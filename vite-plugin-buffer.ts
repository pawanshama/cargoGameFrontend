// vite-plugin-buffer.ts
import type { Plugin } from 'vite';

export default function injectBuffer(): Plugin {
  return {
    name: "inject-buffer",
    enforce: "pre", // ✅ littéral, reconnu comme "pre" | "post"
    transformIndexHtml(html: string) {
      return html.replace(
        "<head>",
        `<head><script>window.Buffer = window.Buffer || {};</script>`
      );
    }
  };
}
