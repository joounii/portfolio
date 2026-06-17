import { Editor } from '@tiptap/react';
import { Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolbarButton from './ToolbarButton';

export default function LinkButton({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [newTab, setNewTab] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const attrs = editor.getAttributes('link');
            setUrl(attrs.href || '');
            setNewTab(attrs.target === '_blank' || !attrs.href);
        }
    }, [isOpen, editor]);

    const setLink = () => {
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setIsOpen(false);
            return;
        }

        let finalUrl = url.trim();
        if (!/^(https?:\/\/|mailto:|tel:|#)/i.test(finalUrl)) {
            finalUrl = `https://${finalUrl}`;
        }

        const targetAttr = newTab ? '_blank' : '_self';

        if (editor.state.selection.empty && !editor.isActive('link')) {
            editor
                .chain()
                .focus()
                .insertContent({
                    type: 'text',
                    text: finalUrl,
                    marks: [
                        {
                            type: 'link',
                            attrs: {
                                href: finalUrl,
                                target: targetAttr,
                            },
                        },
                    ],
                })
                .run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: finalUrl, target: targetAttr })
                .run();
        }

        setIsOpen(false);
    };

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={containerRef}>
            <ToolbarButton
                editor={editor}
                mark="link"
                title="Add Link"
                icon={LinkIcon}
                onClick={() => setIsOpen(!isOpen)}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Header Section */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                    Edit Link
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Input and Action Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="google.com"
                                            className="w-full font-mono text-xs bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setLink();
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={setLink}
                                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-lg transition-all active:scale-95"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                </div>

                                {/* Checkbox Section */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newTab}
                                                onChange={(e) => setNewTab(e.target.checked)}
                                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 transition-all"
                                            />
                                            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                                            Open in new tab
                                        </span>
                                    </label>

                                    {editor.isActive('link') && (
                                        <button
                                            type="button"
                                            onClick={removeLink}
                                            className="text-[10px] font-bold text-red-500/80 hover:text-red-500 uppercase tracking-tight transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
