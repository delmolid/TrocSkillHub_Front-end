# Audit RGPD : TrocSkillHub Front-end

> Branche : `audit-cyber-rgpd`
> Périmètre : SPA React/Vite (`app_front-end/src`, `index.html`, services d'appel, formulaires, routes). Cookies/traceurs, requêtes tierces depuis le navigateur, stockage local, information des personnes, minimisation des formulaires, droits côté UI.
> Rôle du projet : l'exploitant de TrocSkillHub est **responsable de traitement** ; l'équipe technique fournit les moyens techniques. Le stockage en base et les durées de conservation relèvent du back (audité dans le repo back-end).
> Ce document est un audit technique de conformité, **pas un avis juridique**. Les décisions marquées « responsable / DPO » relèvent du responsable de traitement.

## Verdict

**Écarts à corriger avant prod.** Le socle est sain : aucun traceur analytics ni cookie non essentiel (pas de gtag, matomo, fbq, hotjar, sentry), aucun stockage local de PII, aucune injection HTML dangereuse. Deux manques réels d'information/transfert à traiter : le chargement de Google Fonts depuis les serveurs Google (transfert hors UE, IP révélée) et l'absence totale de politique de confidentialité / mentions légales / information au moment de la collecte.

Récapitulatif : **0 bloquant, 2 majeurs, 5 mineurs.**

---

## Findings

### [majeur] Chargement de Google Fonts depuis les serveurs Google : transfert hors UE, IP exposée sans base ni information

- **Fichier** : `app_front-end/index.html:7-12`
- **Risque** : `preconnect` puis `<link>` vers `https://fonts.googleapis.com` et `https://fonts.gstatic.com` (police Inter). Au chargement de chaque page, avant toute action ou consentement, le navigateur émet une requête vers Google LLC qui capte l'adresse IP (donnée personnelle) et le user-agent. Google est un tiers établi hors UE : transfert international (**art. 44 et suivants**) sans information ni encadrement documenté. C'est le motif qui a valu des condamnations en Europe (jurisprudence LG München 2022 sur Google Fonts distant). Vérifié : c'est le seul domaine externe chargé dans le HTML, aucun autre CDN.
- **Qui agit** : responsable de traitement (licéité/information), équipe technique (mise en œuvre : héberger la police en local).
- **Correction attendue** : auto-héberger la police (télécharger les `.woff2`, servir depuis `/public`, supprimer les `preconnect` et le `<link>` Google), ce qui élimine la requête tierce. À défaut, documenter et encadrer le transfert.

### [majeur] Absence de politique de confidentialité, mentions légales, CGU et d'information au moment de la collecte

- **Fichier** : formulaire de collecte `app_front-end/src/components/auth/RegisterForm.tsx:83-236` (aucun lien légal, aucune case de consentement) ; pied de page `app_front-end/src/pages/ProfilPage.tsx:35-44` (liens « À Propos », « Contact », « FAQ » seulement, ancres mortes `#about`/`#contact`/`#faq`) ; grep global `confidentialit|mentions|cgu|privacy|politique|consent|rgpd` = aucune occurrence dans tout `src/`.
- **Risque** : l'inscription collecte identité (nom, prénom), email et ville sans aucun lien vers une information sur le traitement (finalités, base légale, durée, droits, responsable), ni case d'acceptation des CGU. Manquement à l'obligation d'information au moment de la collecte (**art. 12, 13**). Aucune page légale n'existe ni n'est routée (routes déclarées : `/`, `/login`, `/dashboard`, `/profile`).
- **Qui agit** : responsable de traitement (rédaction de la politique de confidentialité, mentions légales, CGU, choix de la base légale), équipe technique (création des pages/routes et du lien d'information à côté du bouton « Créer mon compte »).
- **Correction attendue** : créer les pages Politique de confidentialité, Mentions légales et CGU, les router, les lier dans le pied de page et à proximité du formulaire d'inscription.

### [mineur] Champs libres du profil pouvant capter des données sensibles (art. 9) sans avertissement, profil type CV très riche en PII

- **Fichier** : `app_front-end/src/constantes.ts:75-79` (champ `description` de projet en `textarea`) ; `app_front-end/src/components/ProfilePageComponents/ProfileItemsEditor.tsx:65-86` (rendu du textarea libre) ; formations/expériences/projets/compétences agrégés en profil type CV.
- **Risque** : un champ de description libre peut recueillir spontanément des données de l'**art. 9** (santé, opinions, appartenance syndicale, orientation) sans que l'utilisateur soit averti, et sans base légale renforcée. Combiné au caractère CV du profil, cela concentre beaucoup de PII. Minimisation (**art. 5-1-c**) et vigilance art. 9.
- **Qui agit** : responsable de traitement (politique sur les données sensibles), équipe technique (libellé d'avertissement près des champs libres).
- **Correction attendue** : afficher une mention « ne renseignez pas de données sensibles (santé, opinions, etc.) » près des zones de texte libre ; confirmer que chaque champ collecté est nécessaire à la finalité.

### [mineur] Saisie de la ville envoyée à un tiers (API BAN) à chaque frappe, à documenter

- **Fichier** : `app_front-end/src/constantes.ts:14` ; `app_front-end/src/services/banService.ts:50-81` ; `app_front-end/src/hooks/useBanCommuneSearch.ts`
- **Risque** : la ville tapée est envoyée en autocomplétion vers `https://api-adresse.data.gouv.fr/search` (service public DINUM, hébergé en France, donc UE). Requête tierce révélant l'IP de l'utilisateur à ce service, déclenchée dès 2 caractères saisis. Pas d'illégalité (finalité légitime, tiers UE, service de l'État), mais à documenter dans l'information des personnes.
- **Qui agit** : responsable de traitement (mention dans la politique de confidentialité et le registre).
- **Correction attendue** : mentionner l'appel à l'API BAN (finalité : aide à la saisie de la commune, destinataire : DINUM, UE) dans l'information des personnes. Aucun changement de code requis.

### [mineur] Journalisation console d'erreurs sur les flux d'authentification en production

- **Fichier** : `app_front-end/src/services/authService.ts:24,50,70,89` ; `app_front-end/src/services/passwordResetService.ts:35,46,57`
- **Risque** : `console.error` sur les erreurs d'inscription, connexion, récupération utilisateur et reset. Vérifié : les chaînes loggées ne contiennent pas de PII en clair, mais l'objet `error` associé peut porter des retours d'API et ces logs restent actifs en production (aucun garde `import.meta.env.DEV`). Bonne pratique de journalisation (**art. 32**).
- **Qui agit** : équipe technique.
- **Correction attendue** : retirer ou conditionner ces `console.error` au mode développement, ou s'assurer qu'aucune donnée sensible n'y transite.

### [mineur] Absence de fonction d'export/portabilité des données côté UI

- **Fichier** : composants profil `app_front-end/src/components/ProfilePageComponents/` (grep `export|download|portab|télécharg` = aucune fonctionnalité d'export)
- **Risque** : l'utilisateur peut accéder à ses données (affichage profil), les rectifier (EditableProfileCard / ProfileItemsEditor) et les effacer (ProfileDeleteModal → `DELETE /users/me`, `userService.ts:79-97`), mais aucun moyen d'obtenir une copie exportable (**art. 20**, portabilité). Elle peut être traitée par demande au responsable, mais son absence en UI est une lacune.
- **Qui agit** : responsable de traitement (canal d'exercice du droit), équipe technique si export self-service retenu.
- **Correction attendue** : prévoir un canal de portabilité (bouton d'export ou procédure documentée).

### [mineur] Récupération de la liste complète des utilisateurs avec leurs PII côté client

- **Fichier** : `app_front-end/src/services/userService.ts:26-37` (`getAllUsers` → `GET /users`, normalise skills, needs, education, experience, project pour chaque utilisateur)
- **Risque** : tout utilisateur connecté récupère l'ensemble des profils avec parcours et compétences. Cohérent avec un annuaire de membres, mais la portée exacte des champs exposés (parcours détaillé, champs libres) relève de la minimisation. Le filtrage réel est côté back.
- **Qui agit** : responsable de traitement (proportionnalité des données affichées), équipe back.
- **Correction attendue** : confirmer que `/users` ne renvoie que les champs strictement nécessaires à l'annuaire, pas l'intégralité du CV. À confirmer côté back.

---

## Cartographie des flux de données personnelles côté client

| Donnée | Formulaire / source | Destination | Tiers UE ? |
|---|---|---|---|
| Nom, prénom, email, ville, mot de passe | RegisterForm (`/auth/register`) | API back TrocSkillHub (`VITE_API_BASE_URL`) | Selon hébergeur back, à confirmer |
| Email, mot de passe | LoginForm (`/auth/login`, `credentials: include`) | API back TrocSkillHub | Selon hébergeur back |
| Email (reset), code, nouveau mot de passe | PasswordResetModal (`/auth/password-reset`) | API back TrocSkillHub | Selon hébergeur back |
| Ville saisie (autocomplétion, dès 2 caractères) | FranceCityAutocomplete / banService | `api-adresse.data.gouv.fr` (BAN, DINUM) | Oui (France) |
| Profil CV : formations, expériences, projets (description libre), liens, compétences | EditableProfileCard / ProfileItemsEditor (`PATCH /users/me`) | API back TrocSkillHub | Selon hébergeur back |
| Identité de l'utilisateur courant | AuthContext (`GET /auth/me`) | API back TrocSkillHub | Selon hébergeur back |
| Profils de tous les membres (parcours, compétences) | getAllUsers (`GET /users`) | API back → navigateur | Selon hébergeur back |
| Adresse IP + user-agent | Chargement de page (Google Fonts) | `fonts.googleapis.com` / `fonts.gstatic.com` (Google LLC) | **Non (hors UE)** |
| Cookie de session d'authentification | httpOnly posé par le back (`credentials: include`) | API back TrocSkillHub | Cookie strictement nécessaire, pas de consentement requis |

Aucun `localStorage`, `sessionStorage` ni `document.cookie` manipulé côté client (grep vide). Aucun traceur analytics/publicitaire.

---

## À porter au registre / à la doc du responsable

- Politique de confidentialité, mentions légales et CGU à rédiger et publier, avec information au moment de la collecte sur le formulaire d'inscription.
- Base légale de chaque traitement (inscription, profil, annuaire de membres) à définir et documenter.
- Transfert hors UE via Google Fonts : à supprimer (auto-hébergement) ou à encadrer et déclarer.
- Recours à l'API BAN (DINUM) pour l'autocomplétion de commune : finalité, destinataire, localisation UE, à mentionner dans l'information et le registre.
- Modalités d'exercice des droits, notamment portabilité (**art. 20**), absente de l'UI ; accès/rectification/effacement sont présents côté UI.
- Vérifier côté back la minimisation des champs renvoyés par `GET /users` à l'ensemble des membres.
- Prévoir une mention de non-saisie de données sensibles sur les champs libres du profil.

---

## Top 3 à traiter en priorité

1. **Google Fonts chargé depuis les serveurs Google** — transfert hors UE et IP exposée sans base ni information (art. 44+).
2. **Absence totale de politique de confidentialité, mentions légales, CGU et d'information au moment de la collecte** (art. 12-13).
3. **Champs libres du profil pouvant capter des données sensibles (art. 9)** sans avertissement.

Donnée la plus à risque : le profil de type CV (formations, expériences, descriptions de projet en texte libre), concentré de PII susceptible de contenir des données de l'art. 9, exposé de surcroît aux autres membres via `GET /users`.
