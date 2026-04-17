import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, FileText, ArrowLeft, CheckCircle2, Clock, Plus, AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface ProjectPage {
    id: number;
    version_name: string;
    created_at: string;
}

interface Project {
    id: number;
    custom_id: string;
    title: string;
    slug: string;
    description: string;
    status: string;
    status_color: string;
    tags: string[];
    active_page_id: number | null;
    active_page?: ProjectPage;
    pages: ProjectPage[];
}

export default function Show({ auth, project }: { auth: any, project: Project }) {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [showDangerZone, setShowDangerZone] = useState(false);

    const { delete: destroy, processing } = useForm();

    const deleteProject = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('admin.projects.destroy', project.id), {
            onSuccess: () => setConfirmingDeletion(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Project: {project.slug}
                    </h2>
                    <Link
                        href={route('admin.projects.index')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                    >
                        <ArrowLeft size={16} /> Back to List
                    </Link>
                </div>
            }
        >
            <Head title={`Admin - ${project.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Metadata Overview */}
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 underline decoration-indigo-500 underline-offset-8">
                                    {project.title}
                                </h3>
                                <Link
                                    href={route('admin.projects.edit', project.id)}
                                    className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition"
                                >
                                    <Edit size={14} className="mr-1" /> Edit Metadata
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-mono">Custom ID</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{project.custom_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-mono">Status</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${project.status_color}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs text-gray-500 uppercase font-mono mb-1">Description</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500 uppercase font-mono mb-1">Tags</p>
                                    <div className="flex flex-wrap gap-2">

                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentation / Versions Section */}
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <FileText className="text-indigo-500" /> Architectural Documentation
                                </h3>
                                <Link
                                    // href={route('admin.projects.content.create', project.id)}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                                >
                                    <Plus size={14} className="mr-1" /> New Version
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {project.pages.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-500">No documentation pages created for this project yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {project.pages.map((page) => (
                                                    <tr key={page.id} className={project.active_page_id === page.id ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                            {page.version_name || `Version #${page.id}`}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                                            {new Date(page.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {project.active_page_id === page.id ? (
                                                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold">
                                                                    <CheckCircle2 size={14} /> LIVE
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                                                                    <Clock size={14} /> ARCHIVED
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link
                                                                href={route('admin.projects.content.edit', [project.id, page.id])}
                                                                className="text-indigo-600 hover:text-indigo-900 text-xs font-bold uppercase tracking-widest"
                                                            >
                                                                Open Editor
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Section */}
                    <div className="mt-12 overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800 border border-red-200/20">
                        <div className="p-6">
                            <button
                                onClick={() => setShowDangerZone(!showDangerZone)}
                                className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
                            >
                                <AlertTriangle size={18} />
                                {showDangerZone ? 'Hide Danger Zone' : 'Reveal Danger Zone'}
                            </button>

                            {showDangerZone && (
                                <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-red-800 dark:text-red-200 uppercase tracking-tight">
                                                Delete Project
                                            </h4>
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                This action is irreversible. All documentation versions and system metadata will be purged.
                                            </p>
                                        </div>
                                        <DangerButton onClick={() => setConfirmingDeletion(true)}>
                                            <Trash2 size={14} className="mr-2" />
                                            Delete Project
                                        </DangerButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deletion Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)}>
                <form onSubmit={deleteProject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Confirm System Purge?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-bold text-red-500">{project.title}</span>?
                        This will permanently remove {project.pages.length} documentation version(s) and all associated metadata.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeletion(false)}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Delete Project
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
