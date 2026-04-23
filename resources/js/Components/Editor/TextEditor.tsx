import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect, useRef } from 'react';
import InputLabel from '@/Components/InputLabel';
import FontColor from './Partials/FontColor';
import BoldButton from './Partials/BoldButton';
import ItalicButton from './Partials/ItalicButton';
import UnderlineButton from './Partials/UnderlineButton';
import StrikeButton from './Partials/StrikeButton';
import Underline from '@tiptap/extension-underline';

interface Props {
    content: any;
    onChange: (json: any) => void;
}

export default function TextEditor({ content, onChange }: Props) {
    const contentRef = useRef(content);

    const editor = useEditor({
        extensions: [StarterKit, TextStyle, Color, Underline],
        content: content || '<p></p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700',
            },
        },
        onUpdate: ({ editor }) => {
            const timer = setTimeout(() => {
                onChange(editor.getJSON());
            }, 300);

            return () => clearTimeout(timer);
        },
    });

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
        <div className="space-y-2">
            <InputLabel value="Documentation Content" />

            {/* Main Toolbar Container */}
            <div className="flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md sticky top-0 z-10">

                {/* Text Formatting Group */}
                <div className="flex items-center gap-1">
                    <BoldButton editor={editor} />
                    <ItalicButton editor={editor} />
                    <UnderlineButton editor={editor} />
                    <StrikeButton editor={editor} />
                </div>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Color Group */}
                <FontColor editor={editor} />

            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
