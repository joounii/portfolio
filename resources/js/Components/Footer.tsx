import { Link } from '@inertiajs/react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 px-6 lg:px-24 border-t border-outline-variant/15 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant">
          © {new Date().getFullYear()} DEPLOY_READY // ALL SYSTEMS OPERATIONAL
        </div>

        <div className="flex gap-10">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-secondary transition-colors">GITHUB</a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-secondary transition-colors">LINKEDIN</a>

          <Link
            href="/logs"
            className="font-mono text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-secondary transition-colors"
          >
            SYSTEM_STATUS
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]"></div>
          <span className="font-mono text-[10px] text-secondary tracking-widest uppercase">READY_TO_DEPLOY</span>
        </div>
      </div>
    </footer>
  );
}
