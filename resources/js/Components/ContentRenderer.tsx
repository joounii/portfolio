import React from 'react';

interface Node {
    type: string;
    text?: string;
    attrs?: Record<string, any>;
    marks?: { type: string; attrs?: any }[];
    content?: Node[];
}

export default function ContentRenderer({ json }: { json: any }) {
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
                const Level = `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements;
                const headingClasses: Record<number, string> = {
                    1: 'text-3xl font-bold mb-6',
                    2: 'text-2xl font-semibold mb-4',
                    3: 'text-xl font-medium mb-3',
                };
                return <Level key={index} className={headingClasses[node.attrs?.level]}>{children}</Level>;
            case 'bulletList':
                return <ul key={index} className="list-disc ml-6 mb-4">{children}</ul>;
            case 'orderedList':
                return <ol key={index} className="list-decimal ml-6 mb-4">{children}</ol>;
            case 'listItem':
                return <li key={index}>{children}</li>;
            case 'horizontalRule':
                return <hr key={index} className="my-8 border-t border-gray-200 dark:border-gray-700" />;
            case 'hardBreak':
                return <br key={index} />;
            default:
                return <div key={index}>{children}</div>;
        }
    };

    return (
        <div className="content-renderer prose dark:prose-invert max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
            {json.content.map((block: Node, index: number) => renderNode(block, index))}
        </div>
    );
}
