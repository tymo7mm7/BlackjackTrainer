import type { Card } from "../../types/types";

export default function calculateScore(hand: Card[]) {
  let score = 0;
  let aceCount = 0;

  for (const card of hand) {
    if (["KING", "QUEEN", "JACK"].includes(card.value)) {
      score += 10;
    } else if (card.value === "ACE") {
      // Initially treat every Ace as 11
      score += 11;
      aceCount += 1;
    } else {
      score += Number(card.value);
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }

  return score;
}