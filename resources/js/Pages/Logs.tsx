import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Cpu, Database, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

const bootSequence = [
  '> INITIALIZING KINETIC_OS v2.4.0...',
  '> LOADING KERNEL MODULES...',
  '> MOUNTING DISTRIBUTED_FS...',
  '> ESTABLISHING SECURE_TUNNEL [AES_256]...',
  '> CHECKING NODE_HEALTH: 12 NODES ONLINE',
  '> SYNCHRONIZING DATABASE_CLUSTER...',
  '> STARTING TELEMETRY_SERVICE...',
  '> FIREWALL_ACTIVE: ZERO_TRUST_MODE',
  '> SYSTEM_READY. WELCOME, ARCHITECT.'
];

export default function Logs() {
  const [lines, setLines] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsBooting(false);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Terminal View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden flex flex-col h-[600px] shadow-2xl"
      >
        <div className="bg-surface-container-low px-4 py-2 border-bottom border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-secondary" />
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">TERMINAL_OS // SESSION_0x442</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-error/40"></div>
            <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-grow p-6 font-mono text-sm overflow-y-auto scrollbar-hide space-y-2"
        >
          {lines.map((line, i) => (
            <div key={i} className={(line?.includes('READY') || line?.includes('WELCOME')) ? 'text-secondary' : 'text-on-surface-variant'}>
              {line}
            </div>
          ))}
          {!isBooting && (
            <div className="flex items-center gap-2">
              <span className="text-primary">architect@kinetic:~$</span>
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-primary"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* System Status Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Status Widget */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm tracking-widest uppercase">SYSTEM_STATUS</h3>
            <div className="flex items-center gap-2 px-2 py-0.5 bg-secondary/10 rounded text-[10px] font-mono text-secondary">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
              STABLE
            </div>
          </div>

          <div className="space-y-4">
            <StatusItem icon={Cpu} label="CPU_LOAD" value="12%" color="text-primary" />
            <StatusItem icon={Database} label="MEM_USAGE" value="4.2GB / 16GB" color="text-secondary" />
            <StatusItem icon={Activity} label="NETWORK_I/O" value="1.2 GB/s" color="text-tertiary" />
            <StatusItem icon={ShieldCheck} label="SECURITY" value="OPTIMAL" color="text-secondary" />
          </div>
        </div>

        {/* Active Processes */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <h3 className="font-headline font-bold text-sm tracking-widest uppercase mb-6">ACTIVE_PROCESSES</h3>
          <div className="space-y-4">
            <ProcessItem name="neural_sync_gate" pid="4421" status="RUNNING" />
            <ProcessItem name="void_kube_orch" pid="8829" status="RUNNING" />
            <ProcessItem name="pulse_stream_v2" pid="1102" status="IDLE" />
            <ProcessItem name="crypto_ledger" pid="9921" status="RUNNING" />
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-error-container/5 p-4 rounded-lg border border-error/20 flex gap-4 items-start">
          <AlertCircle className="text-error shrink-0" size={20} />
          <div className="space-y-1">
            <div className="font-mono text-[10px] text-error uppercase tracking-widest">SECURITY_NOTICE</div>
            <p className="font-body text-[11px] text-on-surface-variant leading-tight">
              UNAUTHORIZED ACCESS ATTEMPT DETECTED FROM IP: 192.168.1.102. PROTOCOL: BLOCKED.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon size={16} className={color} />
        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
      </div>
      <span className="font-mono text-xs font-bold">{value}</span>
    </div>
  );
}

function ProcessItem({ name, pid, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-container rounded border border-outline-variant/5">
      <div className="flex flex-col">
        <span className="font-mono text-[11px] font-bold uppercase">{name}</span>
        <span className="font-mono text-[9px] text-on-surface-variant">PID: {pid}</span>
      </div>
      <span className={`font-mono text-[9px] px-2 py-0.5 rounded ${status === 'RUNNING' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
        {status}
      </span>
    </div>
  );
}
