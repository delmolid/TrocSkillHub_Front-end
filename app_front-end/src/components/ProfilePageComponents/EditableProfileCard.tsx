import React from "react";
import { RiPencilFill } from "react-icons/ri";
import { Button } from "primereact/button";
import { cn } from "@/lib/utils";
import type { EditableProfileCardProps } from "../../types/profile.types";

const EditableProfileCard: React.FC<EditableProfileCardProps> = ({
  isEditing,
  isActive,
  onEditClick,
  onCancel,
  onSave,
  isSaving = false,
  editLabel = "Modifier cette section",
  className,
  bordered = true,
  editContent,
  children,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-white p-6 shadow-sm",
        bordered && "border border-primary-border",
        className,
      )}
    >
      {isEditing && !isActive && (
        <button
          type="button"
          onClick={onEditClick}
          aria-label={editLabel}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
        >
          <RiPencilFill className="text-lg" aria-hidden />
        </button>
      )}

      {isActive ? (
        <div className="flex flex-col gap-4">
          {editContent}
          <div className="flex justify-end gap-2 border-t border-primary-border pt-4">
            <Button
              type="button"
              label="Annuler"
              severity="secondary"
              outlined
              size="small"
              className="ts-btn-secondary ts-btn-profile"
              onClick={onCancel}
              disabled={isSaving}
            />
            <Button
              type="button"
              label={isSaving ? "Enregistrement..." : "Enregistrer"}
              size="small"
              className="ts-btn-primary ts-btn-profile"
              onClick={onSave}
              disabled={isSaving}
            />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default EditableProfileCard;
