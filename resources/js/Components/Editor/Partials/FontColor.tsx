import { Editor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { Palette, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomColorPicker from '@/Components/ColorPicker';

interface Props {
    editor: Editor;
}

const PRESET_COLORS = [
    { name: 'Red', color: '#ef4444' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Gray', color: '#6b7280' },
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
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 shadow-sm overflow-hidden h-9">
                {/* LEFT BUTTON: Apply current "lastColor" */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => editor.chain().focus().setColor(lastColor).run()}
                    className="flex items-center justify-center w-10 h-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-r border-gray-300 dark:border-gray-600 rounded-l-sm"
                    title={`Apply ${lastColor}`}
                >
                    <div className="relative">
                        <Palette size={16} className="text-gray-600 dark:text-gray-300" />
                        <div
                            className="absolute -bottom-1 left-0 w-full h-1 rounded-full"
                            style={{ backgroundColor: lastColor }}
                        />
                    </div>
                </motion.button>

                {/* RIGHT BUTTON: Open Menu */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    // 'flex-1' or fixed width to ensure it fills the remaining half
                    className={`flex items-center justify-center w-7 h-full transition-colors rounded-r-sm ${
                        isOpen
                            ? 'bg-gray-200 dark:bg-gray-700'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title="Color Options"
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={12} className="text-gray-400" />
                    </motion.div>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-3 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Text Color</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run();
                                        setIsOpen(false);
                                    }}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500"
                                >
                                    <RotateCcw size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-6 gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => handleSelectColor(preset.color)}
                                        className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                                            lastColor === preset.color ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-black/5'
                                        }`}
                                        style={{ backgroundColor: preset.color }}
                                    />
                                ))}
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800" />

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
