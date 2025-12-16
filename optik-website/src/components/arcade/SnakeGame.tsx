'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface SnakeGameProps {
    onGameOver: (score: number, duration: number) => void;
    maxScore?: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame({ onGameOver, maxScore = 0 }: SnakeGameProps) {
    // Game State
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const startTimeRef = useRef<number>(0);
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Game
    const startGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection({ x: 1, y: 0 });
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        setSpeed(INITIAL_SPEED);
        startTimeRef.current = Date.now();
    };

    const generateFood = (): Point => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    };

    const endGame = useCallback(() => {
        setIsPlaying(false);
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);

        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        onGameOver(score, duration);
    }, [score, onGameOver]);

    // Input Handling
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isPlaying) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, direction]);

    // Game Loop
    useEffect(() => {
        if (!isPlaying) return;

        gameLoopRef.current = setInterval(() => {
            setSnake(prevSnake => {
                const newHead = {
                    x: prevSnake[0].x + direction.x,
                    y: prevSnake[0].y + direction.y,
                };

                // Check collisions (walls)
                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE
                ) {
                    endGame();
                    return prevSnake;
                }

                // Check collisions (self)
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    endGame();
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => s + 10);
                    setFood(generateFood());
                    // Increase speed slightly
                    setSpeed(s => Math.max(50, s * 0.98));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, speed);

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [isPlaying, direction, food, speed, endGame]);

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
            <div className="flex justify-between w-full max-w-[400px] text-white mb-2">
                <div className="font-bold text-xl">Score: {score}</div>
                <div className="text-gray-400">High Score: {maxScore}</div>
            </div>

            <div
                className="relative bg-black/50 border-2 border-slate-700 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE
                }}
            >
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
                        <button
                            onClick={startGame}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-bold text-white text-xl hover:scale-105 transition-transform shadow-lg"
                        >
                            <Play className="w-6 h-6 fill-current" />
                            Start Game
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                        <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
                        <p className="text-xl text-rose-400 mb-6">Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-rose-900 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Play Again
                        </button>
                    </div>
                )}

                {/* Snake */}
                {snake.map((segment, i) => (
                    <div
                        key={`${segment.x}-${segment.y}-${i}`}
                        className="absolute rounded-sm transition-all duration-100"
                        style={{
                            left: segment.x * CELL_SIZE,
                            top: segment.y * CELL_SIZE,
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            backgroundColor: i === 0 ? '#d8b4fe' : '#a855f7', // Head is lighter
                            boxShadow: i === 0 ? '0 0 10px #d8b4fe' : 'none',
                            zIndex: i === 0 ? 2 : 1
                        }}
                    />
                ))}

                {/* Food */}
                <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                        left: food.x * CELL_SIZE,
                        top: food.y * CELL_SIZE,
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        transform: 'translate(2px, 2px)',
                        backgroundColor: '#fbbf24', // Amber-400
                        boxShadow: '0 0 10px #fbbf24'
                    }}
                />
            </div>

            <div className="text-sm text-gray-400 mt-2">
                Use Arrow Keys to control direction
            </div>
        </div>
    );
}
