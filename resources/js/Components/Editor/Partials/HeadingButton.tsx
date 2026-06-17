// Components/Editor/Partials/HeadingSelector.tsx
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
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2.5 h-9 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isOpen ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
            >
                <span className="min-w-[85px] text-left">{getActiveLabel()}</span>
                <ChevronDown size={14} className="text-gray-400" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 p-1"
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
                                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon size={16} />
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
