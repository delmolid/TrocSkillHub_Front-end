/// <reference types="vite/client" />

// Déclaration pour les imports CSS
declare module '*.css' {
  const content: string;
  export default content;
}

// Déclaration pour les imports d'images
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}