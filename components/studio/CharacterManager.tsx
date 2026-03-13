import { StudioDraft, StudioCharacter, Position } from "@/types/studio";
import { useStudioStore } from "@/lib/useStudioStore";
import { Plus, User, Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CharacterManager({ draft }: { draft: StudioDraft }) {
  const { addCharacter, updateCharacter } = useStudioStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newChar: StudioCharacter = {
      id: uuidv4(),
      name: newName,
      role: newRole,
      defaultPosition: "center",
      expressions: {
        neutral: "",
        happy: "",
        sad: "",
        surprised: "",
      }
    };
    addCharacter(draft.id, newChar);
    setIsAdding(false);
    setNewName("");
    setNewRole("");
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif mb-2">Character Roster</h2>
          <p className="text-sm text-purple-200/50">Define characters to use them in the scene editor.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-white/10 hover:bg-white/20"
        >
          <Plus size={16} /> Add Character
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-4 items-end p-5 rounded-2xl border border-purple-500/20 bg-purple-900/10">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs text-purple-200/60 font-medium">Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none"
              autoFocus
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs text-purple-200/60 font-medium">Role (optional)</label>
            <input 
              type="text" 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Rival, Best Friend"
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none"
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

      {draft.characters.length === 0 && !isAdding ? (
        <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
          <User size={32} className="text-white/20 mb-4" />
          <p className="text-white/50">No characters have been created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {draft.characters.map(char => (
            <div key={char.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{char.name}</h3>
                  {char.role && <p className="text-xs text-purple-300/50 uppercase">{char.role}</p>}
                </div>
                {/* Delete button could go here */}
              </div>

              <div className="flex flex-col gap-2">
                 <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Expressions (Asset Paths)</p>
                 <div className="grid grid-cols-2 gap-2">
                   {["neutral", "happy", "sad", "surprised"].map(expr => (
                     <div key={expr} className="flex flex-col gap-1">
                       <label className="text-[10px] text-white/50">{expr}</label>
                       <input 
                         type="text"
                         value={char.expressions[expr] || ""}
                         onChange={(e) => updateCharacter(draft.id, char.id, { 
                           expressions: { ...char.expressions, [expr]: e.target.value } 
                         })}
                         placeholder={`/assets/chars/${char.name.toLowerCase()}_${expr}.png`}
                         className="bg-black/40 border border-white/5 rounded px-2 py-1 text-xs outline-none focus:border-purple-500/50"
                       />
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
