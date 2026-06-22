import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Trash2, Mail } from 'lucide-react';

interface Message {
    id: number;
    identifier_name: string;
    return_path_email: string;
    payload_message: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    auth: any;
    messages: Message[];
    currentFilter?: string | null;
}

export default function Inbox({ auth, messages, currentFilter }: Props) {
    const deleteMessage = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(route('contact.destroy', id));
        }
    };

    const setFilter = (filter: string | null) => {
        router.get(route('admin.inbox'), { filter: filter }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Inbox" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                Message Inbox
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Review and manage incoming communications.
                            </p>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 bg-admin-surface-container-low p-1 rounded-lg">
                            <button
                                onClick={() => setFilter(null)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                    !currentFilter ? 'bg-admin-surface text-admin-on-surface shadow-sm' : 'text-admin-on-surface-variant hover:text-admin-on-surface'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                    currentFilter === 'unread' ? 'bg-admin-surface text-admin-on-surface shadow-sm' : 'text-admin-on-surface-variant hover:text-admin-on-surface'
                                }`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30">
                        <div className="p-0 text-admin-on-surface">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm divide-y divide-admin-outline-variant/20">

                                    {/* Refined Table Headers */}
                                    <thead className="bg-admin-surface-container-low/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Received
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Sender
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Message
                                            </th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-admin-outline-variant/20">
                                        {messages.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-admin-on-surface-variant">
                                                        <Mail size={48} className="mb-4 opacity-20" />
                                                        <p className="text-sm tracking-wide">No messages in the buffer.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            messages.map((msg) => (
                                                <tr
                                                    key={msg.id}
                                                    className={`hover:bg-admin-surface-container-highest transition-colors group ${!msg.is_read ? 'bg-admin-surface-container-high/30' : ''}`}
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                                        {new Date(msg.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {!msg.is_read && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-admin-primary shadow-[0_0_6px_rgba(255,140,0,0.8)]"></span>
                                                            )}
                                                            <a
                                                                href={route('admin.contact.show', msg.id)}
                                                                className={`text-sm tracking-wide hover:underline ${!msg.is_read ? 'font-bold text-admin-on-surface' : 'font-semibold text-admin-on-surface/80'}`}
                                                            >
                                                                {msg.identifier_name}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                                        {msg.return_path_email}
                                                    </td>
                                                    <td className="max-w-xs truncate px-6 py-4 italic text-admin-on-surface-variant/70 text-sm">
                                                        {msg.payload_message}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => deleteMessage(msg.id)}
                                                                className="text-admin-on-surface-variant hover:text-admin-error transition-colors"
                                                                title="Delete Message"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
