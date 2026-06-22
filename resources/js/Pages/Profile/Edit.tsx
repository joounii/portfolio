import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile Configuration" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">

                    {/* Unified Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                Profile Settings
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Manage your account information, security credentials, and data.
                            </p>
                        </div>
                    </div>

                    {/* Profile Information Section */}
                    <div className="bg-admin-surface-container border border-admin-outline-variant/30 p-4 shadow-2xl sm:rounded-xl sm:p-8 relative overflow-hidden">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl relative z-10"
                        />
                    </div>

                    {/* Update Password Section */}
                    <div className="bg-admin-surface-container border border-admin-outline-variant/30 p-4 shadow-2xl sm:rounded-xl sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Delete Account Section (Danger Zone) */}
                    <div className="bg-admin-surface-container border border-admin-error/30 p-4 shadow-2xl sm:rounded-xl sm:p-8 relative overflow-hidden">
                        <DeleteUserForm className="relative z-10" />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
