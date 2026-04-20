import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import TextEditor from '@/Components/Editor/TextEditor';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft } from 'lucide-react';

export default function Create({ auth, project }: any) {
    const { data, setData, post, processing } = useForm({
        version_name: 'V1_DRAFT',
        content: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.projects.page.store', project.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        New Documentation Version: {project.title}
                    </h2>
                    <Link
                        href={route('admin.projects.show', project.id)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            }
        >
            <Head title="Create Page Version" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg space-y-6">
                        <div>
                            <InputLabel value="Version Name" />
                            <TextInput
                                className="w-full mt-1"
                                value={data.version_name}
                                onChange={e => setData('version_name', e.target.value)}
                            />
                        </div>

                        <TextEditor
                            content={data.content}
                            onChange={(json) => setData('content', json)}
                        />

                        <div className="flex justify-end pt-4">
                            <PrimaryButton disabled={processing}>Save Version</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
