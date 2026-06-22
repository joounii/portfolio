import { HexColorPicker } from "react-colorful";

interface Props {
    color: string;
    onChange: (color: string) => void;
}

export default function CustomColorPicker({ color, onChange }: Props) {
    return (
        <div className="custom-color-picker space-y-4">
            <HexColorPicker
                color={color}
                onChange={onChange}
                onMouseDown={(e) => e.stopPropagation()}
                className="!w-full !h-40"
            />

            {/* Hex Input field */}
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded border border-admin-outline-variant/40 shadow-inner shrink-0"
                    style={{ backgroundColor: color }}
                />
                <input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => onChange(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="#000000"
                    className="w-full font-mono text-xs bg-admin-surface-container-lowest border border-admin-outline-variant/50 text-admin-on-surface placeholder:text-admin-on-surface-variant/40 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary transition-all"
                />
            </div>
        </div>
    );
}
