import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get("/api/links");
      setLinks(response.data.links);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/links", newLink);
      setLinks([...links, response.data.link]);
      setNewLink({ title: "", url: "", description: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await axios.delete(`/api/links/${linkId}`);
      setLinks(links.filter((link) => link._id !== linkId));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const toggleLinkStatus = async (linkId, isActive) => {
    try {
      const response = await axios.put(`/api/links/${linkId}`, {
        isActive: !isActive,
      });
      setLinks(
        links.map((link) => (link._id === linkId ? response.data.link : link))
      );
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your links and profile</p>
        </div>
        <Link
          to={`/${user.username}`}
          className="btn-secondary"
          target="_blank"
        >
          View My Page
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Links</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary"
            >
              Add Link
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddLink}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Link title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newLink.description}
                  onChange={(e) =>
                    setNewLink({ ...newLink, description: e.target.value })
                  }
                  className="input-field"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary">
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {links.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No links yet. Add your first link to get started!
              </p>
            ) : (
              links.map((link) => (
                <div
                  key={link._id}
                  className={`p-4 border rounded-lg ${
                    link.isActive ? "bg-white" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {link.url}
                      </p>
                      {link.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {link.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {link.clicks} clicks
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() =>
                          toggleLinkStatus(link._id, link.isActive)
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          link.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link._id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Links:</span>
              <span className="font-semibold">{links.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Links:</span>
              <span className="font-semibold">
                {links.filter((link) => link.isActive).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Clicks:</span>
              <span className="font-semibold">
                {links.reduce((total, link) => total + link.clicks, 0)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">Your Page URL:</h3>
            <div className="flex">
              <input
                type="text"
                value={`${window.location.origin}/${user.username}`}
                readOnly
                className="input-field flex-1 mr-2"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${user.username}`
                  )
                }
                className="btn-secondary"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
