import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { isMarkActiveStrict } from '../Hooks/useMarkActive';

interface Props {
    editor: Editor;
    onClick: () => void;
    mark?: string;
    disabled?: boolean;
    icon: LucideIcon;
    title: string;
}

export default function ToolbarButton({
    editor,
    onClick,
    mark,
    disabled = false,
    icon: Icon,
    title
}: Props) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const updateState = () => {
            if (mark) {
                setActive(isMarkActiveStrict(editor, mark));
            }
        };

        editor.on('transaction', updateState);

        updateState();

        return () => {
            editor.off('transaction', updateState);
        };
    }, [editor, mark]);

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2 rounded-md transition-all duration-200
                ${active
                    ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                    : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'}
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        </motion.button>
    );
}
