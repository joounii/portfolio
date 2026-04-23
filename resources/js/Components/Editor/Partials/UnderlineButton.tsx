import { Editor } from '@tiptap/react';
import { Underline as UnderlineIcon } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function UnderlineButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            mark="underline"
            title="Underline (Ctrl+U)"
            icon={UnderlineIcon}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
        />
    );
}
