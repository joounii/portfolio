import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, Cpu, ShieldAlert } from 'lucide-react';
import ContentRenderer from '@/Components/ContentRenderer';

interface Props {
    project: any;
}

export default function Show({ project }: Props) {
    return (
        <MainLayout>
            <Head title={`${project.title} // SYSTEM_DOSSIER`} />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/projects"
                        className="group inline-flex items-center gap-2 text-outline hover:text-primary transition-colors font-mono text-[10px] tracking-[0.3em] uppercase"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETURN_TO_INDEX
                    </Link>
                </motion.div>

                {/* Header */}
                <header className="mb-20 border-l-2 border-primary/20 pl-8 md:pl-12">
                    <div className="font-mono text-secondary text-sm tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={14} /> {project.custom_id} // {project.status}
                    </div>
                    <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-8 uppercase italic">
                        {project.title.replace('_', ' ')}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] px-3 py-1 bg-surface-container-highest text-secondary rounded border border-outline-variant/10 uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="bg-surface-container-low p-8 rounded border border-outline-variant/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Cpu size={40} />
                            </div>
                            <div className="font-mono text-[10px] text-outline mb-6 uppercase tracking-widest">
                                MODULE_SPECIFICATIONS
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-[10px] text-outline-variant uppercase mb-1">Access_Protocol</div>
                                    <div className="text-sm font-bold uppercase tracking-tight">ENCRYPTED_PUBLIC_VIEW</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-outline-variant uppercase mb-1">Status</div>
                                    <div className="text-sm font-bold uppercase tracking-tight text-primary">
                                        {project.active_page ? 'DATA_VERIFIED' : 'PENDING_UPLOAD'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-8">
                        <div className="font-mono text-[10px] text-primary/30 mb-10 tracking-[0.4em] uppercase flex items-center gap-4">
                            <div className="h-px flex-grow bg-primary/10"></div>
                            DATA_STREAM_START
                            <div className="h-px flex-grow bg-primary/10"></div>
                        </div>

                        <div className="min-h-[400px] text-on-surface-variant font-light text-lg">
                            {project.active_page ? (
                                <ContentRenderer json={project.active_page.content} />
                            ) : (
                                <div className="py-20 border border-dashed border-outline-variant/20 rounded flex flex-col items-center justify-center text-center opacity-50">
                                    <ShieldAlert className="mb-4 text-error" size={32} />
                                    <p className="font-mono text-xs uppercase tracking-widest text-error">
                                        Documentation offline or not yet initialized.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="font-mono text-[10px] text-primary/30 mt-20 tracking-[0.4em] uppercase flex items-center gap-4">
                            <div className="h-px flex-grow bg-primary/10"></div>
                            DATA_STREAM_END
                            <div className="h-px flex-grow bg-primary/10"></div>
                        </div>
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
