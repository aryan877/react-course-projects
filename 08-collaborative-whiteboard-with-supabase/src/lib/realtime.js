import { supabase } from "./supabase";

const elementsChannelName = (whiteboardId) => `elements:${whiteboardId}`;
const presenceChannelName = (whiteboardId) => `whiteboard:${whiteboardId}`;

// --- Channel Management ---

export const removeChannel = (channel) => {
  supabase.removeChannel(channel);
};

// --- Elements Channel ---

export const getElementsChannel = (whiteboardId) => {
  return supabase.channel(elementsChannelName(whiteboardId), {
    config: {
      broadcast: {
        self: true,
      },
    },
  });
};

export const subscribeToElementsChannel = (channel, handlers) => {
  channel
    .on("broadcast", { event: "element-add" }, handlers.onElementAdd)
    .on("broadcast", { event: "elements-insert" }, handlers.onElementsInsert)
    .on("broadcast", { event: "elements-delete" }, handlers.onElementsDelete)
    .on("broadcast", { event: "canvas-clear" }, handlers.onCanvasClear)
    .on("broadcast", { event: "state-replace" }, handlers.onStateReplace)
    .subscribe();
  return channel;
};

const getBroadcastingChannel = (whiteboardId) => {
  return supabase.channel(elementsChannelName(whiteboardId));
};

export const broadcastElementAdd = (whiteboardId, element) => {
  return getBroadcastingChannel(whiteboardId).send({
    type: "broadcast",
    event: "element-add",
    payload: { element },
  });
};

export const broadcastElementsInsert = (whiteboardId, elements) => {
  return getBroadcastingChannel(whiteboardId).send({
    type: "broadcast",
    event: "elements-insert",
    payload: { elements },
  });
};

export const broadcastElementsDelete = (whiteboardId, elementIds) => {
  return getBroadcastingChannel(whiteboardId).send({
    type: "broadcast",
    event: "elements-delete",
    payload: { elementIds },
  });
};

export const broadcastCanvasClear = (whiteboardId) => {
  return getBroadcastingChannel(whiteboardId).send({
    type: "broadcast",
    event: "canvas-clear",
    payload: {},
  });
};

/**
 * Broadcasts a full state replacement. Used for undo/redo.
 * @param {string} whiteboardId - The UUID of the whiteboard.
 * @param {object} state - The full state object, including elements, undo/redo stacks, and source user.
 */
export const broadcastStateReplace = (whiteboardId, state) => {
  return getBroadcastingChannel(whiteboardId).send({
    type: "broadcast",
    event: "state-replace",
    payload: state,
  });
};

// --- Presence Channel ---

export const getPresenceChannel = (whiteboardId) => {
  return supabase.channel(presenceChannelName(whiteboardId));
};

export const subscribeToPresenceChannel = (
  channel,
  onPresenceUpdate,
  onSubscribe
) => {
  channel
    .on("presence", { event: "sync" }, onPresenceUpdate)
    .on("presence", { event: "join" }, onPresenceUpdate)
    .on("presence", { event: "leave" }, onPresenceUpdate)
    .subscribe(onSubscribe);
  return channel;
};

export const trackInPresenceChannel = (channel, payload) => {
  return channel.track(payload);
};
