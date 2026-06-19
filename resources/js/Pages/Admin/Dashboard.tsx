import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';

export default function Dashboard() {
    return (
        // The header={...} prop is removed to match the unified layout
        <AuthenticatedLayout>
            <Head title="Admin - Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                System Dashboard
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Overview of your application status and metrics.
                            </p>
                        </div>
                    </div>

                    {/* Main Dashboard Card */}
                    <div className="bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30">
                        <div className="p-8 flex items-start gap-5">

                            {/* Visual Indicator Icon */}
                            <div className="p-3 bg-admin-primary/10 rounded-lg border border-admin-primary/20 shadow-[0_0_15px_rgba(255,140,0,0.05)] shrink-0">
                                <Activity className="w-6 h-6 text-admin-primary" />
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-lg font-bold text-admin-on-surface tracking-wide">
                                    Logged In
                                </h3>
                                <div className="text-sm text-admin-on-surface-variant mt-1.5 leading-relaxed">
                                    You are successfully authenticated and logged into the admin dashboard.
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
