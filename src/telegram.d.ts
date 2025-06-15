interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  ready: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
