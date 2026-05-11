import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import TextEditor from '@/Components/Editor/TextEditor';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Check, Save } from 'lucide-react';

export default function Edit({ auth, project, page }: any) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        version_name: page.version_name,
        content: page.content,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.projects.page.update', [project.id, page.id]));
    };

    const quickSave = () => {
        put(route('admin.projects.page.update', [project.id, page.id]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Version: {page.version_name}
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
            <Head title="Edit Page Version" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            {/* Status Indicator for UX */}
                            {recentlySuccessful && (
                                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mr-4 animate-fade-out">
                                    <Check size={16} /> Changes Saved
                                </span>
                            )}

                            {/* Action 1: Quick Save */}
                            <SecondaryButton
                                type="button"
                                onClick={quickSave}
                                disabled={processing}
                            >
                                <Save size={14} className="mr-2" />
                                {processing ? 'Saving...' : 'Quick Save'}
                            </SecondaryButton>

                            {/* Action 2: Save & Close */}
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Processing...' : 'Save & Close'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
