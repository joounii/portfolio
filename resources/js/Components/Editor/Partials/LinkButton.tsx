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
                        className="absolute left-0 top-full mt-2 w-72 bg-admin-surface-container border border-admin-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Header Section */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-admin-on-surface-variant tracking-widest">
                                    Edit Link
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-admin-surface-container-high rounded text-admin-on-surface-variant hover:text-admin-on-surface transition-colors focus:outline-none"
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
                                            className="w-full font-mono text-xs bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary transition-all"
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
                                        className="p-2 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary rounded-md shadow-sm transition-all active:scale-95 border border-transparent focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                                    >
                                        <ExternalLink size={16} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Checkbox Section */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            {/* * group-hover:border-admin-primary connects the hover state to the text */}
                                            <input
                                                type="checkbox"
                                                checked={newTab}
                                                onChange={(e) => setNewTab(e.target.checked)}
                                                className="peer appearance-none bg-none checked:bg-none w-4 h-4 border border-admin-outline-variant/50 rounded bg-admin-surface-container-lowest text-admin-primary checked:bg-admin-primary checked:border-admin-primary group-hover:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:ring-offset-0 transition-all cursor-pointer shadow-sm"
                                            />
                                            <svg className="absolute w-2.5 h-2.5 text-admin-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-[11px] font-bold text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors uppercase tracking-wider">
                                            Open in new tab
                                        </span>
                                    </label>

                                    {editor.isActive('link') && (
                                        <button
                                            type="button"
                                            onClick={removeLink}
                                            className="text-[10px] font-bold text-admin-error/80 hover:text-admin-error uppercase tracking-widest transition-colors focus:outline-none"
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
