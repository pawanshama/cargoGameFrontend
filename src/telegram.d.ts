/* src/types/telegram.d.ts  (complète / remplace celle existante) */

export interface TelegramInitDataUnsafe { /* … inchangé … */ }

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
  | string;                        // fallback

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
  sendEvent(type: TwaEvent, data?: unknown): void; // optionnel

  /* … ajoute d’autres propriétés si tu les emploies … */
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
