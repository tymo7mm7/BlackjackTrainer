import { useCallback, useEffect, useState } from "react";

function Clicker() {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem("clicker-value");
    // Parse the stored string back to a number, or default to 0 if null
    return savedValue !== null ? JSON.parse(savedValue) : 0;
  });

  // 2. Update localStorage whenever 'value' changes
  useEffect(() => {
    localStorage.setItem("clicker-value", JSON.stringify(value));
  }, [value]);
  const add = useCallback(() => {
    setValue((prevValue: number) => prevValue + 1);
  }, []);
  const subtract = useCallback(() => {
    setValue((prevValue: number) => prevValue - 1);
  }, []);
  return (
    <div className="w-40 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mx-auto">
      {/* Display */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 font-mono">
        {value}
      </h2>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={subtract}
          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-4 rounded-xl transition-colors duration-200"
        >
          -
        </button>

        <button
          onClick={add}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

export { Clicker };

// dodanie sterowania klawiszami
