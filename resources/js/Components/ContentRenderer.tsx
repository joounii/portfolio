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

            node.marks?.forEach((mark, i) => {
                switch (mark.type) {
                    case 'bold':
                        element = <strong key={i}>{element}</strong>;
                        break;
                    case 'italic':
                        element = <em key={i}>{element}</em>;
                        break;
                    case 'strike':
                        element = <s key={i}>{element}</s>;
                        break;
                    case 'link':
                        element = (
                            <a
                                key={i}
                                href={mark.attrs?.href}
                                target={mark.attrs?.target}
                                className="text-blue-500 underline"
                            >
                                {element}
                            </a>
                        );
                        break;
                    case 'textStyle':
                        if (mark.attrs?.color) {
                            element = (
                                <span key={i} style={{ color: mark.attrs.color }}>
                                    {element}
                                </span>
                            );
                        }
                        break;
                }
            });
            return <React.Fragment key={index}>{element}</React.Fragment>;
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
                // Fallback for unknown nodes
                return <div key={index}>{children}</div>;
        }
    };

    return (
        <div className="content-renderer prose dark:prose-invert max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
            {json.content.map((block: Node, index: number) => renderNode(block, index))}
        </div>
    );
}
