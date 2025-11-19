"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [creating, setCreating] = useState(false);

  const [filter, setFilter] = useState("");

  async function loadLinks() {
    try {
      setLoading(true);
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to load links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError(err.message || "Error loading links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleCreate(e) {
  e.preventDefault();
  setError(null);

  if (!url.trim()) {
    setError("Please enter a URL.");
    return;
  }

  setCreating(true);
  try {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore JSON parse errors
    }

    console.log("POST /api/links response:", res.status, data);

    if (!res.ok) {
      setError(
        (data && data.error) ||
          `Create failed with status ${res.status}.`
      );
    } else {
      setUrl("");
      setCode("");
      await loadLinks();
    }
  } catch (err) {
    console.error("handleCreate error:", err);
    setError("Something went wrong (network).");
  } finally {
    setCreating(false);
  }
}

  async function handleDelete(codeToDelete) {
    const confirmDelete = window.confirm(`Delete link ${codeToDelete}?`);
    if (!confirmDelete) return;

    await fetch(`/api/links/${codeToDelete}`, { method: "DELETE" });
    await loadLinks();
  }

  const filteredLinks = links.filter((link) =>
    (link.code + link.url).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">TinyLink Dashboard</h1>
          <span className="text-xs text-slate-400">
            Total links: {links.length}
          </span>
        </header>

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="space-y-3 border border-slate-800 rounded-xl p-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">Target URL</label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Custom code (optional, 6–8 chars)
            </label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              placeholder="e.g. docs123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            disabled={creating}
            className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create short link"}
          </button>
        </form>

        {/* Filter */}
        <div className="flex justify-between items-center gap-2">
          <input
            className="w-full md:w-64 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
            placeholder="Search by code or URL..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-slate-400">Loading links...</p>
        ) : filteredLinks.length === 0 ? (
          <p className="text-sm text-slate-400">
            No links yet. Create one above.
          </p>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-3 py-2 text-left">Code</th>
                  <th className="px-3 py-2 text-left">Target URL</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-left">Last clicked</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => (
                  <tr key={link.code} className="border-t border-slate-800">
                    <td className="px-3 py-2">
                      <a
                        href={`/code/${link.code}`}
                        className="text-emerald-400 hover:underline"
                      >
                        {link.code}
                      </a>
                    </td>
                    <td className="px-3 py-2 max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {link.clickCount}
                    </td>
                    <td className="px-3 py-2 text-left text-slate-400">
                      {link.lastClicked
                        ? new Date(link.lastClicked).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${window.location.origin}/${link.code}`
                          )
                        }
                        className="text-xs px-2 py-1 rounded bg-slate-800"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(link.code)}
                        className="text-xs px-2 py-1 rounded bg-red-500/80"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
