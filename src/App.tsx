import { Routes, Route, useNavigate } from "react-router-dom";
import { Manual } from "./components/pages/Manual";
import { Button } from "./components/ui/Button";
import { useState } from "react";
import { Game } from "./components/pages/Game";
import { Clicker } from "./components/ui/Clicker";

function App() {
  const navigate = useNavigate();

  const [isManual, setIsManual] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-green-900 text-white p-4 gap-4 relative">
        {/* Navigation to manual Button */}
        <div className="absolute top-4 left-4 z-50">
          { !isManual ? <Button
            onClick={() => {navigate("/manual");
               setIsManual(!isManual)}}
            variant="secondary"
            className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 min-w-20"
          >
            Manual
          </Button> : <Button 
            onClick={() => {navigate("/")
               setIsManual(!isManual)}}
            variant="secondary"
            className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 min-w-20"
          >
            Back
          </Button>
          }
        </div>

        {/* Title */}
        <div className="flex flex-row flex-col items-center w-full max-w-md border-b border-green-700 pb-4">
          <h1 className="text-5xl font-bold tracking-wider text-yellow-400 ">
            Blackjack trainer
          </h1>
        </div>

        <div>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/manual" element={<Manual />} />
          </Routes>
        </div>


        {/* Tactic clicker */}
        <div className="absolute top-20 right-100">
          <Clicker />
        </div>
      </div>
    </>
  );
}

export default App;
