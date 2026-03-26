import Navbar from '@/Components/Navbar';
import { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="bg-surface-container-lowest min-h-screen">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
