import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Trash2, ExternalLink, Mail } from 'lucide-react';

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
}

export default function Inbox({ auth, messages }: Props) {
    const deleteMessage = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(route('contact.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Message Inbox
                </h2>
            }
        >
            <Head title="Inbox" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Received</th>
                                            <th className="px-6 py-3">Sender</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Message</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {messages.map((msg) => (
                                            <tr key={msg.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="whitespace-nowrap px-6 py-4 text-xs">
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 font-medium">{msg.identifier_name}</td>
                                                <td className="px-6 py-4 text-blue-400">{msg.return_path_email}</td>
                                                <td className="max-w-xs truncate px-6 py-4 italic text-gray-500 dark:text-gray-400">
                                                    {msg.payload_message}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-4">
                                                        <button
                                                            onClick={() => deleteMessage(msg.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                                        <Mail size={48} className="mb-4 opacity-20" />
                                        <p>No messages in the buffer.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
