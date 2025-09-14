import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function NotesApp() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState(""); 


  const fetchNotes = async (query = "") => {
    try {
  const res = await axios.get(`http://localhost:5000/notes/search?search=${query}`);
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNote = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setShowModal(true);
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        const resp = await axios.put(`http://localhost:5000/notes/${editId}`, {
          title,
          content,
        });
        const updated = resp.data.note;
        setNotes(notes.map((n) => (n._id === editId ? updated : n)));
      } else {
        const response = await axios.post("http://localhost:5000/notes", {
          title,
          content,
        });
        setNotes([response.data.note, ...notes]);
      }
      setTitle("");
      setContent("");
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

const handleSearch = (e) => {
  const value = e.target.value;
  setSearch(value);
  fetchNotes(value); 
};


  const handleClear = () => {
    setSearch("");
    fetchNotes(); 
  };

  const handleRefresh = () => {
    fetchNotes(search); 
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-glass">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            Notes App
          </a>
          <div>
            <button className="btn btn-light btn-rounded" onClick={handleNewNote}>
              New Note
            </button>
          </div>
        </div>
      </nav>

      <main className="container my-4">
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="mb-3 d-flex gap-2">
              <input
                className="form-control search-input"
                placeholder="Search notes..."
                value={search}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary btn-rounded" onClick={handleClear}>
                Clear
              </button>
              <button className="btn btn-outline-primary btn-rounded" onClick={handleRefresh}>
                Refresh
              </button>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12">
                {notes.length === 0 ? (
                  <div className="card card-glass">
                    <div className="card-body text-center">
                      No notes found. Try changing your{" "}
                      <strong className="text-warning">search</strong> or click{" "}
                      <strong className="text-warning" onClick={handleNewNote} style={{ cursor: "pointer" }}>
                        New Note
                      </strong>{" "}
                      to add one.
                    </div>
                  </div>
                ) : (
                  notes.map((item) => (
                    <div className="card card-glass shadow-sm mt-2" key={item._id}>
                      <div className="card-body d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text text-truncate" style={{ maxWidth: "60ch" }}>
                            {item.content}
                          </p>
                          <small className="text-light">
                            Last updated:{" "}
                            {new Date(item.updatedAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </small>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <button
                            className="btn btn-sm btn-outline-light btn-rounded mb-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger btn-rounded"
                            onClick={() => handleDelete(item._id)}
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
          </div>

          <aside className="col-12 col-md-4">
            <div className="card stats-card mb-3">
              <div className="card-body">
                <h6>Stats</h6>
                <p className="mb-1">
                  Total notes: <strong>{notes.length}</strong>
                </p>
                <p className="mb-0">
                  Showing: <strong>{notes.length}</strong>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <form>
                  <div className="modal-header">
                    <h5 className="modal-title">{editId ? "Edit Note" : "New Note"}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label text-dark">Title</label>
                      <input
                        className="form-control"
                        placeholder="Enter note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">Content</label>
                      <textarea
                        className="form-control"
                        rows={6}
                        placeholder="Enter note content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-rounded"
                      onClick={handleSave}
                    >
                      {editId ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
        </>
      )}

      <button className="fab-btn" onClick={handleNewNote}>
        +
      </button>
    </div>
  );
}
