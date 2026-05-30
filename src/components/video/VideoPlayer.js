"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function VideoPlayerInner({
  src,
  poster,
  className = "",
  videoClassName = "",
  skipAfterSeconds: _skipAfterSeconds,
  skipButtonClassName: _skipButtonClassName,
  onSkip: _onSkip,
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

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fireEnded = useCallback(
    (reason) => {
      if (didEndRef.current) return;
      didEndRef.current = true;
      onEnded?.({ reason });
    },
    [onEnded],
  );

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
  }, [autoPlay, fireEnded, muted, src]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        className={`h-full w-full ${videoClassName}`}
        src={src}
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
    </div>
  );
}

export default function VideoPlayer({
  skipAfterSeconds: _skipAfterSeconds,
  skipButtonClassName: _skipButtonClassName,
  onSkip: _onSkip,
  ...props
}) {
  const key = `${props.src ?? ""}`;
  return <VideoPlayerInner key={key} {...props} />;
}
