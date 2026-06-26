import { useEffect, useRef, useState } from 'react';

interface SnakeCanvasProps {
    difficulty: string;
    onGameOver: (finalScore: number, playedDifficulty: string) => void;
    onQuit: () => void;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CANVAS_SIZE = 400;
const TILE_SIZE = 20;
const GRID_COUNT = CANVAS_SIZE / TILE_SIZE;

export default function SnakeCanvas({ difficulty, onGameOver, onQuit }: SnakeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [snake, setSnake] = useState<Point[]>([
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
    ]);
    const [fruit, setFruit] = useState<Point>({ x: 5, y: 5 });
    const [direction, setDirection] = useState<Direction>('UP');
    const [score, setScore] = useState(0);

    const directionRef = useRef<Direction>('UP');
    const difficultyRef = useRef<string>(difficulty);

    const getSpeed = () => {
        if (difficulty === 'slow') return 140;
        if (difficulty === 'fast') return 45;
        return 90;
    };

    const generateRandomFruit = (currentSnake: Point[]): Point => {
        while (true) {
            const newFruit = {
                x: Math.floor(Math.random() * GRID_COUNT),
                y: Math.floor(Math.random() * GRID_COUNT),
            };
            const hitSnake = currentSnake.some(segment => segment.x === newFruit.x && segment.y === newFruit.y);
            if (!hitSnake) return newFruit;
        }
    };

    useEffect(() => {
        difficultyRef.current = difficulty;
    }, [difficulty]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentDir = directionRef.current;
            if ((e.key === 'ArrowUp' || e.key === 'w') && currentDir !== 'DOWN') {
                directionRef.current = 'UP';
                setDirection('UP');
            } else if ((e.key === 'ArrowDown' || e.key === 's') && currentDir !== 'UP') {
                directionRef.current = 'DOWN';
                setDirection('DOWN');
            } else if ((e.key === 'ArrowLeft' || e.key === 'a') && currentDir !== 'RIGHT') {
                directionRef.current = 'LEFT';
                setDirection('LEFT');
            } else if ((e.key === 'ArrowRight' || e.key === 'd') && currentDir !== 'LEFT') {
                directionRef.current = 'RIGHT';
                setDirection('RIGHT');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const moveSnake = () => {
            setSnake((prevSnake) => {
                const head = prevSnake[0];
                const currentDir = directionRef.current;
                let newHead = { ...head };

                if (currentDir === 'UP') newHead.y -= 1;
                if (currentDir === 'DOWN') newHead.y += 1;
                if (currentDir === 'LEFT') newHead.x -= 1;
                if (currentDir === 'RIGHT') newHead.x += 1;

                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_COUNT ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_COUNT
                ) {
                    onGameOver(score, difficultyRef.current);
                    return prevSnake;
                }

                const hitSelf = prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y);
                if (hitSelf) {
                    onGameOver(score, difficultyRef.current);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                if (newHead.x === fruit.x && newHead.y === fruit.y) {
                    setScore((prev) => prev + 1);
                    setFruit(generateRandomFruit(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, getSpeed());
        return () => clearInterval(gameInterval);
    }, [fruit, score]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < GRID_COUNT; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE_SIZE, 0);
            ctx.lineTo(i * TILE_SIZE, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * TILE_SIZE);
            ctx.lineTo(CANVAS_SIZE, i * TILE_SIZE);
            ctx.stroke();
        }

        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 8;
        ctx.fillRect(fruit.x * TILE_SIZE + 2, fruit.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.shadowBlur = 0;

        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#f97316' : '#d97706';
            ctx.fillRect(
                segment.x * TILE_SIZE + 1,
                segment.y * TILE_SIZE + 1,
                TILE_SIZE - 2,
                TILE_SIZE - 2
            );
        });

    }, [snake, fruit]);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Scoreboard Metrics Bar */}
            <div className="flex items-center justify-between w-full max-w-[400px] bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800">
                <span className="text-xs font-mono text-neutral-400">SCORE</span>
                <span className="text-xl font-black font-mono text-orange-500 tracking-wider">
                    {String(score).padStart(3, '0')}
                </span>
            </div>

            {/* Core HTML5 Graphics Viewport Renderer */}
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border border-neutral-800 rounded-xl shadow-2xl bg-neutral-950"
            />

            <button
                type="button"
                onClick={onQuit}
                className="px-4 py-1.5 text-xs font-bold bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
            >
                Abandon Match
            </button>
        </div>
    );
}
