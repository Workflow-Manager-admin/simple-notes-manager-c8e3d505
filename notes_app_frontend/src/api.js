import { supabase } from "./supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Fetch all notes for the current user (if auth present) or public notes.
 */
export async function fetchNotes(userId = null, searchQuery = "") {
  let query = supabase.from("notes").select("*").order("updated_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Create a new note.
 */
export async function createNote({ title, content, userId = null }) {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Update a note by id.
 */
export async function updateNote(id, { title, content }) {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Delete a note by id.
 */
export async function deleteNote(id) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return true;
}
