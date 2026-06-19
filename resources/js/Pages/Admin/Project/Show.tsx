import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, FileText, ArrowLeft, CheckCircle2, Clock, Plus, AlertTriangle, Trash2, Eye, EyeOff, Upload, Download } from 'lucide-react';
import Modal from '@/Components/Modal';

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

    const handleExport = (page: any) => {
        const exportData = {
            version_name: page.version_name,
            content: page.content,
            exported_at: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `PAGE_${project.slug}_${page.version_name.replace(/\s+/g, '_')}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { data, setData, post, processing: importProcessing, reset, errors: importErrors } = useForm({
        version_name: '',
        content: null as any,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setData({
                    version_name: json.version_name || 'Imported Version',
                    content: json.content
                });
            } catch (err) {
                alert("Invalid JSON file. Please check the file format.");
            }
        };
        reader.readAsText(file);
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.projects.page.import', project.id), {
            onSuccess: () => {
                setIsImportModalOpen(false);
                reset();
            },
        });
    };

    // Shared UI Classes
    const cardClass = "bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30";
    const btnSecondaryClass = "inline-flex items-center px-4 py-2.5 bg-admin-surface-container-high border border-admin-outline-variant/30 rounded-md font-bold text-xs text-admin-on-surface uppercase tracking-wider hover:bg-admin-surface-container-highest focus:outline-none focus:ring-2 focus:ring-admin-outline-variant active:scale-[0.98] transition-all ease-in-out duration-150 shadow-sm shrink-0";
    const btnPrimaryClass = "inline-flex items-center px-4 py-2.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";
    const btnErrorClass = "inline-flex items-center px-4 py-2.5 bg-admin-error hover:bg-admin-error-container text-admin-on-error font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-error/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";
    const inputClass = "mt-1.5 block w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm";

    return (
        <AuthenticatedLayout>
            <Head title={`Admin - ${project.title}`} />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight uppercase">
                                Project: {project.slug}
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Manage dossier metadata and architectural documentation versions.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={route('admin.projects.index')} className={btnSecondaryClass}>
                                <ArrowLeft size={16} className="mr-2" strokeWidth={2.5} /> Back to List
                            </Link>
                            <Link href={route('admin.projects.edit', project.id)} className={btnPrimaryClass}>
                                <Edit size={16} className="mr-2" strokeWidth={2.5} /> Edit Metadata
                            </Link>
                        </div>
                    </div>

                    {/* Metadata Overview */}
                    <div className={cardClass}>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-1.5">System Title</p>
                                        <h3 className="text-xl font-bold text-admin-on-surface">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-1.5">Custom ID</p>
                                        <p className="text-base font-mono font-medium text-admin-on-surface">
                                            {project.custom_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-1.5">Status</p>
                                        <p className="text-base font-medium text-admin-on-surface uppercase tracking-wide">
                                            {project.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-1.5">Description</p>
                                        <p className="text-base text-admin-on-surface leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-1.5">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.length === 0 ? (
                                                <span className="text-sm text-admin-on-surface-variant italic">No tags assigned.</span>
                                            ) : (
                                                project.tags.map(tag => (
                                                    <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded border border-admin-outline-variant/30 text-[11px] uppercase tracking-widest font-bold bg-admin-surface-container-high text-admin-on-surface shadow-sm">
                                                        {tag}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentation / Versions Section */}
                    <div className={cardClass}>
                        <div className="p-0 text-admin-on-surface">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-admin-outline-variant/20 gap-4">
                                <h3 className="text-lg font-bold text-admin-on-surface flex items-center gap-2">
                                    <FileText className="text-admin-primary" size={20} /> Architectural Documentation
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsImportModalOpen(true)} className={btnSecondaryClass}>
                                        <Upload size={16} className="mr-2" /> Import JSON
                                    </button>
                                    <Link href={route('admin.projects.page.create', project.id)} className={btnPrimaryClass}>
                                        <Plus size={16} className="mr-2" strokeWidth={2.5} /> New Version
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-admin-outline-variant/20">
                                    <thead className="bg-admin-surface-container-low/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">Version Name</th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">Created</th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">Status</th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-admin-outline-variant/20">
                                        {project.pages.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-admin-on-surface-variant text-sm">
                                                    No documentation pages created yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            project.pages.map((page) => {
                                                const isActive = project.active_page_id === page.id;
                                                return (
                                                    <tr key={page.id} className="hover:bg-admin-surface-container-highest transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-admin-on-surface">
                                                            {page.version_name || `Version #${page.id}`}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-admin-on-surface-variant font-mono">
                                                            {new Date(page.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {isActive ? (
                                                                <span className="px-2.5 py-0.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold rounded border tracking-widest transition-colors bg-admin-success/10 text-admin-success border-admin-success/30 shadow-[0_0_8px_rgba(45,212,191,0.05)]">
                                                                    <CheckCircle2 size={12} strokeWidth={3} /> Live
                                                                </span>
                                                            ) : (
                                                                <span className="px-2.5 py-0.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold rounded border tracking-widest transition-colors bg-admin-surface-container-highest text-admin-on-surface-variant border-admin-outline-variant/30">
                                                                    <Clock size={12} strokeWidth={2.5} /> Archived
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex justify-end items-center space-x-6">
                                                                <button
                                                                    onClick={() => handleExport(page)}
                                                                    className="text-admin-on-surface-variant hover:text-admin-on-surface transition-colors"
                                                                    title="Export Version"
                                                                >
                                                                    <Download size={18} />
                                                                </button>
                                                                <Link
                                                                    href={route('admin.projects.page.toggle', [project.id, page.id])}
                                                                    method="patch"
                                                                    as="button"
                                                                    className="text-xs font-bold uppercase tracking-widest text-admin-on-surface-variant hover:text-admin-on-surface transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-1.5">
                                                                        {isActive ? <><EyeOff size={14} strokeWidth={2.5} /> Deactivate</> : <><Eye size={14} strokeWidth={2.5} /> Activate</>}
                                                                    </div>
                                                                </Link>
                                                                <Link
                                                                    href={route('admin.projects.page.edit', [project.id, page.id])}
                                                                    className="text-xs font-bold uppercase tracking-widest text-admin-on-surface hover:text-admin-primary transition-colors"
                                                                >
                                                                    Open Editor
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Section */}
                    <div className="bg-admin-error/5 border border-admin-error/20 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="p-6">
                            <button
                                onClick={() => setShowDangerZone(!showDangerZone)}
                                className="flex items-center gap-2 text-sm font-bold tracking-wide text-admin-error hover:text-admin-error-container transition-colors"
                            >
                                <AlertTriangle size={18} />
                                {showDangerZone ? 'Hide Danger Zone' : 'Reveal Danger Zone'}
                            </button>

                            {showDangerZone && (
                                <div className="mt-6 p-6 rounded-lg bg-admin-error/10 border border-admin-error/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-admin-error uppercase tracking-widest">
                                                Purge System Dossier
                                            </h4>
                                            <p className="text-xs text-admin-error/80 mt-1.5 leading-relaxed max-w-xl">
                                                This action is irreversible. All documentation versions, metadata, and history associated with <span className="font-bold">{project.custom_id}</span> will be permanently deleted from the database.
                                            </p>
                                        </div>
                                        <button onClick={() => setConfirmingDeletion(true)} className={`${btnErrorClass} shrink-0`}>
                                            <Trash2 size={16} className="mr-2" strokeWidth={2.5} />
                                            Purge Project
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deletion Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)}>
                <div className="bg-admin-surface-container border border-admin-outline-variant/30 rounded-lg overflow-hidden">
                    <form onSubmit={deleteProject} className="p-8">
                        <h2 className="text-xl font-bold text-admin-on-surface uppercase tracking-tight flex items-center gap-2">
                            <AlertTriangle className="text-admin-error" size={24} /> Confirm System Purge
                        </h2>

                        <p className="mt-4 text-sm text-admin-on-surface-variant leading-relaxed">
                            Are you absolutely sure you want to delete <span className="font-bold text-admin-error px-1 bg-admin-error/10 rounded">{project.title}</span>?
                            This will permanently remove <strong className="text-admin-on-surface">{project.pages.length}</strong> documentation version(s) and cannot be undone.
                        </p>

                        <div className="mt-8 flex justify-end gap-4 border-t border-admin-outline-variant/20 pt-6">
                            <button type="button" onClick={() => setConfirmingDeletion(false)} className={btnSecondaryClass}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className={btnErrorClass}>
                                Confirm Purge
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Import Modal */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
                <div className="bg-admin-surface-container border border-admin-outline-variant/30 rounded-lg overflow-hidden">
                    <form onSubmit={submitImport} className="p-8">
                        <h2 className="text-xl font-bold text-admin-on-surface uppercase tracking-tight flex items-center gap-2 mb-6">
                            <Upload className="text-admin-primary" size={24} /> Import Documentation
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block font-medium text-sm text-admin-on-surface-variant mb-2">Select JSON File</label>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-admin-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-admin-surface-container-high file:text-admin-on-surface hover:file:bg-admin-surface-container-highest file:transition-colors file:cursor-pointer cursor-pointer border border-admin-outline-variant/30 rounded-md bg-admin-surface-container-lowest"
                                />
                            </div>

                            {data.content && (
                                <div className="p-5 bg-admin-surface-container-lowest rounded-lg border border-admin-outline-variant/30">
                                    <p className="text-[11px] text-admin-on-surface-variant uppercase font-bold tracking-widest mb-2">Detected Version Name</p>
                                    <input
                                        type="text"
                                        value={data.version_name}
                                        onChange={e => setData('version_name', e.target.value)}
                                        className={inputClass}
                                    />
                                    <p className="mt-3 text-[11px] text-admin-success font-mono font-bold">
                                        ✓ DATA STREAM VALIDATED (SIZE: {JSON.stringify(data.content).length} BYTES)
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end gap-4 border-t border-admin-outline-variant/20 pt-6">
                            <button type="button" onClick={() => setIsImportModalOpen(false)} className={btnSecondaryClass}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={importProcessing || !data.content}
                                className={btnPrimaryClass}
                            >
                                {importProcessing ? 'Importing...' : 'Confirm Import'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
