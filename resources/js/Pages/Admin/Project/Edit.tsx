import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit: {project.slug}
                    </h2>
                    <Link href={route('admin.projects.show', project.id)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                        <ArrowLeft size={16} /> Cancel
                    </Link>
                </div>
            }
        >
            <Head title={`Edit - ${project.title}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="custom_id" value="System ID" />
                                    <TextInput
                                        id="custom_id"
                                        className="mt-1 block w-full"
                                        value={data.custom_id}
                                        onChange={(e) => setData('custom_id', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.custom_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="title" value="Project Title" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Short Description" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="status" value="Status Label" />
                                    <TextInput
                                        id="status"
                                        className="mt-1 block w-full"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status_color" value="Status Color Class" />
                                    <TextInput
                                        id="status_color"
                                        className="mt-1 block w-full"
                                        value={data.status_color}
                                        onChange={(e) => setData('status_color', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Tags" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.tagInput}
                                    onChange={(e) => setData('tagInput', e.target.value)}
                                    onKeyDown={addTag}
                                    placeholder="Add tag and press Enter"
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {data.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(index)} className="ml-1.5 text-indigo-400 hover:text-indigo-600">
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
                                <PrimaryButton disabled={processing}>
                                    Update Metadata
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
