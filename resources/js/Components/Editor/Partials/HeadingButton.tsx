import { Editor } from '@tiptap/react';
import { Heading1, Heading2, Heading3, Type, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    editor: Editor;
}

const OPTIONS = [
    { label: 'Normal Text', level: 0, icon: Type, action: (ed: Editor) => ed.chain().focus().setParagraph().run() },
    { label: 'Heading 1', level: 1, icon: Heading1, action: (ed: Editor) => ed.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', level: 2, icon: Heading2, action: (ed: Editor) => ed.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', level: 3, icon: Heading3, action: (ed: Editor) => ed.chain().focus().toggleHeading({ level: 3 }).run() },
];

export default function HeadingSelector({ editor }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getActiveLabel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
        return 'Normal Text';
    };

    return (
        <div className="relative inline-flex items-center" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2.5 h-9 text-sm font-bold tracking-wide border rounded-md shadow-sm transition-colors ${
                    isOpen
                        ? 'bg-admin-surface-container-highest border-admin-outline-variant/50 text-admin-on-surface'
                        : 'bg-admin-surface-container-lowest border-admin-outline-variant/30 text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                }`}
            >
                <span className="min-w-[85px] text-left">{getActiveLabel()}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-admin-on-surface' : 'text-admin-on-surface-variant'}`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-48 bg-admin-surface-container border border-admin-outline-variant/30 rounded-xl shadow-2xl z-50 p-1.5"
                    >
                        {OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isActive = opt.level === 0
                                ? editor.isActive('paragraph')
                                : editor.isActive('heading', { level: opt.level });

                            return (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => {
                                        opt.action(editor);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left tracking-wide ${
                                        isActive
                                            ? 'bg-admin-primary/10 text-admin-primary font-bold'
                                            : 'text-admin-on-surface-variant font-medium hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                                    }`}
                                >
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                    {opt.label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
