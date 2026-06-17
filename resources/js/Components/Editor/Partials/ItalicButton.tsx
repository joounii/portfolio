import { Editor } from '@tiptap/react';
import { Italic } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function ItalicButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            mark="italic"
            title="Italic (Ctrl+I)"
            icon={Italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
        />
    );
}
