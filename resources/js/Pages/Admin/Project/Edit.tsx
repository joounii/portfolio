import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Project {
    id: number;
    custom_id: string;
    title: string;
    slug: string;
    description: string;
    status: string;
    tags: string[];
    status_color: string;
}

export default function Edit({ auth, project }: { auth: any, project: Project }) {
    const { data, setData, put, processing, errors } = useForm({
        custom_id: project.custom_id,
        title: project.title,
        description: project.description,
        status: project.status,
        tags: project.tags,
        status_color: project.status_color,
        tagInput: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.projects.update', project.id));
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && data.tagInput.trim()) {
            e.preventDefault();
            const newTag = data.tagInput.trim().toUpperCase();
            if (!data.tags.includes(newTag)) {
                setData('tags', [...data.tags, newTag]);
            }
            setData('tagInput', '');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setData('tags', data.tags.filter((_, index) => index !== indexToRemove));
    };

    // Shared input class for absolute consistency
    const inputClass = "mt-1.5 block w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm";
    const labelClass = "block font-medium text-sm text-admin-on-surface-variant";

    return (
        <AuthenticatedLayout>
            <Head title={`Edit - ${project.title}`} />

            <div className="py-10">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    {/* Unified Action Bar with Cancel Button */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight uppercase">
                                Edit: {project.slug}
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Update system metadata and configuration parameters.
                            </p>
                        </div>

                        <Link
                            href={route('admin.projects.show', project.id)}
                            className="inline-flex items-center px-4 py-2.5 bg-admin-surface-container-high border border-admin-outline-variant/30 rounded-md font-bold text-xs text-admin-on-surface uppercase tracking-wider hover:bg-admin-surface-container-highest focus:outline-none focus:ring-2 focus:ring-admin-outline-variant active:scale-[0.98] transition-all ease-in-out duration-150 shadow-sm shrink-0"
                        >
                            <ArrowLeft size={16} className="mr-2" strokeWidth={2.5} />
                            Cancel
                        </Link>
                    </div>

                    <div className="bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="custom_id" className={labelClass}>System ID</label>
                                    <input
                                        type="text"
                                        id="custom_id"
                                        className={inputClass}
                                        value={data.custom_id}
                                        onChange={(e) => setData('custom_id', e.target.value)}
                                        required
                                    />
                                    {errors.custom_id && <p className="mt-2 text-sm text-admin-error">{errors.custom_id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="title" className={labelClass}>Project Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        className={inputClass}
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-admin-error">{errors.title}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className={labelClass}>Short Description</label>
                                <textarea
                                    id="description"
                                    className={inputClass}
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <p className="mt-2 text-sm text-admin-error">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="status" className={labelClass}>Status Label</label>
                                    <input
                                        type="text"
                                        id="status"
                                        className={inputClass}
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    />
                                    {errors.status && <p className="mt-2 text-sm text-admin-error">{errors.status}</p>}
                                </div>
                                <div>
                                    <label htmlFor="status_color" className={labelClass}>Status Color Class</label>
                                    <input
                                        type="text"
                                        id="status_color"
                                        className={inputClass}
                                        value={data.status_color}
                                        onChange={(e) => setData('status_color', e.target.value)}
                                        placeholder="text-admin-success bg-admin-success/10"
                                    />
                                    {errors.status_color && <p className="mt-2 text-sm text-admin-error">{errors.status_color}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Tags</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={data.tagInput}
                                    onChange={(e) => setData('tagInput', e.target.value)}
                                    onKeyDown={addTag}
                                    placeholder="Add tag and press Enter"
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {data.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded border border-admin-outline-variant/30 text-[11px] uppercase tracking-widest font-bold bg-admin-surface-container-high text-admin-on-surface shadow-sm">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(index)}
                                                className="ml-2 text-admin-on-surface-variant hover:text-admin-error transition-colors focus:outline-none"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                {errors.tags && <p className="mt-2 text-sm text-admin-error">{errors.tags}</p>}
                            </div>

                            <div className="flex items-center justify-end border-t border-admin-outline-variant/20 pt-6 mt-6">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-2.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50"
                                    disabled={processing}
                                >
                                    Update Metadata
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
