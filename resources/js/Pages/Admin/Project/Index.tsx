import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Eye, ExternalLink } from 'lucide-react';

interface Project {
    id: number;
    custom_id: string;
    title: string;
    status: string;
    active_page_id: number | null;
}

interface Props {
    auth: any;
    projects: Project[];
}

export default function Index({ auth, projects }: Props) {
    const handleRowClick = (id: number) => {
        router.get(route('admin.projects.show', id));
    };

    return (
        // Notice: The header={...} prop is completely gone.
        <AuthenticatedLayout>
            <Head title="Admin - Projects" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* NEW: Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                Projects Index
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Manage, view, and organize all system projects.
                            </p>
                        </div>

                        <Link
                            href={route('admin.projects.create')}
                            className="inline-flex items-center px-4 py-2.5 bg-admin-primary rounded-md font-bold text-xs text-admin-on-primary uppercase tracking-wider hover:bg-admin-primary-container focus:outline-none focus:ring-2 focus:ring-admin-primary/50 active:scale-[0.98] transition-all ease-in-out duration-150 shadow-sm shrink-0"
                        >
                            <Plus size={16} className="mr-2" strokeWidth={2.5} />
                            Create Project
                        </Link>
                    </div>

                    {/* Table Container */}
                    <div className="bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30">
                        <div className="p-0 text-admin-on-surface">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-admin-outline-variant/20">

                                    {/* NEW: Refined Table Headers */}
                                    <thead className="bg-admin-surface-container-low/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Title / Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Docs
                                            </th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-admin-outline-variant/20">
                                        {projects.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-admin-on-surface-variant text-sm">
                                                    No projects found. Initialize your first project to get started.
                                                </td>
                                            </tr>
                                        ) : (
                                            projects.map((project) => (
                                                <tr
                                                    key={project.id}
                                                    onClick={() => handleRowClick(project.id)}
                                                    className="hover:bg-admin-surface-container-highest transition-colors cursor-pointer group"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                                        {project.custom_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-admin-on-surface tracking-wide">{project.title}</div>
                                                        <div className="text-xs text-admin-on-surface-variant mt-0.5">{project.status}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {project.active_page_id ? (
                                                            <span className="px-2 py-0.5 inline-flex text-[10px] uppercase font-bold rounded border tracking-widest transition-colors bg-admin-success/10 text-admin-success border-admin-success/30 shadow-[0_0_8px_rgba(45,212,191,0.05)]">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 inline-flex text-[10px] uppercase font-bold rounded border tracking-widest transition-colors bg-admin-warning/10 text-admin-warning border-admin-warning/30 shadow-[0_0_8px_rgba(251,191,36,0.05)]">
                                                                Draft
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div
                                                            className="flex justify-end space-x-4"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Link
                                                                href={route('admin.projects.edit', project.id)}
                                                                className="text-admin-on-surface-variant hover:text-admin-primary transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={18} />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.projects.show', project.id)}
                                                                className="text-admin-on-surface-variant hover:text-admin-accent transition-colors"
                                                                title="View"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>
                                                            <a
                                                                href={`/projects/${project.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-admin-on-surface-variant hover:text-admin-on-surface transition-colors"
                                                                title="Open External"
                                                            >
                                                                <ExternalLink size={18} />
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
