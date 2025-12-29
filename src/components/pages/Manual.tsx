function Manual() {

  return (
    <div className="flex flex-col items-center max-h-screen bg-slate-900 text-white p-8 gap-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-amber-500">
            Manual
          </h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">

          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-slate-300 text-lg">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Objective</h2>
            <p>
              The goal of Blackjack is to beat the dealer's hand without going over 21. 
              Face cards are worth 10. Aces are worth 1 or 11, whichever makes a better hand.
            </p>
            <p>
              IMPORTANT: We use 6 decks of cards
            </p>
          </section>

          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-slate-300 text-lg">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Clicker trainer</h2>
            <p >
              Running count should be updated on every drawed card (starting from zero):
            </p>
            <p>
              -1 on 10, JACK, QUEEN, KING, ACE
            </p>
            <p>
              +0 7, 8, 9
            </p>
            <p>
              +1 on 2, 3, 4, 5, 6
            </p>
            <p>
              True count = Running count / Number of decks remaining </p>
            <p>
              Bet more whenever the true count is bigger
              </p>
            <p>
              For example bet x(true count - 1) your betting units 
            </p>

          </section>
        </div>
      </div>
    </div>
  );
}

export { Manual };
