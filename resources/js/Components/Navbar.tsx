import { motion } from 'framer-motion';
import { Terminal, FileCode, Layers, Mail, LayoutGrid } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {

    const { url } = usePage();

    const navItems = [
        { label: 'HOME', value: 'home' },
        { label: 'PROJECTS', value: 'projects' },
        { label: 'STACK', value: 'stack' },
        { label: 'CONTACT', value: 'contact' },
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-6 py-2 bg-surface-container/60 backdrop-blur-xl rounded-full border border-outline-variant/10 shadow-[0_0_40px_-15px_rgba(139,92,246,0.3)] flex items-center gap-8">
            <Link
                href="/"
                className="text-xl font-bold tracking-tighter text-on-surface font-headline uppercase whitespace-nowrap cursor-pointer"
            >
                //KINETIC_ARCHITECT
            </Link>

            <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                    const isActive = url === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`font-headline tracking-tight uppercase text-sm font-bold transition-all relative py-1 ${
                                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            {item.label}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/logs"
                    className={`p-2 rounded-lg transition-colors ${url === '/logs' ? 'text-secondary bg-secondary/10' : 'text-primary hover:bg-primary/10'}`}
                >
                    <Terminal size={20} />
                </Link>
                <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-xs font-headline font-bold tracking-widest hover:brightness-110 transition-all active:scale-95 uppercase">
                    RESUME
                </button>
            </div>
        </nav>
    );
}
