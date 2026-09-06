import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/legacy/**",
  ]),
  {
    rules: {
      "no-restricted-imports": ["error", {
        paths: [
          {
            name: "@/lib/supabase/admin",
            message: "The admin client MUST ONLY be imported in Server Actions, Route Handlers, or scripts."
          },
          {
            name: "@/config/env.server",
            message: "The server environment module MUST ONLY be imported in Server Actions, Route Handlers, or scripts."
          }
        ]
      }]
    }
  }
]);

export default eslintConfig;
