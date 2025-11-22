import { Clicker } from "./components/ui/clicker";
import { Game } from "./components/ui/game";

function App() {
  return (
    <>
    <div className="flex flex-col items-center min-h-screen bg-green-900 text-white p-8 gap-8">
      <div className="flex flex-row flex-col items-center w-full max-w-md border-b border-green-700 pb-4">
        <h1 className="text-5xl font-bold tracking-wider text-yellow-400 ">
          Blackjack trainer
        </h1>
        
      </div>
      <div>
        <Game />
      </div>
      <div className="absolute top-20 right-100">
          <Clicker />
        </div>
    </div>
     
   </>
  );
}

export default App;
