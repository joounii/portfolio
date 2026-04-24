import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect, useRef, useState } from 'react';
import InputLabel from '@/Components/InputLabel';

// Extensions
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// Components
import FontColor from './Partials/FontColor';
import BoldButton from './Partials/BoldButton';
import ItalicButton from './Partials/ItalicButton';
import UnderlineButton from './Partials/UnderlineButton';
import StrikeButton from './Partials/StrikeButton';
import LinkButton from './Partials/LinkButton';

interface Props {
    content: any;
    onChange: (json: any) => void;
}

export default function TextEditor({ content, onChange }: Props) {
    const contentRef = useRef(content);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    // Monitor Ctrl/Cmd key for the "Link Mode" toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Control' || e.metaKey) setIsCtrlPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Control' || e.metaKey) setIsCtrlPressed(false);
        };
        const handleBlur = () => setIsCtrlPressed(false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            Link.configure({
                openOnClick: false, // Handled by our CSS/Ctrl toggle
                HTMLAttributes: {
                    class: 'editor-link text-blue-500 underline',
                },
                linkOnPaste: true,
                autolink: true,
            }),
        ],
        content: content || '<p></p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700',
            },
            handleDOMEvents: {
                keydown: (view, event) => {
                    // Prevent editor shortcuts from firing when typing in popups/inputs
                    if (event.target instanceof HTMLInputElement) return true;
                    return false;
                },
            },
        },
        onUpdate: ({ editor }) => {
            // Debounced update to prevent Inertia lag
            const timer = setTimeout(() => {
                onChange(editor.getJSON());
            }, 300);
            return () => clearTimeout(timer);
        },
    });

    // Synchronize external content changes
    useEffect(() => {
        if (editor && content !== contentRef.current) {
            contentRef.current = content;
            if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
                editor.commands.setContent(content, { emitUpdate: false });
            }
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={`space-y-2 ${isCtrlPressed ? 'is-linking' : ''}`}>
            <InputLabel value="Documentation Content" />

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md sticky top-0 z-10">

                {/* Formatting Group */}
                <div className="flex items-center gap-1">
                    <BoldButton editor={editor} />
                    <ItalicButton editor={editor} />
                    <UnderlineButton editor={editor} />
                    <StrikeButton editor={editor} />
                </div>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Link Tool */}
                <LinkButton editor={editor} />

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Color Tool */}
                <FontColor editor={editor} />
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
