import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code, Mail, Network, MessageSquare,
    ExternalLink, Copy, Check
} from 'lucide-react';

interface ContactNode {
    label: string;
    value: string;
    icon: any;
    color: string;
    href?: string;
    copyValue?: string;
}

export default function ContactGrid() {
    const [copiedValue, setCopiedValue] = useState<string | null>(null);

    const nodes: ContactNode[] = [
        { label: 'SOURCE_CONTROL', value: 'GITHUB', icon: Code, color: 'text-secondary', href: "https://github.com/joounii" },
        { label: 'DIRECT_MAIL', value: 'EMAIL_CLIENT', icon: Mail, color: 'text-tertiary', copyValue: 'jonifu06@gmail.com' },
        { label: 'B2B_PROTOCOL', value: 'LINKEDIN', icon: Network, color: 'text-primary', href: "https://linkedin.com/in/jonathan-furrer-632733252" },
        { label: 'VOIP_NODE', value: 'DISCORD', icon: MessageSquare, color: 'text-secondary', copyValue: 'joounii' },
    ];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedValue(text);
        setTimeout(() => setCopiedValue(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node, i) => {
                const isCopied = copiedValue === node.copyValue;
                const isLink = !!node.href;

                const Wrapper = isLink ? 'a' : 'button';
                const wrapperProps = isLink
                    ? { href: node.href, target: "_blank", rel: "noopener noreferrer" }
                    : { onClick: () => node.copyValue && handleCopy(node.copyValue) };

                return (
                    <motion.div
                        key={node.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Wrapper
                            {...wrapperProps}
                            className="group relative w-full text-left block bg-surface-container-low p-8 h-40 hover:bg-surface-container-high transition-all duration-300 border border-outline-variant/10 rounded overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <node.icon className={`${node.color} transition-transform group-hover:scale-110`} size={20} />
                                <div className="text-on-surface-variant">
                                    {isLink ? (
                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 relative">
                                <AnimatePresence mode="wait">
                                    {isCopied ? (
                                        <motion.div
                                            key="copied"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="font-mono text-[10px] text-green-500 uppercase"
                                        >
                                            Status: Copied_to_clipboard
                                        </motion.div>
                                    ) : (
                                        <div className={`font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter transition-opacity duration-300 ${!isLink ? 'group-hover:opacity-0' : ''}`}>
                                            {node.label}
                                        </div>
                                    )}
                                </AnimatePresence>

                                <div className={`font-headline font-bold text-on-surface text-lg transition-transform duration-300 ${(!isLink && !isCopied) ? 'group-hover:-translate-y-4' : ''}`}>
                                    {node.value}
                                </div>

                                {!isLink && node.copyValue && !isCopied && (
                                    <div className="absolute top-6 left-0 font-mono text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        {node.copyValue}
                                    </div>
                                )}
                            </div>
                        </Wrapper>
                    </motion.div>
                );
            })}
        </div>
    );
}
