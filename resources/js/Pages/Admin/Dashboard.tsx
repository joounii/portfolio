import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Activity, Mail, FolderKanban, AlertCircle } from 'lucide-react';

interface Stats {
    total_projects: number;
    total_messages: number;
    unread_messages: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
    const cards = [
        { title: 'Total Projects', value: stats.total_projects, icon: FolderKanban, color: 'text-blue-500' },
        { title: 'Total Messages', value: stats.total_messages, icon: Mail, color: 'text-emerald-500' },
        { title: 'Unread Messages', value: stats.unread_messages, icon: AlertCircle, color: 'text-orange-500' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">System Dashboard</h2>
                        <p className="text-sm text-admin-on-surface-variant mt-1">Real-time overview of your application.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <div key={index} className="bg-admin-surface-container p-6 rounded-xl border border-admin-outline-variant/30 shadow-sm flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-admin-surface ${card.color} bg-opacity-10`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-admin-on-surface-variant">{card.title}</p>
                                    <p className="text-2xl font-bold text-admin-on-surface">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
