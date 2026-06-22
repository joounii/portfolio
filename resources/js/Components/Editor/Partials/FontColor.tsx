import { Editor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomColorPicker from '@/Components/ColorPicker';

interface Props {
    editor: Editor;
}

const PRESET_COLORS = [
    { name: 'Primary', color: '#d0bcff' },
    { name: 'Secondary', color: '#4cd7f6' },
    { name: 'Tertiary', color: '#fbabff' },
    { name: 'Accent', color: '#ffb86c' },
    { name: 'Surface Variant', color: '#cbc3d7' },
    { name: 'Error', color: '#ffb4ab' },
];

export default function FontColor({ editor }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [lastColor, setLastColor] = useState('#ffffff');
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

    const handleSelectColor = (color: string, shouldClose = true) => {
        setLastColor(color);
        if (shouldClose) {
            editor.chain().focus().setColor(color).run();
            setIsOpen(false);
        } else {
            editor.chain().setColor(color).run();
        }
    };

    const currentColor = editor.getAttributes('textStyle').color || 'currentColor';

    return (
        <div className="relative inline-flex items-center" ref={dropdownRef}>
            <div className="flex items-center border border-admin-outline-variant/30 rounded-md bg-admin-surface-container-lowest shadow-sm overflow-hidden h-9">
                {/* LEFT BUTTON: Apply current "lastColor" */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => editor.chain().focus().setColor(lastColor).run()}
                    className="flex items-center justify-center w-10 h-full hover:bg-admin-surface-container-high transition-colors border-r border-admin-outline-variant/30 rounded-l-sm"
                    title={`Apply ${lastColor}`}
                >
                    <div className="relative flex items-center justify-center h-full w-full">
                        <Palette size={16} className="text-admin-on-surface-variant" />
                        <div
                            className="absolute bottom-1.5 left-2.5 right-2.5 h-[3px] rounded-full shadow-sm"
                            style={{ backgroundColor: lastColor }}
                        />
                    </div>
                </motion.button>

                {/* RIGHT BUTTON: Open Menu */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-7 h-full transition-colors rounded-r-sm ${
                        isOpen
                            ? 'bg-admin-surface-container-highest'
                            : 'hover:bg-admin-surface-container-high'
                    }`}
                    title="Color Options"
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={12} className={isOpen ? 'text-admin-on-surface' : 'text-admin-on-surface-variant'} />
                    </motion.div>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-56 bg-admin-surface-container border border-admin-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-admin-on-surface-variant tracking-widest">
                                    Text Color
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run();
                                        setLastColor('#ffffff');
                                        setIsOpen(false);
                                    }}
                                    className="p-1.5 hover:bg-admin-surface-container-high rounded text-admin-on-surface-variant hover:text-admin-on-surface transition-colors focus:outline-none"
                                    title="Reset to default"
                                >
                                    <RotateCcw size={14} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="grid grid-cols-6 gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        title={preset.name}
                                        onClick={() => handleSelectColor(preset.color)}
                                        className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 focus:outline-none ${
                                            lastColor === preset.color
                                                ? 'border-admin-on-surface ring-2 ring-admin-on-surface/30'
                                                : 'border-admin-outline-variant/30 shadow-sm'
                                        }`}
                                        style={{ backgroundColor: preset.color }}
                                    />
                                ))}
                            </div>

                            <hr className="border-admin-outline-variant/20" />

                            <CustomColorPicker
                                color={lastColor}
                                onChange={(newColor) => handleSelectColor(newColor, false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
