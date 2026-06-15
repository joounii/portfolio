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
import Heading from '@tiptap/extension-heading';

// Components
import FontColor from './Partials/FontColor';
import BoldButton from './Partials/BoldButton';
import ItalicButton from './Partials/ItalicButton';
import UnderlineButton from './Partials/UnderlineButton';
import StrikeButton from './Partials/StrikeButton';
import LinkButton from './Partials/LinkButton';
import CodeBlockButton from './Partials/CodeBlockButton';
import InlineCodeButton from './Partials/InlineCodeButton';
import { BulletListButton, OrderedListButton } from './Partials/ListButton';
import HeadingSelector from './Partials/HeadingButton';
import ImageMenu from './Partials/ImageMenu';

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
    const [selectionKey, setSelectionKey] = useState(0);

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
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-6 space-y-1',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-6 space-y-1',
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: 'pl-1',
                    },
                },
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'text-gray-900 dark:text-white tracking-tight font-bold block',
                    },
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }).extend({
                renderHTML({ node, HTMLAttributes }) {
                    const hasLevel = this.options.levels.includes(node.attrs.level);
                    const level = hasLevel ? node.attrs.level : this.options.levels[0];

                    const classes: Record<number, string> = {
                        1: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white block mt-6 mb-3',
                        2: 'text-2xl font-semibold tracking-tight text-gray-900 dark:text-white block mt-5 mb-2',
                        3: 'text-xl font-medium tracking-tight text-gray-900 dark:text-white block mt-4 mb-2',
                    };

                    return [
                        `h${level}`,
                        {
                            ...HTMLAttributes,
                            class: `${HTMLAttributes.class || ''} ${classes[level]}`.trim()
                        },
                        0
                    ];
                },
            }),
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
                    class: 'editor-image transition-all duration-200'
                },
            }),
            Image.configure({
                HTMLAttributes: { class: 'editor-image transition-all duration-200' },
            }).extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        'data-master-id': {
                            default: null,
                            parseHTML: element => element.getAttribute('data-master-id'),
                            renderHTML: attributes => {
                                if (!attributes['data-master-id']) return {};
                                return { 'data-master-id': attributes['data-master-id'] };
                            }
                        },
                        width: {
                            default: '100%',
                            parseHTML: element => element.style.width || element.getAttribute('width'),
                            renderHTML: attributes => ({
                                style: `width: ${attributes.width}`,
                            }),
                        },
                        alignment: {
                            default: 'center',
                            parseHTML: element => element.getAttribute('data-alignment'),
                            renderHTML: attributes => ({
                                'data-alignment': attributes.alignment,
                            }),
                        },
                    }
                },
                renderHTML({ node, HTMLAttributes }) {
                    const align = node.attrs.alignment || 'center';
                    const alignClasses: Record<string, string> = {
                        left: 'mr-auto ml-0 block float-left mr-4 my-2',
                        center: 'mx-auto block clear-both my-4',
                        right: 'ml-auto mr-0 block float-right ml-4 my-2',
                    };

                    return [
                        'img',
                        {
                            ...HTMLAttributes,
                            class: `${HTMLAttributes.class || ''} ${alignClasses[align]}`.trim()
                        }
                    ];
                }
            }),
        ],
        content: content || '<p></p>',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-b-md border border-gray-300 dark:border-gray-700 flow-root prose-img:clear-both',
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
        onSelectionUpdate: () => {
            setSelectionKey(prev => prev + 1);
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

                {/* Block Selection */}
                <HeadingSelector editor={editor} />

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

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

                {/* List Group */}
                <div className="flex items-center gap-1">
                    <BulletListButton editor={editor} />
                    <OrderedListButton editor={editor} />
                </div>

            </div>

            <ImageMenu editor={editor} />

            <EditorContent editor={editor} />
        </div>
    );
}
