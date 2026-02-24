"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import ActionButtons from "./ActionButtons";
import Modal from "./modals/Modal";

interface NewsItem {
  id: number;
  date: string;
  content: string;
  highlight: boolean;
  category: string;
  orderIndex: number;
}

export default function NewsPage() {
  const { data: session } = useSession();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [saving, setSaving] = useState(false);

  const fetchNews = useCallback(async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNewsList(data);
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ highlight: false, category: "General" });
    setIsModalOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    fetchNews();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;
      await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsModalOpen(false);
      fetchNews();
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="px-0 py-2 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">News & Updates</h2>
        {session && <ActionButtons onAdd={openAdd} addLabel="Add News" size="md" />}
      </div>

      <div className="space-y-4">
        {newsList.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
              <span className="text-sm sm:text-base font-semibold text-gray-800">
                {index + 1}. {item.date}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                {session && (
                  <ActionButtons
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                )}
              </div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {item.content} {item.highlight && <span className="text-red-500">🎉</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit News" : "Add News"}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Date</label>
            <input type="text" value={(formData.date as string) || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} placeholder="January 2025" />
          </div>
          <div>
            <label className={labelClass}>Content</label>
            <textarea value={(formData.content as string) || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={(formData.category as string) || "General"} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
              {["Publication", "Service", "Conference", "Collaboration", "Award", "General"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="highlightModal" checked={(formData.highlight as boolean) || false} onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })} className="rounded" />
            <label htmlFor="highlightModal" className="text-sm font-medium text-gray-700">Highlight (🎉)</label>
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
