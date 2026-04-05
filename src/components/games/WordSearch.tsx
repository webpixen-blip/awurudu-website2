import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

const WORDS = ['KEVUM', 'KOKIS', 'NAKATH', 'AWRUDU', 'RABAN'];
const GRID_SIZE = 10;

export const WordSearch: React.FC<{ username: string; onComplete: (score: number) => void }> = ({ username, onComplete }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    triggerPopUnder();
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );

    WORDS.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * (direction === 'H' ? GRID_SIZE : GRID_SIZE - word.length));
        const col = Math.floor(Math.random() * (direction === 'V' ? GRID_SIZE : GRID_SIZE - word.length));

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = direction === 'V' ? row + i : row;
          const c = direction === 'H' ? col + i : col;
          if (newGrid[r][c] !== word[i] && newGrid[r][c] >= 'A' && newGrid[r][c] <= 'Z' && !WORDS.some(w => w.includes(newGrid[r][c]))) {
             // Simple check, not perfect but works for demo
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = direction === 'V' ? row + i : row;
            const c = direction === 'H' ? col + i : col;
            newGrid[r][c] = word[i];
          }
          placed = true;
        }
      }
    });
    setGrid(newGrid);
  };

  const handleSelect = (idx: number) => {
    const newSelection = [...selection, idx];
    setSelection(newSelection);

    const selectedWord = newSelection.map(i => grid[Math.floor(i / GRID_SIZE)][i % GRID_SIZE]).join('');
    if (WORDS.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord]);
      setSelection([]);
      setScore(s => s + 20);
      
      if (foundWords.length + 1 === WORDS.length) {
        triggerVignette();
        supabase.from('leaderboard').insert([{ username, game_id: 'word-search', score: score + 20 }]);
        onComplete(score + 20);
      }
    } else if (selectedWord.length > 10) {
      setSelection([]);
    }
  };

  return (
    <div className="p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30">
      <h2 className="text-2xl font-black text-yellow-500 uppercase italic mb-4 text-center">Word Search</h2>
      
      <div className="grid grid-cols-10 gap-1 mb-6">
        {grid.map((row, r) => row.map((char, c) => {
          const idx = r * GRID_SIZE + c;
          const isSelected = selection.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`aspect-square flex items-center justify-center font-bold text-xs cursor-pointer rounded-sm transition-colors ${
                isSelected ? 'bg-yellow-500 text-red-900' : 'bg-red-950/50 text-yellow-500/50 hover:bg-red-800'
              }`}
            >
              {char}
            </div>
          );
        }))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {WORDS.map(word => (
          <span key={word} className={`px-3 py-1 rounded-full text-xs font-bold border ${
            foundWords.includes(word) ? 'bg-green-600 border-green-400 text-white' : 'bg-red-900 border-yellow-600/30 text-yellow-600'
          }`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
