import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Trash2, Mail, Search, X, ChevronUp, ChevronDown, Star, StarOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Message {
    id: number;
    identifier_name: string;
    return_path_email: string;
    payload_message: string;
    is_read: boolean;
    is_starred: boolean;
    created_at: string;
}

interface Props {
    auth: any;
    messages: Message[];
    currentFilter?: string | null;
    currentStarFilter?: 'all' | 'only' | 'exclude'; // Added typed prop
    currentSearch?: string;
    currentSortBy?: string;
    currentSortDir?: 'asc' | 'desc';
}

export default function Inbox({
    auth,
    messages,
    currentFilter,
    currentStarFilter = 'all',
    currentSearch = '',
    currentSortBy = 'received',
    currentSortDir = 'desc'
}: Props) {
    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch]);

    const deleteMessage = (id: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(route('contact.destroy', id));
        }
    };

    const toggleStar = (id: number) => {
        router.patch(route('contact.toggle-star', id), {}, {
            preserveScroll: true,
            preserveState: true
        });
    };

    // Central parameter management adding 'starFilterValue' dependency
    const applyParameters = (
        filterValue: string | null,
        starFilterValue: 'all' | 'only' | 'exclude',
        searchValue: string,
        sortByValue: string,
        sortDirValue: 'asc' | 'desc'
    ) => {
        const params: Record<string, string> = {
            sort_by: sortByValue,
            sort_dir: sortDirValue,
            star_filter: starFilterValue
        };
        if (filterValue) params.filter = filterValue;
        if (searchValue.trim()) params.search = searchValue;

        router.get(route('admin.inbox'), params, {
            preserveState: true,
            replace: true
        });
    };

    // Cycles cleanly between: all -> only -> exclude -> all
    const handleCycleStarFilter = () => {
        let nextStarFilter: 'all' | 'only' | 'exclude' = 'all';
        if (currentStarFilter === 'all') nextStarFilter = 'only';
        else if (currentStarFilter === 'only') nextStarFilter = 'exclude';

        applyParameters(currentFilter || null, nextStarFilter, search, currentSortBy, currentSortDir);
    };

    const handleSort = (field: string) => {
        let nextDir: 'asc' | 'desc' = 'asc';
        if (currentSortBy === field) {
            nextDir = currentSortDir === 'asc' ? 'desc' : 'asc';
        } else {
            nextDir = field === 'received' ? 'desc' : 'asc';
        }
        applyParameters(currentFilter || null, currentStarFilter, search, field, nextDir);
    };

    const handleFilterChange = (filter: string | null) => {
        applyParameters(filter, currentStarFilter, search, currentSortBy, currentSortDir);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyParameters(currentFilter || null, currentStarFilter, search, currentSortBy, currentSortDir);
    };

    const clearSearch = () => {
        setSearch('');
        applyParameters(currentFilter || null, currentStarFilter, '', currentSortBy, currentSortDir);
    };

    const SortableHeader = ({ field, label }: { field: string, label: string }) => {
        const isActive = currentSortBy === field;
        return (
            <th
                onClick={() => handleSort(field)}
                className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30 cursor-pointer hover:text-admin-on-surface select-none transition-colors"
            >
                <div className="flex items-center gap-1">
                    <span>{label}</span>
                    <span className="inline-block text-admin-on-surface-variant/40">
                        {isActive ? (
                            currentSortDir === 'asc' ? <ChevronUp size={14} className="text-admin-primary" /> : <ChevronDown size={14} className="text-admin-primary" />
                        ) : (
                            <ChevronDown size={14} className="opacity-0 hover:opacity-100 transition-opacity" />
                        )}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Inbox" />
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Action Bar Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-admin-on-surface tracking-tight">
                                Message Inbox
                            </h2>
                            <p className="text-sm text-admin-on-surface-variant mt-1">
                                Review and manage incoming communications.
                            </p>
                        </div>

                        {/* Controls Toolbar Wrapper */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center h-9">
                                <Search size={16} className="absolute left-3 text-admin-on-surface-variant/60" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search messages..."
                                    className="pl-9 pr-8 h-full w-full sm:w-64 text-xs rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container text-admin-on-surface placeholder-admin-on-surface-variant/50 focus:outline-none focus:border-admin-primary transition-colors"
                                />
                                {search && (
                                    <button type="button" onClick={clearSearch} className="absolute right-2.5 text-admin-on-surface-variant/60 hover:text-admin-on-surface">
                                        <X size={14} />
                                    </button>
                                )}
                            </form>

                            {/* Status Segments Control */}
                            <div className="flex items-center h-9 gap-1 bg-admin-surface-container-low p-1 rounded-lg border border-admin-outline-variant/20">
                                <button
                                    onClick={() => handleFilterChange(null)}
                                    className={`px-3 h-full text-xs font-semibold rounded-md transition-colors ${!currentFilter ? 'bg-admin-surface text-admin-on-surface shadow-sm' : 'text-admin-on-surface-variant hover:text-admin-on-surface'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleFilterChange('unread')}
                                    className={`px-3 h-full text-xs font-semibold rounded-md transition-colors ${currentFilter === 'unread' ? 'bg-admin-surface text-admin-on-surface shadow-sm' : 'text-admin-on-surface-variant hover:text-admin-on-surface'}`}
                                >
                                    Unread
                                </button>
                                <button
                                    onClick={() => handleFilterChange('read')}
                                    className={`px-3 h-full text-xs font-semibold rounded-md transition-colors ${currentFilter === 'read' ? 'bg-admin-surface text-admin-on-surface shadow-sm' : 'text-admin-on-surface-variant hover:text-admin-on-surface'}`}
                                >
                                    Read
                                </button>
                            </div>

                            {/* Star Toggle Action Button */}
                            <button
                                type="button"
                                onClick={handleCycleStarFilter}
                                className={`flex items-center justify-center h-9 gap-2 px-3 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                                    currentStarFilter === 'only'
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                        : currentStarFilter === 'exclude'
                                        ? 'bg-admin-error/10 text-admin-error border-admin-error/30'
                                        : 'bg-admin-surface-container-low text-admin-on-surface-variant border-admin-outline-variant/20 hover:text-admin-on-surface'
                                }`}
                            >
                                {currentStarFilter === 'only' && (
                                    <>
                                        <Star size={14} className="fill-amber-500 text-amber-500" />
                                        <span>Starred Only</span>
                                    </>
                                )}
                                {currentStarFilter === 'exclude' && (
                                    <>
                                        <StarOff size={14} />
                                        <span>No Starred</span>
                                    </>
                                )}
                                {currentStarFilter === 'all' && (
                                    <>
                                        <Star size={14} />
                                        <span>Stars: All</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Table Layout Markup Container */}
                    <div className="bg-admin-surface-container overflow-hidden shadow-sm sm:rounded-xl border border-admin-outline-variant/30">
                        <div className="p-0 text-admin-on-surface">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm divide-y divide-admin-outline-variant/20">
                                    <thead className="bg-admin-surface-container-low/50">
                                        <tr>
                                            <th className="w-12 border-b border-admin-outline-variant/30"></th>
                                            <SortableHeader field="received" label="Received" />
                                            <SortableHeader field="sender" label="Sender" />
                                            <SortableHeader field="email" label="Email" />
                                            <th className="px-6 py-4 text-left text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30 select-none">
                                                Message
                                            </th>
                                            <th className="px-6 py-4 text-right text-[11px] font-bold text-admin-on-surface-variant uppercase tracking-widest border-b border-admin-outline-variant/30 select-none">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-admin-outline-variant/20">
                                        {messages.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-admin-on-surface-variant">
                                                        <Mail size={48} className="mb-4 opacity-20" />
                                                        <p className="text-sm tracking-wide">
                                                            {search ? 'No results match your search.' : 'No messages in the buffer.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            messages.map((msg) => (
                                                <tr key={msg.id} className={`hover:bg-admin-surface-container-highest transition-colors group ${!msg.is_read ? 'bg-admin-surface-container-high/30' : ''}`}>
                                                    <td className="pl-6 py-4 whitespace-nowrap text-center">
                                                        <button
                                                            onClick={() => toggleStar(msg.id)}
                                                            className="text-admin-on-surface-variant/40 hover:text-amber-500 transition-colors focus:outline-none"
                                                            title={msg.is_starred ? "Unstar Message" : "Star Message"}
                                                        >
                                                            <Star
                                                                size={16}
                                                                className={msg.is_starred ? "fill-amber-500 text-amber-500 transform scale-110" : "hover:scale-110 transition-transform"}
                                                            />
                                                        </button>
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                                        {new Date(msg.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {!msg.is_read && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-admin-primary shadow-[0_0_6px_rgba(255,140,0,0.8)]"></span>
                                                            )}
                                                            <a href={route('admin.contact.show', msg.id)} className={`text-sm tracking-wide hover:underline ${!msg.is_read ? 'font-bold text-admin-on-surface' : 'font-semibold text-admin-on-surface/80'}`}>
                                                                {msg.identifier_name}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-admin-on-surface-variant group-hover:text-admin-on-surface transition-colors">
                                                        {msg.return_path_email}
                                                    </td>
                                                    <td className="max-w-xs truncate px-6 py-4 italic text-admin-on-surface-variant/70 text-sm">
                                                        {msg.payload_message}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end">
                                                            <button onClick={() => deleteMessage(msg.id)} className="text-admin-on-surface-variant hover:text-admin-error transition-colors" title="Delete Message">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
