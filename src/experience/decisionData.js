export const decisionData = Object.freeze({
  approach: {
    question: "The archangel stirs beyond the cathedral doors. Do you kneel, or do you FIGHT!?",
    options: [
      {
        id: "kneel",
        label: "Kneel",
        description: "Bow before the fallen machine and wait for its judgment.",
        transitionLine: "You lower your blade and kneel before the machine saint.",
        video: "/video/kneel.mp4",
      },
      {
        id: "fight",
        label: "FIGHT!",
        description: "Meet the archangel with steel. You can add this clip and follow-up choices later.",
        transitionLine: "You choose defiance and raise your sword.",
        video: "/video/fight1.mp4",
      },
    ],
  },
  kneelResponse: {
    question: "The archangel accepts your submission for a breath. What do you do next?",
    options: [
      {
        id: "give-up",
        label: "Give up",
        description: "Surrender fully and let the machine write the ending for you.",
        transitionLine: "You release the last of your resistance.",
        video: "/videos/decision-2/give-up.mp4",
      },
      {
        id: "sneak-attack",
        label: "Sneak attack",
        description: "Stay bowed just long enough to strike when the archangel relaxes.",
        transitionLine: "You hide the strike inside your submission.",
        video: "/videos/decision-2/sneak-attack.mp4",
      },
    ],
  },
});
