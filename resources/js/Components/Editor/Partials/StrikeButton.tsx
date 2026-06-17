import { Editor } from '@tiptap/react';
import { Strikethrough } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function StrikeButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            mark="strike"
            title="Strikethrough"
            icon={Strikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
        />
    );
}
