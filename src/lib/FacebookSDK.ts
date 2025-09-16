import { useEffect } from "react";

export function FacebookSDK() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__fbInitialized && window.FB) {
      document.dispatchEvent(new Event("fb-sdk-ready"));
      return;
    }

    const id = "facebook-jssdk";
    if (!document.getElementById(id)) {
      const js = document.createElement("script");
      js.id = id;
      js.async = true;
      js.defer = true;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(js);
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      window.__fbInitialized = true;
      document.dispatchEvent(new Event("fb-sdk-ready"));
    };
  }, []);

  return null;
}
