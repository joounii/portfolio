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
    insertPosition: 'before' | 'after' | null;
    targetPos: number | null;
}

export default function TableHoverControls({ editor }: Props) {
    const [hover, setHover] = useState<HoverState>({
        visible: false,
        type: null,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        insertPosition: null,
        targetPos: null,
    });

    const activeTableRef = useRef<HTMLTableElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!editor || !editor.isActive('table')) {
                if (hover.visible) setHover(prev => ({ ...prev, visible: false }));
                return;
            }

            const target = e.target as HTMLElement;
            const cell = target.closest('td, th') as HTMLElement;
            const table = target.closest('table') as HTMLTableElement;

            if (!cell || !table) {
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

            const HIT_ZONE = 8;

            const tr = cell.parentElement as HTMLTableRowElement;
            const rowsArray = Array.from(table.querySelectorAll('tr'));
            const cellsArray = Array.from(tr.querySelectorAll('td, th'));

            const isFirstColumnCell = cellsArray.indexOf(cell) === 0;
            const isFirstRowCell = rowsArray.indexOf(tr) === 0;

            const cellPos = editor.view.posAtDOM(cell, 0);

            if (isFirstColumnCell) {
                const isTopEdge = Math.abs(e.clientY - cellRect.top) <= HIT_ZONE;
                const isBottomEdge = Math.abs(e.clientY - cellRect.bottom) <= HIT_ZONE;

                if (isTopEdge || isBottomEdge) {
                    let targetY = isTopEdge ? cellRect.top : cellRect.bottom;
                    let targetRowIndex = rowsArray.indexOf(tr);
                    if (isBottomEdge) targetRowIndex += 1;
                    if (targetRowIndex === 0) return;

                    setHover({
                        visible: true,
                        type: 'row',
                        top: targetY + scrollY,
                        left: tableRect.left + scrollX,
                        width: tableRect.width,
                        height: 0,
                        insertPosition: isTopEdge ? 'before' : 'after',
                        targetPos: cellPos,
                    });
                    return;
                }
            }

            if (isFirstRowCell) {
                const isLeftEdge = Math.abs(e.clientX - cellRect.left) <= HIT_ZONE;
                const isRightEdge = Math.abs(e.clientX - cellRect.right) <= HIT_ZONE;

                if (isLeftEdge || isRightEdge) {
                    let targetX = isLeftEdge ? cellRect.left : cellRect.right;
                    let targetColIndex = cellsArray.indexOf(cell);
                    if (isRightEdge) targetColIndex += 1;
                    if (targetColIndex === 0) return;

                    setHover({
                        visible: true,
                        type: 'column',
                        top: tableRect.top + scrollY,
                        left: targetX + scrollX,
                        width: 0,
                        height: tableRect.height,
                        insertPosition: isLeftEdge ? 'before' : 'after',
                        targetPos: cellPos,
                    });
                    return;
                }
            }

            setHover(prev => ({ ...prev, visible: false }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [editor, hover.visible]);

    const executeInsertion = () => {
        let chain = editor.chain().focus();

        if (hover.targetPos !== null) {
            chain = chain.setTextSelection(hover.targetPos);
        }

        if (hover.type === 'row') {
            if (hover.insertPosition === 'before') {
                chain.addRowBefore();
            } else {
                chain.addRowAfter();
            }
        } else if (hover.type === 'column') {
            if (hover.insertPosition === 'before') {
                chain.addColumnBefore();
            } else {
                chain.addColumnAfter();
            }
        }

        chain.run();

        setHover(prev => ({ ...prev, visible: false, insertPosition: null, targetPos: null }));
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
            {hover.type === 'row' ? (
                <div className="relative w-full h-[2px] bg-admin-primary flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={executeInsertion}
                        className="absolute -left-3 w-5 h-5 rounded-full border border-admin-primary bg-admin-surface-container-lowest text-admin-primary hover:bg-admin-primary hover:text-admin-on-primary flex items-center justify-center shadow-lg pointer-events-auto transition-all cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <Plus size={12} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className="relative h-full w-[2px] bg-admin-primary flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={executeInsertion}
                        className="absolute -top-3 w-5 h-5 rounded-full border border-admin-primary bg-admin-surface-container-lowest text-admin-primary hover:bg-admin-primary hover:text-admin-on-primary flex items-center justify-center shadow-lg pointer-events-auto transition-all cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <Plus size={12} strokeWidth={3} />
                    </button>
                </div>
            )}
        </div>
    );
}
