import { supabase } from "./supabase";

// This file centralizes all direct database interactions (CRUD operations)
// using the Supabase client. Each function corresponds to a specific database
// table and action, making the data access layer organized and maintainable.

// ============================================================================
// Profile Functions
// ============================================================================

/**
 * Fetches a single user profile based on their user ID.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise} A Supabase query promise.
 */
export const getProfile = (userId) => {
  return supabase.from("profiles").select("*").eq("id", userId).single();
};

/**
 * Creates a new user profile. Typically called upon new user registration.
 * @param {object} profileData - The data for the new profile.
 * @returns {Promise} A Supabase query promise.
 */
export const createProfile = (profileData) => {
  return supabase.from("profiles").insert(profileData).select().single();
};

/**
 * Updates an existing user profile.
 * @param {string} userId - The UUID of the user to update.
 * @param {object} updates - An object containing the fields to update.
 * @returns {Promise} A Supabase query promise.
 */
export const updateUserProfile = (userId, updates) => {
  return supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
};

// ============================================================================
// Whiteboard Functions
// ============================================================================

/**
 * Fetches a single whiteboard's metadata by its ID.
 * @param {string} whiteboardId - The UUID of the whiteboard.
 * @returns {Promise} A Supabase query promise.
 */
export const getWhiteboard = (whiteboardId) => {
  return supabase
    .from("whiteboards")
    .select("*")
    .eq("id", whiteboardId)
    .single();
};

/**
 * Creates a new whiteboard.
 * @param {object} whiteboardData - The data for the new whiteboard.
 * @returns {Promise} A Supabase query promise.
 */
export const createWhiteboard = (whiteboardData) => {
  return supabase.from("whiteboards").insert(whiteboardData).select().single();
};

/**
 * Updates the title of a whiteboard.
 * @param {string} whiteboardId - The UUID of the whiteboard to update.
 * @param {string} title - The new title.
 * @returns {Promise} A Supabase query promise.
 */
export const updateWhiteboardTitle = (whiteboardId, title) => {
  return supabase.from("whiteboards").update({ title }).eq("id", whiteboardId);
};

// ============================================================================
// Drawing Elements Functions
// ============================================================================

/**
 * Fetches all drawing elements associated with a specific whiteboard.
 * @param {string} whiteboardId - The UUID of the whiteboard.
 * @returns {Promise} A Supabase query promise.
 */
export const getElementsForWhiteboard = (whiteboardId) => {
  return supabase
    .from("drawing_elements")
    .select("*")
    .eq("whiteboard_id", whiteboardId)
    .order("created_at", { ascending: true });
};

/**
 * Inserts a single new drawing element into the database.
 * @param {object} element - The element object to insert.
 * @returns {Promise} A Supabase query promise.
 */
export const insertElement = (element) => {
  return supabase.from("drawing_elements").insert(element);
};

/**
 * Inserts multiple drawing elements in a single batch.
 * This is more efficient than inserting them one by one.
 * @param {Array<object>} elements - An array of element objects to insert.
 * @returns {Promise} A Supabase query promise.
 */
export const insertMultipleElements = (elements) => {
  return supabase.from("drawing_elements").insert(elements);
};

/**
 * Deletes multiple drawing elements by their IDs.
 * @param {Array<string>} elementIds - An array of element UUIDs to delete.
 * @returns {Promise} A Supabase query promise.
 */
export const deleteElementsByIds = (elementIds) => {
  return supabase.from("drawing_elements").delete().in("id", elementIds);
};

/**
 * Deletes all drawing elements for a specific whiteboard. Used for the "Clear Canvas" action.
 * @param {string} whiteboardId - The UUID of the whiteboard.
 * @returns {Promise} A Supabase query promise.
 */
export const deleteAllElementsForWhiteboard = (whiteboardId) => {
  return supabase
    .from("drawing_elements")
    .delete()
    .eq("whiteboard_id", whiteboardId);
};

// ============================================================================
// Cursor Functions
// ============================================================================

/**
 * Deletes a user's cursor position entry. This is used as a cleanup mechanism
 * when a user leaves the whiteboard canvas to avoid stale cursors.
 * @param {string} whiteboardId - The UUID of the whiteboard.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise} A Supabase query promise.
 */
export const deleteCursor = (whiteboardId, userId) => {
  return supabase
    .from("active_cursors")
    .delete()
    .eq("whiteboard_id", whiteboardId)
    .eq("user_id", userId);
};
