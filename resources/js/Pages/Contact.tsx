import { motion } from 'framer-motion';
import { Send, Terminal, MapPin } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import ZurichClock from '@/Components/ZurichClock';
import ContactGrid from '@/Components/ContactGrid';
import { useForm, usePage, Head } from '@inertiajs/react';
import React from 'react';

interface PageProps extends Record<string, any> {
    auth: {
        user: any;
    };
    flash: {
        success: string | null;
    };
}

export default function Contact() {
    const offset = new Date().getTimezoneOffset();
    const gmtLabel = offset === -120 ? "CEST // GMT+2" : "CET // GMT+1";

    const { flash } = usePage<PageProps>().props;
    const isSuccess = flash.success === 'PAYLOAD_RECEIVED';

    const { data, setData, post, processing, reset, errors } = useForm({
        identifier_name: '',
        return_path_email: '',
        payload_message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
            onError: (err) => console.error("HANDSHAKE_FAILED", err),
        });
    };

    return (
        <MainLayout>
            <Head title="Contact" />
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="font-mono text-secondary text-sm tracking-[0.3em] mb-4 uppercase">
                            03 // CONNECTION_NODE
                        </div>
                        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                            ESTABLISH <span className="text-primary italic">CONNECTION</span>
                        </h1>
                        <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                            Based in Zurich and working globally. Use the form below to get in touch regarding project inquiries, technical collaborations, or just to say hello.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="font-mono text-xs text-outline mb-1 uppercase tracking-widest">SYSTEM_STATUS</div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/15">
                            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]"></span>
                            <span className="font-mono text-xs text-secondary">ALL_SYSTEMS_OPERATIONAL</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 bg-surface-container-low p-10 relative overflow-hidden group border border-outline-variant/10 rounded transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-outline-variant opacity-30">
                            MODULE_ID: FORM_771
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Terminal className="hidden sm:block text-primary" size={24} />
                                <h2 className="font-headline text-xl font-bold tracking-tight">THE_HANDSHAKE_MODULE</h2>
                            </div>
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">IDENTIFIER_NAME</label>
                                        <input
                                            value={data.identifier_name}
                                            onChange={e => setData('identifier_name', e.target.value)}
                                            className="w-full bg-surface-container-high border-none text-on-surface font-mono focus:ring-1 focus:ring-secondary/50 p-4 transition-all rounded"
                                            placeholder="GUEST_USER"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">RETURN_PATH_EMAIL</label>
                                        <input
                                            value={data.return_path_email}
                                            onChange={e => setData('return_path_email', e.target.value)}
                                            className="w-full bg-surface-container-high border-none text-on-surface font-mono focus:ring-1 focus:ring-secondary/50 p-4 transition-all rounded"
                                            placeholder="USER@NETWORK.COM"
                                            type="email"
                                        />
                                        {errors.return_path_email && (
                                            <div className="text-[10px] font-mono text-error uppercase tracking-tighter mt-1">
                                                &lt; [ERROR]: {errors.return_path_email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">PAYLOAD_MESSAGE</label>
                                    <textarea
                                        value={data.payload_message}
                                        onChange={e => setData('payload_message', e.target.value)}
                                        className="w-full bg-surface-container-high border-none text-on-surface font-mono focus:ring-1 focus:ring-secondary/50 p-4 transition-all resize-none rounded custom-scrollbar"
                                        placeholder="TYPE_YOUR_REQUEST_HERE..."
                                        rows={6}
                                    ></textarea>
                                </div>
                                <button disabled={processing} className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest rounded-lg flex items-center justify-center gap-3 group/btn transition-all active:scale-95 neon-glow-primary">
                                    {processing ? 'UPLOADING_PACKET...' : isSuccess ? 'PAYLOAD_DELIVERED' : 'SEND_PACKET'}
                                    <Send className="text-sm transition-transform group-hover/btn:translate-x-1" size={16} />
                                </button>
                            </form>
                            <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest pt-4">
                                <span>STATUS:
                                    <span className={isSuccess ? "text-primary" : "text-secondary"}>
                                        {isSuccess ? 'SUCCESS_SENT' : 'READY'}
                                    </span>
                                </span>
                                <span>ENCRYPTION: <span className="text-tertiary">AES_256_GCM</span></span>
                                <span>LATENCY: <span className="text-primary">12MS</span></span>
                                <span>PROTOCOL: <span className="text-on-surface">TCP/IP_V6</span></span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-5 space-y-8">
                        <ContactGrid />

                        <div className="bg-surface-container-low overflow-hidden relative group border border-outline-variant/10 rounded-xl">
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none grayscale brightness-50 contrast-125 transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    backgroundImage: "url('/images/earth_picture.png')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>
                            <div className="relative p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-surface-container-highest/80 backdrop-blur rounded-lg border border-outline-variant/10">
                                        <MapPin className="text-secondary" size={24} />
                                    </div>
                                    <div className="bg-tertiary-container/10 px-3 py-1 rounded-full text-[10px] font-mono text-tertiary border border-tertiary/20 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span>
                                        AVAILABILITY_STATUS: ONLINE
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">LOCATION_COORDINATES</h3>
                                        <p className="font-headline text-2xl font-bold tracking-tight">ZURICH, CH</p>
                                        <p className="font-mono text-[10px] text-secondary opacity-70">47.3744° N, 8.5411° E</p>
                                    </div>
                                    <div className="pt-4 border-t border-outline-variant/10">
                                        <h3 className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase mb-2">TIMEZONE_SYNC</h3>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 font-mono text-sm">
                                            <span className="text-on-surface">{ gmtLabel }</span>
                                            <span className="text-primary-container px-2 bg-primary-container/10 rounded w-fit">
                                                <ZurichClock />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border border-outline-variant/10 font-mono text-[9px] text-on-surface-variant leading-relaxed rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <Terminal size={12} />
                                TRANSMISSION_NOTICE
                            </div>
                            ALL INCOMING DATA PACKETS ARE SUBJECT TO AUTOMATIC SPAM FILTERING PROTOCOLS. PLEASE ENSURE IDENTIFIER_NAME MATCHES RECORDED ENTITIES FOR FASTER PROCESSING. RESPONSE LATENCY MAY VARY BETWEEN 24-48 CYCLES.
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
