/* src/types/telegram.d.ts
   — Définition complète + propriétés manquantes */

export type TwaEvent =
  | "themeChanged"
  | "viewportChanged"
  | "mainButtonClicked"
  | "backButtonClicked"
  | "settingsButtonClicked"
  | "invoiceClosed"
  | "popupClosed"
  | "qrTextReceived"
  | "clipboardTextReceived"
  | string; // fallback

export interface TelegramInitDataUnsafe {
  /** Paramètre start du bot (invite=xxx) */
  start_param?: string;

  /** Utilisateur Telegram ayant lancé le bot */
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    allows_write_to_pm?: boolean;
  };

  /** autres clés non typées */
  [key: string]: unknown;
}

export interface TelegramWebApp {
  /* --- propriétés core --- */
  initData: string;
  initDataUnsafe?: TelegramInitDataUnsafe;

  /* --- méthodes basiques --- */
  ready(): void;
  close(): void;
  expand(): void;
  requestFullscreen(): void;
  isVersionAtLeast(version: string): boolean;

  /* --- events --- */
  onEvent(type: TwaEvent, cb: (...args: any[]) => void): void;
  offEvent(type: TwaEvent, cb: (...args: any[]) => void): void;
  sendEvent?(type: TwaEvent, data?: unknown): void;
}

export interface TelegramGlobal {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: TelegramGlobal;
  }
}

export {};
