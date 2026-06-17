// Components/Editor/Partials/ImageMenu.tsx
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface Props {
    editor: Editor;
}

export default function ImageMenu({ editor }: Props) {
    return (
        <BubbleMenu
            editor={editor}
            options={{
                placement: 'top',
                strategy: 'absolute',
            }}
            shouldShow={({ editor: currentEditor }) => {
                if (!currentEditor) return false;
                return currentEditor.isActive('image');
            }}
        >
            <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl backdrop-blur-sm">

                {/* Alignment Toggles */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'left' }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.getAttributes('image').alignment === 'left'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'center' }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.getAttributes('image').alignment === 'center'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'right' }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.getAttributes('image').alignment === 'right'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-0.5" />

                {/* Width Sizing Presets */}
                {(['25%', '50%', '75%', '100%'] as const).map((size) => (
                    <button
                        key={size}
                        type="button"
                        onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                        className={`px-2 py-1 text-xs font-mono font-bold rounded-md transition-colors ${
                            editor.getAttributes('image').width === size
                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </BubbleMenu>
    );
}
