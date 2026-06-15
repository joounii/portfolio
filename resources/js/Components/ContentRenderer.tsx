import React from 'react';
import { all, createLowlight } from 'lowlight';

interface Node {
    type: string;
    text?: string;
    attrs?: Record<string, any>;
    marks?: { type: string; attrs?: any }[];
    content?: Node[];
}

const lowlight = createLowlight(all);

const renderLowlightNodes = (nodes: any[]): string => {
    return nodes
        .map((node) => {
            if (node.type === 'text') {
                return node.value
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }
            if (node.type === 'element') {
                const classes = node.properties?.className?.join(' ') || '';
                const content = renderLowlightNodes(node.children);
                return `<span class="${classes}">${content}</span>`;
            }
            return '';
        })
        .join('');
};

let renderingSlugs: Record<string, number> = {};

export default function ContentRenderer({ json }: { json: any }) {

    renderingSlugs = {};

    if (!json || !json.content) return null;

    const renderNode = (node: Node, index: number): React.ReactNode => {
        if (node.type === 'text') {
            let element: React.ReactNode = node.text;
            let textStyle: React.CSSProperties = {};

            node.marks?.forEach((mark, i) => {
                switch (mark.type) {
                    case 'bold':
                        element = <strong key={i}>{element}</strong>;
                        break;
                    case 'italic':
                        element = <em key={i}>{element}</em>;
                        break;
                    case 'underline':
                        element = <u key={i} style={{ textDecorationColor: 'inherit' }}>{element}</u>;
                        break;
                    case 'strike':
                        element = <s key={i} style={{ textDecorationColor: 'inherit' }}>{element}</s>;
                        break;
                    case 'link':
                        element = (
                            <a
                                key={i}
                                href={mark.attrs?.href}
                                target={mark.attrs?.target || '_blank'}
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {element}
                            </a>
                        );
                        break;
                    case 'textStyle':
                        if (mark.attrs?.color) {
                            textStyle.color = mark.attrs.color;
                        }
                        break;
                    case 'code':
                        element = (
                            <code key={i} className="bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-[0.9em] border border-gray-200 dark:border-gray-700 before:content-[''] after:content-['']">
                                {element}
                            </code>
                        );
                        break;
                }
            });

            return (
                <span key={index} style={textStyle}>
                    {element}
                </span>
            );
        }

        const children = node.content?.map((child, i) => renderNode(child, i));

        switch (node.type) {
            case 'paragraph':
                return <p key={index} className="mb-4 last:mb-0 leading-relaxed">{children}</p>;

            case 'heading':
                const rawLevel = node.attrs?.level;
                const level = (rawLevel === 1 || rawLevel === 2 || rawLevel === 3) ? rawLevel : 1;
                const Level = `h${level}` as keyof JSX.IntrinsicElements;

                const headingText = node.content?.map((c: any) => c.text).join('') || 'section';

                let baseId = headingText
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                if (!baseId) baseId = 'section';

                let uniqueHeadingId = baseId;

                if (renderingSlugs[baseId] !== undefined) {
                    renderingSlugs[baseId]++;
                    uniqueHeadingId = `${baseId}-${renderingSlugs[baseId]}`;
                } else {
                    renderingSlugs[baseId] = 0;
                }

                const headingClasses: Record<1 | 2 | 3, string> = {
                    1: 'text-3xl font-bold mt-8 mb-4 tracking-tight text-gray-900 dark:text-white first:mt-0 clear-both scroll-mt-32',
                    2: 'text-2xl font-semibold mt-6 mb-3 tracking-tight text-gray-900 dark:text-white clear-both scroll-mt-32',
                    3: 'text-xl font-medium mt-5 mb-2 tracking-tight text-gray-900 dark:text-white clear-both scroll-mt-32',
                };

                return (
                    <Level
                        key={index}
                        id={uniqueHeadingId}
                        className={headingClasses[level as 1 | 2 | 3]}
                    >
                        {children}
                    </Level>
                );

            case 'bulletList':
                return <ul key={index} className="list-disc ml-6 mb-4 space-y-1">{children}</ul>;
            case 'orderedList':
                return <ol key={index} className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>;
            case 'listItem':
                return <li key={index} className="pl-1">{children}</li>;
            case 'horizontalRule':
                return <hr key={index} className="my-8 border-t border-gray-200 dark:border-gray-700" />;
            case 'hardBreak':
                return <br key={index} />;

            case 'codeBlock':
                const lang = node.attrs?.language || 'javascript';
                const codeContent = node.content?.[0]?.text || '';
                const highlighted = lowlight.highlight(lang, codeContent);

                return (
                    <pre key={index} className="rounded-lg p-4 bg-gray-900 overflow-x-auto my-6 border border-gray-800">
                        <code
                            className={`language-${lang} hljs`}
                            dangerouslySetInnerHTML={{
                                __html: renderLowlightNodes(highlighted.children)
                            }}
                        />
                    </pre>
                );

            case 'image':
                const align = node.attrs?.alignment || 'center';
                const width = node.attrs?.width || '100%';

                const containerClasses: Record<string, string> = {
                    left: 'flex justify-start float-left mr-4 my-2 w-full',
                    center: 'flex justify-center mx-auto clear-both my-4 w-full',
                    right: 'flex justify-end float-right ml-4 my-2 w-full',
                };

                return (
                    <div
                        key={index}
                        className={containerClasses[align]}
                    >
                        <img
                            src={node.attrs?.src}
                            alt={node.attrs?.alt || ''}
                            title={node.attrs?.title}
                            style={{ width: width }}
                            className="rounded-lg border border-gray-200 dark:border-gray-800 h-auto max-w-full object-contain shadow-sm"
                        />
                    </div>
                );

            default:
                return <div key={index}>{children}</div>;
        }
    };

    return (
        <div className="content-renderer prose dark:prose-invert max-w-none">
            {json.content.map((block: Node, index: number) => renderNode(block, index))}
        </div>
    );
}
