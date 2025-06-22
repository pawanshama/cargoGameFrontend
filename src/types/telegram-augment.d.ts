/* src/types/telegram-augment.d.ts
   — complète les defs de @twa-dev/types pour inclure `user` */

import "@twa-dev/types";

declare module "@twa-dev/types" {
  /* on étend l’interface existante */
  interface TelegramInitDataUnsafe {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      allows_write_to_pm?: boolean;
    };
  }
}
