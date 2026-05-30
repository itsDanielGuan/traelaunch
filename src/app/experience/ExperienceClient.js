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

const TRANSITION_TIMINGS = {
  midpointHoldMs: 1350,
  revealAfterCanPlayMs: 330,
  introFadeReleaseMs: 675,
  overlayFadeMs: 1050,
  copyFadeMs: 750,
  introFadeMs: 1800,
};

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

function getUpcomingDecisionKeyFromChoices(stage, choices) {
  const nextStage = nextStageAfterVideo(stage, choices);
  return nextStage ? decisionKeyForStage(nextStage) : null;
}

function getStageLabel(stage) {
  switch (stage) {
    case STAGES.PROLOGUE:
      return "Prologue";
    case STAGES.DECISION_APPROACH:
      return "Decision I";
    case STAGES.DECISION_KNEEL_RESPONSE:
    case STAGES.DECISION_FIGHT_STYLE:
      return "Decision II";
    case STAGES.CONSEQUENCE_APPROACH:
    case STAGES.CONSEQUENCE_KNEEL_RESPONSE:
    case STAGES.CONSEQUENCE_FIGHT_STYLE:
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
  const [skipRequestId, setSkipRequestId] = useState(0);
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

  useEffect(() => {
    const { documentElement, body } = document;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const overlayDecision = decisionOverlayKey ? decisionData[decisionOverlayKey] : null;

  const activeConsequenceKey = useMemo(() => {
    if (!isConsequenceStage(state.currentStage)) return null;
    return decisionKeyForStage(state.currentStage);
  }, [state.currentStage]);

  const pathSummary = useMemo(() => {
    const summaryOrder = ["approach", "kneelResponse", "fightStyle"];

    return summaryOrder
      .map((decisionKey) => {
        const optionId = state.choices?.[decisionKey];
        if (!optionId) return null;

        const decision = decisionData[decisionKey];
        const option = decision?.options.find((entry) => entry.id === optionId);
        if (!decision || !option) return null;

        return {
          key: decisionKey,
          title:
            decisionKey === "approach"
              ? "Approach"
              : decisionKey === "kneelResponse"
                ? "Kneel Choice"
                : "Fight Style",
          label: option.label,
          description: option.description,
        };
      })
      .filter(Boolean);
  }, [state.choices]);

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
  const isVideoNearEnd = progress.duration > 0 && progress.current >= progress.duration - 0.12;
  const showSkipControl =
    showVideo && !decisionOverlayKey && !transitionState.active && !introFadeActive && !isVideoNearEnd;

  const stageLabel = decisionOverlayKey
    ? getStageLabel(nextStageAfterVideo(state.currentStage, state.choices) ?? state.currentStage)
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
      }, TRANSITION_TIMINGS.midpointHoldMs);
    },
    [clearTransitionTimers, queueTransitionTimeout],
  );

  const isEndingReady = endingReady || (state.currentStage === STAGES.ENDING && !videoSrc);
  const endingTheme = product?.theme ?? {
    accent: "var(--sc-cyan)",
    glow: "var(--sc-red)",
  };

  const handleVideoEnded = useCallback(() => {
    if (state.currentStage === STAGES.ENDING) {
      setEndingReady(true);
      return;
    }

    const nextDecisionKey = getUpcomingDecisionKeyFromChoices(state.currentStage, state.choices);
    if (nextDecisionKey) {
      setDecisionOverlayKey(nextDecisionKey);
      return;
    }

    if (
      state.currentStage === STAGES.CONSEQUENCE_KNEEL_RESPONSE ||
      state.currentStage === STAGES.CONSEQUENCE_FIGHT_STYLE
    ) {
      beginBlackTransition("", () => {
        dispatch(actions.videoEnded());
      });
      return;
    }

    dispatch(actions.videoEnded());
  }, [actions, beginBlackTransition, dispatch, state.choices, state.currentStage]);

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

  const requestSkip = useCallback(() => {
    if (!showSkipControl) return;
    setSkipRequestId((current) => current + 1);
  }, [showSkipControl]);

  useEffect(() => {
    if (!showSkipControl) return;

    const handleKeyDown = (event) => {
      if (event.defaultPrevented || event.key.toLowerCase() !== "s") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement)
      ) {
        return;
      }

      event.preventDefault();
      setSkipRequestId((current) => current + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSkipControl]);

  return (
    <div className="sc-screen relative flex h-screen min-h-screen w-full overflow-hidden bg-black text-white">
      {showVideo ? (
        <div className="absolute inset-0">
          <VideoPlayer
            src={videoSrc}
            className="h-full w-full"
            videoClassName="h-full w-full object-cover"
            muted={false}
            skipRequestId={skipRequestId}
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
                }, TRANSITION_TIMINGS.introFadeReleaseMs);
              }

              if (!transitionState.waitingForNextVideo) return;

              queueTransitionTimeout(() => {
                setTransitionState({
                  active: false,
                  text: "",
                  waitingForNextVideo: false,
                });
              }, TRANSITION_TIMINGS.revealAfterCanPlayMs);
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.04),transparent_26%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.58)_100%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(77,186,210,0.14),transparent_24%),radial-gradient(circle_at_20%_60%,rgba(198,23,47,0.16),transparent_28%),linear-gradient(180deg,#071019_0%,#06080c_48%,#030406_100%)]" />
      )}

      <div className="relative z-10 flex min-h-0 w-full flex-col overflow-hidden">
        <header className="shrink-0 flex items-start px-5 py-5 sm:px-8">
          <div className="sc-video-hud px-4 py-3">
            <div className="sc-kicker text-[10px]">Saint Circuit</div>
            <div className="mt-1 sc-title text-xs font-semibold">{stageLabel}</div>
          </div>
          {state.currentStage === STAGES.ENDING ? (
            <div className="ml-auto max-w-sm text-right">
              <div className="sc-kicker text-[10px] text-white/62">
                SAINT CIRCUIT:PILGRIMAGE PROTOCOL
              </div>
            </div>
          ) : null}
        </header>

        <div className="relative flex min-h-0 flex-1 px-5 pb-8 pt-4 sm:px-8 sm:pb-10">
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
                    const isFightChoice =
                      decisionOverlayKey === "approach" &&
                      option.id === "fight";
                    const btnClass = isFightChoice
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
                  The next step appears after the clip finishes.
                </div>
              </div>
            </div>
          ) : null}

          {state.currentStage === STAGES.ENDING && ending ? (
            <div className="mt-auto flex w-full flex-col gap-4">
              <div
                className="w-full max-w-xl px-2 py-2 sm:px-0"
                style={{
                  "--sc-accent": endingTheme.accent,
                  "--sc-glow": endingTheme.glow,
                }}
              >
                <div className="sc-kicker text-[10px]" style={{ color: "var(--sc-accent)" }}>
                  Ending Outcome
                </div>
                <div className="sc-medieval sc-metal-text mt-3 text-3xl sm:text-4xl">
                  {ending.title}
                </div>
                <div className="mt-3 text-sm leading-6 text-white/78 sm:text-base">
                  {ending.line}
                </div>
                <div className="mt-3 text-sm leading-7 text-white/72">
                  {ending.scenario ?? ending.line}
                </div>

                {product ? (
                  <>
                    <div className="mt-6 h-px w-full bg-white/12" />
                    <div className="mt-6 sc-kicker text-[10px]" style={{ color: "var(--sc-accent)" }}>
                      Product Unlocked
                    </div>
                    <div className="mt-3 sc-medieval sc-metal-text text-2xl sm:text-3xl">
                      {product.name}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-white/78">
                      {product.tagline}
                    </div>
                    <div className="mt-4 text-sm leading-7 text-white/72">
                      {product.description}
                    </div>
                  </>
                ) : null}

                <div className="mt-6 grid gap-3">
                  {product ? (
                    <a
                      className="sc-btn sc-btn-primary text-center"
                      href={product.buyHref ?? "#buy-now"}
                    >
                      Buy now
                    </a>
                  ) : null}
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

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {pathSummary.map((entry) => (
                    <div key={entry.key} className="border-l border-white/12 pl-4">
                      <div className="sc-kicker text-[9px] text-white/46">
                        {entry.title}
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {entry.label}
                      </div>
                      <div className="mt-2 text-xs leading-6 text-white/60">
                        {entry.description}
                      </div>
                    </div>
                  ))}
                </div>

                {!isEndingReady ? (
                  <div className="mt-5 text-xs text-white/54">
                    The product reveal is still playing and will hold on the final frame.
                  </div>
                ) : null}
              </div>
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

      {showSkipControl ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-end p-5 sm:p-8">
          <button
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/16 bg-black/62 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/86 backdrop-blur-sm transition hover:border-white/32 hover:bg-black/78"
            type="button"
            onClick={requestSkip}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/52">
              S
            </span>
            <span>Skip Cutscene</span>
          </button>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transform-gpu transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          transitionState.active ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.018] blur-sm"
        }`}
        style={{ transitionDuration: `${TRANSITION_TIMINGS.overlayFadeMs}ms` }}
      >
        {transitionState.active ? (
          <>
            <LoopingLoadingVideo className="absolute inset-0 h-full w-full scale-[1.03] object-cover saturate-[0.88]" />
            <div className="absolute inset-0 bg-black/52 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.76)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.28)_22%,rgba(0,0,0,0.52)_58%,rgba(0,0,0,0.82)_100%)]" />
          </>
        ) : null}
        <div
          className={`relative z-10 px-8 text-center text-sm uppercase tracking-[0.22em] text-white/86 transform-gpu transition-[opacity,transform,filter] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            transitionState.active && transitionState.text
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-2 blur-[2px]"
          }`}
          style={{ transitionDuration: `${TRANSITION_TIMINGS.copyFadeMs}ms` }}
        >
          {transitionState.text}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-40 bg-black transition-[opacity,filter] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          introFadeActive ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        }`}
        style={{ transitionDuration: `${TRANSITION_TIMINGS.introFadeMs}ms` }}
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
