import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import TextEditor from '@/Components/Editor/TextEditor';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Check, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Edit({ auth, project, page }: any) {
    const [showToast, setShowToast] = useState(false);

    const { data, setData, put, processing, transform } = useForm({
        version_name: page.version_name,
        content: page.content,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.projects.page.update', [project.id, page.id]));
    };

    const executeQuickSave = (latestData = data) => {
        transform(() => ({
            ...latestData,
            stay: true,
        }));

        put(route('admin.projects.page.update', [project.id, page.id]), {
            headers: {
                'X-Quick-Save': 'true',
            },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowToast(true);
            }
        });
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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

            {/* FLOATING HUD TOAST */}
            <div className={`fixed top-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
                showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}>
                <div className="bg-gray-900/90 dark:bg-black/80 text-green-400 font-mono text-xs tracking-wider border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] px-4 py-2.5 rounded-lg flex items-center gap-2 backdrop-blur-md">
                    <Check size={14} className="text-green-400 animate-pulse" />
                    <span>SAVED_SUCCESSFULLY</span>
                </div>
            </div>

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
                            onChange={(json, isExplicitSave) => {
                                setData('content', json);

                                if (isExplicitSave) {
                                    executeQuickSave({ ...data, content: json });
                                }
                            }}
                        />

                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            {/* Manual Clickable Backup Action Button */}
                            <SecondaryButton
                                type="button"
                                onClick={() => executeQuickSave()}
                                disabled={processing}
                            >
                                <Save size={14} className="mr-2" />
                                {processing ? 'Saving...' : 'Quick Save'}
                            </SecondaryButton>

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
