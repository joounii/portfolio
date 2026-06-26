import { Head, Link } from '@inertiajs/react';
import { Gamepad2, ArrowLeft } from 'lucide-react';

interface GameItem {
    routeName: string;
    title: string;
    description: string;
    status: 'playable' | 'in_development';
}

export default function Index({ games }: { games: GameItem[] }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-orange-500/20">
            <Head title="Arcade Laboratory" />

            <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <Gamepad2 className="text-orange-500" size={28} />
                            <h1 className="text-3xl font-extrabold tracking-tight">Arcade Hub</h1>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                            A completely isolated modular arena of web experiments and mini-games.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-bold rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Return Home</span>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game, idx) => {
                        const isPlayable = game.status === 'playable';

                        return (
                            <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between h-60 bg-neutral-900 shadow-sm ${
                                isPlayable ? 'border-neutral-800 hover:border-orange-500/30 group transition-all' : 'border-neutral-900/50 opacity-40'
                            }`}>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors tracking-tight">
                                        {game.title}
                                    </h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                                        {game.description}
                                    </p>
                                </div>

                                {isPlayable ? (
                                    <Link
                                        href={route(game.routeName)}
                                        className="w-full inline-flex items-center justify-center h-9 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-500 shadow-sm transition-colors"
                                    >
                                        Enter Game Workspace
                                    </Link>
                                ) : (
                                    <button disabled className="w-full h-9 text-xs font-bold rounded-lg border border-neutral-800 text-neutral-600 cursor-not-allowed">
                                        Under Development
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
