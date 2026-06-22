import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    // Shared UI Classes (Directly from Login screen)
    const inputClass = "w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm px-3 py-2";
    const labelClass = "block font-medium text-sm text-admin-on-surface-variant mb-1.5";
    const btnPrimaryClass = "inline-flex justify-center items-center px-6 py-2.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-admin-on-surface tracking-wide">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-admin-on-surface-variant">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">

                {/* Current Password Field */}
                <div>
                    <label htmlFor="current_password" className={labelClass}>
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <p className="mt-2 text-sm text-admin-error font-medium">{errors.current_password}</p>
                    )}
                </div>

                {/* New Password Field */}
                <div>
                    <label htmlFor="password" className={labelClass}>
                        New Password
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-admin-error font-medium">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="password_confirmation" className={labelClass}>
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-admin-error font-medium">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit Area */}
                <div className="flex items-center gap-4 pt-2">
                    <button type="submit" disabled={processing} className={btnPrimaryClass}>
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs uppercase tracking-widest text-admin-primary font-bold">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
