import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

export default function ImageNodeView({ node }: NodeViewProps) {
    const { src, alt, title, width, alignment, caption } = node.attrs;

    const isSvg = src?.toLowerCase().split(/[?#]/)[0].endsWith('.svg');

    const alignClasses: Record<string, string> = {
        left: 'mr-auto ml-0 block clear-both mt-4 mb-1',
        center: 'mx-auto block clear-both mt-4 mb-1',
        right: 'ml-auto mr-0 block clear-both mt-4 mb-1',
    };

    return (
        <NodeViewWrapper
            className="w-full clear-both block"
            style={{ textAlign: alignment }}
        >
            <div
                data-drag-handle
                className="inline-block relative max-w-full group select-none"
                style={{ width: width }}
            >
                <img
                    src={src}
                    alt={alt || caption || ''}
                    title={title}
                    className={`h-auto max-w-full object-contain transition-all duration-200 ${
                        isSvg
                            ? ''
                            : 'rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm'
                    } ${alignClasses[alignment || 'center']}`}
                    style={{ width: '100%' }}
                />

                {caption && (
                    <div className="text-xs text-left text-gray-500 dark:text-gray-400 mt-2 italic font-medium leading-relaxed tracking-wide px-2 select-none pointer-events-none">
                        {caption}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
