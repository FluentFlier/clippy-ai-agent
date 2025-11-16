// Animation definitions from Felix Rieseberg's Clippy
export interface Animation {
  src: string;
  length: number;
}

import Alert from "./images/animations/Alert.png";
import CheckingSomething from "./images/animations/CheckingSomething.png";
import Congratulate from "./images/animations/Congratulate.png";
import Default from "./images/animations/Default.png";
import Explain from "./images/animations/Explain.png";
import Greeting from "./images/animations/Greeting.png";
import Processing from "./images/animations/Processing.png";
import RestPose from "./images/animations/RestPose.png";
import Searching from "./images/animations/Searching.png";
import Show from "./images/animations/Show.png";
import Thinking from "./images/animations/Thinking.png";
import Wave from "./images/animations/Wave.png";
import Writing from "./images/animations/Writing.png";
import IdleFingerTap from "./images/animations/IdleFingerTap.png";
import IdleHeadScratch from "./images/animations/IdleHeadScratch.png";
import IdleSideToSide from "./images/animations/IdleSideToSide.png";

export const ANIMATIONS: Record<string, Animation> = {
  Alert: { src: Alert, length: 2400 },
  CheckingSomething: { src: CheckingSomething, length: 6640 },
  Congratulate: { src: Congratulate, length: 3680 },
  Default: { src: Default, length: 0 },
  Explain: { src: Explain, length: 1500 },
  Greeting: { src: Greeting, length: 4450 },
  Processing: { src: Processing, length: 3800 },
  RestPose: { src: RestPose, length: 100 },
  Searching: { src: Searching, length: 8100 },
  Show: { src: Show, length: 50 },
  Thinking: { src: Thinking, length: 4500 },
  Wave: { src: Wave, length: 4900 },
  Writing: { src: Writing, length: 8400 },
  IdleFingerTap: { src: IdleFingerTap, length: 1150 },
  IdleHeadScratch: { src: IdleHeadScratch, length: 1900 },
  IdleSideToSide: { src: IdleSideToSide, length: 5700 },
};

export const EMPTY_ANIMATION: Animation = { src: "", length: 0 };

export function getRandomIdleAnimation(): Animation {
  const idleAnimations = [
    ANIMATIONS.IdleFingerTap,
    ANIMATIONS.IdleHeadScratch,
    ANIMATIONS.IdleSideToSide,
    ANIMATIONS.Default,
  ];
  return idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
}
