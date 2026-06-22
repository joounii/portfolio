import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Message {
    id: number;
    identifier_name: string;
    return_path_email: string;
    payload_message: string;
    created_at: string;
}

export default function ShowMessage({ message }: { message: Message }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Message from ${message.identifier_name}`} />

            <div className="py-10">
                {/* Updated max-w-7xl to match the Inbox width */}
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <Link
                        href={route('admin.inbox')}
                        className="inline-flex items-center text-sm text-admin-on-surface-variant hover:text-admin-on-surface mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Inbox
                    </Link>

                    <div className="bg-admin-surface-container p-8 rounded-xl border border-admin-outline-variant/30 shadow-sm">
                        <h1 className="text-2xl font-bold text-admin-on-surface mb-2">
                            {message.identifier_name}
                        </h1>
                        <p className="text-admin-primary mb-6">
                            {message.return_path_email}
                        </p>

                        <div className="border-t border-admin-outline-variant/20 pt-6">
                            <p className="text-admin-on-surface-variant leading-relaxed whitespace-pre-wrap">
                                {message.payload_message}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-admin-outline-variant/20 text-xs text-admin-on-surface-variant/50">
                            Received on: {new Date(message.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
