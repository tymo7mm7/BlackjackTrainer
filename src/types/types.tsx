interface Deck {
  success: boolean;
  deck_id: string;
  remaining: number;
  shuffled: boolean;
}

interface Card {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

interface Cards {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
}

export type { Deck, Card, Cards };
