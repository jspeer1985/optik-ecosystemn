'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, TrendingUp, Zap } from 'lucide-react';

interface Game2048Props {
    onGameOver: (score: number, duration: number) => void;
}

type Board = number[][];

export default function Game2048({ onGameOver }: Game2048Props) {
    const [board, setBoard] = useState<Board>([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [moves, setMoves] = useState(0);

    const initBoard = useCallback((): Board => {
        const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0));
        addNewTile(newBoard);
        addNewTile(newBoard);
        return newBoard;
    }, []);

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const newBoard = initBoard();
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setStartTime(Date.now());
        setMoves(0);
    };

    const addNewTile = (currentBoard: Board) => {
        const emptyCells: [number, number][] = [];
        currentBoard.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 0) emptyCells.push([i, j]);
            });
        });

        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            currentBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        let newBoard = board.map(row => [...row]);
        let scoreIncrease = 0;
        let moved = false;

        const slide = (row: number[]): number[] => {
            const filtered = row.filter(cell => cell !== 0);
            const merged: number[] = [];

            for (let i = 0; i < filtered.length; i++) {
                if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                    merged.push(filtered[i] * 2);
                    scoreIncrease += filtered[i] * 2;
                    i++;
                } else {
                    merged.push(filtered[i]);
                }
            }

            while (merged.length < 4) {
                merged.push(0);
            }

            return merged;
        };

        if (direction === 'left') {
            newBoard = newBoard.map(row => slide(row));
        } else if (direction === 'right') {
            newBoard = newBoard.map(row => slide([...row].reverse()).reverse());
        } else if (direction === 'up') {
            for (let col = 0; col < 4; col++) {
                const column = newBoard.map(row => row[col]);
                const slid = slide(column);
                slid.forEach((val, row) => {
                    newBoard[row][col] = val;
                });
            }
        } else if (direction === 'down') {
            for (let col = 0; col < 4; col++) {
                const column = newBoard.map(row => row[col]);
                const slid = slide([...column].reverse()).reverse();
                slid.forEach((val, row) => {
                    newBoard[row][col] = val;
                });
            }
        }

        // Check if board changed
        moved = JSON.stringify(board) !== JSON.stringify(newBoard);

        if (moved) {
            addNewTile(newBoard);
            setBoard(newBoard);
            setScore(prev => {
                const newScore = prev + scoreIncrease;
                if (newScore > bestScore) setBestScore(newScore);
                return newScore;
            });
            setMoves(prev => prev + 1);

            // Check game over
            if (isGameOver(newBoard)) {
                setGameOver(true);
                const duration = Math.floor((Date.now() - startTime) / 1000);
                onGameOver(score + scoreIncrease, duration);
            }
        }
    }, [board, gameOver, score, bestScore, startTime, onGameOver]);

    const isGameOver = (currentBoard: Board): boolean => {
        // Check for empty cells
        for (let row of currentBoard) {
            if (row.includes(0)) return false;
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = currentBoard[i][j];
                if (j < 3 && current === currentBoard[i][j + 1]) return false;
                if (i < 3 && current === currentBoard[i + 1][j]) return false;
            }
        }

        return true;
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    move('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    move('right');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [move, gameOver]);

    const getTileColor = (value: number): string => {
        const colors: { [key: number]: string } = {
            0: 'bg-slate-800/30',
            2: 'bg-gradient-to-br from-slate-700 to-slate-600',
            4: 'bg-gradient-to-br from-slate-600 to-slate-500',
            8: 'bg-gradient-to-br from-orange-600 to-orange-500',
            16: 'bg-gradient-to-br from-orange-500 to-orange-400',
            32: 'bg-gradient-to-br from-red-600 to-red-500',
            64: 'bg-gradient-to-br from-red-500 to-red-400',
            128: 'bg-gradient-to-br from-yellow-600 to-yellow-500',
            256: 'bg-gradient-to-br from-yellow-500 to-yellow-400',
            512: 'bg-gradient-to-br from-yellow-400 to-yellow-300',
            1024: 'bg-gradient-to-br from-emerald-600 to-emerald-500',
            2048: 'bg-gradient-to-br from-emerald-500 to-emerald-400',
        };
        return colors[value] || 'bg-gradient-to-br from-purple-600 to-purple-500';
    };

    const getTileSize = (value: number): string => {
        if (value >= 1024) return 'text-2xl';
        if (value >= 128) return 'text-3xl';
        return 'text-4xl';
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Score</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Best</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{bestScore}</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Moves</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{moves}</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-emerald-700/50">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Reward</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-400">{Math.floor(score / 10)} <span className="text-xs text-slate-400">OPTIK</span></div>
                </div>
            </div>

            {/* Game Board */}
            <div className="relative">
                <div
                    className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-700/50 mx-auto"
                    style={{
                        width: 'fit-content',
                        boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <div className="grid grid-cols-4 gap-3">
                        {board.map((row, i) =>
                            row.map((cell, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    className={`w-24 h-24 rounded-xl flex items-center justify-center font-bold transition-all duration-150 ${getTileColor(cell)} ${getTileSize(cell)}`}
                                    style={{
                                        boxShadow: cell > 0 ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
                                        border: cell > 0 ? '2px solid rgba(255, 255, 255, 0.1)' : 'none'
                                    }}
                                >
                                    {cell > 0 && (
                                        <span className="text-white drop-shadow-lg">
                                            {cell}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl">
                        <div className="bg-slate-900/95 p-8 rounded-2xl border border-slate-700 text-center space-y-4">
                            <div className="text-red-400 text-4xl font-bold mb-4">Game Over!</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center gap-8 py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Final Score:</span>
                                    <span className="text-2xl font-bold text-white">{score}</span>
                                </div>
                                <div className="flex justify-between items-center gap-8 py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Moves:</span>
                                    <span className="text-2xl font-bold text-blue-400">{moves}</span>
                                </div>
                                <div className="flex justify-between items-center gap-8 py-2">
                                    <span className="text-slate-400">Earned:</span>
                                    <span className="text-2xl font-bold text-emerald-400">{Math.floor(score / 10)} OPTIK</span>
                                </div>
                            </div>
                            <button
                                onClick={resetGame}
                                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-4">
                {/* Mobile Controls */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto lg:hidden">
                    <div />
                    <button
                        onClick={() => move('up')}
                        className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all active:scale-95"
                    >
                        <div className="text-2xl">↑</div>
                    </button>
                    <div />
                    <button
                        onClick={() => move('left')}
                        className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all active:scale-95"
                    >
                        <div className="text-2xl">←</div>
                    </button>
                    <button
                        onClick={resetGame}
                        className="bg-emerald-700 hover:bg-emerald-600 p-4 rounded-xl border border-emerald-600 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-6 h-6 mx-auto text-white" />
                    </button>
                    <button
                        onClick={() => move('right')}
                        className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all active:scale-95"
                    >
                        <div className="text-2xl">→</div>
                    </button>
                    <div />
                    <button
                        onClick={() => move('down')}
                        className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all active:scale-95"
                    >
                        <div className="text-2xl">↓</div>
                    </button>
                    <div />
                </div>

                {/* Instructions */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <kbd className="px-3 py-1 bg-slate-800 rounded border border-slate-600 font-mono text-xs">↑ ↓ ← →</kbd>
                                <span className="text-slate-400">Arrow keys to move</span>
                            </div>
                        </div>
                        <div className="text-slate-400">
                            Merge tiles to reach <span className="text-emerald-400 font-bold">2048</span> • Earn <span className="text-emerald-400 font-bold">OPTIK</span> based on score
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
