import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import { all, createLowlight } from 'lowlight';
import axios from 'axios';

// Extensions
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image';

// Components
import FontColor from './Partials/FontColor';
import BoldButton from './Partials/BoldButton';
import ItalicButton from './Partials/ItalicButton';
import UnderlineButton from './Partials/UnderlineButton';
import StrikeButton from './Partials/StrikeButton';
import LinkButton from './Partials/LinkButton';
import CodeBlockButton from './Partials/CodeBlockButton';
import InlineCodeButton from './Partials/InlineCodeButton';

interface Props {
    content: any;
    onChange: (json: any) => void;
}

const lowlight = createLowlight(all);

const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(route('image.upload'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.url;
};

export default function TextEditor({ content, onChange }: Props) {
    const contentRef = useRef(content);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const hasInitialized = useRef(false);

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
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link text-blue-500 underline',
                },
                linkOnPaste: true,
                autolink: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
            Code.configure({
                HTMLAttributes: {
                    class: 'inline-code bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-[0.9em]',
                },
            }),
            Image.configure({
                HTMLAttributes: { class: 'editor-image' },
            }).extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        'data-master-id': {
                            default: null,
                        },
                    }
                },
            }),
        ],
        content: content || '<p></p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    const isImage = file.type.startsWith('image/');

                    if (isImage) {
                        uploadFile(file).then(url => {
                            const { schema } = view.state;
                            const node = schema.nodes.image.create({ src: url });
                            const transaction = view.state.tr.replaceSelectionWith(node);
                            view.dispatch(transaction);
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            uploadFile(file).then(url => {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            });
                            return true;
                        }
                    }
                }
                return false;
            },
            handleDOMEvents: {
                keydown: (view, event) => {
                    if (event.target instanceof HTMLInputElement) return true;
                    return false;
                },
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            contentRef.current = json;

            onChange(json);
        },
    });

    useEffect(() => {
        if (editor && content && !hasInitialized.current) {
            editor.commands.setContent(content, { emitUpdate: false });
            hasInitialized.current = true;
        }
    }, [editor, content]);

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

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Code */}
                <CodeBlockButton editor={editor} />
                <InlineCodeButton editor={editor} />

            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
