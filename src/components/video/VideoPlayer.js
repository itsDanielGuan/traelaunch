"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_FADE_DURATION_MS = 420;

function VideoPlayerInner({
  src,
  poster,
  className = "",
  videoClassName = "",
  skipAfterSeconds = 0,
  skipButtonClassName = "",
  onSkip,
  autoPlay = true,
  muted = true,
  loop = false,
  playsInline = true,
  preload = "auto",
  onEnded,
  ...videoProps
}) {
  const videoRef = useRef(null);
  const didEndRef = useRef(false);
  const playRetryTimerRef = useRef(null);
  const sourceSwapTimerRef = useRef(null);

  const [displaySrc, setDisplaySrc] = useState(src);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [skipUnlocked, setSkipUnlocked] = useState(false);

  const isSourceSwapping = src !== displaySrc;
  const canSkip = skipAfterSeconds <= 0 || skipUnlocked;

  const fireEnded = useCallback(
    (reason) => {
      if (didEndRef.current) return;
      didEndRef.current = true;
      onEnded?.({ reason });
    },
    [onEnded],
  );

  useEffect(() => {
    return () => {
      if (sourceSwapTimerRef.current) {
        window.clearTimeout(sourceSwapTimerRef.current);
        sourceSwapTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (src === displaySrc) return;

    didEndRef.current = true;

    if (sourceSwapTimerRef.current) {
      window.clearTimeout(sourceSwapTimerRef.current);
    }

    sourceSwapTimerRef.current = window.setTimeout(() => {
      didEndRef.current = false;
      setIsReady(false);
      setHasError(false);
      setIsVideoVisible(false);
      setSkipUnlocked(false);
      setDisplaySrc(src);
      sourceSwapTimerRef.current = null;
    }, VIDEO_FADE_DURATION_MS);
  }, [displaySrc, src]);

  const handleSkip = useCallback(() => {
    const el = videoRef.current;
    if (!el || didEndRef.current) return;

    const duration = Number.isFinite(el.duration) ? el.duration : 0;

    if (duration > 0) {
      const targetTime = Math.max(duration - 0.05, 0);
      el.pause();
      el.currentTime = targetTime;
    }

    onSkip?.();
    fireEnded("skipped");
  }, [fireEnded, onSkip]);

  useEffect(() => {
    if (skipAfterSeconds <= 0) return;

    const el = videoRef.current;
    if (!el) return;

    const updateSkipAvailability = () => {
      if (Number.isFinite(el.currentTime) && el.currentTime >= skipAfterSeconds) {
        setSkipUnlocked(true);
      }
    };

    el.addEventListener("timeupdate", updateSkipAvailability);
    updateSkipAvailability();

    return () => {
      el.removeEventListener("timeupdate", updateSkipAvailability);
    };
  }, [displaySrc, skipAfterSeconds]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const attemptAutoPlay = (retryCount = 0) => {
      if (!autoPlay) return;

      el.defaultMuted = muted;
      el.muted = muted;

      const maybePromise = el.play();
      if (!maybePromise || typeof maybePromise.catch !== "function") return;

      maybePromise.catch(() => {
        if (retryCount >= 4) return;

        if (playRetryTimerRef.current) {
          window.clearTimeout(playRetryTimerRef.current);
        }

        playRetryTimerRef.current = window.setTimeout(() => {
          attemptAutoPlay(retryCount + 1);
        }, 180);
      });
    };

    const onCanPlay = () => {
      setIsReady(true);
      setIsVideoVisible(true);
      attemptAutoPlay();
    };
    const onError = () => setHasError(true);
    const onEndedEvent = () => fireEnded("ended");

    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("error", onError);
    el.addEventListener("ended", onEndedEvent);
    attemptAutoPlay();

    return () => {
      if (playRetryTimerRef.current) {
        window.clearTimeout(playRetryTimerRef.current);
        playRetryTimerRef.current = null;
      }

      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("error", onError);
      el.removeEventListener("ended", onEndedEvent);
    };
  }, [autoPlay, displaySrc, fireEnded, muted]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        className={`h-full w-full transition-opacity ease-in-out ${videoClassName} ${
          isVideoVisible && !isSourceSwapping ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${VIDEO_FADE_DURATION_MS}ms` }}
        src={displaySrc}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        {...videoProps}
      />

      {!isReady && !hasError ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/18">
          <div className="sc-video-hud px-5 py-4">
            <div className="h-7 w-7 animate-spin rounded-full border border-white/18 border-t-white/70" />
          </div>
        </div>
      ) : null}

      {hasError ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="sc-overlay px-5 py-4 text-sm text-white/78">
            Video failed to load
          </div>
        </div>
      ) : null}

      {!loop && isReady && !hasError && canSkip ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end p-4 sm:p-6">
          <button
            className={`pointer-events-auto rounded-full border border-white/16 bg-black/56 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/88 backdrop-blur-sm transition hover:border-white/34 hover:bg-black/72 ${skipButtonClassName}`}
            type="button"
            onClick={handleSkip}
          >
            Skip Cutscene
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function VideoPlayer({
  ...props
}) {
  return <VideoPlayerInner {...props} />;
}
