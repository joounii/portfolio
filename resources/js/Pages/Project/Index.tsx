import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProjectCard from '@/Components/ProjectCard';

interface Project {
    id: number;
    custom_id: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    status: string;
    status_color: string;
}

interface Props {
    projects: Project[];
}

export default function Projects({ projects }: Props) {
    return (
        <MainLayout>
            <Head title="Project Dossier" />
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
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
