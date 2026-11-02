import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── SVG icons (inline, no extra dependency) ────────────────────────────── */
const EnterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const ExitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="8 3 3 3 3 8" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="3" y1="3" x2="10" y2="10" />
    <line x1="21" y1="21" x2="14" y2="14" />
  </svg>
);

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function isFullscreenSupported() {
  return !!(
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen
  );
}

function currentFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  );
}

function requestFullscreen(el) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
  return Promise.reject(new Error("Fullscreen API not supported"));
}

function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
  return Promise.reject(new Error("Fullscreen API not supported"));
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);
  const [toast, setToast] = useState(""); // brief fallback message
  const toastTimer = React.useRef(null);

  /* Detect support once on mount */
  useEffect(() => {
    setSupported(isFullscreenSupported());
  }, []);

  /* Sync state whenever the browser changes fullscreen status
     (covers Escape key, browser UI button, programmatic exit) */
  useEffect(() => {
    const sync = () => setIsFullscreen(!!currentFullscreenElement());
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    document.addEventListener("mozfullscreenchange", sync);
    document.addEventListener("MSFullscreenChange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
      document.removeEventListener("mozfullscreenchange", sync);
      document.removeEventListener("MSFullscreenChange", sync);
    };
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const toggle = useCallback(() => {
    if (!supported) {
      /* iPhone Safari and some browsers don't support the API.
         Show a friendly tip instead of silently failing. */
      showToast(
        /iPhone|iPad|iPod/.test(navigator.userAgent)
          ? "On iPhone Safari, add this page to your Home Screen for a full-screen experience."
          : "Full-screen isn't supported in your browser. Try Chrome or Edge for the best experience."
      );
      return;
    }

    if (currentFullscreenElement()) {
      exitFullscreen().catch(() => {/* already exited */});
    } else {
      requestFullscreen(document.documentElement).catch(() => {
        showToast("Full-screen was blocked. Tap the button again or allow it in your browser settings.");
      });
    }
  }, [supported, showToast]);

  return createPortal(
    <>
      <button
        className={`fs-btn${isFullscreen ? " fs-btn--exit" : ""}`}
        onClick={toggle}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        title={isFullscreen ? "Exit full screen" : "Enter full screen"}
        type="button"
      >
        {isFullscreen ? <ExitIcon /> : <EnterIcon />}
      </button>

      {toast && (
        <div className="fs-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>,
    document.body
  );
}
