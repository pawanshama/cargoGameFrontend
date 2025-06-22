/* src/types/telegram.d.ts
   — types globaux pour Telegram WebApp
   — un seul endroit → plus de conflits de déclarations */

export interface TelegramInitDataUnsafe {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    allows_write_to_pm?: boolean;
  };
  auth_date?: string;
  start_param?: string; // ← inviteCode placé ici par Telegram
  hash?: string;
  [key: string]: unknown; // pour les clés futures
}

export interface TelegramWebApp {
  /* Données signées */
  initData: string;
  initDataUnsafe?: TelegramInitDataUnsafe;

  /* Méthodes courantes */
  ready: () => void;
  close: () => void;

  /* Optionnel : MainButton, Haptic, etc.  Ajoute-les si tu en as besoin.
     Exemple :
     MainButton?: {
       text: string;
       isVisible: boolean;
       show: () => void;
       hide: () => void;
     };
  */
}

export interface TelegramGlobal {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: TelegramGlobal;
  }
}

/* transforme ce fichier en module, sinon TypeScript l’ignore */
export {};
