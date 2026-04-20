import { Editor } from '@tiptap/react';

interface Props {
    editor: Editor;
}

export default function FontColor({ editor }: Props) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                onInput={(event) =>
                    editor
                        .chain()
                        .focus()
                        .setColor((event.target as HTMLInputElement).value)
                        .run()
                }
                // Check the current color at the cursor position
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                title="Font Color"
            />
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
                Reset Color
            </button>
        </div>
    );
}
