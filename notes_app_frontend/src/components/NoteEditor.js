import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function NoteEditor({ note, onSave, onDelete, isSaving }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  // Reset form when a new note is selected
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  if (!note) {
    return <div className="note-editor note-editor-empty">Select or create a note to start</div>;
  }

  const handleSave = () => {
    onSave({ ...note, title, content });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this note?")) onDelete(note.id);
  };

  return (
    <div className="note-editor">
      <input
        className="note-title-input"
        type="text"
        placeholder="Untitled note"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isSaving}
      />
      <textarea
        className="note-content-input"
        placeholder="Write your note..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={isSaving}
        rows={10}
      />
      <div className="note-editor-actions">
        <button className="btn btn-save" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-delete" onClick={handleDelete} disabled={isSaving}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
