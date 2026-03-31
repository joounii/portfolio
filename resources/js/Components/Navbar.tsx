import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Menu, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

interface NavItem {
    label: string;
    href: string;
}

export default function Navbar() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);

    const navItems: NavItem[] = [
        { label: 'HOME', href: '/home' },
        { label: 'PROJECTS', href: '/projects' },
        { label: 'STACK', href: '/stack' },
        { label: 'CONTACT', href: '/contact' },
    ];

    // Close mobile menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [url]);

    return (
        <motion.nav
            layoutRoot
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-full max-w-fit px-4 md:px-6 py-2 bg-surface-container/60 backdrop-blur-xl rounded-2xl md:rounded-full border border-outline-variant/10 shadow-[0_0_40px_-15px_rgba(139,92,246,0.3)] flex flex-col md:flex-row items-center gap-4 md:gap-8"
        >
            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tighter text-on-surface font-headline uppercase whitespace-nowrap cursor-pointer"
                >
                    <span className="text-primary opacity-80 text-[0.85em] leading-none inline-block -translate-y-[2.8px]">
                        //
                    </span>
                    JOOUNII
                </Link>

                {/* Mobile Toggle Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-on-surface hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Desktop Navigation */}
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
                                    style={{originY: "0px"}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                        x: { duration: 0.3 }
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden md:hidden w-full flex flex-col gap-4 pb-4"
                    >
                        <div className="h-[1px] bg-outline-variant/10 w-full" />
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-bold font-headline tracking-widest uppercase py-2 px-4 rounded-lg transition-colors ${
                                    url === item.href ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/* will be added in Version 2 */}
                        {/* <button className="w-full bg-primary text-on-primary-container px-4 py-3 rounded-lg text-xs font-headline font-bold tracking-widest uppercase">
                            RESUME
                        </button> */}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
                {/* will be added in Version 2 */}
                {/* <Link
                    href="/logs"
                    className={`p-2 rounded-lg transition-colors ${url === '/logs' ? 'text-secondary bg-secondary/10' : 'text-primary hover:bg-primary/10'}`}
                >
                    <Terminal size={20} />
                </Link>
                <button className="bg-primary text-on-primary-container px-4 py-1.5 rounded-lg text-xs font-headline font-bold tracking-widest hover:brightness-110 transition-all active:scale-95 uppercase">
                    RESUME
                </button> */}
            </div>
        </motion.nav>
    );
}
