// import { useState, useEffect } from "react";

// If using bearer-token based session management, we'll store the token
// in localStorage using this key.
// TODO: storing tokens in LocalStorage is not secure and persists. This is fine for dev but real solution needs to be implemented. Likely will do Token + refresh token to make it easier to develop and APP in the future.

const AUTH_TOKEN_KEY = "auth_token";

const API_URL = "https://api.notenoughbooks.com/shop-api"; //TODO: Move to ENV variable

let languageCode: string | undefined;
let channelToken: string | undefined;

export function setLanguageCode(value: string | undefined) {
  languageCode = value;
}

export function setChannelToken(value: string | undefined) {
  channelToken = value;
}

export function query(
  document: string,
  variables: Record<string, unknown> = {},
) {
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers({
    "content-type": "application/json",
  });
  if (authToken) {
    headers.append("authorization", `Bearer ${authToken}`);
  }
  if (channelToken) {
    headers.append("vendure-token", channelToken);
  }
  let endpoint = API_URL;
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`;
  }
  return fetch(endpoint, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      query: document,
      variables,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`An error ocurred, HTTP status: ${res.status}`);
    }
    const newAuthToken = res.headers.get("vendure-auth-token");
    if (newAuthToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newAuthToken);
    }
    return res.json();
  });
}
