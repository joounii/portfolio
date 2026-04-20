import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import InputLabel from '@/Components/InputLabel';
import { useEffect } from 'react';

interface Props {
    content: any;
    onChange: (json: any) => void;
}

export default function PageEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
        ],
        content: content || '<p>Start typing documentation...</p>',
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!editor) return null;

    return (
        <div className="space-y-2">
            <InputLabel value="Documentation Content" />

            {/* Simple Toolbar for Color */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md">
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                    title="Font Color"
                />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-gray-700 dark:text-gray-200"
                >
                    Reset Color
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
