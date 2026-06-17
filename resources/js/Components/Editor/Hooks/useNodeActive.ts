import { Editor } from '@tiptap/react';

export const isNodeActive = (editor: Editor, nodeType: string, attrs = {}) => {
    if (!editor || !editor.state) return false;

    return editor.isActive(nodeType, attrs);
};
