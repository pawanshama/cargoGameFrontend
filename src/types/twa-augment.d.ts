/* src/types/twa-augment.d.ts
   — complète les définitions globales fournies par @twa-dev/types */

import "@twa-dev/types";        // ➊ rend le fichier « module » et assure le chargement

declare global {
  namespace Telegram {
    interface InitDataUnsafe {
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

export {};                      // ➋ force le scope module pour ce fichier
