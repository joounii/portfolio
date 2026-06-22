import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { isNodeActive } from '../Hooks/useNodeActive'; // New specific hook

interface Props {
    editor: Editor;
    onClick: () => void;
    nodeType: string;
    icon: LucideIcon;
    title: string;
}

export default function ToolbarNodeButton({ editor, onClick, nodeType, icon: Icon, title }: Props) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const updateState = () => {
            setActive(isNodeActive(editor, nodeType));
        };

        editor.on('transaction', updateState);
        updateState();

        return () => {
            editor.off('transaction', updateState);
        };
    }, [editor, nodeType]);

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClick}
            title={title}
            className={`
                p-2 rounded-md transition-all duration-200 cursor-pointer
                ${active
                    ? 'bg-admin-primary/10 text-admin-primary shadow-sm'
                    : 'text-admin-on-surface-variant hover:bg-admin-surface-container-high hover:text-admin-on-surface'}
            `}
        >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        </motion.button>
    );
}
