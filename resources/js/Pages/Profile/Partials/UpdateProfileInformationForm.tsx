import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // Shared UI Classes (Directly from your Login screen)
    const inputClass = "w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm px-3 py-2";
    const labelClass = "block font-medium text-sm text-admin-on-surface-variant mb-1.5";
    const btnPrimaryClass = "inline-flex justify-center items-center px-6 py-2.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm";

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-admin-on-surface tracking-wide">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-admin-on-surface-variant">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                {/* Name Field */}
                <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                        id="name"
                        type="text"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                    {errors.name && <p className="mt-2 text-sm text-admin-error font-medium">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input
                        id="email"
                        type="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && <p className="mt-2 text-sm text-admin-error font-medium">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-admin-on-surface-variant">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 text-[11px] font-bold uppercase tracking-wider text-admin-primary hover:text-admin-primary-container transition-colors focus:outline-none"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-4 p-3 rounded bg-admin-success/10 border border-admin-success/30 text-[11px] font-bold tracking-widest text-admin-success uppercase text-center">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

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
                            Saved
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
