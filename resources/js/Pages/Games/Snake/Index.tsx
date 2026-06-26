import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Play, Settings, Trophy } from 'lucide-react';
import { useState } from 'react';

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
    const [selectedDifficulty, setSelectedDifficulty] = useState('classic');
    const [activeMod, setActiveMod] = useState('walls');
    const [isPlaying, setIsPlaying] = useState(false);

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

                        {/* Box 1: Difficulty Settings */}
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

                        {/* Box 2: Mechanics Modification Toggles */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                            <h3 className="text-xs font-bold font-mono text-neutral-400 tracking-wider uppercase">
                                Boundary Physics Mod
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {presets.mods.map((mod) => (
                                    <div
                                        key={mod.id}
                                        onClick={() => !isPlaying && setActiveMod(mod.id)}
                                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                                            activeMod === mod.id
                                                ? 'bg-neutral-950 border-orange-500/40 text-neutral-100'
                                                : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-400 opacity-60'
                                        } ${isPlaying ? 'pointer-events-none' : ''}`}
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
                        <div className="w-full aspect-square bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 relative overflow-hidden">

                            {isPlaying ? (
                                <div className="text-center space-y-2">
                                    <p className="font-mono text-xs text-neutral-500">[ Canvas Game Loop Running ]</p>
                                    <p className="text-xs text-neutral-400">Difficulty: <span className="text-orange-500 font-bold">{selectedDifficulty}</span> | Mode: <span className="text-orange-500 font-bold">{activeMod}</span></p>
                                    <button
                                        onClick={() => setIsPlaying(false)}
                                        className="mt-4 px-4 py-1.5 text-xs font-bold bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                                    >
                                        Quit Match
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center max-w-sm space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
                                        <Play size={20} fill="currentColor" className="ml-0.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Ready to Start?</h2>
                                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                            The game board will launch inside this window using your active speed config and physical rule parameters. Use arrow keys to maneuver.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsPlaying(true)}
                                        className="inline-flex items-center gap-2 h-9 px-6 text-xs font-bold bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md transition-colors"
                                    >
                                        Launch Game Loop
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
