import { StudioDraft } from "@/types/studio";
import { useStudioStore } from "@/lib/useStudioStore";
import { Plus, BookOpen, ChevronRight, GripVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChapterManager({ draft }: { draft: StudioDraft }) {
  const { addChapter } = useStudioStore();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = addChapter(draft.id, newTitle);
    setIsAdding(false);
    setNewTitle("");
    // Optionally redirect straight to the new chapter
    router.push(`/studio/story/${draft.id}/chapter/${newId}`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif mb-2">Chapters</h2>
          <p className="text-sm text-purple-200/50">Manage the episodes and branching routes of your story.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-white/10 hover:bg-white/20"
        >
          <Plus size={16} /> New Chapter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-4 items-end p-5 rounded-2xl border border-purple-500/20 bg-purple-900/10 mb-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs text-purple-200/60 font-medium">Chapter Title</label>
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none"
              autoFocus
              required
            />
          </div>
          <button type="submit" className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-bold">
            Create
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-white/50">
            Cancel
          </button>
        </form>
      )}

      {draft.chapters.length === 0 && !isAdding ? (
        <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
          <BookOpen size={32} className="text-white/20 mb-4" />
          <p className="text-white/50 text-center max-w-xs">
            No chapters yet. Create your first episode to open the Scene Builder and start writing.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {draft.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              onClick={() => router.push(`/studio/story/${draft.id}/chapter/${chapter.id}`)}
              className="group flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <GripVertical size={16} className="text-white/10 cursor-grab" />
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold">{chapter.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                    <span>{chapter.nodes.length} Blocks</span>
                    <span>~{chapter.readTimeMinutes} min read</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
                  {chapter.status}
                </span>
                <ChevronRight size={18} className="text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
