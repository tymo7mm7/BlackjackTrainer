import type { Card } from "../../types/types";

interface HandProps {
  title: string;
  cards: Card[];
  score: number;
  isDealer?: boolean;
  hideSecondCard?: boolean;
}

function Hand({ title, cards, score, isDealer = false, hideSecondCard = false }: HandProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header / Score Badge */}
      <div className="relative">
        <h2 className="text-xl font-bold text-slate-200 tracking-wide uppercase shadow-sm">
          {title}
        </h2>
        {/* <div className="absolute -top-3 -right-8 bg-amber-500 text-slate-900 font-bold text-sm px-2 py-0.5 rounded-full shadow-lg border border-amber-400">
          {score}
        </div> */}
      </div>

      {/* Cards Container */}
      <div className="flex flex-row items-center justify-center h-50 px-4">
        {cards.length === 0 ? (
           <div className="w-24 h-46 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
              <span className="text-slate-600 font-bold text-xs uppercase">Empty</span>
           </div>
        ) : (
          cards.map((card, index) => {
             // Logic for hidden dealer card
             const isHidden = isDealer && hideSecondCard && index === 1;
             const cardImage = isHidden 
                ? "https://deckofcardsapi.com/static/img/back.png" 
                : card.image;
             
             return (
              <div
                key={`${card.code}-${index}`}
                className={`transition-all duration-500 ease-out transform hover:-translate-y-4 relative ${
                  index !== 0 ? "-ml-12" : ""
                }`}
                style={{ 
                    zIndex: index,
                    transform: `rotate(${(index - (cards.length - 1) / 2) * 3}deg)` // rotating effect
                }}
              >
                <img
                  src={cardImage}
                  alt={isHidden ? "Hidden Card" : `${card.value} of ${card.suit}`}
                  className="h-46 w-auto shadow-2xl rounded-lg object-contain border border-slate-900/20"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { Hand };
