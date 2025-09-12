import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

const AUTH_TOKEN_KEY = "auth_token";
const API_URL =
  import.meta.env.VITE_VENDURE_SHOP_API ||
  "https://api.notenoughbooks.com/shop-api";

let languageCode: string | undefined;
let channelToken: string | undefined;

export function setLanguageCode(value: string | undefined) {
  languageCode = value;
}

export function setChannelToken(value: string | undefined) {
  channelToken = value;
}

/**
 * Vendure fetcher (higher-order style).
 * Works with both raw string queries and TypedDocumentNode from Codegen.
 * Logs outgoing requests in dev mode.
 */
export const vendureFetcher =
  <TData, TVariables extends Record<string, unknown> = Record<string, never>>(
    query: string | TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
  ) =>
  async (): Promise<TData> => {
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const headers = new Headers({ "content-type": "application/json" });

    if (authToken) headers.append("authorization", `Bearer ${authToken}`);
    if (channelToken) headers.append("vendure-token", channelToken);

    let endpoint = API_URL;
    if (languageCode) endpoint += `?languageCode=${languageCode}`;

    // Always turn DocumentNode into a string
    const queryString = typeof query === "string" ? query : print(query);

    // 🔍 Debug logging (only in dev mode)
    if (import.meta.env.DEV) {
      console.debug("[VendureFetcher] POST", endpoint, {
        query: queryString,
        variables,
      });
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ query: queryString, variables }),
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const newAuthToken = res.headers.get("vendure-auth-token");
    if (newAuthToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newAuthToken);
    }

    const { data, errors } = await res.json();

    if (import.meta.env.DEV) {
      console.debug("[VendureFetcher] POST", endpoint, {
        query: queryString,
        variables,
      });
    }

    if (errors?.length) {
      throw new Error(errors.map((e: unknown) => e.message).join(", "));
    }

    return data as TData;
  };
