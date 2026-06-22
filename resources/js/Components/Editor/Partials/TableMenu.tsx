import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Trash2, Heading, Columns, Rows } from 'lucide-react';
import { findParentNode } from '@tiptap/core';

interface Props {
    editor: Editor;
}

export default function TableMenu({ editor }: Props) {
    return (
        <BubbleMenu
            editor={editor}
            pluginKey="unique-table-bubble-menu"
            updateDelay={0}
            options={{
                placement: 'top',
                strategy: 'absolute',
                offset: 10,
            }}
            getReferencedVirtualElement={() => {
                let actualTable: HTMLTableElement | null = null;

                const domSelection = window.getSelection();
                if (domSelection && domSelection.rangeCount > 0) {
                    const container = domSelection.getRangeAt(0).commonAncestorContainer;

                    const element = container.nodeType === 3
                        ? container.parentElement
                        : (container as HTMLElement);

                    actualTable = element?.closest('table') || null;
                }

                if (!actualTable) {
                    const { view, state } = editor;
                    const parentTable = findParentNode((node) => node.type.name === 'table')(state.selection);

                    if (parentTable) {
                        const nodeDOM = view.nodeDOM(parentTable.pos) as HTMLElement;
                        actualTable = nodeDOM?.querySelector('table') || nodeDOM?.closest('table') || null;
                    }
                }

                if (actualTable) {
                    return {
                        getBoundingClientRect: () => actualTable!.getBoundingClientRect(),
                        contextElement: actualTable,
                    };
                }

                return {
                    getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
                } as any;
            }}
            shouldShow={({ editor: currentEditor }) => {
                if (!currentEditor || currentEditor.isDestroyed) return false;
                return currentEditor.isActive('table');
            }}
        >
            <div
                data-tiptap-bubble-menu
                className="flex items-center p-1.5 bg-admin-surface-container/95 border border-admin-outline-variant/30 rounded-xl shadow-2xl backdrop-blur-md transition-all text-[11px] uppercase tracking-wider text-admin-on-surface-variant font-bold select-none"
            >
                {/* Toggle Header Row */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                    className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-admin-surface-container-high hover:text-admin-primary rounded-lg transition-colors focus:outline-none"
                    title="Toggle Header Row"
                >
                    <Heading size={14} strokeWidth={2.5} />
                    <span>Header</span>
                </button>

                <div className="w-px h-4 bg-admin-outline-variant/30 mx-1.5" />

                {/* Delete Row & Column Section */}
                <div className="flex items-center bg-admin-surface-container-lowest/50 border border-admin-outline-variant/20 rounded-lg px-1 py-0.5 gap-0.5">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-admin-on-surface-variant/50 font-black ml-1.5 mr-1">
                        DEL
                    </span>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        className="p-1.5 hover:bg-admin-surface-container-high hover:text-admin-error rounded-md transition-colors focus:outline-none"
                        title="Delete Row"
                    >
                        <Rows size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        className="p-1.5 hover:bg-admin-surface-container-high hover:text-admin-error rounded-md transition-colors focus:outline-none"
                        title="Delete Column"
                    >
                        <Columns size={14} />
                    </button>
                </div>

                <div className="w-px h-4 bg-admin-outline-variant/30 ml-3 mr-1.5" />

                {/* Delete Full Table (Danger Zone) */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    className="p-2 hover:bg-admin-error/10 text-admin-error rounded-lg transition-colors focus:outline-none"
                    title="Purge Entire Table"
                >
                    <Trash2 size={15} strokeWidth={2.5} />
                </button>
            </div>
        </BubbleMenu>
    );
}
