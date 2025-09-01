import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);       // generic loading if needed later
  const [creating, setCreating] = useState(false);     // create form submit state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);     // controls CTA vs form
  const navigate = useNavigate();

  const canSave = title.trim().length > 0 && content.trim().length > 0 && !creating;

  // Fetch user and notes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/signin");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchNotes();
    }
  }, [navigate]);

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      const { data } = await API.get("/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create note via inline form
  const handleCreateInline = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setCreating(true);
    try {
      await API.post(
        "/notes",
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle("");
      setContent("");
      await fetchNotes();
      setShowForm(false); // collapse form after success
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not create note");
    } finally {
      setCreating(false);
    }
  };

  // Delete a note
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header with image + HD and Sign Out */}
      <div className="w-full flex justify-between items-center max-w-md mb-6">
        <div className="flex items-center gap-2">
          <img src="/image.png" alt="App Icon" className="w-6 h-6" />
          <span className="text-lg font-semibold text-gray-800">Dashboard</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-500 hover:underline"
        >
          Sign Out
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mb-6">
          <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          <p className="text-gray-600">
            Email: {user.email.replace(/(.{3})(.*)(@.*)/, "$1*****$3")}
          </p>
        </div>
      )}

      {/* Create Note - conditional card */}
      {!showForm ? (
        // CTA card shown first
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6">
        
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full max-w-md px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Note
            </button>
          </div>
        </div>
      ) : (
        // Inline form appears after clicking "Add note"
        <form
          onSubmit={handleCreateInline}
          className="w-full max-w-md bg-white shadow-md rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <img src="/image.png" alt="App Icon" className="w-6 h-6" />
            <span className="text-lg font-semibold text-gray-800">HD</span>
          </div>

          <div className="mb-4">
            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="noteTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="noteContent"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
                setShowForm(false);
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={creating}
              aria-disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className={`px-4 py-2 rounded-md text-white ${
                canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
              }`}
            >
              {creating ? "Saving..." : "Save note"}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="w-full max-w-md space-y-3">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center bg-white shadow rounded-lg p-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{note.title}</p>
                {note.content ? (
                  <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                ) : null}
              </div>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-500 hover:text-red-700"
                title="Delete note"
              >
                🗑
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No notes yet</p>
        )}
      </div>
    </div>
  );
}
