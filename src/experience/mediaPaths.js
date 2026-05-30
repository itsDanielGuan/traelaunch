export const PLACEHOLDER_VIDEO_SRC =
  "/video/PixVerse_V6_Image_Text_360P_Hyperreal_cinemati.mp4";

export const MEDIA_PATHS = Object.freeze({
  loadingLoop: "/video/loading.mp4",
  landingLoop: "/video/loading.mp4",
  prologue: "/video/initialscene.mp4",
  decisions: {
    route: {
      nave: "/videos/decision-1/nave.mp4",
      tower: "/videos/decision-1/tower.mp4",
      crypt: "/videos/decision-1/crypt.mp4",
    },
    blade: {
      "prayer-code": "/videos/decision-2/prayer-code.mp4",
      "dead-fire": "/videos/decision-2/dead-fire.mp4",
      "human-memory": "/videos/decision-2/human-memory.mp4",
    },
    sacrifice: {
      fear: "/videos/decision-3/fear.mp4",
      memories: "/videos/decision-3/memories.mp4",
      obedience: "/videos/decision-3/obedience.mp4",
    },
    command: {
      "sever-core": "/videos/decision-4/sever-core.mp4",
      "wear-halo": "/videos/decision-4/wear-halo.mp4",
      "open-gates": "/videos/decision-4/open-gates.mp4",
    },
  },
  endings: {
    destroyer: "/videos/endings/destroyer.mp4",
    saint: "/videos/endings/saint.mp4",
    heretic: "/videos/endings/heretic.mp4",
    apostle: "/videos/endings/apostle.mp4",
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
]);

export function resolveVideoSrc(targetPath) {
  if (targetPath && READY_VIDEO_SOURCES.has(targetPath)) {
    return targetPath;
  }

  return PLACEHOLDER_VIDEO_SRC;
}
