"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  addLabel?: string;
  size?: "sm" | "md";
}

export default function ActionButtons({
  onAdd,
  onEdit,
  onDelete,
  addLabel = "Add",
  size = "sm",
}: ActionButtonsProps) {
  const btnClass =
    size === "sm"
      ? "flex items-center gap-1 px-2 py-1 text-xs rounded font-medium transition-colors duration-200"
      : "flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200";

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div className="flex items-center gap-1">
      {onAdd && (
        <button
          onClick={onAdd}
          className={`${btnClass} bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200`}
        >
          <Plus size={iconSize} />
          {addLabel}
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${btnClass} bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200`}
        >
          <Pencil size={iconSize} />
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${btnClass} bg-red-50 text-red-600 hover:bg-red-100 border border-red-200`}
        >
          <Trash2 size={iconSize} />
          Delete
        </button>
      )}
    </div>
  );
}
