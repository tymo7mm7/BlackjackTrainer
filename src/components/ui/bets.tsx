import { useCallback, useState } from "react";

interface BetsParams {
  isGameActive: boolean;
  GameStateSetter: (state: boolean) => void;
}

function Bets({ isGameActive, GameStateSetter }: BetsParams) {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [chips, setChips] = useState<number>(2000);

  //   handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (val <= chips) {
      setBetAmount(val);
    }
  };

  // Handler for "Placing" the bet
  const placeBet = useCallback(() => {
    if (betAmount <= 0) return;
    GameStateSetter(true);
    console.log(`Game started with bet: ${betAmount}`);
  }, [betAmount, GameStateSetter]);

  const chipsReset = useCallback(() => {
    setChips(2000);
  }, []);

  return (
    <>
      <h1 className="text-white text-center">Chips: {chips}</h1>
      {!isGameActive && (
        <div className="flex flex-col items-center justify-center text-white p-4 font-sans">
          <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-8 bg-slate-950 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-400">
                <span className="text-xl font-bold">Chips</span>
              </div>
              <span className="text-2xl font-mono">{chips}</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  {isGameActive ? "Current Bet (Locked)" : "Place your Bet"}
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={handleInputChange}
                    // This is the key: We disable the input based on game state
                    // rather than moving the value to a new variable.
                    disabled={isGameActive}
                    className={`w-full p-4 text-right text-2xl rounded-lg bg-slate-700 border-2 focus:outline-none transition-all
                  ${
                    isGameActive
                      ? "border-slate-600 text-slate-400 cursor-not-allowed"
                      : "border-indigo-500 text-white focus:border-indigo-400"
                  }`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    $
                  </span>
                </div>
              </div>

              {!isGameActive ? (
                <button
                  onClick={placeBet}
                  disabled={betAmount <= 0 || betAmount > chips}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Place Bet</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-center">
                    <p className="text-indigo-300">
                      Game is running with bet: <strong>{betAmount}</strong>
                    </p>
                  </div>
                  <button
                    onClick={chipsReset}
                    className="w-full py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Bets };
