import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { AlignLeft, AlignCenter, AlignRight, Subtitles, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    editor: Editor;
}

export default function ImageMenu({ editor }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [captionText, setCaptionText] = useState('');

    const currentCaption = editor.getAttributes('image').caption || '';

    useEffect(() => {
        setCaptionText(currentCaption);
    }, [currentCaption, editor.state.selection]);

    const saveCaption = () => {
        editor.chain().focus().updateAttributes('image', { caption: captionText }).run();
        setIsMenuOpen(false);
    };

    return (
        <BubbleMenu
            editor={editor}
            getReferencedVirtualElement={() => {
                const { state, view } = editor;
                const { from } = state.selection;

                const node = view.nodeDOM(from) as HTMLElement;

                if (node) {
                    const hasCaption = !!editor.getAttributes('image').caption;
                    const container = node.querySelector('[data-drag-handle]') as HTMLElement;
                    const img = node.querySelector('img');

                    // If a caption exists, anchor to the full container (img + caption)
                    // so the menu clears the text if forced below. Otherwise, stay tight to the img.
                    const targetElement = (hasCaption && container) ? container : (img || node);

                    return {
                        getBoundingClientRect: () => targetElement.getBoundingClientRect(),
                        contextElement: targetElement,
                    };
                }

                return null;
            }}
            options={{
                placement: 'top',
                strategy: 'absolute',
            }}
            shouldShow={({ editor: currentEditor }: { editor: Editor }) => {
                if (!currentEditor) return false;
                return currentEditor.isActive('image');
            }}
        >
            <div
                data-tiptap-bubble-menu
                className="flex flex-col gap-2 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl backdrop-blur-sm transition-all max-w-sm"
            >
                {/* Primary Toolbar Controls */}
                <div className="flex items-center gap-1.5">
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

                    <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-0.5" />

                    {/* Toggle Caption Drawer */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isMenuOpen || currentCaption
                                ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title="Toggle Image Caption"
                    >
                        <Subtitles size={16} />
                    </button>
                </div>

                {/* Inline Popup Edit Panel */}
                {isMenuOpen && (
                    <div className="flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-1.5 mt-0.5 px-0.5">
                        <input
                            type="text"
                            value={captionText}
                            onChange={(e) => setCaptionText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveCaption();
                                }
                            }}
                            placeholder="Type caption description..."
                            className="flex-1 text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-purple-500 transition-colors"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={saveCaption}
                            className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Check size={14} />
                        </button>
                    </div>
                )}
            </div>
        </BubbleMenu>
    );
}
