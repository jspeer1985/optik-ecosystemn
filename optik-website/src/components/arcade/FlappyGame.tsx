'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy, TrendingUp } from 'lucide-react';

interface FlappyGameProps {
    onGameOver: (score: number, duration: number) => void;
}

export default function FlappyGame({ onGameOver }: FlappyGameProps) {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
    const [birdY, setBirdY] = useState(250);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState<{ x: number; gapY: number; passed: boolean }[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const gameOverRef = useRef(false);

    const GRAVITY = 0.6;
    const JUMP_STRENGTH = -10;
    const PIPE_WIDTH = 80;
    const PIPE_GAP = 180;
    const BIRD_SIZE = 40;
    const GAME_WIDTH = 600;
    const GAME_HEIGHT = 500;

    const startGame = () => {
        gameOverRef.current = false;
        setGameState('playing');
        setBirdY(250);
        setBirdVelocity(0);
        setPipes([{ x: GAME_WIDTH, gapY: 200, passed: false }]);
        setScore(0);
        setStartTime(Date.now());
    };

    const jump = useCallback(() => {
        if (gameState === 'playing') {
            setBirdVelocity(JUMP_STRENGTH);
        }
    }, [gameState]);

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            // Update bird position
            setBirdY(prev => {
                const newY = prev + birdVelocity;
                if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
                    setTimeout(() => endGame(), 0);
                    return prev;
                }
                return newY;
            });

            setBirdVelocity(prev => prev + GRAVITY);

            // Update pipes
            setPipes(prev => {
                const updated = prev.map(pipe => ({
                    ...pipe,
                    x: pipe.x - 3
                })).filter(pipe => pipe.x > -PIPE_WIDTH);

                // Add new pipe
                if (updated.length === 0 || updated[updated.length - 1].x < GAME_WIDTH - 300) {
                    updated.push({
                        x: GAME_WIDTH,
                        gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
                        passed: false
                    });
                }

                // Check collisions and score
                updated.forEach(pipe => {
                    const birdX = 100;

                    // Check if bird passed pipe
                    if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
                        pipe.passed = true;
                        setScore(s => s + 1);
                    }

                    // Check collision
                    if (
                        birdX + BIRD_SIZE > pipe.x &&
                        birdX < pipe.x + PIPE_WIDTH &&
                        (birdY < pipe.gapY || birdY + BIRD_SIZE > pipe.gapY + PIPE_GAP)
                    ) {
                        setTimeout(() => endGame(), 0);
                    }
                });

                return updated;
            });
        }, 1000 / 60);

        return () => clearInterval(interval);
    }, [gameState, birdVelocity, birdY]);

    const endGame = () => {
        setGameState('gameOver');
        if (score > highScore) {
            setHighScore(score);
        }
        const duration = Math.floor((Date.now() - startTime) / 1000);
        onGameOver(score, duration);
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (gameState === 'idle' || gameState === 'gameOver') {
                    startGame();
                } else {
                    jump();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, jump]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Score</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{score}</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Best</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{highScore}</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-emerald-700/50">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Reward</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">{score * 2} <span className="text-sm text-slate-400">OPTIK</span></div>
                </div>
            </div>

            {/* Game Canvas */}
            <div
                className="relative mx-auto rounded-2xl overflow-hidden border-2 border-slate-700/50 cursor-pointer"
                style={{
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                    boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(0, 0, 0, 0.3)'
                }}
                onClick={gameState === 'playing' ? jump : startGame}
            >
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

                {/* Pipes */}
                {pipes.map((pipe, i) => (
                    <div key={i}>
                        {/* Top Pipe */}
                        <div
                            className="absolute"
                            style={{
                                left: pipe.x,
                                top: 0,
                                width: PIPE_WIDTH,
                                height: pipe.gapY,
                                background: 'linear-gradient(90deg, #334155 0%, #475569 50%, #334155 100%)',
                                borderLeft: '2px solid #1e293b',
                                borderRight: '2px solid #64748b',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                            }}
                        />
                        {/* Bottom Pipe */}
                        <div
                            className="absolute"
                            style={{
                                left: pipe.x,
                                top: pipe.gapY + PIPE_GAP,
                                width: PIPE_WIDTH,
                                height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
                                background: 'linear-gradient(90deg, #334155 0%, #475569 50%, #334155 100%)',
                                borderLeft: '2px solid #1e293b',
                                borderRight: '2px solid #64748b',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                            }}
                        />
                    </div>
                ))}

                {/* Bird */}
                {gameState !== 'idle' && (
                    <div
                        className="absolute transition-transform duration-100"
                        style={{
                            left: 100,
                            top: birdY,
                            width: BIRD_SIZE,
                            height: BIRD_SIZE,
                            transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl flex items-center justify-center border-2 border-emerald-300">
                            <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>
                )}

                {/* Idle State */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl">
                                <Play className="w-10 h-10 text-white ml-1" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2">Flappy OptiK</h3>
                                <p className="text-slate-300 mb-4">Click or press SPACE to jump</p>
                                <div className="text-sm text-slate-400">Earn 2 OPTIK per point scored</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Over State */}
                {gameState === 'gameOver' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
                        <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-700 text-center space-y-4 max-w-sm">
                            <div className="text-red-400 text-5xl font-bold mb-2">Game Over</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Score:</span>
                                    <span className="text-2xl font-bold text-white">{score}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                    <span className="text-slate-400">Best:</span>
                                    <span className="text-2xl font-bold text-yellow-400">{highScore}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-400">Earned:</span>
                                    <span className="text-2xl font-bold text-emerald-400">{score * 2} OPTIK</span>
                                </div>
                            </div>
                            <button
                                onClick={startGame}
                                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Play Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Score Display (During Game) */}
                {gameState === 'playing' && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl font-bold text-white/20">
                        {score}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <kbd className="px-3 py-1 bg-slate-800 rounded border border-slate-600 font-mono text-xs">SPACE</kbd>
                            <span className="text-slate-400">or</span>
                            <kbd className="px-3 py-1 bg-slate-800 rounded border border-slate-600 font-mono text-xs">CLICK</kbd>
                            <span className="text-slate-400">to jump</span>
                        </div>
                    </div>
                    <div className="text-slate-400">
                        Avoid the pipes • Earn <span className="text-emerald-400 font-bold">2 OPTIK</span> per point
                    </div>
                </div>
            </div>
        </div>
    );
}
