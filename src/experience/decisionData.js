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
        description: "Meet the archangel with steel and choose how you survive the clash.",
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
        video: "/video/giveup.mp4",
      },
      {
        id: "sneak-attack",
        label: "Sneak attack",
        description: "Stay bowed just long enough to strike when the archangel relaxes.",
        transitionLine: "You hide the strike inside your submission.",
        video: "/video/sneakattack.mp4",
      },
    ],
  },
  fightStyle: {
    question: "Steel meets halo-fire. Do you press the attack or wait for the perfect parry?",
    options: [
      {
        id: "aggressive",
        label: "Aggressive",
        description: "Overwhelm the archangel with relentless pressure and violent momentum.",
        transitionLine: "You lunge first and refuse to give the machine room to breathe.",
        video: "/video/aggressive.mp4",
      },
      {
        id: "defensive",
        label: "Defensive",
        description: "Hold your ground, read the pattern, and answer every strike with timing.",
        transitionLine: "You wait inside the storm and turn its force back with a measured parry.",
        video: "/video/parry.mp4",
      },
    ],
  },
});
