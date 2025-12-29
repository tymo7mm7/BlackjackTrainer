import { useCallback } from "react";
import { Button } from "../ui/Button";

interface FooterParams {
  isGameActive: boolean;
  GameStateSetter: (state: boolean) => void;
  chips: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onHit: () => void;
  onPass: () => void;
  onResetRound: () => void;
  onResetDeck: () => void;
  onSplit: () => void;
  disableControls: boolean;
  canSplit: boolean;
  remainingCards: number;
}

function Footer({ 
  isGameActive, 
  GameStateSetter, 
  chips, 
  betAmount, 
  setBetAmount,
  onHit,
  onPass,
  onResetRound,
  onResetDeck,
  onSplit,
  disableControls,
  canSplit,
  remainingCards
}: FooterParams) {




  // handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (val <= chips) {
      setBetAmount(val);
    }
  };

  // place bet handler
  const placeBet = useCallback(() => {
    if (betAmount <= 0) return;
    GameStateSetter(true);
    console.log(`Game started with bet: ${betAmount}`);
  }, [betAmount, GameStateSetter]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        
        {/* LEFT: Reset Controls */}
        <div className="flex items-center gap-2 min-w-[200px]">
           <Button 
            onClick={onResetDeck} 
            variant="secondary"
            className="text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 border-slate-600"
           >
            Reset Deck
          </Button>
          {isGameActive && (
             <Button 
              onClick={onResetRound} 
              variant="danger"
              className="text-sm px-3 py-2"
             >
              Reset Round
            </Button>
          )}
        </div>

        {/* CENTER: Game Actions (Betting or Playing) */}
        <div className="flex items-center justify-center gap-4 flex-1">
          {!isGameActive ? (
            // BETTING PHASE
            <div className="flex items-center gap-4">
              <Button onClick={() => {if (betAmount/2 >= 1) setBetAmount(betAmount / 2); else setBetAmount(1)}} variant="danger"
              className="px-8 py-2 text-lg font-bold w-20 shadow-indigo-500/20 shadow-lg bg-red-50"
              >
                /2
              </Button>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  value={betAmount || ''}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-40 pl-8 pr-4 py-2 text-right text-lg rounded-lg border-2 border-indigo-500 text-white bg-slate-800 focus:outline-none focus:border-indigo-400 font-mono transition-all"
                />
              </div>
              <Button onClick={() => setBetAmount(betAmount + 10)} variant="outline"
              className="px-8 py-2 text-lg font-bold w-20 shadow-indigo-500/20 shadow-lg"
              >
                +10
              </Button>
              <Button onClick={() => setBetAmount(betAmount * 2)} variant="secondary"
              className="px-8 py-2 text-lg font-bold w-20 shadow-indigo-500/20 shadow-lg bg-violet-500"
              >
                x2
              </Button>
              <Button
                  onClick={placeBet}
                  disabled={betAmount <= 0 || betAmount > chips}
                  variant="primary"
                  className="px-8 py-2 text-lg font-bold min-w-[120px] shadow-indigo-500/20 shadow-lg"
                >
                  Deal
              </Button>
            </div>
          ) : (
             // PLAYING PHASE
             <div className="flex items-center gap-4">
                <Button 
                  onClick={onHit} 
                  variant="primary" 
                  className="px-8 py-2 text-xl font-bold min-w-[120px] shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={disableControls}
                >
                  Hit
                </Button>
                <Button 
                  onClick={onPass} 
                  variant="secondary" 
                  className="px-8 py-2 text-xl font-bold min-w-[120px] shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={disableControls}
                >
                  Pass
                </Button>
                {canSplit && (
                  <Button 
                    onClick={onSplit} 
                    variant="secondary" 
                    className="px-8 py-2 text-xl font-bold min-w-[120px] shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-green-500 hover:bg-amber-600 text-white border-amber-600"
                    disabled={disableControls}
                  >
                    Split
                  </Button>
                )}
             </div>
          )}
        </div>

        {/* RIGHT: Chips & Status */}
        <div className="flex items-center justify-end gap-6 min-w-[200px]">
           {/* Deck Count */}
           <div className="flex flex-col items-end leading-tight mr-4">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Cards Left</span>
              <span className="text-slate-300 text-lg font-mono tracking-wider">{remainingCards}/312</span>
           </div>
           {isGameActive && (
             <div className="flex flex-col items-end">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Current Bet</span>
                <span className="text-indigo-400 font-bold text-xl">${betAmount}</span>
             </div>
           )}
           <div className="flex items-center gap-3 bg-slate-950 px-5 py-2 rounded-lg border border-slate-800">
             <div className="flex flex-col items-end leading-tight">
                <span className="text-amber-500 text-xs uppercase font-bold tracking-wider">Balance</span>
                <span className="text-white text-xl font-mono tracking-wider">${chips}</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export { Footer };
