import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Story Endpoints
export const getMyStories = () => api.get("/stories");
export const getStory = (id) => api.get(`/stories/${id}`);
export const getStoryForEdit = (id) => api.get(`/stories/${id}/edit`);
export const createStory = (storyData) => api.post("/stories", storyData);
export const addStorySegment = (storyId, segmentData) =>
  api.post(`/stories/${storyId}/segments`, segmentData);
export const completeStory = (storyId, makePublic = false) =>
  api.post(`/stories/${storyId}/complete`, { makePublic });

// AI Endpoints
export const generateStory = (prompt, genre, tone) =>
  api.post("/ai/generate-story", { prompt, genre, tone });
export const continueStory = (context, choice) =>
  api.post("/ai/continue-story", { context, choice });
export const generateChoices = (content) =>
  api.post("/ai/generate-choices", { content });
export const generateImage = (content) =>
  api.post("/ai/generate-image", { content });

// Auth Endpoints
export const login = (email, password) =>
  api.post("/auth/login", { email, password });
export const register = (username, displayName, email, password) =>
  api.post("/auth/register", { username, displayName, email, password });
export const getMe = () => api.get("/auth/me");

export default api;
