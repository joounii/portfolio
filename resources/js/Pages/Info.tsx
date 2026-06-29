import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, ShieldCheck, Layers, RefreshCw, Server, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';

interface TelemetryData {
    host: { environment: string; php_version: string; laravel_version: string; uptime: string };
    hardware: { cpu_load: number; memory: { used: string; subtext: string; percentage: number } };
    daemons: {
        php_fpm: { status: string; latency: string };
        mysql: { status: string; context: string };
        scheduler: { status: string; context: string };
        cloudflare_tunnel: { status: string; context: string };
    };
}

export default function Status() {
    const [data, setData] = useState<TelemetryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchTelemetry = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get('/api/infra/telemetry');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Telemetry pipeline interrupted:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTelemetry();
        const telemetryLoop = setInterval(fetchTelemetry, 15000);
        return () => clearInterval(telemetryLoop);
    }, []);

    return (
        <MainLayout>
            <Head title="System Infos" />
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">

                {/* Header */}
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="font-mono text-secondary text-sm tracking-[0.3em] mb-4 uppercase">
                            03 // SYSTEM_REGISTRY
                        </div>
                        <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                            SYSTEM <span className="text-primary italic">INFOS</span>
                        </h1>
                        <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                            Real-time infrastructure metrics and service status streaming straight from the Docker containers hosting this website.
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="font-mono text-xs text-outline mb-1 uppercase tracking-widest">CLUSTER_HEALTH</div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/15">
                            <span className={`w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] ${refreshing ? 'animate-spin' : 'animate-pulse'}`}></span>
                            <span className="font-mono text-[10px] text-secondary tracking-wider">
                                {refreshing ? 'SYNCING_METRICS...' : 'METRICS_STREAM_ACTIVE'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Section 01: Hardware Counters */}
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">01 // CLUSTER_TELEMETRY</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-secondary/30 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {loading ? (
                        [1, 2].map((i) => <div key={i} className="h-44 bg-surface-container-low rounded border border-outline-variant/10 animate-pulse" />)
                    ) : (
                        <>
                            {/* CPU Engine */}
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-low rounded p-8 border border-outline-variant/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="font-mono text-[10px] text-outline tracking-widest uppercase">CORE_LOAD_AVG</div>
                                    <Cpu className="text-primary" size={18} />
                                </div>
                                <div className="font-mono text-[10px] text-outline tracking-wider uppercase mb-1">COMPUTE ENGINE LOAD</div>
                                <h3 className="font-mono text-4xl font-bold mb-2">{data?.hardware.cpu_load}%</h3>
                                <p className="font-mono text-[11px] text-on-surface-variant/80">RESOURCE CONSUMPTION VALUE ACROSS CLUSTER APPS</p>
                                <div className="w-full bg-surface-container-highest h-[2px] mt-6 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min(data?.hardware.cpu_load || 0, 100)}%` }}></div>
                                </div>
                            </motion.div>

                            {/* Memory Allocation */}
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-surface-container-low rounded p-8 border border-outline-variant/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="font-mono text-[10px] text-outline tracking-widest uppercase">DYNAMIC_RAM_BUFFER</div>
                                    <Activity className="text-secondary" size={18} />
                                </div>
                                <div className="font-mono text-[10px] text-outline tracking-wider uppercase mb-1">MEMORY UTILIZATION</div>
                                <h3 className="font-mono text-4xl font-bold mb-2">{data?.hardware.memory.used}</h3>
                                <p className="font-mono text-[11px] text-on-surface-variant/80 uppercase">{data?.hardware.memory.subtext}</p>
                                <div className="w-full bg-surface-container-highest h-[2px] mt-6 rounded-full overflow-hidden">
                                    <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${data?.hardware.memory.percentage}%` }}></div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Section 02: Daemon Container Stack */}
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">02 // CONTAINER_DAEMON_REGISTRY</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/30 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-surface-container-low rounded border border-outline-variant/10 animate-pulse" />)
                    ) : (
                        <>
                            {/* PHP FPM */}
                            <div className="flex items-center justify-between bg-surface-container-low rounded p-6 border border-outline-variant/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-xs font-medium text-on-surface">PHP_FPM CONTAINER</span>
                                    <span className="font-mono text-[9px] text-outline uppercase">LATENCY: {data?.daemons.php_fpm.latency}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                                    data?.daemons.php_fpm.status === 'OPERATIONAL'
                                        ? 'bg-secondary/5 border-secondary/10 text-secondary'
                                        : 'bg-primary/5 border-primary/10 text-primary'
                                }`}>
                                    {data?.daemons.php_fpm.status === 'OPERATIONAL' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                                    <span className="font-mono text-[9px] uppercase">{data?.daemons.php_fpm.status === 'OPERATIONAL' ? 'ONLINE' : 'ERROR'}</span>
                                </div>
                            </div>

                            {/* MySQL Engine */}
                            <div className="flex items-center justify-between bg-surface-container-low rounded p-6 border border-outline-variant/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-xs font-medium text-on-surface">MYSQL_DB CONTAINER</span>
                                    <span className="font-mono text-[9px] text-outline uppercase">{data?.daemons.mysql.context}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                                    data?.daemons.mysql.status === 'OPERATIONAL'
                                        ? 'bg-secondary/5 border-secondary/10 text-secondary'
                                        : 'bg-primary/5 border-primary/10 text-primary'
                                }`}>
                                    {data?.daemons.mysql.status === 'OPERATIONAL' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                                    <span className="font-mono text-[9px] uppercase">{data?.daemons.mysql.status === 'OPERATIONAL' ? 'ONLINE' : 'OFFLINE'}</span>
                                </div>
                            </div>

                            {/* Artisan Scheduler */}
                            <div className="flex items-center justify-between bg-surface-container-low rounded p-6 border border-outline-variant/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-xs font-medium text-on-surface">PORTFOLIO_SCHEDULER</span>
                                    <span className="font-mono text-[9px] text-outline uppercase">{data?.daemons.scheduler.context}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                                    data?.daemons.scheduler.status === 'ACTIVE'
                                        ? 'bg-secondary/5 border-secondary/10 text-secondary'
                                        : 'bg-primary/5 border-primary/10 text-primary'
                                }`}>
                                    {data?.daemons.scheduler.status === 'ACTIVE' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                                    <span className="font-mono text-[9px] uppercase">{data?.daemons.scheduler.status}</span>
                                </div>
                            </div>

                            {/* Cloudflare Tunnel Proxy */}
                            <div className="flex items-center justify-between bg-surface-container-low rounded p-6 border border-outline-variant/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-xs font-medium text-on-surface">CLOUDFLARED TUNNEL</span>
                                    <span className="font-mono text-[9px] text-outline uppercase">{data?.daemons.cloudflare_tunnel.context}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                                    data?.daemons.cloudflare_tunnel.status === 'SHIELDED'
                                        ? 'bg-tertiary/5 border-tertiary/10 text-tertiary'
                                        : 'bg-primary/5 border-primary/10 text-primary'
                                }`}>
                                    {data?.daemons.cloudflare_tunnel.status === 'SHIELDED' ? <ShieldCheck size={10} /> : <AlertTriangle size={10} />}
                                    <span className="font-mono text-[9px] uppercase">{data?.daemons.cloudflare_tunnel.status === 'SHIELDED' ? 'SECURED' : 'OFFLINE'}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Section 03: Infrastructure Blueprint Meta */}
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-outline">03 // ENGINE_VIRTUALIZATION_DETAILS</h3>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-outline/20 to-transparent"></div>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container-low rounded p-10 border border-outline-variant/10 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-outline mb-1.5">
                                <Server size={12} />
                                <span className="font-mono text-[9px] tracking-widest uppercase">CLUSTER ENVIRONMENT CONTEXT</span>
                            </div>
                            <p className="font-mono text-sm text-on-surface font-semibold">{data?.host.environment || 'LOADING...'}</p>
                            <p className="font-mono text-[11px] text-outline mt-0.5">ISOLATED VIA ALPINE BRIDGED BR0 ENGINE</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-outline mb-1.5">
                                <Clock size={12} />
                                <span className="font-mono text-[9px] tracking-widest uppercase">CONTAINER UP-TIME LIFECYCLE</span>
                            </div>
                            <p className="font-mono text-sm text-secondary font-semibold">{data?.host.uptime || 'COUNTING...'}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-outline mb-1.5">
                                <Layers size={12} />
                                <span className="font-mono text-[9px] tracking-widest uppercase">CORE FRAMEWORK REGISTRIES</span>
                            </div>
                            <p className="font-mono text-sm text-on-surface font-semibold">PHP {data?.host.php_version} • LARAVEL {data?.host.laravel_version}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-outline mb-1.5">
                                <ShieldCheck size={12} />
                                <span className="font-mono text-[9px] tracking-widest uppercase">INGRESS ARCHITECTURE SHIELD</span>
                            </div>
                            <p className="font-mono text-sm text-on-surface font-semibold">CLOUDFLARE ARGO ZERO-TRUST</p>
                        </div>
                    </div>

                    {/* Retro console tracker simulation output log */}
                    <div className="w-full lg:w-1/3 bg-surface-container-lowest rounded border border-outline-variant/5 p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4cd7f6 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

                        <div className="font-mono text-[9px] text-secondary/70 leading-normal z-10">
                            &gt; ENGINE STACK INITIALIZED VIA WORKFLOW<br />
                            &gt; MULTI_STAGE ASSET INJECTION: COMPLETE<br />
                            &gt; INGRESS ENTRY: STACKED THROUGH NGINX CONTROLLER<br />
                            &gt; DATA INTERACTION FLOW STATE: LOCK_SECURE<br />
                            &gt; PIPELINE REFRESH POLLING PERIOD: 15 SECONDS
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/10 pt-4 z-10">
                            <span className="font-mono text-[9px] text-outline">AUTO_REFRESH MODE: LIVE</span>
                            <RefreshCw className={`text-secondary/40 ${refreshing ? 'animate-spin text-secondary' : ''}`} size={14} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
