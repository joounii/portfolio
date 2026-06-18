import { Editor } from '@tiptap/react';
import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

interface Props {
    editor: Editor;
}

interface HoverState {
    visible: boolean;
    type: 'row' | 'column' | null;
    top: number;
    left: number;
    width: number;
    height: number;
    targetIndex: number;
}

export default function TableHoverControls({ editor }: Props) {
    const [hover, setHover] = useState<HoverState>({
        visible: false,
        type: null,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        targetIndex: 0,
    });

    const activeTableRef = useRef<HTMLTableElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!editor || !editor.isActive('table')) {
                if (hover.visible) setHover(prev => ({ ...prev, visible: false }));
                return;
            }

            // Find the closest table element under the cursor position
            const target = e.target as HTMLElement;
            const cell = target.closest('td, th') as HTMLElement;
            const table = target.closest('table') as HTMLTableElement;

            if (!cell || !table) {
                // Keep the indicator visible if hovering directly over the button itself
                if (target.closest('.table-insert-trigger')) return;

                setHover(prev => ({ ...prev, visible: false }));
                activeTableRef.current = null;
                return;
            }

            activeTableRef.current = table;

            const cellRect = cell.getBoundingClientRect();
            const tableRect = table.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            const HIT_ZONE = 8; // Pixels from border to trigger lines

            // 1. Check Row Insert Boundaries (Top & Bottom edges)
            const isTopEdge = Math.abs(e.clientY - cellRect.top) <= HIT_ZONE;
            const isBottomEdge = Math.abs(e.clientY - cellRect.bottom) <= HIT_ZONE;

            if (isTopEdge || isBottomEdge) {
                const tr = cell.parentElement as HTMLTableRowElement;
                const rowsArray = Array.from(table.querySelectorAll('tr'));
                let targetRowIndex = rowsArray.indexOf(tr);

                // ADJUSTMENT: Subtract 1 or 2 pixels from the bottom boundary line calculation
                // to compensate for collapsed table borders and alignment metrics
                let targetY = isTopEdge ? (cellRect.top - 8) : (cellRect.bottom - 8);

                if (isBottomEdge) targetRowIndex += 1;

                if (targetRowIndex === 0) return;

                setHover({
                    visible: true,
                    type: 'row',
                    top: targetY + scrollY,
                    left: tableRect.left + scrollX,
                    width: tableRect.width,
                    height: 0,
                    targetIndex: targetRowIndex,
                });
                return;
            }

            // 2. Check Column Insert Boundaries (Left & Right edges)
            const isLeftEdge = Math.abs(e.clientX - cellRect.left) <= HIT_ZONE;
            const isRightEdge = Math.abs(e.clientX - cellRect.right) <= HIT_ZONE;

            if (isLeftEdge || isRightEdge) {
                const tr = cell.parentElement as HTMLTableRowElement;
                const cellsArray = Array.from(tr.querySelectorAll('td, th'));
                let targetColIndex = cellsArray.indexOf(cell);

                let targetX = isLeftEdge ? cellRect.left : cellRect.right;

                if (isRightEdge) targetColIndex += 1;

                if (targetColIndex === 0) return;

                setHover({
                    visible: true,
                    type: 'column',
                    top: tableRect.top + scrollY,
                    left: targetX + scrollX,
                    width: 0,
                    height: tableRect.height,
                    targetIndex: targetColIndex,
                });
                return;
            }

            // Clear state if mouse moves back to cell centers
            setHover(prev => ({ ...prev, visible: false }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [editor, hover.visible]);

    const executeInsertion = () => {
        if (!activeTableRef.current) return;

        editor.commands.focus();

        if (hover.type === 'row') {
            // Find a cell inside the row preceding our insert point to establish focus index context
            const rows = activeTableRef.current.querySelectorAll('tr');
            const relativeRow = rows[hover.targetIndex - 1];
            const sampleCell = relativeRow?.querySelector('td, th') as HTMLElement;

            if (sampleCell) {
                const pos = editor.view.posAtDOM(sampleCell, 0);
                editor.chain().setTextSelection(pos).addRowAfter().run();
            }
        } else if (hover.type === 'column') {
            const firstRow = activeTableRef.current.querySelector('tr');
            const cells = firstRow?.querySelectorAll('td, th');
            const relativeCell = cells?.[hover.targetIndex - 1] as HTMLElement;

            if (relativeCell) {
                const pos = editor.view.posAtDOM(relativeCell, 0);
                editor.chain().setTextSelection(pos).addColumnAfter().run();
            }
        }

        setHover(prev => ({ ...prev, visible: false }));
    };

    if (!hover.visible || !hover.type) return null;

    return (
        <div
            className="table-insert-trigger absolute z-40 pointer-events-none group"
            style={{
                top: hover.top,
                left: hover.left,
                width: hover.type === 'row' ? hover.width : undefined,
                height: hover.type === 'column' ? hover.height : undefined,
            }}
        >
            {/* The Insertion Interactive Line Overlays */}
            {hover.type === 'row' ? (
                <div className="relative w-full h-[2px] bg-secondary flex items-center">
                    <button
                        type="button"
                        onClick={executeInsertion}
                        className="absolute -left-3 w-5 h-5 rounded-full border border-secondary bg-surface text-secondary hover:bg-secondary hover:text-on-secondary flex items-center justify-center shadow-lg pointer-events-auto transition-all cursor-pointer hover:scale-110 active:scale-95"
                    >
                        <Plus size={12} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className="relative h-full w-[2px] bg-secondary flex justify-center">
                    <button
                        type="button"
                        onClick={executeInsertion}
                        className="absolute -top-3 w-5 h-5 rounded-full border border-secondary bg-surface text-secondary hover:bg-secondary hover:text-on-secondary flex items-center justify-center shadow-lg pointer-events-auto transition-all cursor-pointer hover:scale-110 active:scale-95"
                    >
                        <Plus size={12} strokeWidth={3} />
                    </button>
                </div>
            )}
        </div>
    );
}
