import { Editor } from '@tiptap/react';

export const isMarkActiveStrict = (editor: Editor, markType: string) => {
    if (!editor || !editor.state) return false;

    const { from, to, empty } = editor.state.selection;

    // --- CURSOR ---
    if (empty) {
        const stored = editor.state.storedMarks?.some(m => m.type.name === markType);
        if (stored !== undefined) return stored;

        if (from <= 1) return false;
        return editor.state.doc.rangeHasMark(from - 1, from, editor.schema.marks[markType]);
    }

    // --- SELECTION (Range) ---
    return editor.isActive(markType);
};
