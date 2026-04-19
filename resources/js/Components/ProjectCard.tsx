import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

interface ProjectProps {
    project: {
        id: number;
        custom_id: string;
        title: string;
        slug: string;
        description: string;
        tags: string[];
        status: string;
        status_color: string;
    };
    index: number;
}

export default function ProjectCard({ project, index }: ProjectProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-surface-container-low rounded p-10 transition-all duration-300 border border-outline-variant/10 flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-8">
                <div className="font-mono text-[10px] text-outline tracking-widest uppercase">
                    {project.custom_id}
                </div>
                <div className={`${project.status_color} px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter uppercase`}>
                    {project.status}
                </div>
            </div>

            <h3 className="font-headline text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors uppercase">
                {project.title.replace('_', ' ')}
            </h3>

            <p className="text-on-surface-variant text-sm font-light mb-6 line-clamp-4 flex-grow">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] px-2 py-1 bg-surface-container-highest text-secondary rounded uppercase">
                        {tag}
                    </span>
                ))}
            </div>

            <Link
                href={route('projects.show', project.slug)}
                className="w-full py-3 rounded-lg border border-outline-variant/20 font-headline text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
            >
                VIEW ARCHITECTURE
                <Network size={14} />
            </Link>
        </motion.div>
    );
}
