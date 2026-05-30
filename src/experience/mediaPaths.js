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
      "give-up": "/video/giveup.mp4",
      "sneak-attack": "/video/sneakattack.mp4",
    },
    fightStyle: {
      aggressive: "/video/aggressive.mp4",
      defensive: "/video/parry.mp4",
    },
  },
  endings: {
    fight: null,
    "fight-aggressive": "/video/haloframecontroller.mp4",
    "fight-defensive": "/video/mercybandheadset.mp4",
    "kneel-give-up": "/video/bloodcircuitmouse.mp4",
    "kneel-sneak-attack": "/video/nullbladekeyboard.mp4",
  },
  products: {
    haloframe: {
      video: "/video/haloframecontroller.mp4",
      image: "/images/products/haloframe-controller.png",
    },
    nullblade: {
      video: "/video/nullbladekeyboard.mp4",
      image: "/images/products/nullblade-keyboard.png",
    },
    bloodcircuit: {
      video: "/video/bloodcircuitmouse.mp4",
      image: "/images/products/bloodcircuit-mouse.png",
    },
    mercyband: {
      video: "/video/mercybandheadset.mp4",
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
  MEDIA_PATHS.decisions.kneelResponse["give-up"],
  MEDIA_PATHS.decisions.kneelResponse["sneak-attack"],
  MEDIA_PATHS.decisions.fightStyle.aggressive,
  MEDIA_PATHS.decisions.fightStyle.defensive,
  MEDIA_PATHS.endings["fight-aggressive"],
  MEDIA_PATHS.endings["fight-defensive"],
  MEDIA_PATHS.endings["kneel-give-up"],
  MEDIA_PATHS.endings["kneel-sneak-attack"],
  MEDIA_PATHS.products.haloframe.video,
  MEDIA_PATHS.products.nullblade.video,
  MEDIA_PATHS.products.bloodcircuit.video,
  MEDIA_PATHS.products.mercyband.video,
]);

export function resolveVideoSrc(targetPath) {
  if (targetPath && READY_VIDEO_SOURCES.has(targetPath)) {
    return targetPath;
  }

  return PLACEHOLDER_VIDEO_SRC;
}
