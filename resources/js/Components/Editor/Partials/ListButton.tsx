import { Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import ToolbarNodeButton from './ToolbarNodeButton';

export function BulletListButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarNodeButton
            editor={editor}
            nodeType="bulletList"
            title="Bullet List"
            icon={List}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
    );
}

export function OrderedListButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarNodeButton
            editor={editor}
            nodeType="orderedList"
            title="Ordered List"
            icon={ListOrdered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
    );
}
