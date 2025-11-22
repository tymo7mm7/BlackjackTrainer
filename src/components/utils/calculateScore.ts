import type { Card } from "../../types/types";

export default function calculateScore(hand: Card[]) {
  let score = 0;

  for (const card of hand) {
    if (["KING", "QUEEN", "JACK"].includes(card.value)) {
      score += 10;
    } else if (card.value === "ACE" && score + 11 <= 21) {
      score += 11;
    } else if (card.value === "ACE") {
      score += 1;
    } else {
      score += Number(card.value);
    }
  }
  return score;
}
