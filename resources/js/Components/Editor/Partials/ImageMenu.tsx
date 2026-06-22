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
                offset: 10, // Explicit offset for Floating UI
            }}
            shouldShow={({ editor: currentEditor }: { editor: Editor }) => {
                if (!currentEditor) return false;
                return currentEditor.isActive('image');
            }}
        >
            <div
                data-tiptap-bubble-menu
                className="flex flex-col gap-2 p-1.5 bg-admin-surface-container/95 border border-admin-outline-variant/30 rounded-xl shadow-2xl backdrop-blur-md transition-all max-w-sm"
            >
                {/* Primary Toolbar Controls */}
                <div className="flex items-center gap-1.5">
                    {/* Alignment Toggles */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'left' }).run()}
                        className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            editor.getAttributes('image').alignment === 'left'
                                ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                                : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                        }`}
                        title="Align Left"
                    >
                        <AlignLeft size={16} strokeWidth={editor.getAttributes('image').alignment === 'left' ? 2.5 : 2} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'center' }).run()}
                        className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            editor.getAttributes('image').alignment === 'center'
                                ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                                : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                        }`}
                        title="Align Center"
                    >
                        <AlignCenter size={16} strokeWidth={editor.getAttributes('image').alignment === 'center' ? 2.5 : 2} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().updateAttributes('image', { alignment: 'right' }).run()}
                        className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            editor.getAttributes('image').alignment === 'right'
                                ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                                : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                        }`}
                        title="Align Right"
                    >
                        <AlignRight size={16} strokeWidth={editor.getAttributes('image').alignment === 'right' ? 2.5 : 2} />
                    </button>

                    <div className="w-px h-5 bg-admin-outline-variant/30 mx-0.5" />

                    {/* Width Sizing Presets */}
                    {(['25%', '50%', '75%', '100%'] as const).map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                            className={`px-2 py-1 text-xs font-mono font-bold rounded-md transition-colors focus:outline-none ${
                                editor.getAttributes('image').width === size
                                    ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                                    : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                            }`}
                        >
                            {size}
                        </button>
                    ))}

                    <div className="w-px h-5 bg-admin-outline-variant/30 mx-0.5" />

                    {/* Toggle Caption Drawer */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            isMenuOpen || currentCaption
                                ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                                : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'
                        }`}
                        title="Toggle Image Caption"
                    >
                        <Subtitles size={16} strokeWidth={isMenuOpen || currentCaption ? 2.5 : 2} />
                    </button>
                </div>

                {/* Inline Popup Edit Panel */}
                {isMenuOpen && (
                    <div className="flex items-center gap-2 border-t border-admin-outline-variant/20 pt-2 px-0.5 pb-0.5">
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
                            className="flex-1 font-mono text-xs bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-admin-primary focus:border-admin-primary transition-all"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={saveCaption}
                            className="p-1.5 bg-admin-primary hover:bg-admin-primary-container text-admin-on-primary rounded-md transition-colors shadow-sm focus:outline-none active:scale-95 border border-admin-primary"
                        >
                            <Check size={15} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </BubbleMenu>
    );
}
