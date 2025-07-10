import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import Auth from "./components/Auth";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote as apiDeleteNote,
} from "./api";
import { supabase } from "./supabaseClient";

// PUBLIC_INTERFACE
function App() {
  // THEME
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // AUTH (optional, detect if table "users" exists or Supabase session exists)
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState(false);

  // NOTES STATE
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user from auth (optional)
  useEffect(() => {
    const session = supabase.auth.getSession ? undefined : null;
    (async () => {
      if (supabase.auth.getSession) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      }
    })();
    // Listen to changes (auth state)
    if (supabase.auth.onAuthStateChange) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setAuthView(false);
      });
      return () => { if (listener) listener.subscription.unsubscribe(); };
    }
  }, []);

  // Fetch notes
  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchNotes(user?.id, search);
      setNotes(items);
      if (items.length > 0 && (selectedId == null || !items.some(n => n.id === selectedId))) {
        setSelectedId(items[0].id);
      } else if (items.length === 0) {
        setSelectedId(null);
      }
    } catch (err) {
      // Optionally: set error
    } finally {
      setIsLoading(false);
    }
  }, [user, search, selectedId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // CRUD handlers
  const handleSelect = (id) => setSelectedId(id);
  const handleSearch = (q) => setSearch(q);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const note = await createNote({ title: "Untitled", content: "", userId: user?.id });
      setNotes([note, ...notes]);
      setSelectedId(note.id);
    } catch (e) {
      // handle error
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (note) => {
    setIsSaving(true);
    try {
      const updated = await updateNote(note.id, { title: note.title, content: note.content });
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    } catch (e) {
      // handle error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSaving(true);
    try {
      await apiDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSelectedId((prev) => {
        const idx = notes.findIndex((n) => n.id === prev);
        if (!notes.length) return null;
        if (idx > 0) return notes[idx - 1]?.id || null;
        return notes[1]?.id || null;
      });
    } catch (e) {
      // handle error
    } finally {
      setIsSaving(false);
    }
  };

  // Auth handlers
  const handleAuth = async (email) => {
    if (!supabase.auth.signInWithOtp) return { error: { message: "Auth unsupported" } };
    const res = await supabase.auth.signInWithOtp({ email });
    return res;
  };
  const handleLogout = async () => {
    if (supabase.auth.signOut) await supabase.auth.signOut();
    setUser(null);
    setNotes([]);
    setSelectedId(null);
  };

  // Get selected note
  const selectedNote = notes.find(n => n.id === selectedId);

  return (
    <div className="App">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          {!user && supabase.auth.signInWithOtp ? (
            <div className="auth-container">
              <Auth onAuth={handleAuth} />
            </div>
          ) : (
            <div className="notes-app">
              <NotesList
                notes={notes}
                selectedId={selectedId}
                onSelect={handleSelect}
                onCreate={handleCreate}
                onSearch={handleSearch}
                search={search}
              />
              <div className="editor-container">
                {isLoading ? (
                  <div className="notes-loading">Loading...</div>
                ) : (
                  <NoteEditor
                    note={selectedNote}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
