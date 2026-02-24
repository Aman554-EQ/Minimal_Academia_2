"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import ActionButtons from "./ActionButtons";
import Modal from "./modals/Modal";

interface Publication {
  id: number;
  title: string;
  venue: string;
  authors: string;
  year: number;
  type: string;
  abstract?: string | null;
  paperUrl?: string | null;
  codeUrl?: string | null;
  bibtex?: string | null;
  featured?: boolean | null;
  orderIndex: number;
}

export default function PublicationsPage() {
  const { data: session } = useSession();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [expandedBibtex, setExpandedBibtex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<Partial<Publication>>({});
  const [saving, setSaving] = useState(false);

  const fetchPublications = useCallback(async () => {
    const res = await fetch("/api/publications");
    const data = await res.json();
    setPublications(data);
  }, []);

  useEffect(() => { fetchPublications(); }, [fetchPublications]);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ year: new Date().getFullYear(), type: "Conference", featured: false });
    setIsModalOpen(true);
  };

  const openEdit = (pub: Publication) => {
    setEditingItem(pub);
    setFormData({ ...pub });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this publication?")) return;
    await fetch(`/api/publications?id=${id}`, { method: "DELETE" });
    fetchPublications();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;
      await fetch("/api/publications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsModalOpen(false);
      fetchPublications();
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Publications</h2>
        {session && (
          <ActionButtons onAdd={openAdd} addLabel="Add Publication" size="md" />
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {publications.map((pub) => (
          <div key={pub.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg leading-tight pr-0 sm:pr-4 flex-1">{pub.title}</h3>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">{pub.year}</span>
                {session && (
                  <ActionButtons
                    onEdit={() => openEdit(pub)}
                    onDelete={() => handleDelete(pub.id)}
                  />
                )}
              </div>
            </div>

            <p className="text-blue-600 font-medium text-xs sm:text-sm mb-2">{pub.venue}</p>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{pub.authors}</p>

            {pub.abstract && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">Abstract:</h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{pub.abstract}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{pub.type}</span>
              <div className="flex flex-wrap gap-2">
                {pub.paperUrl && pub.paperUrl !== "#" && (
                  <a href={pub.paperUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs sm:text-sm hover:underline">Paper</a>
                )}
                {pub.codeUrl && pub.codeUrl !== "#" && (
                  <a href={pub.codeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs sm:text-sm hover:underline">Code</a>
                )}
                {pub.bibtex && (
                  <button onClick={() => setExpandedBibtex(expandedBibtex === pub.id ? null : pub.id)} className="text-blue-600 text-xs sm:text-sm hover:underline">
                    BibTeX
                  </button>
                )}
              </div>
            </div>

            {expandedBibtex === pub.id && pub.bibtex && (
              <div className="mt-4 bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words">{pub.bibtex}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Publication" : "Add Publication"}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={(formData.title as string) || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Venue</label>
              <input type="text" value={(formData.venue as string) || ""} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input type="number" value={(formData.year as number) || new Date().getFullYear()} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Authors</label>
            <input type="text" value={(formData.authors as string) || ""} onChange={(e) => setFormData({ ...formData, authors: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select value={(formData.type as string) || "Conference"} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputClass}>
              <option>Conference</option>
              <option>Journal</option>
              <option>Workshop</option>
              <option>Preprint</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Abstract</label>
            <textarea value={(formData.abstract as string) || ""} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} rows={3} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Paper URL</label>
              <input type="text" value={(formData.paperUrl as string) || ""} onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Code URL</label>
              <input type="text" value={(formData.codeUrl as string) || ""} onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>BibTeX</label>
            <textarea value={(formData.bibtex as string) || ""} onChange={(e) => setFormData({ ...formData, bibtex: e.target.value })} rows={4} className={`${inputClass} font-mono text-xs`} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured2" checked={(formData.featured as boolean) || false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded" />
            <label htmlFor="featured2" className="text-sm font-medium text-gray-700">Show in Featured (Home page)</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
