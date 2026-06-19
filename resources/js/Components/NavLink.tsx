import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-admin-primary text-admin-on-surface focus:border-admin-primary-container'
                    : 'border-transparent text-admin-on-surface-variant hover:border-admin-outline-variant hover:text-admin-on-surface focus:border-admin-outline-variant focus:text-admin-on-surface') +
                ` ${className}`
            }
        >
            {children}
        </Link>
    );
}
