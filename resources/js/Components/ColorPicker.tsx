import { HexColorPicker } from "react-colorful";
import { Input } from '@/Components/tiptap-ui-primitive/input';
import { motion } from "framer-motion";

interface Props {
    color: string;
    onChange: (color: string) => void;
}

export default function CustomColorPicker({ color, onChange }: Props) {
    return (
        <div className="custom-color-picker p-2 space-y-3">
            <HexColorPicker
                color={color}
                onChange={onChange}
                onMouseDown={(e) => e.stopPropagation()}
                className="!w-full !h-40"
            />

            {/* Hex Input field */}
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700 shadow-inner"
                    style={{ backgroundColor: color }}
                />
                <Input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => onChange(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="#000000"
                    className="font-mono text-xs"
                />
            </div>
        </div>
    );
}
