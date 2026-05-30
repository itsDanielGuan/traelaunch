"use client";

import { MEDIA_PATHS, resolveVideoSrc } from "@/experience";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function stopMediaPlayback(element) {
  if (!(element instanceof HTMLMediaElement)) return;

  element.pause();
  element.muted = true;
  element.currentTime = 0;
  element.removeAttribute("src");
  element.load();
}

function LoopingScreenVideo({ src, className = "", videoRef }) {
  useEffect(() => {
    const element = videoRef?.current;
    if (!(element instanceof HTMLVideoElement)) return;

    const playPromise = element.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }

    return () => {
      stopMediaPlayback(element);
    };
  }, [src, videoRef]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );
}

export default function Home() {
  const router = useRouter();
  const landingVideoRef = useRef(null);
  const navigationTimerRef = useRef(null);
  const [journeyStarting, setJourneyStarting] = useState(false);

  useEffect(() => {
    router.prefetch("/experience");
  }, [router]);

  useEffect(() => {
    if (!journeyStarting) return;
    stopMediaPlayback(landingVideoRef.current);
  }, [journeyStarting]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  const handleBeginJourney = useCallback(() => {
    stopMediaPlayback(landingVideoRef.current);
    setJourneyStarting(true);

    navigationTimerRef.current = window.setTimeout(() => {
      router.push("/experience");
    }, 1200);
  }, [router]);

  return (
    <div className="sc-screen min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        {!journeyStarting ? (
          <LoopingScreenVideo
            className="h-full w-full object-cover"
            src={resolveVideoSrc(MEDIA_PATHS.landingLoop)}
            videoRef={landingVideoRef}
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.16)_34%,rgba(0,0,0,0.62)_78%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,9,0.18),rgba(4,6,9,0.5)_58%,rgba(2,3,5,0.84)_100%)]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-end justify-center px-6 py-12 sm:py-16">
        {!journeyStarting ? (
          <button
            type="button"
            className="sc-hero-cta min-w-[220px] text-white/95 sm:min-w-[260px]"
            onClick={handleBeginJourney}
          >
            <span className="sc-medieval sc-metal-text text-2xl sm:text-[2rem]">
              Begin Journey
            </span>
          </button>
        ) : (
          <div className="mx-auto mb-8 w-full max-w-3xl text-center">
            <div className="sc-overlay px-6 py-6 sm:px-8 sm:py-8">
              <div className="sc-kicker text-[11px] text-white/58">
                Pilgrimage Initiated
              </div>
              <div className="sc-medieval sc-metal-text mt-3 text-2xl leading-tight sm:text-4xl">
                The knight begins his journey.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
