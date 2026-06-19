import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import TextEditor from '@/Components/Editor/TextEditor';
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

        transform((data) => {
            const { stay, ...cleanData } = data as any;
            return cleanData;
        });

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

    // Shared UI Classes
    const inputClass = "mt-1.5 block w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm";
    const labelClass = "block font-medium text-sm text-admin-on-surface-variant";
    const btnSecondaryClass = "inline-flex items-center justify-center px-4 py-2.5 bg-admin-surface-container-high border border-admin-outline-variant/30 rounded-md font-bold text-xs text-admin-on-surface uppercase tracking-wider hover:bg-admin-surface-container-highest focus:outline-none focus:ring-2 focus:ring-admin-outline-variant active:scale-[0.98] transition-all ease-in-out duration-150 shadow-sm";
    const btnPrimaryClass = "inline-flex items-center justify-center px-6 py-2.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";

    return (
        <AuthenticatedLayout>
            <Head title={`Edit - ${page.version_name}`} />

            {/* FLOATING HUD TOAST - Updated to Cyber-Teal */}
            <div className={`fixed top-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
                showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}>
                <div className="bg-admin-surface/95 text-admin-success font-mono text-xs font-bold tracking-widest border border-admin-success/30 shadow-[0_0_20px_rgba(45,212,191,0.15)] px-4 py-2.5 rounded-lg flex items-center gap-2 backdrop-blur-md">
                    <Check size={14} className="text-admin-success animate-pulse" strokeWidth={3} />
                    <span>DATA_SAVED_SUCCESSFULLY</span>
                </div>
            </div>

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight uppercase flex items-center gap-3">
                                Editor <span className="text-admin-on-surface-variant/30">|</span> <span className="text-admin-primary">{page.version_name}</span>
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Modifying documentation for {project.slug}.
                            </p>
                        </div>

                        <Link
                            href={route('admin.projects.show', project.id)}
                            className={btnSecondaryClass}
                        >
                            <ArrowLeft size={16} className="mr-2" strokeWidth={2.5} />
                            Back to Project
                        </Link>
                    </div>

                    <form onSubmit={submit} className="bg-admin-surface-container border border-admin-outline-variant/30 shadow-sm sm:rounded-xl flex flex-col">

                        {/* Editor Header / Meta fields */}
                        <div className="p-6 border-b border-admin-outline-variant/20 bg-admin-surface-container-low/30">
                            <div className="max-w-md">
                                <label className={labelClass}>Version Name</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={data.version_name}
                                    onChange={e => setData('version_name', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Text Editor Area */}
                        <div className="flex-grow">
                            <TextEditor
                                content={data.content}
                                onChange={(json, isExplicitSave) => {
                                    setData('content', json);

                                    if (isExplicitSave) {
                                        executeQuickSave({ ...data, content: json });
                                    }
                                }}
                            />
                        </div>

                        {/* Editor Footer / Actions */}
                        <div className="p-6 bg-admin-surface-container border-t border-admin-outline-variant/20 flex justify-end items-center gap-4">
                            <button
                                type="button"
                                onClick={() => executeQuickSave()}
                                disabled={processing}
                                className={btnSecondaryClass}
                            >
                                <Save size={16} className="mr-2" />
                                {processing ? 'Saving...' : 'Quick Save'}
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className={btnPrimaryClass}
                            >
                                {processing ? 'Processing...' : 'Save & Close'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
