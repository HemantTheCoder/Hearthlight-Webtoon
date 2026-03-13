import { StudioDraft, StudioChapter, SceneNode } from "@/types/studio";
import { useStudioStore } from "@/lib/useStudioStore";
import { Plus, GripVertical, Trash2, MessageSquare, Image as ImageIcon, GitBranch, Sparkles, List } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NodeEditorList({ draft, chapter }: { draft: StudioDraft, chapter: StudioChapter }) {
  const { addNode, updateNode, deleteNode } = useStudioStore();
  
  const handleAddNode = (type: "narration" | "dialogue" | "panel" | "choice") => {
    const newNode: SceneNode = {
      id: uuidv4(),
      type,
      text: type === "choice" ? "What do you do?" : "",
      background: "classroom", // Default
    };
    addNode(draft.id, chapter.id, newNode);
  };

  return (
    <div className="flex flex-col gap-4 pb-32">
      {chapter.nodes.map((node, index) => (
        <div key={node.id} className="flex gap-3 items-start group">
          {/* Reorder Handle & Sequence */}
          <div className="flex flex-col items-center mt-3 opacity-50 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} className="cursor-grab mb-1 text-white/40" />
            <span className="text-[10px] font-bold text-white/30">{index + 1}</span>
          </div>

          {/* Node Block */}
          <div className="flex-1 rounded-2xl bg-black/30 border border-white/10 p-4 transition-colors hover:border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded bg-white/10 text-[10px] uppercase font-bold tracking-wider text-purple-300">
                {node.type}
              </span>
              
              <button 
                onClick={() => {
                  if(confirm("Delete this block?")) deleteNode(draft.id, chapter.id, node.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Editor Fields based on Type */}
            <div className="flex flex-col gap-3">
              
              {/* Common: Background Field */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/50 w-24">Background:</label>
                <input 
                  type="text" 
                  value={node.background || ""}
                  onChange={(e) => updateNode(draft.id, chapter.id, node.id, { background: e.target.value })}
                  placeholder="e.g. classroom, rooftop"
                  className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Dialogue specific: Speaker & Character ID */}
              {node.type === "dialogue" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/50 w-24">Speaker:</label>
                  <input 
                    type="text" 
                    value={node.speaker || ""}
                    onChange={(e) => updateNode(draft.id, chapter.id, node.id, { speaker: e.target.value })}
                    placeholder="Display Name"
                    className="w-1/3 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none"
                  />
                  <select
                    className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none text-white/80"
                    value={node.characters?.[0]?.characterId || ""}
                    onChange={(e) => {
                      const charId = e.target.value;
                      if (!charId) {
                        updateNode(draft.id, chapter.id, node.id, { characters: [] });
                        return;
                      }
                      updateNode(draft.id, chapter.id, node.id, {
                        characters: [{ characterId: charId, expression: "neutral", position: "center", highlighted: true }]
                      });
                    }}
                  >
                    <option value="">No Sprite...</option>
                    {draft.characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {/* Cinematic Image Field (For Panels) */}
              {node.type === "panel" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/50 w-24">Image Asset:</label>
                  <input 
                    type="text" 
                    value={node.cinematicImage || ""}
                    onChange={(e) => updateNode(draft.id, chapter.id, node.id, { cinematicImage: e.target.value })}
                    placeholder="/assets/panels/my_art.png"
                    className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none focus:border-purple-500/50"
                  />
                </div>
              )}

              {/* Main Text Area */}
              {(node.type === "narration" || node.type === "dialogue" || node.type === "panel") && (
                <div className="flex gap-2">
                   <label className="text-xs text-white/50 w-24 mt-2">Text:</label>
                   <textarea 
                    value={node.text}
                    onChange={(e) => updateNode(draft.id, chapter.id, node.id, { text: e.target.value })}
                    rows={3}
                    placeholder="Write your story here..."
                    className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500/50 resize-y"
                   />
                </div>
              )}

              {/* Choice specific */}
              {node.type === "choice" && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                   <p className="text-xs text-purple-200/50 mb-1">Choice Options:</p>
                   {(node.choices || []).map((choice, i) => (
                     <div key={choice.id} className="flex gap-2 items-center">
                       <span className="w-4 text-xs text-white/30">{i+1}.</span>
                       <input 
                         type="text" 
                         value={choice.text}
                         onChange={(e) => {
                           const newChoices = [...(node.choices || [])];
                           newChoices[i].text = e.target.value;
                           updateNode(draft.id, chapter.id, node.id, { choices: newChoices });
                         }}
                         placeholder="Choice text..."
                         className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none focus:border-purple-500/50"
                       />
                       <input 
                         type="text" 
                         value={choice.next}
                         onChange={(e) => {
                           const newChoices = [...(node.choices || [])];
                           newChoices[i].next = e.target.value;
                           updateNode(draft.id, chapter.id, node.id, { choices: newChoices });
                         }}
                         placeholder="Next Node ID"
                         className="w-1/3 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-500/50 font-mono text-xs"
                       />
                       <button
                          onClick={() => {
                            const newChoices = [...(node.choices || [])];
                            newChoices.splice(i, 1);
                            updateNode(draft.id, chapter.id, node.id, { choices: newChoices });
                          }}
                          className="p-1 text-white/20 hover:text-red-400"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                   ))}
                   <button 
                     onClick={() => {
                       const newChoice = { id: uuidv4(), text: "New Choice", next: "end" };
                       updateNode(draft.id, chapter.id, node.id, { choices: [...(node.choices || []), newChoice] });
                     }}
                     className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 w-max"
                   >
                     <Plus size={12} /> Add Option
                   </button>
                </div>
              )}

              {/* Next node pointer (for linear) */}
              {node.type !== "choice" && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Next Node ID:</label>
                  <input
                    type="text"
                    value={node.next || ""}
                    onChange={(e) => updateNode(draft.id, chapter.id, node.id, { next: e.target.value })}
                    placeholder="(optional, defaults to next in array)"
                    className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-purple-300 placeholder-white/20"
                  />
                  <div className="text-[10px] text-white/20 font-mono">ID: {node.id}</div>
                </div>
              )}

            </div>
          </div>
        </div>
      ))}

      {chapter.nodes.length === 0 && (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed border-white/10 rounded-2xl mb-4">
          <p className="text-white/40 text-sm">No scenes created yet. Add a block to begin.</p>
        </div>
      )}

      {/* Floating Add Menu */}
      <div className="sticky bottom-6 mt-8 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full border border-white/10 mx-auto w-max shadow-2xl">
        <span className="text-xs font-bold text-white/40 mr-2 uppercase tracking-wide">Add Block</span>
        <button onClick={() => handleAddNode("narration")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors tooltip" title="Narration">
          <List size={14} className="text-blue-400" /> Text
        </button>
        <button onClick={() => handleAddNode("dialogue")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors">
          <MessageSquare size={14} className="text-green-400" /> Dialogue
        </button>
        <button onClick={() => handleAddNode("panel")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors">
          <ImageIcon size={14} className="text-orange-400" /> Panel
        </button>
        <button onClick={() => handleAddNode("choice")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors">
          <GitBranch size={14} className="text-purple-400" /> Choice
        </button>
      </div>
    </div>
  );
}
