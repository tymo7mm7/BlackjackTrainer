import { useCallback, useEffect, useMemo, useState } from "react";
import type { Card } from "../../types/types";
// import { drawDeckbyApi } from "../api/drawdeck";
import { Bets } from "./bets";
import calculateScore from "../utils/calculateScore";

function Game() {
  // obsługa gry i obsługa decku
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [deckId, setDeckId] = useState<string>("");
  // obsługa gry
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [onDrawnCards, setOnDrawnCards] = useState<Card[]>([]);
  const [onHit, setOnHit] = useState<number>(0);
  const [onPass, setOnPass] = useState<boolean>(false);

  // Handler for gamestate changes
  const handleGameStateChange = (newState: boolean) => {
    setIsGameActive(newState);
  };

  // Handler decku
  const drawDeck = useCallback(async () => {
    try {
      const xhr = new XMLHttpRequest();

      xhr.open(
        "GET",
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
      );
      xhr.responseType = "json";
      xhr.send();
      xhr.onload = () => {
        const deckId = xhr.response.deck_id;
        console.log("nowy deck: ", deckId);
        setDeckId(deckId);
        localStorage.setItem("deckId", deckId);
        // console.log(xhr.response);
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const deckId = localStorage.getItem("deckId");
    if (deckId) {
      setDeckId(deckId);
    }
  }, [deckId]);

  const resetDeck = useCallback(() => {
    setDeckId("");
    localStorage.removeItem("deckId");
  }, []);

  const drawCards = useCallback(
    async (amount: number) => {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open(
          "GET",
          `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${amount}`
        );
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = () => {
          const cards = xhr.response.cards;
          // console.log("drawn cards: ", cards);
          cards.forEach((card: Card) => {
            setOnDrawnCards((prevCards) => [...prevCards, card]);
          });
        };
      } catch (e) {
        console.log(e);
      }
    },
    [deckId]
  );

  const resetGame = useCallback(() => {
    setIsGameActive(false);
    //
    setPlayerCards([]);
    setDealerCards([]);
    setOnHit(0);
    setOnPass(false);
  }, []);

  useEffect(() => {
    if (isGameActive) {
      drawCards(4);
    }
  }, [isGameActive, drawCards]);

  useEffect(() => {
    onDrawnCards.forEach((card: Card, index: number) => {
      if (onPass) {
        setDealerCards((prevCards) => [...prevCards, card]);
      // } else if (onDrawnCards.length === 4) {
      } else {
        if (index % 2 === 0) {
        setPlayerCards((prevCards) => [...prevCards, card]);          
        } else {
        setDealerCards((prevCards) => [...prevCards, card]);

        }
      }
      setOnDrawnCards([]);
      // console.log(playerCards);
    });
  }, [onDrawnCards, onPass]);
  
  const playerDraw = useCallback(() => {
    setOnHit((prevValue: number) => prevValue + 1);
  }, []);
  const playerPass = useCallback(() => {
    setOnPass(true);
  }, []);

  useEffect(() => {
    if (isGameActive && onHit > 0) {
      drawCards(1);
    }
  }, [isGameActive, onHit]);
  
  const playerScore = useMemo(() => calculateScore(playerCards), [playerCards]);
  const dealerScore = useMemo(() => calculateScore(dealerCards), [dealerCards]);

  useEffect(() => {
    if (isGameActive) {
      console.log("Player score: ", playerScore);
      console.log("Dealer score: ", dealerScore);
    }
  }, [isGameActive, playerScore, dealerScore]);

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => resetGame()}>Reset</button>
      <button onClick={() => resetDeck()}>Reset deck</button>
      <div className="">
        {!deckId && (
          <button onClick={() => drawDeck()}>
            Pobierz deck / Ustaw nowy deck
          </button>
        )}
      </div>
      {deckId && (
        <div className="">
          <Bets
            isGameActive={isGameActive}
            GameStateSetter={handleGameStateChange}
          />
          {isGameActive && (<div className="flex flex-col">
            <div className="flex flex-row">
              <h1 className="text-white">Player</h1>
              {playerCards.map((card: Card, index: number) => (
                <img
                  key={index}
                  src={card.image}
                  alt={card.value + " " + card.suit + " " + card.code}
                />
              ))}
            </div>
            <div className="flex flex-row"> 
            <h1>Dealer</h1>
              {dealerCards.map((card: Card, index: number) => (
                index !== 1 ? (
                  <img
                    key={index}
                    src={card.image}
                    alt={card.value + " " + card.suit + " " + card.code}
                  />
                ) : isGameActive ? (
                  <img
                    key={index}
                    src="https://deckofcardsapi.com/static/img/back.png"
                    alt="dealer hidden card"
                  />
                ) : (
                  <img
                    key={index}
                    src={card.image}
                    alt={card.value + " " + card.suit + " " + card.code}
                  />
                )
              ))}
            </div>
            <div className="flex flex-col gap-4">
            <button onClick={() => playerDraw()}>Hit</button>
            <button onClick={() => playerPass()}>Pass</button>
            </div>
          </div>)}
        </div>
      )}
    </div>
  );
}

export { Game };
