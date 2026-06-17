import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }: { auth: any }) {
    const { data, setData, post, processing, errors } = useForm({
        custom_id: '#',
        title: '',
        description: '',
        status: '',
        tags: [] as string[],
        status_color: 'text-primary bg-primary/10',
        tagInput: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.projects.store'));
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && data.tagInput.trim()) {
            e.preventDefault();
            if (!data.tags.includes(data.tagInput.trim().toUpperCase())) {
                setData('tags', [...data.tags, data.tagInput.trim().toUpperCase()]);
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Project Create
                </h2>
            }
        >
            <Head title="Admin - Create Project" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Custom ID & Title */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="custom_id" value="System ID (e.g. #OC_01)" />
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

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Short Description (Card Text)" />
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

                            {/* Status & Status Color */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="status" value="Status Label (e.g. STABLE)" />
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
                                        placeholder="text-primary bg-primary/10"
                                    />
                                </div>
                            </div>

                            {/* Tag System */}
                            <div>
                                <InputLabel value="Tags (Press Enter to add)" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.tagInput}
                                    onChange={(e) => setData('tagInput', e.target.value)}
                                    onKeyDown={addTag}
                                    placeholder="Add a tag..."
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {data.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(index)}
                                                className="ml-1.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <InputError message={errors.tags} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Initialize Dossier
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
