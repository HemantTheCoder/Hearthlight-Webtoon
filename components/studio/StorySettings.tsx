import { StudioDraft } from "@/types/studio";
import { useStudioStore } from "@/lib/useStudioStore";
import { Save, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function StorySettings({ draft }: { draft: StudioDraft }) {
  const { updateDraft } = useStudioStore();
  const [title, setTitle] = useState(draft.title);
  const [synopsis, setSynopsis] = useState(draft.synopsis);
  const [tags, setTags] = useState(draft.tags.join(", "));
  const [genre, setGenre] = useState(draft.genre.join(", "));
  const [coverImage, setCoverImage] = useState(draft.coverImage || "");

  const handleSave = () => {
    updateDraft(draft.id, {
      title,
      synopsis,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      genre: genre.split(",").map(t => t.trim()).filter(Boolean),
      coverImage
    });
    alert("Settings saved!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h2 className="text-2xl font-bold font-serif mb-2">Story Settings</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-purple-200/60 font-medium">Story Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-purple-200/60 font-medium">Synopsis</label>
        <textarea 
          value={synopsis} 
          onChange={(e) => setSynopsis(e.target.value)}
          rows={5}
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 resize-y"
          placeholder="What is this story about?"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm text-purple-200/60 font-medium">Genres (comma separated)</label>
          <input 
            type="text" 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Romance, Drama..."
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50"
          />
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm text-purple-200/60 font-medium">Mood Tags (comma separated)</label>
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)}
            placeholder="slow burn, rivals..."
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-purple-200/60 font-medium">Cover Image Path</label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-24 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-white/20" />
            )}
          </div>
          <input 
            type="text" 
            value={coverImage} 
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="e.g. /assets/covers/my_cover.png"
            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50"
          />
        </div>
        <p className="text-[10px] text-white/30">For now, type the path to an asset uploaded to /public/assets. A file picker will be added later.</p>
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
         <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: "#9333ea", color: "white" }}
          >
            <Save size={16} /> Save Changes
         </button>
      </div>
    </div>
  );
}
