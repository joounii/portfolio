import { Editor } from '@tiptap/react';
import { Bold } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function BoldButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            mark="bold"
            title="Bold (Ctrl+B)"
            icon={Bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
        />
    );
}
