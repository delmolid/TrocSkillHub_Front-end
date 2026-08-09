# Audit sécurité (OWASP) : TrocSkillHub Front-end

> Branche : `audit-cyber-rgpd`
> Périmètre : SPA React/Vite (`app_front-end/src`, services d'appel API, config build, nginx, Dockerfile).
> Méthode : audit statique selon OWASP Top 10 web, adapté au contexte client. Aucune modification de code.
> **Rappel de portée** : un front SPA n'est jamais une frontière de sécurité (l'autorisation réelle est côté API, auditée dans le repo back-end). Les contrôles d'accès manquants côté client ne sont donc pas classés bloquants ici ; on cible ce qui est exploitable côté navigateur (XSS, secret exposé dans le bundle, token volable, posture serveur).

## Verdict

**Écarts à corriger avant prod.** Aucun bloquant exploitable aujourd'hui. Une XSS latente (neutralisée par le mapper actuel mais prête à s'activer) et une posture serveur à durcir.

Récapitulatif : **0 bloquant, 0 majeur, 4 mineurs.**

---

## Findings

### [mineur] href construit depuis une donnée profil non validée : XSS latente par URI `javascript:` (OWASP A03 — Injection)

- **Fichier** : `app_front-end/src/components/ProfilePageComponents/UserCard.tsx:33,46`
- **Faille** : `href={linkedin}` et `href={instagram}` injectent directement une chaîne provenant du profil utilisateur (type `string` libre, `types/UserProfile.types.ts:80-81`). React n'assainit PAS l'attribut `href` : une valeur `javascript:...` reste cliquable et s'exécute. Le `rel="noopener noreferrer"` est présent (le risque `target="_blank"` est couvert) ; le problème est l'origine non contrôlée de l'URL.
- **Scénario d'exploitation** : un utilisateur enregistre `javascript:fetch('/users/me',{method:'DELETE',credentials:'include'})` comme lien LinkedIn. Une victime consultant son profil et cliquant sur « LinkedIn » exécute ce script dans SA session authentifiée (stored XSS déclenchée au clic). Le cookie httpOnly n'est pas lisible, mais l'attaquant pilote l'API avec les droits de la victime.
- **Non exploitable en l'état** : `utils/userMapper.ts:13-14` force `linkedin: undefined` / `instagram: undefined`, donc l'ancre n'est jamais rendue. C'est une régression prête à s'activer dès qu'on branchera ces champs sur l'API.
- **Correction attendue** : valider le schéma d'URL avant rendu (n'autoriser que `https:`/`http:`, rejeter `javascript:`, `data:`, `vbscript:`), via un helper partagé `safeUrl()`. Le champ « Lien » de projet (`ProfileMain.tsx:707`) est lui rendu en texte échappé (`Lien : {item.links}`) donc sûr.

### [mineur] Absence d'en-têtes de sécurité HTTP (dont CSP) (OWASP A05 — Security Misconfiguration)

- **Fichier** : `app_front-end/nginx.conf` (bloc `server`), `app_front-end/api-proxy.conf.template`
- **Faille** : le serveur nginx qui sert le build ne pose aucun `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors`, ni `Referrer-Policy`. Aucune CSP ne viendrait donc contenir une XSS (voir finding précédent) ni bloquer le clickjacking.
- **Scénario d'exploitation** : en cas d'injection réussie, aucune CSP ne limite l'exfiltration vers un domaine tiers. Sans `X-Frame-Options`, la SPA peut être encadrée dans un iframe pour du clickjacking sur les actions sensibles (suppression de compte).
- **Correction attendue** : ajouter les `add_header` de sécurité dans le bloc `server` nginx (CSP restrictive autorisant `self`, `api-adresse.data.gouv.fr` pour la BAN, et la police retenue ; `nosniff` ; `frame-ancestors 'none'` ; `Referrer-Policy: strict-origin-when-cross-origin`).

### [mineur] `.DS_Store` versionné à la racine du dépôt (OWASP A05 — Security Misconfiguration)

- **Fichier** : `TrocSkillHub_Front-end/.DS_Store` (présent dans `git ls-files`)
- **Faille** : fichier macOS committé, alors que le `.gitignore` racine l'exclut pourtant. Il révèle la structure de dossiers locale.
- **Scénario d'exploitation** : fuite mineure d'arborescence/nommage interne pour un attaquant en reconnaissance.
- **Correction attendue** : `git rm --cached .DS_Store` puis commit. Le `.dockerignore` l'exclut déjà du build image, donc pas de fuite via l'image nginx.

### [mineur] `jsdom` déclaré en dependency de production (OWASP A06 — Vulnerable/Outdated Components)

- **Fichier** : `app_front-end/package.json:23` (dans `dependencies`, et re-déclaré en `devDependencies:46`)
- **Faille** : `jsdom` est un outil de test/SSR sans usage runtime dans un front SPA. En `dependencies` il alourdit l'arbre installé en prod et élargit la surface d'appro (transitives lourdes). Aucun `import` de jsdom dans `src/` (le bundle Vite ne l'embarque donc pas), mais sa présence en dépendance de prod reste anormale.
- **Scénario d'exploitation** : pas d'exploitation côté client direct ; risque supply-chain / faux positifs d'audit.
- **Correction attendue** : retirer `jsdom` de `dependencies` (le garder uniquement en `devDependencies`).

---

## Surface analysée (services, appels réseau, points d'entrée)

- Services API back (même origine via proxy `/api` ou `VITE_API_BASE_URL`), tous en `credentials: 'include'` : `authService.ts`, `userService.ts` (getAllUsers, `/me`, PATCH, DELETE), `passwordResetService.ts`, `knowledgeService.ts`. Aucune URL construite depuis une entrée utilisateur, aucun open redirect.
- Tiers navigateur : API BAN `https://api-adresse.data.gouv.fr/search` via `banService.ts` + `useBanCommuneSearch.ts`. URL construite proprement via `URL`/`searchParams` (pas d'injection d'hôte). Saisie de commune envoyée à ce service public (donnée peu sensible), à mentionner côté RGPD.
- Auth : `AuthContext.tsx` lit `/auth/me` via React Query, aucun token manipulé en JS.
- Config : `constantes.ts` (une seule var `VITE_API_BASE_URL`, non secrète), `vite.config.ts` (pas de sourcemap prod, pas de proxy exposé), `Dockerfile` (build multi-stage, nginx-unprivileged non-root, `VITE_API_BASE_URL` en build-arg non secret), `nginx.conf`, `.gitignore`/`.dockerignore`.

---

## Points sûrs notables (à ne pas régresser)

- Aucun `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, insertion de `<script>` dans `src/`. React échappe le rendu par défaut, tout le contenu API/utilisateur est rendu en texte.
- **Aucun `localStorage` / `sessionStorage` / `document.cookie`** : le JWT reste en cookie httpOnly côté back (`credentials: 'include'`), donc non volable par XSS. Bonne pratique respectée.
- Aucune variable `VITE_*` secrète, aucun secret/clé/mot de passe en dur dans `src/`, `vite.config.ts`, `Dockerfile`, `nginx.conf`. Aucun `.env` versionné.
- Devtools TanStack Router gardés par `import.meta.env.DEV` (`routes/__root.tsx:9`) : jamais servis en prod. React Query Devtools non montés.
- Les seuls `console.error` (services) loguent des libellés génériques et l'objet erreur, pas de PII ni de token explicite.
- `target="_blank"` accompagnés de `rel="noopener noreferrer"` (`UserCard.tsx`).
- Dockerfile : image finale `nginxinc/nginx-unprivileged`, `USER nginx`, ne copie que `dist/` (pas les sources ni `.env`), `.dockerignore` exclut `node_modules`, `.env.local`, `.git`, `.DS_Store`.

---

## Non vérifiable statiquement (relève de l'audit back ou du runtime)

- Contenu réel des réponses `/auth/me`, `/users` : présence éventuelle de champs sensibles renvoyés au client au-delà du nécessaire (minimisation) relève de l'audit back.
- Attributs réels du cookie de session (`HttpOnly`, `Secure`, `SameSite`) : posés côté Spring Boot.
- Configuration CORS et valeur de production de `VITE_API_BASE_URL` (origine visée par `credentials: 'include'`) : à confirmer au déploiement.
- Efficacité anti-bruteforce / rate-limiting du reset et du login : côté back.
- Versions de dépendances : numéros du manifeste non confrontés à une base CVE (`npm audit` non lancé).

---

## Top 3 à traiter en priorité

1. **href profil non validé** (A03) — XSS latente par `javascript:` URI, neutralisée aujourd'hui par le mapper mais à assainir avant de brancher `linkedin`/`instagram` sur l'API.
2. **Absence de CSP et d'en-têtes de sécurité nginx** (A05).
3. **`.DS_Store` versionné** (A05).

Point le plus exposé : le rendu `href={linkedin/instagram}` de `UserCard.tsx`, seule véritable primitive XSS du front.
