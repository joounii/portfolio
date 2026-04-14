import { motion } from 'framer-motion';
import { Network, Terminal, Share2 } from 'lucide-react';
import { Project } from '@/types/types';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const projects: Project[] = [
  {
    id: '#OC_03Y',
    title: 'INTERNAL_AUTOMATION',
    description: 'Engineered enterprise management flows for hardware provisioning and desktop virtualization. Focused on high-concurrency background automation.',
    tags: ['ROR', 'DOCKER', 'SIDEKIQ'],
    status: 'OC_COCKPIT',
    statusColor: 'text-tertiary bg-tertiary-container/10'
  },
  {
    id: '#DEG_01',
    title: 'PROJECT_ORCHESTRATOR',
    description: 'A full-stack management suite focused on organizational logic. Features dynamic team allocation, permission-centric security (PBAC), and high-utility data dashboards.',
    tags: ['LARAVEL', 'PBAC', 'BLADE'],
    status: 'DEGREE_PROJECT',
    statusColor: 'text-secondary bg-secondary-container/10'
  },
  {
    id: '#NODE_CH_01',
    title: 'SELF_HOSTED_INFRA',
    description: 'A secure Ubuntu environment hosting this portfolio and high-concurrency game servers. Managed via a local-only Cockpit instance, shielded by a private WireGuard VPN node on a Raspberry Pi gateway.',
    tags: ['LINUX', 'WIREGUARD', 'NGINX'],
    status: 'HOME_NODE',
    statusColor: 'text-error bg-error-container/10'
  }
];

export default function Projects() {
  return (
    <MainLayout>
        <Head title="Project" />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
            <div className="font-mono text-secondary text-sm tracking-[0.3em] mb-4 uppercase">
                01 // CORE_MODULES
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                PROJECT <span className="text-primary italic">DOSSIER</span>
            </h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                Showcasing my experience in building robust internal systems and functional management tools. Focused on solving complex logic problems with clean, future-proof code.
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => (
            <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-surface-container-low rounded p-10 transition-all duration-300 border border-outline-variant/10"
            >
                <div className="flex justify-between items-start mb-8">
                    <div className="font-mono text-[10px] text-outline tracking-widest uppercase">{project.id}</div>
                    <div className={`${project.statusColor} px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter uppercase`}>
                        {project.status}
                    </div>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-on-surface-variant text-sm font-light mb-6 line-clamp-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                        <span key={tag} className="font-mono text-[10px] px-2 py-1 bg-surface-container-highest text-secondary rounded">{tag}</span>
                    ))}
                </div>
                <button className="w-full py-3 rounded-lg border border-outline-variant/20 font-headline text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2">
                VIEW ARCHITECTURE
                <Network size={14} />
                </button>
            </motion.div>
            ))}

            {/* Large Feature Card */}
            {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 group relative bg-surface-container-low rounded p-10 transition-all duration-300 border border-outline-variant/10 flex flex-col md:flex-row gap-8"
            >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-8">
                <div className="font-mono text-[10px] text-outline tracking-widest uppercase">#FF000_S1</div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter uppercase">CORE_INFRA</div>
                </div>
                <h3 className="font-headline text-4xl font-bold mb-4 group-hover:text-primary transition-colors">TITAN_GRID_BACKBONE</h3>
                <p className="text-on-surface-variant text-base font-light mb-8 max-w-lg">
                The foundational orchestration layer for Kinetic Architect. Manages global load balancing, automatic failover, and regional data replication across 12 availability zones.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">TERRAFORM</span>
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">BGP</span>
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">NATS</span>
                <span className="font-mono text-xs px-3 py-1.5 bg-surface-container-highest text-secondary rounded">PROMETHEUS</span>
                </div>
                <button className="w-fit px-8 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all flex items-center justify-center gap-2">
                SYSTEM BLUEPRINTS
                <Terminal size={14} />
                </button>
            </div>
            <div className="hidden md:block w-1/3 bg-surface-container-lowest rounded-lg border border-outline-variant/5 p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d0bcff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <div className="font-mono text-[8px] text-primary/50 overflow-hidden leading-tight">
                &gt; INITIALIZING TITAN_GRID...<br />
                &gt; CHECKING NODE_AVAILABILITY... [OK]<br />
                &gt; REPLICATING DATABASE_CLUSTER... [OK]<br />
                &gt; TUNNELING SECURE_PROTOCOL... [OK]<br />
                &gt; LOAD_BALANCER_ACTIVE: 10.0.0.1<br />
                &gt; SYNC_COMPLETE.
                </div>
                <div className="mt-4 flex justify-center">
                <Network className="text-primary opacity-30" size={64} />
                </div>
            </div>
            </motion.div> */}
        </div>
        </div>
    </MainLayout>
  );
}
