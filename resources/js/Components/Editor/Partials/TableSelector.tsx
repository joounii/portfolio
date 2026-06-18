import { Editor } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { Grid, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    editor: Editor;
}

// Defining a comfortable standard 6x6 viewport matrix size for the picker layout
const MAX_COLS = 6;
const MAX_ROWS = 6;

export default function TableSelector({ editor }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredGrid, setHoveredGrid] = useState({ rows: 0, cols: 0 });
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

    const handleGridHover = (row: number, col: number) => {
        setHoveredGrid({ rows: row, cols: col });
    };

    const handleCreateTable = (rows: number, cols: number) => {
        if (rows > 0 && cols > 0) {
            editor
                .chain()
                .focus()
                .insertTable({ rows: rows, cols: cols, withHeaderRow: false })
                .run();
            setIsOpen(false);
            setHoveredGrid({ rows: 0, cols: 0 });
        }
    };

    return (
        <div className="relative inline-flex items-center" ref={dropdownRef}>
            <div className="flex items-center border border-outline-variant bg-surface rounded-md shadow-sm overflow-hidden h-9">
                {/* Trigger Button */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-1.5 px-3 h-full transition-colors rounded-sm ${
                        isOpen ? 'bg-surface-container-highest' : 'hover:bg-surface-container-high'
                    }`}
                    title="Insert Table"
                >
                    <Grid size={16} className="text-on-surface-variant" />
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                    >
                        <ChevronDown size={12} className="text-outline" />
                    </motion.div>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 p-3.5 bg-surface-container border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden select-none"
                    >
                        <div className="space-y-3">
                            {/* Matrix Label Header */}
                            <div className="flex items-center justify-between min-w-[170px]">
                                <span className="text-[10px] uppercase font-bold text-outline tracking-widest">
                                    {hoveredGrid.rows > 0 && hoveredGrid.cols > 0
                                        ? `${hoveredGrid.cols}x${hoveredGrid.rows} Tabelle`
                                        : 'Tabelle einfügen'}
                                </span>
                            </div>

                            {/* Interactive 2D Grid Block */}
                            <div
                                className="flex flex-col gap-1 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/30"
                                onMouseLeave={() => setHoveredGrid({ rows: 0, cols: 0 })}
                            >
                                {Array.from({ length: MAX_ROWS }).map((_, rowIndex) => {
                                    const currentRow = rowIndex + 1;
                                    return (
                                        <div key={rowIndex} className="flex gap-1">
                                            {Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                                                const currentCol = colIndex + 1;
                                                const isHighlighted =
                                                    currentRow <= hoveredGrid.rows &&
                                                    currentCol <= hoveredGrid.cols;

                                                return (
                                                    <button
                                                        key={colIndex}
                                                        type="button"
                                                        onMouseEnter={() => handleGridHover(currentRow, currentCol)}
                                                        onClick={() => handleCreateTable(currentRow, currentCol)}
                                                        className={`w-6 h-6 rounded transition-all duration-150 ${
                                                            isHighlighted
                                                                ? 'bg-accent-container border border-accent ring-2 ring-accent/20 scale-[1.04]'
                                                                : 'bg-surface-container-highest border border-outline-variant/30 hover:bg-surface-container-high'
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
