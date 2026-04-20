import React from 'react';

interface Node {
    type: string;
    text?: string;
    marks?: { type: string; attrs?: any }[];
    content?: Node[];
}

export default function ContentRenderer({ json }: { json: any }) {
    if (!json || !json.content) return null;

    const renderNode = (node: Node, index: number) => {
        if (node.type === 'text') {
            const style: React.CSSProperties = {};

            const colorMark = node.marks?.find(m => m.type === 'textStyle');
            if (colorMark?.attrs?.color) {
                style.color = colorMark.attrs.color;
            }

            return <span key={index} style={style}>{node.text}</span>;
        }

        if (node.content) {
            const children = node.content.map((child, i) => renderNode(child, i));

            if (node.type === 'paragraph') {
                return <div key={index} className="mb-6">{children}</div>;
            }

            return <div key={index}>{children}</div>;
        }

        return null;
    };

    return (
        <div className="content-renderer">
            {json.content.map((block: Node, index: number) => renderNode(block, index))}
        </div>
    );
}
