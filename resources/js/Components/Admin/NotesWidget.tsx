import { useForm } from '@inertiajs/react';
import { Save, FileText } from 'lucide-react';

interface NotesWidgetProps {
    parentId: number;
    initialNotes: string | null;
    patchRouteName: string;
}

export default function NotesWidget({ parentId, initialNotes, patchRouteName }: NotesWidgetProps) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        admin_notes: initialNotes ?? '',
    });

    const submitNotes = (e?: React.FormEvent, isAutoSave = false) => {
        e?.preventDefault();

        if (isAutoSave && data.admin_notes.trim() === (initialNotes ?? '').trim()) {
            return;
        }

        patch(route(patchRouteName, parentId), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-admin-surface-container p-6 rounded-xl border border-admin-outline-variant/30 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-admin-primary" />
                <h3 className="text-sm font-bold text-admin-on-surface tracking-wide uppercase">
                    Personal Notes
                </h3>
            </div>

            <form onSubmit={(e) => submitNotes(e)} className="space-y-3">
                <textarea
                    value={data.admin_notes}
                    onChange={(e) => setData('admin_notes', e.target.value)}
                    onBlur={() => submitNotes(undefined, true)}
                    placeholder="Add private follow-up notes, project ideas, or interaction logs here..."
                    className="w-full h-48 text-sm p-4 rounded-lg border border-admin-outline-variant/40 bg-admin-surface-container-low text-admin-on-surface placeholder-admin-on-surface-variant/40 focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary transition-all resize-none"
                />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-admin-on-surface-variant/60">
                        {recentlySuccessful ? (
                            <span className="text-emerald-500 font-medium animate-pulse">Saved successfully</span>
                        ) : processing ? (
                            <span>Saving...</span>
                        ) : (
                            <span>Auto-saves on blur</span>
                        )}
                    </span>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-admin-surface-container-highest border border-admin-outline-variant/30 text-admin-on-surface hover:bg-admin-surface transition-colors disabled:opacity-50"
                    >
                        <Save size={12} />
                        <span>Save Note</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
