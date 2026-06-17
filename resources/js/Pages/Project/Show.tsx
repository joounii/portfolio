import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, ShieldAlert, List } from 'lucide-react';
import ContentRenderer from '@/Components/ContentRenderer';
import { useEffect, useState } from 'react';

interface Props {
    project: any;
}

interface TocItem {
    text: string;
    level: number;
    id: string;
}

const parseHeadings = (content: any): TocItem[] => {
    if (!content || !content.content) return [];

    // Maintain a temporary map index to count seen heading names
    const seenSlugs: Record<string, number> = {};

    return content.content
        .filter((block: any) => block.type === 'heading')
        .map((heading: any) => {
            const text = heading.content?.map((c: any) => c.text).join('') || 'Untitled Section';

            // Base URL-safe string conversion
            let baseSlug = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Fallback for empty headers or completely special characters
            if (!baseSlug) baseSlug = 'section';

            let uniqueId = baseSlug;

            // Collision Resolution Check Loop
            if (seenSlugs[baseSlug] !== undefined) {
                seenSlugs[baseSlug]++;
                uniqueId = `${baseSlug}-${seenSlugs[baseSlug]}`;
            } else {
                seenSlugs[baseSlug] = 0; // First time seeing this string title name
            }

            return {
                text,
                level: heading.attrs?.level || 1,
                id: uniqueId,
            };
        });
};

export default function Show({ project }: Props) {
    const [activeId, setActiveId] = useState<string>('');
    const tocItems = parseHeadings(project.active_page?.content);

    useEffect(() => {
        if (tocItems.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting);
                if (visibleEntries.length > 0) {
                    setActiveId(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: '-10% 0px -75% 0px',
                threshold: 0.1
            }
        );

        tocItems.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [project.active_page]);

    const scrollToAnchor = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveId(id);
        }
    };

    return (
        <MainLayout>
            <Head title={`${project.title} // SYSTEM_DOSSIER`} />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/projects"
                        className="group inline-flex items-center gap-2 text-outline hover:text-primary transition-colors font-mono text-[10px] tracking-[0.3em] uppercase"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETURN_TO_INDEX
                    </Link>
                </motion.div>

                {/* Header */}
                <header className="mb-20 border-l-2 border-primary/20 pl-8 md:pl-12">
                    <div className="font-mono text-secondary text-sm tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={14} /> {project.custom_id} // {project.status}
                    </div>
                    <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-8 uppercase italic">
                        {project.title.replace('_', ' ')}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] px-3 py-1 bg-surface-container-highest text-secondary rounded border border-outline-variant/10 uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="w-full h-full block" style={{ overflow: 'visible' }}>
                    {project.active_page ? (

                        /* STATE A: Documentation exists -> Render your full dual-column engineering split grid */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                            {/* Sticky Nav Menu Side */}
                            <aside className="lg:col-span-4 sticky top-28 self-start hidden lg:block">
                                <div className="border border-outline-variant/10 bg-surface-container-low/30 backdrop-blur-md rounded-xl p-6 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar nav-scrollbar">
                                    <div className="font-mono text-[10px] text-outline mb-6 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-outline-variant/10 pb-3">
                                        <List size={12} className="text-primary" /> DOSSIER_INDEX
                                    </div>
                                    <nav className="space-y-1">
                                        {tocItems.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => scrollToAnchor(item.id)}
                                                className={`w-full text-left font-mono text-xs uppercase tracking-wider py-2 px-3 rounded-lg transition-all border block ${
                                                    activeId === item.id
                                                        ? 'bg-primary/5 text-primary border-primary/20 pl-5 font-semibold shadow-sm'
                                                        : 'text-outline border-transparent hover:text-secondary hover:bg-surface-container-high/40 hover:pl-4'
                                                }`}
                                                style={{
                                                    paddingLeft: item.level === 2 ? (activeId === item.id ? '1.75rem' : '1.5rem') : item.level === 3 ? (activeId === item.id ? '2.5rem' : '2.25rem') : undefined
                                                }}
                                            >
                                                <span className={`mr-1.5 transition-colors ${activeId === item.id ? 'opacity-100 text-primary' : 'opacity-20 text-outline'}`}>#</span>
                                                {item.text}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </aside>

                            {/* Main Content Render Side */}
                            <main className="lg:col-span-8">
                                <div className="font-mono text-[10px] text-primary/30 mb-10 tracking-[0.4em] uppercase flex items-center gap-4">
                                    <div className="h-px flex-grow bg-primary/10"></div>
                                    DATA_STREAM_START
                                    <div className="h-px flex-grow bg-primary/10"></div>
                                </div>

                                <div className="min-h-[400px] text-on-surface-variant font-light text-lg">
                                    <ContentRenderer json={project.active_page.content} />
                                </div>

                                <div className="font-mono text-[10px] text-primary/30 mt-20 tracking-[0.4em] uppercase flex items-center gap-4">
                                    <div className="h-px flex-grow bg-primary/10"></div>
                                    DATA_STREAM_END
                                    <div className="h-px flex-grow bg-primary/10"></div>
                                </div>
                            </main>
                        </div>

                    ) : (

                        /* STATE B: No active page -> Render a full-width, perfectly centered layout container hero card */
                        <div className="max-w-4xl mx-auto py-24 px-8 border border-outline-variant/10 bg-surface-container-low/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">

                            {/* Background decorative grid pattern */}
                            <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />

                            {/* INTEGRATED BADGE & PULSE TERMINAL NODE:
                                We merge the pulsing dot directly inside the pill badge container.
                                We also switch the color theme from amber (accent) to your secondary cyan/teal color scheme.
                            */}
                            <div className="inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-secondary border border-secondary/15 bg-secondary/5 px-3 py-1.5 rounded-full mb-6 uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary/40 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                </span>
                                STATUS_LOG // COMPILING_DATA
                            </div>

                            {/* Clean, high-contrast headline using your secondary system accent color */}
                            <h3 className="font-headline text-2xl md:text-3xl font-bold text-secondary uppercase tracking-wide mb-4 italic">
                                Documentation Under Construction
                            </h3>

                            {/* Completely clear, highly readable body copy using your exact 'on-surface-variant' token */}
                            <p className="text-on-surface-variant max-w-lg text-sm md:text-base leading-relaxed font-sans font-light">
                                Hey there! I am currently writing and structuring the detailed documentation for this project. Everything will be completely live as soon as it's ready.<br/> Please check back in a later moment.
                            </p>

                            {/* Muted design token tracker string */}
                            <div className="mt-10 font-mono text-[9px] text-outline-variant uppercase tracking-[0.2em] opacity-60">
                                SYS_REF: INDETERMINATE_STREAM_INITIALIZATION
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
