import { useForm, router, usePage } from '@inertiajs/react';
import { Bell, BellOff } from 'lucide-react';

interface Reminder {
    id: number;
    reminder_at: string;
    is_sent: boolean;
}

interface ReminderWidgetProps {
    morphType: string;
    parentFieldId: number;
    reminders?: Reminder[];
}

export default function ReminderWidget({ morphType, parentFieldId, reminders = [] }: ReminderWidgetProps) {
    const { isDev } = usePage().props as any;

    const activeReminder = reminders.length > 0 ? reminders[0] : null;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const getFormattedLocalTime = (utcDateString: string) => {
        return new Date(utcDateString).toLocaleString('sv-SE', {
            timeZone: userTimezone,
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }).replace(' ', 'T');
    };

    const { data, setData } = useForm({
        reminder_at: activeReminder ? getFormattedLocalTime(activeReminder.reminder_at) : '',
    });

    const handleUpdateReminder = (dateTimeValue: string) => {
        setData('reminder_at', dateTimeValue);

        let utcString: string | null = null;

        if (dateTimeValue) {
            const localDate = new Date(dateTimeValue);
            utcString = localDate.toISOString();
        }

        router.patch(route('reminders.store-or-update', {
            type: morphType,
            id: parentFieldId
        }), {
            reminder_at: utcString
        }, {
            preserveScroll: true,
        });
    };

    const handleQuickPreset = (minutesToAdd: number) => {
        const now = new Date();
        const futureDate = new Date(now.getTime() + minutesToAdd * 60000);

        const displayString = futureDate.toLocaleString('sv-SE', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }).replace(' ', 'T');

        handleUpdateReminder(displayString);
    };

    return (
        <div className="bg-admin-surface-container p-6 rounded-xl border border-admin-outline-variant/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-admin-primary" />
                <h3 className="text-sm font-bold text-admin-on-surface tracking-wide uppercase">
                    Set Discord Reminder
                </h3>
            </div>

            <div className="space-y-3">

                {/* Custom Datetime Picker Input Field */}
                <div className="flex items-center gap-2 h-9">
                    <input
                        type="datetime-local"
                        value={data.reminder_at}
                        min={new Date().toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(' ', 'T')}
                        onChange={(e) => handleUpdateReminder(e.target.value)}
                        className="h-full flex-1 text-xs px-3 rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container-low text-admin-on-surface focus:outline-none focus:border-admin-primary focus:ring-0 transition-colors"
                    />
                    {activeReminder && (
                        <button
                            type="button"
                            onClick={() => handleUpdateReminder('')}
                            className="flex items-center justify-center h-full px-3 text-xs font-semibold rounded-lg border border-admin-error/20 bg-admin-error/5 text-admin-error hover:bg-admin-error/10 transition-colors"
                            title="Clear Active Reminder"
                        >
                            <BellOff size={14} />
                        </button>
                    )}
                </div>

                {/* Quick Presets Toolbar Row */}
                <div className="grid grid-cols-4 gap-1.5">
                    {isDev ? (
                        <button
                            type="button"
                            onClick={() => handleQuickPreset(1)}
                            className="h-8 text-[11px] font-bold rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title="Dev Tool: Trigger reminder on the next minute mark"
                        >
                            +1m
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleQuickPreset(15)}
                            className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface hover:bg-admin-surface-container-highest transition-colors"
                        >
                            +15m
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => handleQuickPreset(60)}
                        className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface hover:bg-admin-surface-container-highest transition-colors"
                    >
                        +1h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset(180)}
                        className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface hover:bg-admin-surface-container-highest transition-colors"
                    >
                        +3h
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset(1440)}
                        className="h-8 text-[11px] font-bold rounded-lg border border-admin-outline-variant/20 bg-admin-surface-container-low text-admin-on-surface-variant hover:text-admin-on-surface hover:bg-admin-surface-container-highest transition-colors"
                    >
                        +1d
                    </button>
                </div>

                <p className="text-[11px] text-admin-on-surface-variant/60 leading-normal">
                    {activeReminder ? (
                        <span className="text-emerald-500 font-medium">
                            Active: Discord ping scheduled for {new Date(activeReminder.reminder_at).toLocaleString()}
                        </span>
                    ) : (
                        "Select a quick preset or choose a specific date to dispatch a notification directly to Discord."
                    )}
                </p>
            </div>
        </div>
    );
}
