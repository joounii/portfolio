import { Editor } from '@tiptap/react';
import { CodeXml, ChevronDown } from 'lucide-react';
import ToolbarNodeButton from './ToolbarNodeButton';
import { isNodeActive } from '../Hooks/useNodeActive';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
    { value: 'javascript', label: 'Javascript' },
    { value: 'typescript', label: 'Typescript' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
    { value: 'bash', label: 'Bash' },
];

export default function CodeBlockButton({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('javascript');
    const isActive = isNodeActive(editor, 'codeBlock');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close the custom dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync language selection when clicking around the editor
    useEffect(() => {
        const updateLang = () => {
            if (editor.isActive('codeBlock')) {
                const lang = editor.getAttributes('codeBlock').language;
                if (lang) setSelectedLang(lang);
            }
        };

        editor.on('transaction', updateLang);
        return () => {
            editor.off('transaction', updateLang);
        };
    }, [editor]);

    const handleToggle = () => {
        editor.chain().focus().toggleCodeBlock({ language: selectedLang }).run();
    };

    const handleLangChange = (newLang: string) => {
        setSelectedLang(newLang);

        if (isActive) {
            editor.chain().focus().updateAttributes('codeBlock', { language: newLang }).run();
        }

        setIsOpen(false); // Close menu after selecting
    };

    const activeLabel = LANGUAGES.find(l => l.value === selectedLang)?.label || 'Javascript';

    return (
        <div className="flex items-center gap-1.5" ref={dropdownRef}>

            <ToolbarNodeButton
                editor={editor}
                nodeType="codeBlock"
                title="Code Block"
                icon={CodeXml}
                onClick={handleToggle}
            />

            <div className="relative">
                {/* Custom Dropdown Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-1.5 px-2.5 h-9 text-[10px] font-bold tracking-widest uppercase border rounded-md shadow-sm transition-colors focus:outline-none ${
                        isOpen || isActive
                            ? 'bg-admin-surface-container-highest border-admin-outline-variant/50 text-admin-on-surface'
                            : 'bg-admin-surface-container-lowest border-admin-outline-variant/30 text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                    }`}
                    title="Select Language"
                >
                    <span className="min-w-[75px] text-left">{activeLabel}</span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-admin-on-surface' : 'text-admin-on-surface-variant'}`}
                    />
                </button>

                {/* Custom Floating Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute left-0 top-full mt-2 w-40 bg-admin-surface-container border border-admin-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Wrapper to pad the scroll container away from the rounded corners */}
                            <div className="py-1.5">
                                <div className="max-h-60 overflow-y-auto px-1.5 flex flex-col space-y-0.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-admin-outline-variant/40 hover:[&::-webkit-scrollbar-thumb]:bg-admin-outline-variant/60 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {LANGUAGES.map((lang) => {
                                        const isSelected = selectedLang === lang.value;

                                        return (
                                            <button
                                                key={lang.value}
                                                type="button"
                                                onClick={() => handleLangChange(lang.value)}
                                                className={`flex items-center w-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors text-left focus:outline-none ${
                                                    isSelected
                                                        ? 'bg-admin-primary/10 text-admin-primary'
                                                        : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                                                }`}
                                            >
                                                {lang.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
