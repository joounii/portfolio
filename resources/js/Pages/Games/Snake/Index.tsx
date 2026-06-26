import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Play, Settings, Trophy } from 'lucide-react';
import { useState } from 'react';
import SnakeCanvas from './Components/SnakeCanvas';

interface Difficulty {
    level: string;
    label: string;
    speedMs: number;
}

interface Mod {
    id: string;
    name: string;
    desc: string;
}

interface Props {
    presets: {
        difficulties: Difficulty[];
        mods: Mod[];
    };
}

export default function Index({ presets }: Props) {
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
    const [activeMod, setActiveMod] = useState('walls');
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOverScore, setGameOverScore] = useState<number | null>(null);
    const [lastPlayedDifficulty, setLastPlayedDifficulty] = useState<string>('medium');

    const handleGameOver = (finalScore: number, playedDifficulty: string) => {
        setIsPlaying(false);
        setGameOverScore(finalScore);
        setLastPlayedDifficulty(playedDifficulty);
    };

    const handleStartGame = () => {
        setGameOverScore(null);
        setIsPlaying(true);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased font-sans p-6">
            <Head title="Retro Snake Lounge Workspace" />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Upper Breadcrumb Segment */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <Link
                        href={route('games.index')}
                        className="inline-flex items-center text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} className="mr-1.5" /> Back to Arcade Hub
                    </Link>
                    <div className="text-right">
                        <h2 className="text-sm font-mono tracking-wider text-orange-500 font-bold uppercase">Snake Workspace</h2>
                    </div>
                </div>

                {/* Split Configuration Dash / Screen Display Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* Control Panel Area Column */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                            <h3 className="text-xs font-bold font-mono text-neutral-400 tracking-wider uppercase flex items-center gap-1.5">
                                <Settings size={12} /> Game Tuning Presets
                            </h3>
                            <div className="space-y-2">
                                {presets.difficulties.map((diff) => (
                                    <button
                                        key={diff.level}
                                        onClick={() => setSelectedDifficulty(diff.level)}
                                        disabled={isPlaying}
                                        className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium border transition-all ${
                                            selectedDifficulty === diff.level
                                                ? 'bg-orange-600/10 text-orange-500 border-orange-500/40'
                                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                                        } disabled:opacity-50`}
                                    >
                                        {diff.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                            <h3 className="text-xs font-bold font-mono text-neutral-400 tracking-wider uppercase">
                                Boundary Physics Mod
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {presets.mods.map((mod) => (
                                    <div
                                        key={mod.id}
                                        className={`p-3 rounded-lg border text-left transition-all ${
                                            activeMod === mod.id
                                                ? 'bg-neutral-950 border-orange-500/40 text-neutral-100'
                                                : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-500 opacity-40 cursor-not-allowed'
                                        }`}
                                    >
                                        <p className="text-xs font-bold">{mod.name}</p>
                                        <p className="text-[10px] text-neutral-500 leading-snug mt-0.5">{mod.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Arena Gameplay Screen Column */}
                    <div className="lg:col-span-2">
                        <div className="w-full min-h-[500px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 overflow-hidden">

                            {isPlaying ? (
                                <SnakeCanvas
                                    difficulty={selectedDifficulty}
                                    onGameOver={handleGameOver}
                                    onQuit={() => setIsPlaying(false)}
                                />
                            ) : (
                                <div className="text-center max-w-sm space-y-5">
                                    {gameOverScore !== null ? (
                                        <div className="space-y-2 animate-scale-up">
                                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                                                <Trophy size={20} />
                                            </div>
                                            <h2 className="text-xl font-black text-red-500 tracking-wide uppercase">Game Over</h2>
                                            <p className="text-sm text-neutral-400">
                                                You scored <span className="text-white font-bold font-mono">{gameOverScore}</span> points on <span className="text-orange-500 font-semibold">{lastPlayedDifficulty}</span> speed!
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
                                            <Play size={20} fill="currentColor" className="ml-0.5" />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-md font-bold">{gameOverScore !== null ? "Try Again?" : "Ready to Start?"}</h2>
                                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                            The game viewport will execute within this card frame. Use **Arrow Keys** or **WASD** inputs on your keyboard to navigate the snake.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleStartGame}
                                        className="inline-flex items-center gap-2 h-9 px-6 text-xs font-bold bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md transition-colors font-mono tracking-wide uppercase"
                                    >
                                        {gameOverScore !== null ? "Reinitialize Arena" : "Launch Match Arena"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
