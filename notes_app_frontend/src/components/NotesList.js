import React from "react";

// PUBLIC_INTERFACE
function NotesList({ notes, selectedId, onSelect, onCreate, onSearch, search }) {
  return (
    <section className="notes-list-section">
      <div className="notes-list-header">
        <input
          className="notes-search"
          type="search"
          placeholder="Search notes..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        <button className="btn btn-create" onClick={onCreate}>+ New</button>
      </div>
      <ul className="notes-list">
        {notes.length === 0 && (
          <li className="notes-empty">No notes yet.</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={`notes-list-item ${selectedId === note.id ? "selected" : ""}`}
            onClick={() => onSelect(note.id)}
          >
            <div className="note-title">{note.title || <em>Untitled</em>}</div>
            <div className="note-snippet">{note.content?.slice(0, 48)}</div>
            <div className="note-date">{new Date(note.updated_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotesList;
