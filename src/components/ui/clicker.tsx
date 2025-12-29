import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";

function Clicker() {

// getting clicker value
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem("clicker-value");
    return savedValue !== null ? JSON.parse(savedValue) : 0;
  });

// draggable state
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  
// setting clicker value
  useEffect(() => {
    localStorage.setItem("clicker-value", JSON.stringify(value));
  }, [value]);

// value handlers
  const add = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking button
    setValue((prevValue: number) => prevValue + 1);
  }, []);

  const subtract = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking button
    setValue((prevValue: number) => prevValue - 1);
  }, []);

// drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      className={`fixed w-40 bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-gray-100 select-none z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Display */}
      <h4 className="text-center mb-2"> Running count </h4>
      <h2 className="text-4xl font-bold text-center mb-8 font-mono pointer-events-none">
        {value}
      </h2>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={subtract}
          className="flex-1 active:cursor-default"
          variant="danger"
          onMouseDown={(e) => e.stopPropagation()} 
        >
          -
        </Button>

        <Button
          onClick={add}
          className="flex-1 active:cursor-default"
          variant="primary"
          onMouseDown={(e) => e.stopPropagation()}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export { Clicker };

// dodanie sterowania klawiszami
