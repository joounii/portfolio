import { motion } from 'framer-motion';
import { Terminal, Diamond, Database, Layers, Cloud, Zap, Rocket, Settings, Code } from 'lucide-react';
import { TechStack } from '@/types/types';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const coreEngines: TechStack[] = [
  {
    name: 'PYTHON',
    experience: 'EXP_5_YEARS',
    description: 'Asynchronous programming, data pipelines, and high-performance API development. Highly optimized for machine learning orchestration.',
    tags: ['FASTAPI', 'PYTEST', 'PANDAS'],
    category: 'PRIMARY_ENGINE',
    icon: 'terminal'
  },
  {
    name: 'RUBY ON RAILS',
    experience: 'EXP_3_YEARS',
    description: 'Rapid application development with a focus on domain-driven design and clean architecture. Optimized for developer productivity.',
    tags: ['HOTWIRE', 'SIDEKIQ', 'RSPEC'],
    category: 'STABLE',
    icon: 'diamond'
  },
  {
    name: 'LARAVEL',
    experience: 'EXP_2_YEARS',
    description: 'Building robust MVC applications with deep integration of enterprise design patterns. Focus on scalable backend systems.',
    tags: ['ELOQUENT', 'HORIZON', 'LIVEWIRE'],
    category: 'LEGACY_MOD',
    icon: 'code'
  }
];

const toolkit = [
  { name: 'POSTGRESQL', icon: Database, color: 'text-secondary' },
  { name: 'DOCKER', icon: Layers, color: 'text-primary' },
  { name: 'K8S', icon: Cloud, color: 'text-tertiary' },
  { name: 'AWS', icon: Cloud, color: 'text-secondary' },
  { name: 'REDIS', icon: Zap, color: 'text-primary' },
  { name: 'GO_LANG', icon: Rocket, color: 'text-tertiary' },
];

export default function Stack() {
  return (
    <MainLayout>
        <Head title="Stack" />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
            <div className="font-mono text-secondary text-sm tracking-[0.3em] mb-4 uppercase">
                02 // TECH_INVENTORY
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                STACK <span className="text-primary italic">REGISTRY</span>
            </h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                A high-performance ecosystem built on distributed systems and rigorous backend architecture. Engineered for scale, optimized for resilience.
            </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
            <div className="font-mono text-xs text-outline mb-1 uppercase tracking-widest">SYSTEM_STATUS</div>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/15">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]"></span>
                <span className="font-mono text-xs text-secondary">ALL_SYSTEMS_OPERATIONAL</span>
            </div>
            </div>
        </header>

        {/* Core Engine Grid */}
        <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">01 // CORE_ENGINE</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-secondary/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {coreEngines.map((engine, index) => (
            <motion.div
                key={engine.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-surface-container-low rounded p-10 transition-all duration-300 border border-outline-variant/10"
            >
                <div className="flex justify-between items-start mb-8">
                <div className="font-mono text-[10px] text-outline tracking-widest uppercase">{engine.experience}</div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter uppercase ${
                    engine.category === 'PRIMARY_ENGINE' ? 'bg-primary/10 text-primary' :
                    engine.category === 'STABLE' ? 'bg-secondary/10 text-secondary' :
                    'bg-tertiary-container/10 text-tertiary'
                }`}>
                    {engine.category}
                </div>
                </div>
                <h3 className="font-headline text-2xl font-bold mb-3 group-hover:text-primary transition-colors uppercase">{engine.name}</h3>
                <p className="text-on-surface-variant text-sm font-light mb-6 line-clamp-3">{engine.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                {engine.tags.map(tag => (
                    <span key={tag} className="font-mono text-[10px] px-2 py-1 bg-surface-container-highest text-secondary rounded">{tag}</span>
                ))}
                </div>
                <button className="w-full py-3 rounded-lg border border-outline-variant/20 font-headline text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2">
                ENGINE SPECS
                {engine.icon === 'terminal' ? <Terminal size={14} /> : engine.icon === 'diamond' ? <Diamond size={14} /> : <Code size={14} />}
                </button>
            </motion.div>
            ))}
        </div>

        {/* Extended Toolkit Grid */}
        <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">02 // EXTENDED_TOOLKIT</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {toolkit.map((item, index) => (
            <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-surface-container-low rounded p-8 border border-outline-variant/10 transition-all text-center"
            >
                <item.icon className={`${item.color} text-3xl mb-3 mx-auto opacity-60 group-hover:opacity-100 transition-opacity`} size={32} />
                <div className="font-mono text-[10px] text-outline tracking-widest uppercase">{item.name}</div>
            </motion.div>
            ))}
        </div>

        {/* Philosophy Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-24 group relative bg-surface-container-low rounded p-10 transition-all duration-300 border border-outline-variant/10 flex flex-col md:flex-row gap-8"
        >
            <div className="flex-1">
            <div className="flex justify-between items-start mb-8">
                <div className="font-mono text-[10px] text-outline tracking-widest uppercase">#MANIFESTO_S1</div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter uppercase">ARCH_PHILOSOPHY</div>
            </div>
            <h3 className="font-headline text-4xl font-bold mb-4 group-hover:text-primary transition-colors">INFRASTRUCTURE PHILOSOPHY</h3>
            <p className="text-on-surface-variant text-base font-light mb-8 max-w-lg">
                "Scaling is not about adding more resources; it's about removing bottlenecks. I architect systems that are immutable, observable, and resilient to chaos."
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">IMMUTABILITY</span>
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">OBSERVABILITY</span>
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">RESILIENCE</span>
            </div>
            <button className="w-fit px-8 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all flex items-center justify-center gap-2">
                VIEW ARCHITECTURE DOCS
                <Terminal size={14} />
            </button>
            </div>
            <div className="hidden md:block w-1/3 bg-surface-container-lowest rounded-lg border border-outline-variant/5 p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d0bcff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="font-mono text-[8px] text-primary/50 overflow-hidden leading-tight">
                &gt; INITIALIZING PHILOSOPHY_CORE...<br />
                &gt; LOADING DESIGN_PATTERNS... [OK]<br />
                &gt; ANALYZING SCALE_BOTTLENECKS... [NONE]<br />
                &gt; DEPLOYING RESILIENT_GRID... [OK]<br />
                &gt; SYSTEM_OBSERVABILITY: 100%<br />
                &gt; ARCHITECTURE_STABLE.
            </div>
            <div className="mt-4 flex justify-center">
                <Settings className="text-primary opacity-30 animate-spin-slow" size={64} />
            </div>
            </div>
        </motion.div>
        </div>
    </MainLayout>
  );
}
