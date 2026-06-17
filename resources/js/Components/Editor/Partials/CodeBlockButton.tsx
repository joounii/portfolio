import { Editor } from '@tiptap/react';
import { CodeXml } from 'lucide-react';
import ToolbarNodeButton from './ToolbarNodeButton';
import { isNodeActive } from '../Hooks/useNodeActive';
import { useState, useEffect } from 'react';

export default function CodeBlockButton({ editor }: { editor: Editor }) {
    const [selectedLang, setSelectedLang] = useState('javascript');
    const isActive = isNodeActive(editor, 'codeBlock');

    useEffect(() => {
        const updateLang = () => {
            if (editor.isActive('codeBlock')) {
                const lang = editor.getAttributes('codeBlock').language;
                if (lang) setSelectedLang(lang);
            }
        };

        editor.on('transaction', updateLang);
        return () => {
            editor.off('transaction', updateLang);
        };
    }, [editor]);

    const handleToggle = () => {
        editor.chain().focus().toggleCodeBlock({ language: selectedLang }).run();
    };

    const handleLangChange = (newLang: string) => {
        setSelectedLang(newLang);

        if (isActive) {
            editor.chain().focus().updateAttributes('codeBlock', { language: newLang }).run();
        }
    };

    return (
        <div className="flex items-center gap-1">
            <ToolbarNodeButton
                editor={editor}
                nodeType="codeBlock"
                title="Code Block"
                icon={CodeXml}
                onClick={handleToggle}
            />

            <select
                className="text-[10px] bg-gray-200 dark:bg-gray-700 border-none rounded px-2 py-1 uppercase font-bold text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer h-[34px]"
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
            >
                <option value="javascript">Javascript</option>
                <option value="typescript">Typescript</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="json">JSON</option>
                <option value="bash">Bash</option>
            </select>
        </div>
    );
}
