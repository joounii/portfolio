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
                                className="text-secondary transition-all duration-200 underline decoration-secondary/20 hover:decoration-secondary underline-offset-4 font-medium inline-block"
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
                            <code
                                key={i}
                                className="bg-surface-container-high/60 text-secondary border border-outline-variant/20 px-1.5 py-0.5 rounded font-mono text-[0.85em] mx-0.5 tracking-normal before:content-[''] after:content-[''] inline-block"
                            >
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
                    1: 'text-3xl font-bold mt-10 mb-4 tracking-tight text-on-surface border-b border-outline-variant/10 pb-2 first:mt-0 clear-both scroll-mt-32 font-headline uppercase',
                    2: 'text-2xl font-semibold mt-8 mb-3 tracking-wide text-on-surface first:mt-0 clear-both scroll-mt-32 font-headline',
                    3: 'text-xl font-medium mt-6 mb-2 tracking-wide text-on-surface first:mt-0 clear-both scroll-mt-32 font-headline opacity-90',
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

            case 'table':
                return (
                    <div key={index} className="my-8 w-full overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm custom-scrollbar nav-scrollbar">
                        <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                            <tbody className="divide-y divide-outline-variant/90">
                                {children}
                            </tbody>
                        </table>
                    </div>
                );

            case 'tableRow':
                return (
                    <tr key={index} className="divide-x divide-outline-variant/90 hover:bg-surface-container-low/50 transition-colors">
                        {children}
                    </tr>
                );

            case 'tableHeader':
                return (
                    <th
                        key={index}
                        colSpan={node.attrs?.colspan}
                        rowSpan={node.attrs?.rowspan}
                        className="bg-surface-container-high/50 px-4 py-3 font-semibold text-on-surface align-top font-headline tracking-wide border-b-2 border-outline-variant/90"
                        style={{ width: node.attrs?.colwidth ? `${node.attrs.colwidth[0]}px` : undefined }}
                    >
                        {children}
                    </th>
                );

            case 'tableCell':
                return (
                    <td
                        key={index}
                        colSpan={node.attrs?.colspan}
                        rowSpan={node.attrs?.rowspan}
                        className="px-4 py-3 align-top text-on-surface-variant"
                        style={{ width: node.attrs?.colwidth ? `${node.attrs.colwidth[0]}px` : undefined }}
                    >
                        {children}
                    </td>
                );

            case 'codeBlock':
                const lang = node.attrs?.language || 'javascript';
                const codeContent = node.content?.[0]?.text || '';
                const highlighted = lowlight.highlight(lang, codeContent);

                return (
                    <div key={index} className="bg-surface-container-low p-6 rounded border border-outline-variant/10 w-full my-6 shadow-sm overflow-hidden block">

                        {/* Terminal Window look */}
                        <div className="flex items-center gap-2 mb-4 select-none pointer-events-none">
                            <div className="w-3 h-3 rounded-full bg-error/40"></div>
                            <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                            <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                            <div className="ml-auto font-mono text-[9px] text-outline-variant uppercase tracking-widest px-1.5 opacity-60">
                                {lang}
                            </div>
                        </div>

                        {/* Dynamic Syntax Renderer */}
                        <pre className="overflow-x-auto bg-transparent p-0 m-0 border-0 custom-scrollbar nav-scrollbar">
                            <code
                                className={`language-${lang} hljs font-mono text-sm text-on-surface-variant block leading-relaxed`}
                                dangerouslySetInnerHTML={{
                                    __html: renderLowlightNodes(highlighted.children)
                                }}
                            />
                        </pre>
                    </div>
                );

            case 'image':
                const align = node.attrs?.alignment || 'center';
                const width = node.attrs?.width || '100%';
                const src = node.attrs?.src || '';
                const caption = node.attrs?.caption || '';

                const isSvg = src.toLowerCase().split(/[?#]/)[0].endsWith('.svg');

                const containerClasses: Record<string, string> = {
                    left: 'flex flex-col items-start justify-start mx-0 mr-auto clear-both my-4 w-full block',
                    center: 'flex flex-col items-center justify-center mx-auto clear-both my-4 w-full block',
                    right: 'flex flex-col items-end justify-end mx-0 ml-auto clear-both my-4 w-full block',
                };

                return (
                    <figure
                        key={index}
                        className={containerClasses[align]}
                        style={{ width: width }}
                    >
                        <img
                            src={src}
                            alt={node.attrs?.alt || caption || ''}
                            title={node.attrs?.title}
                            className={`h-auto max-w-full object-contain ${
                                isSvg
                                    ? ''
                                    : 'rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm'
                            }`}
                            style={{ width: '100%' }}
                        />
                        {caption && (
                            <figcaption className="text-xs text-left w-full text-gray-500 dark:text-gray-400 mt-2 italic font-medium leading-relaxed tracking-wide px-1 max-w-xl">
                                {caption}
                            </figcaption>
                        )}
                    </figure>
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
