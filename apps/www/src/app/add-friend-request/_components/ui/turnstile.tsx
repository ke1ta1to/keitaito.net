"use client";

import Script from "next/script";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import type { TurnstileProps, TurnstileWidgetRef } from "../../types/turnstile";

export const Turnstile = forwardRef<TurnstileWidgetRef, TurnstileProps>(
  function Turnstile(
    { onVerify, onError, onExpire, theme = "light", size = "normal" },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const handleError = useCallback(() => {
      console.error("Turnstile verification failed");
      onError?.();
    }, [onError]);

    const handleExpire = useCallback(() => {
      console.log("Turnstile token expired");
      onExpire?.();
    }, [onExpire]);

    const reset = useCallback(() => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (error) {
          console.error("Failed to reset Turnstile widget:", error);
        }
      }
    }, []);

    const remove = useCallback(() => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (error) {
          console.error("Failed to remove Turnstile widget:", error);
        }
      }
    }, []);

    // ref forwarding
    useImperativeHandle(
      ref,
      () => ({
        reset,
        remove,
      }),
      [reset, remove],
    );

    useEffect(() => {
      // クリーンアップ関数
      return () => {
        remove();
      };
    }, [remove]);

    const handleScriptLoad = () => {
      if (!containerRef.current || !window.turnstile) return;

      const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!sitekey) {
        console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
        handleError();
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey,
          callback: onVerify,
          "error-callback": handleError,
          "expired-callback": handleExpire,
          theme,
          size,
        });
      } catch (error) {
        console.error("Failed to render Turnstile widget:", error);
        handleError();
      }
    };

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
        <div ref={containerRef} className="flex justify-center" />
      </>
    );
  },
);
