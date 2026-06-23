import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Trash2, Mail, MailOpen, Star, Reply, Save, FileText } from 'lucide-react';

interface Message {
    id: number;
    identifier_name: string;
    return_path_email: string;
    payload_message: string;
    is_read: boolean;
    is_starred: boolean;
    admin_notes: string | null;
    created_at: string;
}

export default function ShowMessage({ message }: { message: Message }) {

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        admin_notes: message.admin_notes ?? '',
    });

    const deleteMessage = () => {
        if (confirm('Are you sure you want to delete this message? This action is permanent.')) {
            router.delete(route('contact.destroy', message.id));
        }
    };

    const toggleStar = () => {
        router.patch(route('contact.toggle-star', message.id), {}, { preserveScroll: true });
    };

    const toggleRead = () => {
        router.patch(route('contact.toggle-read', message.id));
    };

    const submitNotes = (e?: React.FormEvent, isAutoSave = false) => {
        e?.preventDefault();

        if (isAutoSave && data.admin_notes.trim() === (message.admin_notes ?? '').trim()) {
            return;
        }

        patch(route('contact.update-notes', message.id), {
            preserveScroll: true,
        });
    };

    const mailtoUrl = `mailto:${message.return_path_email}?subject=Re: Portfolio Contact Form Message`;

    return (
        <AuthenticatedLayout>
            <Head title={`Message from ${message.identifier_name}`} />

            <div className="py-10">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    {/* Header Action Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
                        <Link
                            href={route('admin.inbox')}
                            className="inline-flex items-center text-sm text-admin-on-surface-variant hover:text-admin-on-surface transition-colors select-none"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Back to Inbox
                        </Link>

                        {/* Control Toolbar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={toggleRead}
                                className="flex items-center gap-2 px-3 h-9 text-xs font-semibold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors"
                            >
                                {message.is_read ? (
                                    <><Mail size={14} /><span>Mark Unread</span></>
                                ) : (
                                    <><MailOpen size={14} /><span>Mark Read</span></>
                                )}
                            </button>

                            <button
                                onClick={toggleStar}
                                className={`flex items-center gap-2 px-3 h-9 text-xs font-semibold rounded-lg border transition-all ${
                                    message.is_starred
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                        : 'border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface'
                                }`}
                            >
                                <Star size={14} className={message.is_starred ? "fill-amber-500" : ""} />
                                <span>{message.is_starred ? 'Starred' : 'Star'}</span>
                            </button>

                            <a
                                href={mailtoUrl}
                                className="flex items-center gap-2 px-3 h-9 text-xs font-semibold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors"
                            >
                                <Reply size={14} />
                                <span>Reply</span>
                            </a>

                            <button
                                onClick={deleteMessage}
                                className="flex items-center gap-2 px-3 h-9 text-xs font-semibold rounded-lg border border-admin-error/20 bg-admin-error/5 text-admin-error hover:bg-admin-error/10 transition-colors"
                            >
                                <Trash2 size={14} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Left Column */}
                        <div className="lg:col-span-2 bg-admin-surface-container p-8 rounded-xl border border-admin-outline-variant/30 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-admin-outline-variant/20 pb-6 mb-6 gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                            {message.identifier_name}
                                        </h1>
                                        {!message.is_read && (
                                            <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider rounded-md bg-admin-primary/10 text-admin-primary border border-admin-primary/20">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-admin-on-surface-variant text-sm font-medium mt-1">
                                        From: <span className="text-admin-primary">{message.return_path_email}</span>
                                    </p>
                                </div>

                                <div className="text-left md:text-right">
                                    <span className="text-xs font-mono text-admin-on-surface-variant/60 block">
                                        {new Date(message.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className="text-[11px] font-mono text-admin-on-surface-variant/40 block mt-0.5">
                                        {new Date(message.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>

                            {/* Message area */}
                            <div className="bg-admin-surface-container-low/30 rounded-lg border border-admin-outline-variant/10 overflow-hidden">
                                <div className="max-h-[500px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-admin-outline-variant/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-admin-outline-variant/40 hover:[&::-webkit-scrollbar-thumb]:bg-admin-outline-variant/60 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    <p className="text-admin-on-surface leading-relaxed whitespace-pre-wrap tracking-wide text-sm">
                                        {message.payload_message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-admin-surface-container p-6 rounded-xl border border-admin-outline-variant/30 shadow-sm sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText size={18} className="text-admin-primary" />
                                <h3 className="text-sm font-bold text-admin-on-surface tracking-wide uppercase">
                                    Personal Notes
                                </h3>
                            </div>

                            <form onSubmit={submitNotes} className="space-y-3">
                                <textarea
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    onBlur={() => submitNotes(undefined, true)}
                                    placeholder="Add private follow-up notes, project ideas, or interaction logs here..."
                                    className="w-full h-64 text-sm p-4 rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container-low text-admin-on-surface placeholder-admin-on-surface-variant/40 focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary transition-all resize-none"
                                />

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-admin-on-surface-variant/60">
                                        {recentlySuccessful ? (
                                            <span className="text-emerald-500 font-medium animate-pulse">Saved successfully</span>
                                        ) : processing ? (
                                            <span>Saving changes...</span>
                                        ) : (
                                            <span>Auto-saves on blur</span>
                                        )}
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-admin-surface-container-highest border border-admin-outline-variant/30 text-admin-on-surface hover:bg-admin-surface transition-colors disabled:opacity-50"
                                    >
                                        <Save size={12} />
                                        <span>Save Note</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
