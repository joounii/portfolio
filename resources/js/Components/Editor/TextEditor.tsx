import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
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
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

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
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageNodeView from './Partials/ImageNodeView';
import TableSelector from './Partials/TableSelector';
import TableHoverControls from './Partials/TableHoverControls';
import TableMenu from './Partials/TableMenu';

interface Props {
    content: any;
    onChange: (json: any, isExplicitSave?: boolean) => void;
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

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-6 space-y-1 text-admin-on-surface-variant',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-6 space-y-1 text-admin-on-surface-variant',
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
                        class: 'text-admin-on-surface tracking-tight font-bold block',
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
                        1: 'text-3xl font-bold tracking-tight text-admin-on-surface block mt-8 mb-4',
                        2: 'text-2xl font-semibold tracking-tight text-admin-on-surface block mt-6 mb-3',
                        3: 'text-xl font-medium tracking-tight text-admin-on-surface block mt-5 mb-2',
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
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full my-6 border-collapse table-fixed clear-both border border-admin-outline-variant/30 rounded',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border-b border-admin-outline-variant/30 last:border-0',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-admin-outline-variant/30 p-3 font-bold bg-admin-surface-container-high text-admin-on-surface text-left align-top box-border relative',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-admin-outline-variant/30 p-3 min-w-[60px] text-left align-top box-border relative text-admin-on-surface-variant focus:outline-none focus:bg-admin-surface-container-highest/20 transition-colors',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link text-admin-primary underline hover:text-admin-primary-container transition-colors',
                },
                linkOnPaste: true,
                autolink: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
                HTMLAttributes: {
                    class: 'bg-admin-surface-container-highest text-admin-on-surface p-4 rounded-lg font-mono text-sm border border-admin-outline-variant/20 overflow-x-auto my-4',
                }
            }),
            Code.configure({
                HTMLAttributes: {
                    class: 'bg-admin-surface-container-highest text-admin-accent px-1.5 py-0.5 rounded font-mono text-sm border border-admin-outline-variant/20'
                },
            }),
            Image.configure({
                HTMLAttributes: { class: 'editor-image transition-all duration-200 shadow-md rounded border border-admin-outline-variant/20' },
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
                        caption: {
                            default: '',
                            parseHTML: element => element.getAttribute('data-caption') || element.getAttribute('alt') || '',
                            renderHTML: attributes => {
                                if (!attributes.caption) return {};
                                return { 'data-caption': attributes.caption };
                            },
                        },
                    }
                },

                addNodeView() {
                    return ReactNodeViewRenderer(ImageNodeView);
                },

                renderHTML({ node, HTMLAttributes }) {
                    const align = node.attrs.alignment || 'center';
                    const alignClasses: Record<string, string> = {
                        left: 'mr-auto ml-0 block clear-both mt-4 mb-1',
                        center: 'mx-auto block clear-both mt-4 mb-1',
                        right: 'ml-auto mr-0 block clear-both mt-4 mb-1',
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
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-8 bg-admin-surface-container-lowest rounded-b-xl border border-t-0 border-admin-outline-variant/30 text-admin-on-surface-variant flow-root prose-img:clear-both prose-p:leading-relaxed prose-strong:text-admin-on-surface',
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Control' || e.metaKey) setIsCtrlPressed(true);

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();

                if (editor) {
                    const currentJson = editor.getJSON();
                    onChange(currentJson, true);
                }
            }
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
    }, [editor, onChange]);

    if (!editor) return null;

    return (
        <div className={`flex flex-col ${isCtrlPressed ? 'is-linking' : ''}`}>

            <div className="flex flex-wrap items-center gap-3 p-2.5 bg-admin-surface-container-low/90 backdrop-blur-md border border-admin-outline-variant/30 border-b-0 rounded-t-xl sticky top-0 z-40 shadow-sm">

                {/* Group 1: Semantics */}
                <div className="flex items-center p-1 bg-admin-surface-container-lowest border border-admin-outline-variant/20 rounded-lg shadow-inner">
                    <HeadingSelector editor={editor} />
                </div>

                {/* Group 2: Typography */}
                <div className="flex items-center gap-0.5 p-1 bg-admin-surface-container-lowest border border-admin-outline-variant/20 rounded-lg shadow-inner">
                    <BoldButton editor={editor} />
                    <ItalicButton editor={editor} />
                    <UnderlineButton editor={editor} />
                    <StrikeButton editor={editor} />
                </div>

                {/* Group 3: Formatting & Links */}
                <div className="flex items-center gap-0.5 p-1 bg-admin-surface-container-lowest border border-admin-outline-variant/20 rounded-lg shadow-inner">
                    <LinkButton editor={editor} />
                    <FontColor editor={editor} />
                </div>

                {/* Group 4: Code & Dev */}
                <div className="flex items-center gap-0.5 p-1 bg-admin-surface-container-lowest border border-admin-outline-variant/20 rounded-lg shadow-inner">
                    <InlineCodeButton editor={editor} />
                    <CodeBlockButton editor={editor} />
                </div>

                {/* Group 5: Lists & Structure */}
                <div className="flex items-center gap-0.5 p-1 bg-admin-surface-container-lowest border border-admin-outline-variant/20 rounded-lg shadow-inner ml-auto sm:ml-0">
                    <BulletListButton editor={editor} />
                    <OrderedListButton editor={editor} />
                    <div className="w-px h-5 bg-admin-outline-variant/30 mx-1" />
                    <TableSelector editor={editor} />
                </div>

            </div>

            <ImageMenu editor={editor} />
            <TableMenu editor={editor} />
            <TableHoverControls editor={editor} />

            <EditorContent editor={editor} />
        </div>
    );
}
