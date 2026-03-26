import { motion } from 'motion/react';
import { Terminal, FileCode, Layers, Mail, LayoutGrid } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const navItems: { label: string; value: View }[] = [
    { label: 'HOME', value: 'home' },
    { label: 'PROJECTS', value: 'projects' },
    { label: 'STACK', value: 'stack' },
    { label: 'CONTACT', value: 'contact' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-6 py-2 bg-surface-variant/60 backdrop-blur-xl rounded-full border border-outline-variant/10 shadow-[0_0_40px_-15px_rgba(139,92,246,0.3)] flex items-center gap-8">
      <div 
        className="text-xl font-bold tracking-tighter text-on-surface font-headline uppercase whitespace-nowrap cursor-pointer"
        onClick={() => setView('home')}
      >
        //KINETIC_ARCHITECT
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setView(item.value)}
            className={`font-headline tracking-tight uppercase text-sm font-bold transition-all relative py-1 ${
              currentView === item.value 
                ? 'text-primary' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {item.label}
            {currentView === item.value && (
              <motion.div 
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setView('logs')}
          className={`p-2 rounded-lg transition-colors ${currentView === 'logs' ? 'text-secondary bg-secondary/10' : 'text-primary hover:bg-primary/10'}`}
        >
          <Terminal size={20} />
        </button>
        <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-xs font-headline font-bold tracking-widest hover:brightness-110 transition-all active:scale-95 uppercase">
          RESUME
        </button>
      </div>
    </nav>
  );
}
