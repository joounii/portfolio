import { Editor } from '@tiptap/react';
import { Code } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function InlineCodeButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            mark="code"
            title="Inline Code"
            icon={Code}
            onClick={() => editor.chain().focus().toggleCode().run()}
        />
    );
}
