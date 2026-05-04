import { Editor } from '@tiptap/react';
import { CodeXml } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export default function CodeBlockButton({ editor }: { editor: Editor }) {
    return (
        <ToolbarButton
            editor={editor}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
            icon={CodeXml}
        />
    );
}
