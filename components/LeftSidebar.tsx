"use client";

import { SiGooglescholar, SiLinkedin, SiGithub } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ActionButtons from "./ActionButtons";
import Modal from "./modals/Modal";

interface PersonalInfoData {
  id?: number;
  name: string;
  title: string;
  email: string;
  githubUrl?: string | null;
  githubLabel?: string | null;
  scholarUrl?: string | null;
  linkedinUrl?: string | null;
  researchInterests?: string | null;
}

interface LeftSidebarProps {
  info: PersonalInfoData | null;
  onUpdate: () => void;
}

export default function LeftSidebar({ info, onUpdate }: LeftSidebarProps) {
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoData>({
    name: info?.name || "",
    title: info?.title || "",
    email: info?.email || "",
    githubUrl: info?.githubUrl || "",
    githubLabel: info?.githubLabel || "",
    scholarUrl: info?.scholarUrl || "",
    linkedinUrl: info?.linkedinUrl || "",
    researchInterests: info?.researchInterests
      ? JSON.parse(info.researchInterests).join(", ")
      : "",
  });
  const [saving, setSaving] = useState(false);

  const socialLinks = [
    {
      icon: MdEmail,
      label: "Email",
      href: `mailto:${info?.email}`,
    },
    {
      icon: SiGithub,
      label: info?.githubLabel || "GitHub",
      href: info?.githubUrl || "#",
    },
    {
      icon: SiGooglescholar,
      label: "Google Scholar",
      href: info?.scholarUrl || "#",
    },
    {
      icon: SiLinkedin,
      label: "LinkedIn",
      href: info?.linkedinUrl || "#",
    },
  ];

  const openEditModal = () => {
    setFormData({
      name: info?.name || "",
      title: info?.title || "",
      email: info?.email || "",
      githubUrl: info?.githubUrl || "",
      githubLabel: info?.githubLabel || "",
      scholarUrl: info?.scholarUrl || "",
      linkedinUrl: info?.linkedinUrl || "",
      researchInterests: info?.researchInterests
        ? JSON.parse(info.researchInterests).join(", ")
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const interestsArray = formData.researchInterests
        ? formData.researchInterests.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      await fetch("/api/personal-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: info?.id,
          ...formData,
          researchInterests: JSON.stringify(interestsArray),
        }),
      });
      setIsEditModalOpen(false);
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  const displayName = info?.name || "Loading...";
  const displayTitle = info?.title || "";

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <img
                src="/aman.png"
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1 leading-tight">
                  {displayName}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2">
                  {displayTitle}
                </p>
              </div>
              {session && (
                <ActionButtons onEdit={openEditModal} size="sm" />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <a
                key={index}
                href={link.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200 group py-1 px-2 rounded-lg hover:bg-gray-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconComponent size={14} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <span className="text-xs hidden sm:inline">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block space-y-6">
        <div className="flex justify-center">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <img
              src="/aman.png"
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="text-center px-2">
          <div className="flex items-start justify-center gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                {displayName}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {displayTitle}
              </p>
            </div>
          </div>
          {session && (
            <div className="flex justify-center mt-3">
              <ActionButtons onEdit={openEditModal} size="sm" />
            </div>
          )}
        </div>

        <div className="space-y-3 px-2">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <a
                key={index}
                href={link.href}
                className="flex items-center justify-start space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 group py-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <span className="text-sm break-words">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Info"
      >
        <div className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Title", key: "title", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "GitHub URL", key: "githubUrl", type: "text" },
            { label: "GitHub Label", key: "githubLabel", type: "text" },
            { label: "Google Scholar URL", key: "scholarUrl", type: "text" },
            { label: "LinkedIn URL", key: "linkedinUrl", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={(formData as unknown as Record<string, string>)[key] || ""}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Research Interests (comma-separated)
            </label>
            <textarea
              value={formData.researchInterests || ""}
              onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="NLP, Computer Vision, Agentic AI"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
