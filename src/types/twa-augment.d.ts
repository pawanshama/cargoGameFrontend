import "@twa-dev/types";          // ↩︎ charge la def officielle

declare global {
  namespace Telegram {
    interface InitDataUnsafe {
      /** Ajout de la clé manquante */
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
}

export {};                        // ↩︎ marque ce fichier comme module
