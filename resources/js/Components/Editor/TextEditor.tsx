import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import InputLabel from '@/Components/InputLabel';
import FontColor from './Partials/FontColor';

interface Props {
    content: any;
    onChange: (json: any) => void;
}

export default function TextEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [StarterKit, TextStyle, Color],
        editorProps: {
            handleDOMEvents: {
                keydown: (view, event) => {
                    if (event.target instanceof HTMLInputElement) {
                        return true;
                    }
                    return false;
                },
            },
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700',
            },
        },
        content: content || '<p>Start typing documentation...</p>',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!editor) return null;

    return (
        <div className="space-y-2">
            <InputLabel value="Documentation Content" />

            {/* Main Toolbar Container */}
            <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md">
                <FontColor editor={editor} />
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
