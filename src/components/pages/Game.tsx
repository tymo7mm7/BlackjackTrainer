import { useCallback, useEffect, useMemo, useState } from "react";
import calculateScore from "../utils/calculateScore";
import { type Card } from "../../types/types";
import { Button } from "../ui/Button";
import { Hand } from "../gameComponents/Hand";
import { Footer } from "../gameComponents/Footer";

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
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [remainingCards, setRemainingCards] = useState<number>(312);

  // Betting State
  const [chips, setChips] = useState<number>(2000);
  const [betAmount, setBetAmount] = useState<number>(0);

  // Handler for gamestate changes
  const handleGameStateChange = (newState: boolean) => {
    setIsGameActive(newState);
    if (newState) {
      // Deduct bet when game starts
      setChips((prev) => prev - betAmount);
      localStorage.setItem("chips", (chips - betAmount).toString());
    }
  };

  // if deckId in localStorage -> set deckId
  useEffect(() => {
    const deckId = localStorage.getItem("deckId");
    if (deckId) {
      setDeckId(deckId);
    }
  }, [deckId]);

  // if chips in localStorage -> set chips
  useEffect(() => {
    const chips = localStorage.getItem("chips");
    if (chips) {
      setChips(Number(chips));
    }
  }, [chips]);

  // Handler pobierania decku z api
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
        setRemainingCards(xhr.response.remaining);
        localStorage.setItem("deckId", deckId);
        // console.log(xhr.response);
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  const resetDeck = useCallback(() => {
    setDeckId("");
    setRemainingCards(0);
    localStorage.removeItem("deckId");
    localStorage.removeItem("remainingCards");
    localStorage.removeItem("chips");
    if (isGameActive) {
      setIsGameActive(false);
    }
    resetGame();
    setChips(2000);
    setBetAmount(0);
  }, []);

  // handler pobierania kart przez api
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
          setRemainingCards(xhr.response.remaining);
          localStorage.setItem(
            "remainingCards",
            xhr.response.remaining.toString()
          );
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

  // update remaining cards on page reload
  useEffect(() => {
    const remainingCards = localStorage.getItem("remainingCards");
    if (remainingCards) {
      setRemainingCards(Number(remainingCards));
    }
    if (Number(remainingCards) <= 5 && isGameActive) {
      drawDeck();
    }
  }, [remainingCards]);

  const resetGame = useCallback(() => {
    setIsGameActive(false);
    setPlayerCards([]);
    setDealerCards([]);
    setOnHit(0);
    setOnPass(false);
    setGameResult(null);
  }, []);

  // start gry
  useEffect(() => {
    if (isGameActive) {
      drawCards(4);
    }
  }, [isGameActive, drawCards]);

  // rozdzielanie kart
  useEffect(() => {
    onDrawnCards.forEach((card: Card, index: number) => {
      if (onPass) {
        setDealerCards((prevCards) => [...prevCards, card]);
      } else {
        if (index % 2 === 0) {
          setPlayerCards((prevCards) => [...prevCards, card]);
        } else {
          setDealerCards((prevCards) => [...prevCards, card]);
        }
      }
      setOnDrawnCards([]);
    });
  }, [onDrawnCards, onPass]);

  const playerDraw = useCallback(() => {
    setOnHit((prevValue: number) => prevValue + 1);
  }, []);

  const playerPass = useCallback(() => {
    setOnPass(true);
  }, []);

  // handler dobierania kart dla gracza
  useEffect(() => {
    if (isGameActive && onHit > 0) {
      drawCards(1);
    }
  }, [isGameActive, onHit]);

  // zapisywanie wyników
  const playerScore = useMemo(() => calculateScore(playerCards), [playerCards]);
  const dealerScore = useMemo(() => calculateScore(dealerCards), [dealerCards]);

  const handleGameEnd = useCallback(() => {
    let result = "";
    let payout = 0;

    // Check for Blackjack (21 with 2 cards)
    const playerHasBlackjack = playerScore === 21 && playerCards.length === 2;

    // Player Bust
    if (playerScore > 21) {
      result = "Bust! Dealer Wins";
      payout = 0;
    } // Dealer Bust
    else if (dealerScore > 21) {
      result = playerHasBlackjack
        ? "Blackjack! Player Wins"
        : "Dealer Bust! Player Wins";
      payout = playerHasBlackjack ? betAmount * 2.5 : betAmount * 2;
    } else if (playerScore > dealerScore) {
      result = playerHasBlackjack ? "Blackjack! Player Wins" : "Player Wins!";
      payout = playerHasBlackjack ? betAmount * 2.5 : betAmount * 2;
    } else if (dealerScore > playerScore) {
      result = "Dealer Wins!";
      payout = 0;
    } else {
      // Draw
      result = "Push (Tie)";
      payout = betAmount; // Return bet
    }

    // Payout handler
    if (payout > 0) {
      setChips((prev) => prev + payout);
      localStorage.setItem("chips", (chips + payout).toString());
    }

    // Game result handler
    setGameResult(result);
  }, [playerScore, dealerScore, playerCards.length, betAmount]);

  // Player Bust Watcher & Auto-Pass on 21
  useEffect(() => {
    if (isGameActive) {
      if (playerScore > 21) {
        const timeoutId = setTimeout(() => {
          handleGameEnd();
        }, 1000);
        return () => clearTimeout(timeoutId);
      } else if (playerScore === 21 && !onPass) {
        const timeoutId = setTimeout(() => {
          setOnPass(true);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isGameActive, playerScore, handleGameEnd, onPass]);

  // Dealer Draw Logic
  useEffect(() => {
    if (onPass && isGameActive && !gameResult) {
      if (dealerScore <= 16) {
        const timeoutId = setTimeout(() => {
          drawCards(1);
        }, 1000);
        return () => clearTimeout(timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          handleGameEnd();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [onPass, dealerScore, isGameActive, gameResult, drawCards, handleGameEnd]);

  // debugger wyniku
  // useEffect(() => {
  //   if (isGameActive) {
  //     console.log("Player score: ", playerScore);
  //     console.log("Dealer score: ", dealerScore);
  //   }
  // }, [isGameActive, playerScore, dealerScore]);

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="">
        {!deckId && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => drawDeck()}
              variant="primary"
              className="text-xl px-8 py-4"
            >
              Start New Game
            </Button>
          </div>
        )}
      </div>
      {deckId && (
        <div className="">
          {isGameActive ? (
            <div>
              <div className="flex flex-col gap-12 min-h-[400px] justify-center py-8">
                {/* Dealer Hand */}
                <Hand
                  title="Dealer"
                  cards={dealerCards}
                  score={dealerScore}
                  isDealer={true}
                  hideSecondCard={isGameActive && !onPass}
                />
                {/* Player Hand */}
                <Hand title="Player" cards={playerCards} score={playerScore} />
              </div>
              {gameResult && (
                <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 p-8 rounded-xl flex flex-col items-center gap-4 z-50 border-2 border-amber-500 shadow-2xl">
                  <h2
                    className={`text-5xl font-bold mb-4 ${
                      gameResult.includes("Win")
                        ? "text-green-500"
                        : gameResult.includes("Push")
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {gameResult}
                  </h2>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => resetGame()}
                      variant="primary"
                      className="text-lg px-6"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
              <h2 className="text-3xl font-light">
                Place your bet to start dealing
              </h2>
            </div>
          )}

          <Footer
            isGameActive={isGameActive}
            GameStateSetter={handleGameStateChange}
            chips={chips}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onHit={playerDraw}
            onPass={playerPass}
            onResetRound={resetGame}
            onResetDeck={resetDeck}
            onSplit={() => {}}
            disableControls={onPass || !!gameResult || playerScore >= 21}
            canSplit={false}
            remainingCards={remainingCards}
          />
        </div>
      )}
    </div>
  );
}

export { Game };
