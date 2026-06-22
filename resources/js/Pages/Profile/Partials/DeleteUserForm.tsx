import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showDangerZone, setShowDangerZone] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    // Standard Shared UI Classes
    const btnSecondaryClass = "inline-flex items-center px-4 py-2.5 bg-admin-surface-container-high border border-admin-outline-variant/30 rounded-md font-bold text-xs text-admin-on-surface uppercase tracking-wider hover:bg-admin-surface-container-highest focus:outline-none focus:ring-2 focus:ring-admin-outline-variant active:scale-[0.98] transition-all ease-in-out duration-150 shadow-sm shrink-0";
    const btnErrorClass = "inline-flex items-center px-4 py-2.5 bg-admin-error hover:bg-admin-error-container text-admin-on-error font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-error/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";

    // Danger Input: Specifically uses error colors
    const errorInputClass = "mt-1.5 block w-full rounded-md bg-admin-surface-container-lowest border border-admin-error/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 focus:border-admin-error focus:ring-1 focus:ring-admin-error outline-none shadow-sm transition-colors sm:text-sm px-3 py-2";

    return (
        <section className={className}>
            <div>
                <button
                    type="button"
                    onClick={() => setShowDangerZone(!showDangerZone)}
                    className="flex items-center gap-2 text-sm font-bold tracking-wide text-admin-error hover:text-admin-error-container transition-colors focus:outline-none"
                >
                    <AlertTriangle size={18} />
                    {showDangerZone ? 'Hide Danger Zone' : 'Reveal Danger Zone'}
                </button>

                {showDangerZone && (
                    <div className="mt-6">
                        <header className="max-w-xl">
                            <h2 className="text-lg font-bold text-admin-on-surface tracking-wide">
                                Delete Account
                            </h2>

                            <p className="mt-1 text-sm text-admin-on-surface-variant">
                                Once your account is deleted, all of its resources and data
                                will be permanently deleted. Before deleting your account,
                                please download any data or information that you wish to
                                retain.
                            </p>
                        </header>
                        <div className="mt-6 p-6 rounded-lg bg-admin-error/10 border border-admin-error/30">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-admin-error uppercase tracking-widest">
                                        Purge Account
                                    </h4>
                                    <p className="text-xs text-admin-error/80 mt-1.5 leading-relaxed max-w-xl">
                                        This action is irreversible. All your profile information and data will be permanently deleted from the database.
                                    </p>
                                </div>
                                <button type="button" onClick={confirmUserDeletion} className={`${btnErrorClass} shrink-0`}>
                                    <Trash2 size={16} className="mr-2" strokeWidth={2.5} />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Deletion Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="bg-admin-surface-container border border-admin-outline-variant/30 rounded-lg overflow-hidden">
                    <form onSubmit={deleteUser} className="p-8">

                        <h2 className="text-xl font-bold text-admin-on-surface uppercase tracking-tight flex items-center gap-2">
                            <AlertTriangle className="text-admin-error" size={24} /> Confirm Account Deletion
                        </h2>

                        <p className="mt-4 text-sm text-admin-on-surface-variant leading-relaxed">
                            Are you absolutely sure you want to delete your account? This will permanently remove all associated data and cannot be undone. Please enter your password to confirm you would like to proceed.
                        </p>

                        <div className="mt-8">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={errorInputClass}
                                placeholder="Enter your password..."
                                autoFocus
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-admin-error font-medium">{errors.password}</p>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={closeModal} className={btnSecondaryClass}>
                                Cancel
                            </button>

                            <button type="submit" disabled={processing} className={btnErrorClass}>
                                {processing ? 'Deleting...' : 'Confirm Deletion'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}
