import { motion } from 'framer-motion';
import { Database, Activity, Terminal, Server, Zap, Shield } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import UptimeCounter from '@/Components/time';

export default function Home() {
    return (
        <MainLayout>
            <Head title="Home" />

            <div className="relative min-h-screen">
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col justify-start lg:justify-center pt-24 lg:pt-0 px-6 lg:px-24 overflow-hidden">
                    {/* Background Ambiance */}
                    {/* <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div> */}
                    {/* <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div> */}

                    <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Content Block */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-8 flex flex-col items-start gap-8"
                        >
                            {/* System Status Chip */}
                            <div className="flex items-center gap-4 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/15">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                </span>
                                <span className="font-mono text-[10px] tracking-widest text-secondary uppercase">SYSTEM STATUS: ONLINE</span>
                                <span className="h-3 w-[1px] bg-outline-variant/30"></span>
                                <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">LATENCY: 12ms</span>
                            </div>

                            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-on-surface">
                                I BUILD THE <br />
                                <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">INVISIBLE.</span>
                            </h1>

                            <p className="font-body text-xl text-on-surface-variant max-w-xl leading-relaxed">
                                I’m joounii, a backend developer focused on building the logic and systems that power modern apps. I turn messy data into fast, reliable APIs.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href={route('projects')}
                                    as="button"
                                    className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container rounded text-on-primary font-headline font-bold tracking-wide shadow-[0_0_30px_-5px_rgba(160,120,255,0.5)] hover:shadow-[0_0_40px_-5px_rgba(160,120,255,0.7)] transition-all active:scale-95"
                                >
                                    EXPLORE MY SYSTEMS
                                </Link>
                                <Link
                                    href={route('contact')}
                                    as="button"
                                    className="px-8 py-4 bg-transparent border border-secondary/20 rounded text-secondary font-headline font-bold tracking-wide hover:bg-secondary/5 transition-all"
                                >
                                    GET IN TOUCH
                                </Link>
                            </div>
                        </motion.div>

                        {/* Asymmetric Detail Block */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-4 flex flex-col gap-6"
                        >
                            {/* Metric Card */}
                            <div className="bg-surface-container/40 backdrop-blur-md p-8 rounded border border-outline-variant/10 shadow-2xl self-end w-full max-w-xs rotate-2">
                                <div className="flex justify-between items-start mb-6">
                                    <Database className="text-tertiary" size={24} />
                                    <span className="font-mono text-[10px] text-on-surface-variant/50" title="if you know, you know.">0xCAFEBABE</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-tertiary"
                                        />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-3xl font-headline font-bold text-on-surface">99.9%</div>
                                            <div className="font-mono text-[10px] text-tertiary uppercase tracking-widest">Uptime Precision</div>
                                        </div>
                                        <Activity className="text-on-surface-variant/30" size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Bento Snipet */}
                            <div className="bg-surface-container-low p-6 rounded border border-outline-variant/10 w-full max-w-sm ml-auto -translate-x-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-error/40"></div>
                                    <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                                    <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                                </div>
                                <code className="font-mono text-sm text-on-surface-variant block space-y-1">
                                    <span className="text-secondary">class</span> <span className="text-primary">Joounii</span> {'{'}<br />
                                    &nbsp;&nbsp;<span className="text-secondary">async</span> <span className="text-tertiary">build</span>(<span className="text-accent">me</span>: <span className="text-primary">Developer</span>) {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">await</span> this.<span className="text-tertiary">deploy</span>(<span className="text-accent">me</span>);<br />
                                    &nbsp;&nbsp;{'}'}<br />
                                    {'}'}
                                </code>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-24 px-6 lg:px-24 relative">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div>
                        <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase mb-4 block">01 // IDENTITY_CORE</span>
                        <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
                            IDENTIFY <br />
                            <span className="text-primary">JOOUNII</span>
                        </h2>
                        </div>

                        <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 font-mono text-xs space-y-2 relative group">
                        <div className="flex items-center gap-2 mb-4 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-error"></div>
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="ml-2 text-[10px] uppercase tracking-widest">profile_dump.sh</span>
                        </div>
                        <p className="text-on-surface-variant"><span className="text-secondary">$</span> whoami</p>
                        <p className="text-on-surface">Jonathan Furrer // Backend Developer</p>
                        <p className="text-on-surface-variant"><span className="text-secondary">$</span> uptime --experience</p>
                        <p className="text-on-surface">
                            <UptimeCounter startDate="2019-10-15" />
                        </p>
                        <p className="text-on-surface-variant"><span className="text-secondary">$</span> status</p>
                        <p className="text-secondary animate-pulse">OPTIMIZING_INFRASTRUCTURE...</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <p className="font-body text-2xl text-on-surface leading-relaxed font-light">
                        I specialize in building <span className="text-primary font-medium italic">secure logic</span> and <span className="text-secondary font-medium italic">data-driven tools</span> that turn complex requirements into stable, future-proof systems.
                        </p>

                        <p className="font-body text-lg text-on-surface-variant leading-relaxed">
                        My approach to development is rooted in the "invisible" parts of an application - the parts that ensure security, scalability, and long-term maintainability. I thrive on solving unique, high-stakes problems, from architecting granular permission systems to optimizing backends for sub-millisecond data processing.
                        <br /><br />
                        While I work across the full stack, my focus on the frontend is purely functional. I build dashboards that prioritize usability and efficiency, ensuring that complex data remains easy to manage and interpret. In the backend, I write code that doesn't just work today, but is ready to be expanded tomorrow.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
                        <div>
                            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">Location</div>
                            <div className="font-headline font-bold text-lg">EUROPE_ZURICH</div>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">Focus</div>
                            <div className="font-headline font-bold text-lg">BACKEND_INFRA</div>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">Status</div>
                            <div className="font-headline font-bold text-lg text-secondary">AVAILABLE</div>
                        </div>
                        </div>
                    </motion.div>
                    </div>
                </section>

                {/* Specialties Section */}
                <section className="py-24 px-6 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                            <div className="max-w-md">
                                <span className="font-mono text-xs tracking-[0.3em] text-tertiary uppercase mb-4 block">02 // CORE_ARCHITECTURE</span>
                                <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">ENGINEERING THE <span className="text-primary">BACKBONE</span></h2>
                            </div>
                            <p className="font-body text-on-surface-variant max-w-sm text-right hidden md:block">
                                Developing secure, high-utility backend layers with a focus on optimization and scale.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Grid Item 1 */}
                            <div
                                className="md:col-span-2 bg-surface-container p-10 rounded group transition-colors flex flex-col justify-between"
                            >
                                <Server className="text-primary mb-6" size={40} />
                                <h3 className="font-headline text-2xl font-bold mb-4">MODERN_FULLSTACK</h3>
                                <p className="font-body text-on-surface-variant mb-6">Building robust backends with Laravel and TypeScript, paired with highly functional React interfaces.</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-mono text-[10px] rounded-full uppercase tracking-tighter">LARAVEL</span>
                                    <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-mono text-[10px] rounded-full uppercase tracking-tighter">REACT</span>
                                    <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-mono text-[10px] rounded-full uppercase tracking-tighter">TYPESCRIPT</span>
                                    <span className="px-3 py-1 bg-tertiary-container/10 text-tertiary font-mono text-[10px] rounded-full uppercase tracking-tighter">MYSQL</span>
                                </div>
                            </div>

                            {/* Grid Item 2 */}
                            <div
                                className="md:col-span-2 bg-surface-container p-10 rounded group transition-colors flex flex-col justify-between"
                            >
                                <div>
                                    <Zap className="text-secondary mb-6" size={40} />
                                    <h3 className="font-headline text-2xl font-bold mb-4">SYSTEM_EFFICIENCY</h3>
                                    <p className="font-body text-on-surface-variant">Optimizing query performance and data handling to ensure sub-100ms response times for data-heavy applications.</p>
                                </div>
                                <div className="mt-8 flex items-baseline gap-2">
                                    <span className="text-4xl font-headline font-bold text-secondary">&lt; 100ms</span>
                                    <span className="font-mono text-[10px] text-on-secondary-fixed-variant uppercase tracking-widest">avg_request_time</span>
                                </div>
                            </div>

                            {/* Grid Item 3 */}
                            <div className="md:col-span-1 bg-surface-container-low p-8 rounded border border-outline-variant/5">
                                <Shield className="text-on-surface-variant mb-4" size={32} />
                                <h4 className="font-headline font-bold text-lg mb-2 text-on-surface">SECURITY_FIRST</h4>
                                <p className="font-body text-sm text-on-surface-variant">Implementing flexible, permission-based access control (PBAC) for granular system security.</p>
                            </div>

                            {/* Grid Item 4 (Image) */}
                            <div className="md:col-span-3 h-64 relative rounded overflow-hidden group">
                                <img
                                    src="/images/project_background.png"
                                    alt="Project Orchestrator Visual"
                                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale"
                                    referrerPolicy="no-referrer"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <div className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] mb-1">FINAL_DEGREE_PROJECT</div>
                                    <div className="font-headline font-bold text-xl uppercase">PROJECT_ORCHESTRATOR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </MainLayout>
    );
}
