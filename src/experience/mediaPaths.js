export const PLACEHOLDER_VIDEO_SRC =
  "/video/PixVerse_V6_Image_Text_360P_Hyperreal_cinemati.mp4";

export const MEDIA_PATHS = Object.freeze({
  loadingLoop: "/video/loading.mp4",
  landingLoop: "/video/loading.mp4",
  prologue: "/video/initialscene.mp4",
  decisions: {
    approach: {
      kneel: "/video/kneel.mp4",
      fight: "/video/fight1.mp4",
    },
    kneelResponse: {
      "give-up": "/videos/decision-2/give-up.mp4",
      "sneak-attack": "/videos/decision-2/sneak-attack.mp4",
    },
  },
  endings: {
    fight: null,
    "kneel-give-up": null,
    "kneel-sneak-attack": null,
  },
  products: {
    haloframe: {
      video: "/videos/products/haloframe-controller.mp4",
      image: "/images/products/haloframe-controller.png",
    },
    nullblade: {
      video: "/videos/products/nullblade-keyboard.mp4",
      image: "/images/products/nullblade-keyboard.png",
    },
    bloodcircuit: {
      video: "/videos/products/bloodcircuit-mouse.mp4",
      image: "/images/products/bloodcircuit-mouse.png",
    },
    mercyband: {
      video: "/videos/products/mercyband-headset.mp4",
      image: "/images/products/mercyband-headset.png",
    },
  },
});

const READY_VIDEO_SOURCES = new Set([
  MEDIA_PATHS.loadingLoop,
  MEDIA_PATHS.landingLoop,
  MEDIA_PATHS.prologue,
  MEDIA_PATHS.decisions.approach.kneel,
  MEDIA_PATHS.decisions.approach.fight,
]);

export function resolveVideoSrc(targetPath) {
  if (targetPath && READY_VIDEO_SOURCES.has(targetPath)) {
    return targetPath;
  }

  return PLACEHOLDER_VIDEO_SRC;
}
