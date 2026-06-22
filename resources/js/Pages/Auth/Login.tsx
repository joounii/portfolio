import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Shared UI Classes
    const inputClass = "w-full rounded-md bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none shadow-sm transition-colors sm:text-sm";
    const labelClass = "block font-medium text-sm text-admin-on-surface-variant";
    const btnPrimaryClass = "w-full flex justify-center items-center px-6 py-3 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary font-bold text-xs uppercase tracking-widest rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-sm mt-6";

    return (
        // Standalone wrapper guarantees edge-to-edge matte black
        <div className="min-h-screen bg-admin-surface flex flex-col justify-center items-center p-4 font-body selection:bg-admin-primary/30">
            <Head title="System Login" />

            <div className="w-full max-w-md">

                {/* Portal Branding Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-admin-primary/10 border border-admin-primary/30 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,140,0,0.1)]">
                        <Lock className="text-admin-primary" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight uppercase">
                        Admin Portal
                    </h2>
                    <p className="text-sm text-admin-on-surface-variant mt-2">
                        Authenticate to access secure systems.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-admin-surface-container border border-admin-outline-variant/30 rounded-xl shadow-2xl p-8 sm:p-10">

                    {status && (
                        <div className="mb-6 p-4 rounded bg-admin-success/10 border border-admin-success/30 text-[11px] font-bold tracking-widest text-admin-success uppercase text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className={`${labelClass} mb-1.5`}>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={inputClass}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="mt-2 text-sm text-admin-error font-medium">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="password" className={labelClass}>Password</label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[11px] font-bold uppercase tracking-wider text-admin-primary hover:text-admin-primary-container transition-colors focus:outline-none"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={inputClass}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="mt-2 text-sm text-admin-error font-medium">{errors.password}</p>}
                        </div>

                        {/* Custom Styled Checkbox */}
                        <div className="flex items-center pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="peer appearance-none w-5 h-5 border border-admin-outline-variant/50 rounded bg-admin-surface-container-lowest checked:bg-admin-primary checked:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/30 transition-colors cursor-pointer shadow-sm"
                                    />
                                    {/* Custom Checkmark SVG */}
                                    <svg className="absolute w-3.5 h-3.5 text-admin-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="ms-3 text-sm font-medium text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                    Keep me logged in
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={processing} className={btnPrimaryClass}>
                            {processing ? 'Authenticating...' : 'Authorize Access'}
                        </button>
                    </form>
                </div>

                {/* Tech/Cyber Detail Footer */}
                <div className="mt-8 text-center text-[10px] text-admin-on-surface-variant/40 font-mono uppercase tracking-widest">
                    SECURE_CONNECTION_REQUIRED
                </div>
            </div>
        </div>
    );
}
