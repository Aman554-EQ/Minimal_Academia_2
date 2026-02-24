"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, FileText, GraduationCap, Briefcase } from "lucide-react";
import { useSession } from "next-auth/react";
import ActionButtons from "./ActionButtons";
import Modal from "./modals/Modal";

interface AboutParagraph { id: number; content: string; orderIndex: number; }
interface Education { id: number; degree: string; university: string; period: string; grade?: string | null; orderIndex: number; }
interface Experience { id: number; title: string; period: string; course?: string | null; professors?: string | null; orderIndex: number; }
interface Publication { id: number; title: string; venue: string; authors: string; year: number; type: string; abstract?: string | null; paperUrl?: string | null; codeUrl?: string | null; bibtex?: string | null; featured?: boolean | null; orderIndex: number; }
interface NewsItem { id: number; date: string; content: string; highlight: boolean; category: string; orderIndex: number; }

interface HomePageProps {
  onViewAllPublications: () => void;
  onViewAllNews: () => void;
}

type ModalType = "about" | "education" | "experience" | "publication" | "news" | null;

export default function HomePage({ onViewAllPublications, onViewAllNews }: HomePageProps) {
  const { data: session } = useSession();
  const [about, setAbout] = useState<AboutParagraph[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [personalInfo, setPersonalInfo] = useState<{ researchInterests?: string | null } | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    const [aboutRes, eduRes, expRes, pubRes, newsRes, infoRes] = await Promise.all([
      fetch("/api/about"),
      fetch("/api/education"),
      fetch("/api/experience"),
      fetch("/api/publications"),
      fetch("/api/news"),
      fetch("/api/personal-info"),
    ]);
    const [aboutData, eduData, expData, pubData, newsData, infoData] = await Promise.all([
      aboutRes.json(),
      eduRes.json(),
      expRes.json(),
      pubRes.json(),
      newsRes.json(),
      infoRes.json(),
    ]);
    setAbout(aboutData);
    setEducationList(eduData);
    setExperienceList(expData);
    setPublications(pubData);
    setNewsList(newsData);
    setPersonalInfo(infoData);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = (type: ModalType) => {
    setEditingItem(null);
    setFormData({});
    setActiveModal(type);
  };

  const openEdit = (type: ModalType, item: Record<string, unknown>) => {
    setEditingItem(item);
    setFormData({ ...item });
    setActiveModal(type);
  };

  const handleDelete = async (endpoint: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
    fetchAll();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpointMap: Record<string, string> = {
        about: "/api/about",
        education: "/api/education",
        experience: "/api/experience",
        publication: "/api/publications",
        news: "/api/news",
      };
      const endpoint = endpointMap[activeModal!];
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setActiveModal(null);
      fetchAll();
    } finally {
      setSaving(false);
    }
  };

  const researchInterests: string[] = personalInfo?.researchInterests
    ? JSON.parse(personalInfo.researchInterests)
    : [];

  const featuredPubs = publications.filter((p) => p.featured);

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const ModalFooter = () => (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
        {saving ? "Saving..." : editingItem ? "Save Changes" : "Add"}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* About Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">About</h3>
          {session && <ActionButtons onAdd={() => openAdd("about")} addLabel="Add Paragraph" />}
        </div>
        {about.map((paragraph) => (
          <div key={paragraph.id} className="group relative mb-3 sm:mb-4">
            <p className="text-gray-700 leading-relaxed text-justify text-sm sm:text-base pr-0">
              {paragraph.content}
            </p>
            {session && (
              <div className="flex gap-1 mt-1">
                <ActionButtons
                  onEdit={() => openEdit("about", paragraph as unknown as Record<string, unknown>)}
                  onDelete={() => handleDelete("/api/about", paragraph.id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <GraduationCap className="mr-2" size={18} />
            Education
          </h3>
          {session && <ActionButtons onAdd={() => openAdd("education")} addLabel="Add Education" />}
        </div>
        {educationList.map((edu) => (
          <div key={edu.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{edu.degree}</h4>
                <p className="text-blue-600 font-medium text-sm sm:text-base">{edu.university}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{edu.period}</p>
                {edu.grade && <p className="text-gray-600 text-xs sm:text-sm">{edu.grade}</p>}
              </div>
              {session && (
                <ActionButtons
                  onEdit={() => openEdit("education", edu as unknown as Record<string, unknown>)}
                  onDelete={() => handleDelete("/api/education", edu.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <Briefcase className="mr-2" size={18} />
            Work Experience
          </h3>
          {session && <ActionButtons onAdd={() => openAdd("experience")} addLabel="Add Experience" />}
        </div>
        {experienceList.map((exp) => (
          <div key={exp.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{exp.title}</h4>
                {exp.course && <p className="text-blue-600 font-medium text-sm sm:text-base">{exp.course}</p>}
                <p className="text-gray-600 text-xs sm:text-sm">{exp.period}</p>
                {exp.professors && <p className="text-gray-600 text-xs sm:text-sm">{exp.professors}</p>}
              </div>
              {session && (
                <ActionButtons
                  onEdit={() => openEdit("experience", exp as unknown as Record<string, unknown>)}
                  onDelete={() => handleDelete("/api/experience", exp.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Research Interests */}
      {researchInterests.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Research Interests</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {researchInterests.map((interest: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Updates */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2" size={18} />
            Recent Updates
          </h3>
          {session && <ActionButtons onAdd={() => openAdd("news")} addLabel="Add News" />}
        </div>
        <ul className="space-y-2 sm:space-y-3">
          {newsList.slice(0, 3).map((item) => (
            <li key={item.id} className="flex flex-col sm:flex-row items-start space-y-1 sm:space-y-0 sm:space-x-3">
              <div className="flex items-start gap-2 w-full">
                <span className="font-medium text-gray-800 text-xs sm:text-sm whitespace-nowrap">{item.date}:</span>
                <span className={`text-gray-700 text-xs sm:text-sm flex-1 ${item.highlight ? "font-medium" : ""}`}>
                  {item.content} {item.highlight && <span className="text-red-500">🎉</span>}
                </span>
                {session && (
                  <ActionButtons
                    onEdit={() => openEdit("news", item as unknown as Record<string, unknown>)}
                    onDelete={() => handleDelete("/api/news", item.id)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onViewAllNews}
          className="text-blue-600 text-xs sm:text-sm mt-2 sm:mt-3 hover:underline cursor-pointer"
        >
          View all updates →
        </button>
      </div>

      {/* Selected Publications */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-2" size={18} />
            Selected Publications
          </h3>
          {session && <ActionButtons onAdd={() => openAdd("publication")} addLabel="Add Publication" />}
        </div>
        <div className="space-y-4 sm:space-y-6">
          {featuredPubs.map((pub, index) => (
            <div key={pub.id} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base leading-tight flex-1">
                  {index + 1}. {pub.title}
                </h4>
                {session && (
                  <ActionButtons
                    onEdit={() => openEdit("publication", pub as unknown as Record<string, unknown>)}
                    onDelete={() => handleDelete("/api/publications", pub.id)}
                  />
                )}
              </div>
              <p className="text-xs sm:text-sm text-blue-600 mb-1">{pub.venue}</p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                <span className="font-medium">Authors - </span>{pub.authors}
              </p>
              <div className="flex flex-wrap gap-2">
                {pub.paperUrl && pub.paperUrl !== "#" && (
                  <a href={pub.paperUrl} className="text-blue-600 text-xs sm:text-sm hover:underline" target="_blank" rel="noopener noreferrer">[Paper]</a>
                )}
                {pub.codeUrl && pub.codeUrl !== "#" && (
                  <a href={pub.codeUrl} className="text-blue-600 text-xs sm:text-sm hover:underline" target="_blank" rel="noopener noreferrer">[Code]</a>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onViewAllPublications}
          className="text-blue-600 text-xs sm:text-sm mt-2 sm:mt-3 hover:underline cursor-pointer"
        >
          View all publications →
        </button>
      </div>

      {/* ===== MODALS ===== */}

      {/* About Modal */}
      <Modal isOpen={activeModal === "about"} onClose={() => setActiveModal(null)} title={editingItem ? "Edit Paragraph" : "Add Paragraph"}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Content</label>
            <textarea
              value={(formData.content as string) || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className={inputClass}
              placeholder="Write your paragraph here..."
            />
          </div>
          <div>
            <label className={labelClass}>Order Index</label>
            <input type="number" value={(formData.orderIndex as number) || 0} onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })} className={inputClass} />
          </div>
          <ModalFooter />
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal isOpen={activeModal === "education"} onClose={() => setActiveModal(null)} title={editingItem ? "Edit Education" : "Add Education"}>
        <div className="space-y-4">
          {[
            { label: "Degree", key: "degree", placeholder: "B.Sc. in Computer Science" },
            { label: "University", key: "university", placeholder: "North South University" },
            { label: "Period", key: "period", placeholder: "Sep 2021 - Dec 2025" },
            { label: "Grade/Honors", key: "grade", placeholder: "Magna Cum Laude" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={(formData[key] as string) || ""}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className={inputClass}
                placeholder={placeholder}
              />
            </div>
          ))}
          <ModalFooter />
        </div>
      </Modal>

      {/* Experience Modal */}
      <Modal isOpen={activeModal === "experience"} onClose={() => setActiveModal(null)} title={editingItem ? "Edit Experience" : "Add Experience"}>
        <div className="space-y-4">
          {[
            { label: "Title", key: "title", placeholder: "Teaching Assistant" },
            { label: "Period", key: "period", placeholder: "Feb 2024 - Present" },
            { label: "Course", key: "course", placeholder: "Course: CSE373[Algorithms]" },
            { label: "Professors / Details", key: "professors", placeholder: "Worked under Dr. XYZ" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={(formData[key] as string) || ""}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className={inputClass}
                placeholder={placeholder}
              />
            </div>
          ))}
          <ModalFooter />
        </div>
      </Modal>

      {/* Publication Modal */}
      <Modal isOpen={activeModal === "publication"} onClose={() => setActiveModal(null)} title={editingItem ? "Edit Publication" : "Add Publication"}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={(formData.title as string) || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="Paper title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Venue</label>
              <input type="text" value={(formData.venue as string) || ""} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className={inputClass} placeholder="EMNLP-2024" />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input type="number" value={(formData.year as number) || new Date().getFullYear()} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Authors</label>
            <input type="text" value={(formData.authors as string) || ""} onChange={(e) => setFormData({ ...formData, authors: e.target.value })} className={inputClass} placeholder="Author1, Author2, ..." />
          </div>
          <div>
            <label className={labelClass}>Abstract</label>
            <textarea value={(formData.abstract as string) || ""} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} rows={3} className={inputClass} placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Paper URL</label>
              <input type="text" value={(formData.paperUrl as string) || ""} onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })} className={inputClass} placeholder="https://arxiv.org/..." />
            </div>
            <div>
              <label className={labelClass}>Code URL</label>
              <input type="text" value={(formData.codeUrl as string) || ""} onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
            </div>
          </div>
          <div>
            <label className={labelClass}>BibTeX</label>
            <textarea value={(formData.bibtex as string) || ""} onChange={(e) => setFormData({ ...formData, bibtex: e.target.value })} rows={4} className={`${inputClass} font-mono text-xs`} placeholder="@inproceedings{...}" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={(formData.featured as boolean) || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Show in Featured (Home page)</label>
          </div>
          <ModalFooter />
        </div>
      </Modal>

      {/* News Modal */}
      <Modal isOpen={activeModal === "news"} onClose={() => setActiveModal(null)} title={editingItem ? "Edit News" : "Add News"}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Date</label>
            <input type="text" value={(formData.date as string) || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} placeholder="January 2025" />
          </div>
          <div>
            <label className={labelClass}>Content</label>
            <textarea value={(formData.content as string) || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} className={inputClass} placeholder="News description..." />
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
            <input
              type="checkbox"
              id="highlight"
              checked={(formData.highlight as boolean) || false}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="highlight" className="text-sm font-medium text-gray-700">Highlight this item (🎉)</label>
          </div>
          <ModalFooter />
        </div>
      </Modal>
    </div>
  );
}
