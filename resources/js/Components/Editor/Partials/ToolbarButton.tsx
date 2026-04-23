import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { isMarkActiveStrict } from '../Hooks/useActiveState';

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
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <Icon size={18} strokeWidth={2.5} />
        </motion.button>
    );
}
