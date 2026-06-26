import { useForm, router, usePage } from '@inertiajs/react';
import { Bell, BellOff, Trash2, X, Calendar, MessageSquare, ListTodo, Eye, EyeOff, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface Reminder {
    id: number;
    reminder_at: string;
    custom_message: string | null;
    is_sent: boolean;
}

interface ReminderWidgetProps {
    morphType: string;
    parentFieldId: number;
    reminders?: Reminder[];
}

export default function ReminderWidget({ morphType, parentFieldId, reminders = [] }: ReminderWidgetProps) {
    const { isDev } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPastReminders, setShowPastReminders] = useState(false);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const activeCount = reminders.filter(r => !r.is_sent).length;

    const displayedReminders = showPastReminders
        ? [...reminders].sort((a, b) => new Date(b.reminder_at).getTime() - new Date(a.reminder_at).getTime())
        : reminders.filter(r => !r.is_sent).sort((a, b) => new Date(a.reminder_at).getTime() - new Date(b.reminder_at).getTime());

    const { data, setData, reset, processing } = useForm({
        reminder_at: '',
        custom_message: '',
    });

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.reminder_at) return;

        const localDate = new Date(data.reminder_at);

        router.post(route('reminders.store', { type: morphType, id: parentFieldId }), {
            reminder_at: localDate.toISOString(),
            custom_message: data.custom_message || null
        }, {
            preserveScroll: true,
            onSuccess: () => reset('reminder_at', 'custom_message')
        });
    };

    const handleQuickPreset = (minutesToAdd: number) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + minutesToAdd * 60000);

        const displayString = futureDate.toLocaleString('sv-SE', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }).replace(' ', 'T');

        setData('reminder_at', displayString);
    };

    const handleDeleteReminder = (reminderId: number) => {
        if (confirm('Delete this reminder log track record permanently?')) {
            router.delete(route('reminders.destroy', reminderId), {
                preserveScroll: true
            });
        }
    };

    return (
        <div className="bg-admin-surface-container p-6 rounded-xl border border-admin-outline-variant/30 shadow-sm space-y-4">

            {/* Header Content Action Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-admin-primary" />
                    <h3 className="text-sm font-bold text-admin-on-surface tracking-wide uppercase">
                        Add Reminder
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-bold rounded-md bg-admin-surface-container-low border border-admin-outline-variant/20 text-admin-on-surface hover:bg-admin-surface transition-colors"
                >
                    <ListTodo size={12} />
                    <span>Manage ({activeCount})</span>
                </button>
            </div>

            {/* Form Stage Input Panel Area */}
            <form onSubmit={handleAddReminder} className="space-y-3">
                <div className="grid grid-cols-4 gap-1.5">
                    {isDev ? (
                        <button type="button" onClick={() => handleQuickPreset(1)} className="h-8 text-[11px] font-bold rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-colors">+1m</button>
                    ) : (
                        <button type="button" onClick={() => handleQuickPreset(15)} className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors">+15m</button>
                    )}
                    <button type="button" onClick={() => handleQuickPreset(60)} className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors">+1h</button>
                    <button type="button" onClick={() => handleQuickPreset(180)} className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors">+3h</button>
                    <button type="button" onClick={() => handleQuickPreset(1440)} className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface transition-colors">+1d</button>
                </div>

                <div className="flex items-stretch gap-2 h-9">
                    <input
                        type="datetime-local"
                        value={data.reminder_at}
                        min={new Date().toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(' ', 'T')}
                        onChange={(e) => setData('reminder_at', e.target.value)}
                        className="w-full flex-1 text-xs px-3 py-0 rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container-low text-admin-on-surface focus:outline-none focus:border-admin-primary focus:ring-0 transition-colors box-border"
                        required
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.reminder_at}
                        className="flex items-center justify-center px-4 text-xs font-bold rounded-lg border transition-all whitespace-nowrap
                            enabled:border-admin-primary/40 enabled:bg-admin-primary/5 enabled:text-admin-primary enabled:hover:bg-admin-primary/10 enabled:hover:opacity-90
                            disabled:border-admin-outline-variant/20 disabled:bg-admin-surface-container-low disabled:text-admin-on-surface-variant/40"
                    >
                        Save
                    </button>
                </div>

                <div className="relative flex flex-col gap-1">
                    <div className="absolute left-3 top-2.5 text-admin-on-surface-variant/40 pointer-events-none">
                        <MessageSquare size={14} />
                    </div>
                    <textarea
                        value={data.custom_message}
                        onChange={(e) => setData('custom_message', e.target.value)}
                        placeholder="Add dynamic custom notification text description note (Optional)..."
                        maxLength={500}
                        className="w-full h-16 pl-9 pr-3 py-2 text-xs rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container-low text-admin-on-surface placeholder-admin-on-surface-variant/40 focus:outline-none focus:border-admin-primary transition-all resize-none"
                    />
                </div>
            </form>

            {/* --- MODAL MANAGEMENT OVERLAY LIST VIEW --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-admin-surface-container border border-admin-outline-variant/30 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-admin-outline-variant/20 bg-admin-surface-container-low/60 gap-3">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-admin-primary" />
                                <h3 className="text-md font-bold text-admin-on-surface tracking-tight">
                                    Reminder Management Queue
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPastReminders(!showPastReminders)}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg border transition-all select-none whitespace-nowrap ${
                                        showPastReminders
                                            ? 'bg-admin-primary/10 text-admin-primary border-admin-primary/30'
                                            : 'bg-admin-surface-container-low border-admin-outline-variant/20 text-admin-on-surface-variant hover:text-admin-on-surface'
                                    }`}
                                >
                                    {showPastReminders ? (
                                        <><Eye size={14} /><span>Showing History</span></>
                                    ) : (
                                        <><EyeOff size={14} /><span>Hide Past Logs</span></>
                                    )}
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-admin-on-surface-variant/70 hover:text-admin-on-surface transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-admin-outline-variant/30">
                            {displayedReminders.length === 0 ? (
                                <div className="text-center py-12 text-admin-on-surface-variant/50 flex flex-col items-center justify-center gap-2">
                                    <Bell size={36} className="opacity-20" />
                                    <p className="text-sm">
                                        {showPastReminders ? "No notification logs history found." : "No active upcoming reminders scheduled."}
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-admin-outline-variant/20 rounded-xl overflow-hidden bg-admin-surface-container-low/30">
                                    <table className="w-full text-left border-collapse text-xs divide-y divide-admin-outline-variant/10">
                                        <thead>
                                            <tr className="bg-admin-surface-container-low/80 font-bold text-admin-on-surface-variant">
                                                <th className="w-8 px-4 py-3 text-center">Status</th>
                                                <th className="px-4 py-3">Execution Time (Zurich)</th>
                                                <th className="px-4 py-3">Custom Alert Message Note</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-admin-outline-variant/10 text-admin-on-surface/90">
                                            {displayedReminders.map((reminder) => (
                                                <tr
                                                    key={reminder.id}
                                                    className={`hover:bg-admin-surface-container-highest transition-colors ${
                                                        reminder.is_sent ? 'opacity-60 bg-admin-surface-container-low/20' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-3 text-center">
                                                        {reminder.is_sent ? (
                                                            <CheckCircle size={14} className="text-emerald-500 mx-auto"/>
                                                        ) : (
                                                            <Clock size={14} className="text-admin-primary mx-auto"/>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-admin-on-surface-variant whitespace-nowrap">
                                                        {new Date(reminder.reminder_at).toLocaleString(undefined, {
                                                            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3 italic max-w-xs truncate text-admin-on-surface-variant/80">
                                                        {reminder.custom_message || <span className="opacity-30 not-italic">— Standard Alert —</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteReminder(reminder.id)}
                                                            className="text-admin-on-surface-variant hover:text-admin-error p-1 rounded transition-colors"
                                                            title="Purge Record"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-admin-outline-variant/20 bg-admin-surface-container-low/40 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-1.5 text-xs font-bold rounded-lg border border-admin-outline-variant/30 text-admin-on-surface hover:bg-admin-surface-container-low transition-colors"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
