"use client";

import {
  ExperienceProvider,
  decisionData,
  decisionKeyForStage,
  endingData,
  getCurrentVideoSrc,
  isConsequenceStage,
  MEDIA_PATHS,
  nextStageAfterVideo,
  productData,
  resolveVideoSrc,
  STAGES,
  useExperience,
} from "@/experience";
import { VideoPlayer } from "@/components/video";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function readVideoMetrics(event) {
  const media = event?.currentTarget;

  if (!(media instanceof HTMLMediaElement)) {
    return { current: 0, duration: 0 };
  }

  return {
    current: Number.isFinite(media.currentTime) ? media.currentTime : 0,
    duration: Number.isFinite(media.duration) ? media.duration : 0,
  };
}

function getUpcomingDecisionKey(stage) {
  const nextStage = nextStageAfterVideo(stage);
  return nextStage ? decisionKeyForStage(nextStage) : null;
}

function getStageLabel(stage) {
  switch (stage) {
    case STAGES.PROLOGUE:
      return "Prologue";
    case STAGES.DECISION_ROUTE:
      return "Decision I";
    case STAGES.DECISION_BLADE:
      return "Decision II";
    case STAGES.DECISION_SACRIFICE:
      return "Decision III";
    case STAGES.DECISION_COMMAND:
      return "Decision IV";
    case STAGES.CONSEQUENCE_ROUTE:
    case STAGES.CONSEQUENCE_BLADE:
    case STAGES.CONSEQUENCE_SACRIFICE:
    case STAGES.CONSEQUENCE_COMMAND:
      return "Consequence";
    case STAGES.ENDING:
      return "Ending";
    case STAGES.PRODUCT:
      return "Relicware";
    default:
      return "Pilgrimage";
  }
}

function LoopingLoadingVideo({ className = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!(video instanceof HTMLVideoElement)) return;

    video.currentTime = 0;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={resolveVideoSrc(MEDIA_PATHS.loadingLoop)}
      autoPlay
      loop
      playsInline
      preload="auto"
    />
  );
}

function ExperienceInner() {
  const { state, dispatch, actions } = useExperience();
  const videoSrc = getCurrentVideoSrc(state);
  const ending = state.ending ? endingData[state.ending] : null;
  const product = state.product ? productData[state.product] : null;

  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [endingReady, setEndingReady] = useState(false);
  const [decisionOverlayKey, setDecisionOverlayKey] = useState(null);
  const [transitionState, setTransitionState] = useState({
    active: false,
    text: "",
    waitingForNextVideo: false,
  });
  const [introFadeActive, setIntroFadeActive] = useState(state.currentStage === STAGES.PROLOGUE);

  const transitionTimersRef = useRef([]);

  const queueTransitionTimeout = useCallback((callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    transitionTimersRef.current.push(timerId);
    return timerId;
  }, []);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTransitionTimers();
    };
  }, [clearTransitionTimers]);

  const overlayDecision = decisionOverlayKey ? decisionData[decisionOverlayKey] : null;

  const activeConsequenceKey = useMemo(() => {
    if (!isConsequenceStage(state.currentStage)) return null;
    return decisionKeyForStage(state.currentStage);
  }, [state.currentStage]);

  const selectedOption = useMemo(() => {
    if (!activeConsequenceKey) return null;

    const selectedOptionId = state.choices?.[activeConsequenceKey];
    const decision = decisionData[activeConsequenceKey];

    if (!decision || !selectedOptionId) return null;

    return decision.options.find((option) => option.id === selectedOptionId) ?? null;
  }, [activeConsequenceKey, state.choices]);

  const showVideo =
    Boolean(videoSrc) &&
    (state.currentStage === STAGES.PROLOGUE ||
      isConsequenceStage(state.currentStage) ||
      state.currentStage === STAGES.ENDING ||
      state.currentStage === STAGES.PRODUCT);

  const progressRatio =
    showVideo && progress.duration > 0
      ? Math.min(progress.current / progress.duration, 1)
      : 0;

  const choiceEntries = Object.entries(state.scores);
  const stageLabel = decisionOverlayKey
    ? getStageLabel(nextStageAfterVideo(state.currentStage) ?? state.currentStage)
    : getStageLabel(state.currentStage);

  const beginBlackTransition = useCallback(
    (text, onMidpoint) => {
      clearTransitionTimers();
      setTransitionState({
        active: true,
        text,
        waitingForNextVideo: false,
      });

      queueTransitionTimeout(() => {
        onMidpoint();
        setTransitionState((current) => ({
          ...current,
          waitingForNextVideo: true,
        }));
      }, 900);
    },
    [clearTransitionTimers, queueTransitionTimeout],
  );

  const handleVideoEnded = useCallback(() => {
    if (state.currentStage === STAGES.ENDING) {
      setEndingReady(true);
      return;
    }

    const nextDecisionKey = getUpcomingDecisionKey(state.currentStage);
    if (nextDecisionKey) {
      setDecisionOverlayKey(nextDecisionKey);
      return;
    }

    if (state.currentStage === STAGES.CONSEQUENCE_COMMAND) {
      beginBlackTransition("", () => {
        dispatch(actions.videoEnded());
      });
      return;
    }

    dispatch(actions.videoEnded());
  }, [actions, beginBlackTransition, dispatch, state.currentStage]);

  const handleDecisionSelect = useCallback(
    (option) => {
      if (!decisionOverlayKey) return;

      setDecisionOverlayKey(null);
      setEndingReady(false);

      beginBlackTransition(option.transitionLine ?? option.description, () => {
        dispatch(actions.selectChoice(decisionOverlayKey, option.id));
      });
    },
    [actions, beginBlackTransition, decisionOverlayKey, dispatch],
  );

  return (
    <div className="sc-screen relative flex min-h-screen w-full items-stretch justify-stretch bg-black text-white">
      {showVideo ? (
        <div className="absolute inset-0">
          <VideoPlayer
            src={videoSrc}
            className="h-full w-full"
            videoClassName="h-full w-full object-cover"
            muted={false}
            onLoadStart={() => {
              setProgress({ current: 0, duration: 0 });
              setDecisionOverlayKey(null);

              if (state.currentStage !== STAGES.ENDING) {
                setEndingReady(false);
              }
            }}
            onCanPlay={() => {
              if (state.currentStage === STAGES.PROLOGUE && introFadeActive) {
                queueTransitionTimeout(() => {
                  setIntroFadeActive(false);
                }, 450);
              }

              if (!transitionState.waitingForNextVideo) return;

              queueTransitionTimeout(() => {
                setTransitionState({
                  active: false,
                  text: "",
                  waitingForNextVideo: false,
                });
              }, 220);
            }}
            onEnded={handleVideoEnded}
            onLoadedMetadata={(e) => {
              const { duration } = readVideoMetrics(e);
              setProgress((prev) => ({ ...prev, duration }));
            }}
            onTimeUpdate={(e) => {
              const { current } = readVideoMetrics(e);
              setProgress((prev) => ({
                ...prev,
                current,
              }));
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.04),transparent_26%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.58)_100%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(77,186,210,0.14),transparent_24%),radial-gradient(circle_at_20%_60%,rgba(198,23,47,0.16),transparent_28%),linear-gradient(180deg,#071019_0%,#06080c_48%,#030406_100%)]" />
      )}

      <div className="relative z-10 flex w-full flex-col">
        <header className="flex items-start px-5 py-5 sm:px-8">
          <div className="sc-video-hud px-4 py-3">
            <div className="sc-kicker text-[10px]">Saint Circuit</div>
            <div className="mt-1 sc-title text-xs font-semibold">{stageLabel}</div>
          </div>
        </header>

        <div className="relative flex flex-1 px-5 pb-8 pt-4 sm:px-8 sm:pb-10">
          {overlayDecision ? (
            <div className="mt-auto flex w-full justify-center">
              <div className="w-full max-w-5xl transition-opacity duration-700 ease-out opacity-100">
                <div className="sc-overlay mx-auto max-w-3xl px-5 py-4">
                  <div className="sc-kicker text-[10px] text-white/60">
                    Choose Your Path
                  </div>
                  <div className="sc-medieval sc-metal-text mt-2 max-w-2xl text-lg leading-7 sm:text-2xl">
                    {overlayDecision.question}
                  </div>
                </div>

                <div className="mx-auto mt-4 flex w-full max-w-5xl flex-col gap-3">
                  {overlayDecision.options.map((option) => {
                    const isOpenGates =
                      decisionOverlayKey === "command" &&
                      option.id === "open-gates";
                    const btnClass = isOpenGates
                      ? "sc-btn sc-btn-danger"
                      : "sc-btn";

                    return (
                      <button
                        key={option.id}
                        className={`${btnClass} sc-fade-in min-h-[92px] w-full justify-start px-6 py-5 text-left sm:min-h-[104px] sm:px-7`}
                        type="button"
                        onClick={() => handleDecisionSelect(option)}
                      >
                        <div className="flex w-full items-start justify-between gap-6">
                          <div>
                            <div className="sc-medieval sc-metal-text text-lg sm:text-xl">
                              {option.label}
                            </div>
                            <div className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
                              {option.description}
                            </div>
                          </div>
                          <div className="sc-kicker text-[10px] text-white/55">
                            Invoke
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {isConsequenceStage(state.currentStage) && !overlayDecision ? (
            <div className="mt-auto max-w-md">
              <div className="sc-overlay sc-fade-in px-5 py-4">
                <div className="sc-kicker text-[10px] text-white/60">
                  Consequence
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {selectedOption ? selectedOption.label : "..."}
                </div>
                <div className="mt-2 text-sm leading-6 text-white/72">
                  The next choice appears after the clip finishes.
                </div>
              </div>
            </div>
          ) : null}

          {state.currentStage === STAGES.ENDING && ending ? (
            <div className="mt-auto flex w-full flex-col gap-4 lg:max-w-5xl">
              <div className="sc-overlay sc-fade-in max-w-3xl px-6 py-5">
                <div className="sc-kicker text-[10px] text-white/60">Ending</div>
                <div className="sc-medieval sc-metal-text mt-3 text-3xl sm:text-4xl">
                  {ending.title}
                </div>
                <div className="mt-3 max-w-2xl text-sm leading-6 text-white/74 sm:text-base">
                  {ending.line}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {choiceEntries.map(([key, value]) => (
                  <div key={key} className="sc-overlay px-4 py-3">
                    <div className="sc-kicker text-[9px] text-white/52">
                      {key}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="sc-btn sc-btn-primary"
                  type="button"
                  onClick={() => {
                    setEndingReady(false);
                    dispatch(actions.revealProduct());
                  }}
                  disabled={!endingReady}
                >
                  Reveal Relicware
                </button>
                <button
                  className="sc-btn"
                  type="button"
                  onClick={() => {
                    setEndingReady(false);
                    setIntroFadeActive(true);
                    dispatch(actions.reset());
                  }}
                >
                  Replay Pilgrimage
                </button>
              </div>

              {!endingReady ? (
                <div className="text-xs text-white/58">
                  The final frame is holding. The ending reveal will unlock next.
                </div>
              ) : null}
            </div>
          ) : null}

          {state.currentStage === STAGES.PRODUCT && product ? (
            <div
              className="sc-panel sc-product-panel sc-fade-in mt-auto w-full max-w-4xl rounded-[28px] px-6 py-6"
              style={{
                "--sc-accent": product.theme?.accent ?? "var(--sc-cyan)",
                "--sc-glow": product.theme?.glow ?? "var(--sc-red)",
              }}
            >
              <div className="sc-kicker text-[10px] text-white/62">Relicware</div>
              <div className="sc-medieval sc-metal-text mt-3 text-3xl sm:text-4xl">
                {product.name}
              </div>
              <div className="mt-2 text-sm leading-6 text-white/76">
                {product.tagline}
              </div>
              <div className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                {product.description}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button className="sc-btn sc-btn-accent" type="button">
                  Wishlist
                </button>
                <button className="sc-btn" type="button">
                  Claim
                </button>
                <button
                  className="sc-btn"
                  type="button"
                  onClick={() => {
                    setEndingReady(false);
                    setIntroFadeActive(true);
                    dispatch(actions.reset());
                  }}
                >
                  Replay
                </button>
                <button className="sc-btn" type="button">
                  Share
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
          transitionState.active ? "opacity-100" : "opacity-0"
        }`}
      >
        {transitionState.active ? (
          <>
            <LoopingLoadingVideo className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.24)_46%,rgba(0,0,0,0.68)_100%)]" />
          </>
        ) : null}
        <div
          className={`relative z-10 px-8 text-center text-sm uppercase tracking-[0.22em] text-white/86 transition-opacity duration-500 ${
            transitionState.active && transitionState.text ? "opacity-100" : "opacity-0"
          }`}
        >
          {transitionState.text}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-1200 ease-out ${
          introFadeActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function ExperienceClient() {
  return (
    <ExperienceProvider>
      <ExperienceInner />
    </ExperienceProvider>
  );
}
