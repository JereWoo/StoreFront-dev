import type { CodegenConfig } from "@graphql-codegen/cli";

const VENDURE_SHOP_API =
  process.env.VENDURE_SHOP_API || "https://api.notenoughbooks.com/shop-api";

const config: CodegenConfig = {
  schema: VENDURE_SHOP_API,
  documents: "src/**/*.{ts,tsx,graphql,gql}",
  generates: {
    "./src/generated/": {
      preset: "client", // fragments + typed docs
      plugins: [],
    },
    "./src/generated/hooks.ts": {
      plugins: ["typescript-react-query"],
      config: {
        fetcher: "@/lib/vendure/fetcher#vendureFetcher",
        reactQueryVersion: 5,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
