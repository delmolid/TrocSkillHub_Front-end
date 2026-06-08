import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import type { Knowledge } from "../../types/knowledge.types";
import type { skills } from "../../types/UserProfile.types";

interface KnowledgeListEditorProps {
  id: string;
  label: string;
  items: skills[];
  knowledges: Knowledge[];
  isLoading?: boolean;
  isError?: boolean;
  onChange: (items: skills[]) => void;
}

const KnowledgeListEditor: React.FC<KnowledgeListEditorProps> = ({
  id,
  label,
  items,
  knowledges,
  isLoading = false,
  isError = false,
  onChange,
}) => {
  const options = knowledges.map((knowledge) => ({
    label: knowledge.name,
    value: knowledge.id,
  }));

  const updateItem = (index: number, knowledgeId: number | null) => {
    const selected = knowledges.find((k) => k.id === knowledgeId);
    if (!selected) return;

    onChange(
      items.map((item, i) =>
        i === index
          ? { knowledgeId: selected.id, knowledgeName: selected.name }
          : item,
      ),
    );
  };

  const addItem = () => {
    onChange([...items, { knowledgeName: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label htmlFor={`${id}-0`} className="profile-field-label">
        {label}
      </label>

      {isLoading && (
        <p className="text-sm text-text">Chargement des connaissances...</p>
      )}

      {isError && (
        <p className="text-sm text-red-600">
          Impossible de charger la liste des connaissances.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-text italic">Aucun élément sélectionné.</p>
          ) : (
            items.map((item, index) => (
              <div key={`${id}-${index}`} className="profile-field flex items-center gap-2">
                <Dropdown
                  inputId={index === 0 ? `${id}-0` : undefined}
                  className="profile-dropdown flex-1"
                  panelClassName="ts-dropdown-panel"
                  value={item.knowledgeId ?? null}
                  options={options}
                  onChange={(e) => updateItem(index, e.value)}
                  placeholder={item.knowledgeName || "Choisir une connaissance"}
                  optionLabel="label"
                  optionValue="value"
                />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  size="small"
                  className="ts-btn-secondary"
                  onClick={() => removeItem(index)}
                  aria-label="Supprimer"
                />
              </div>
            ))
          )}

          <Button
            type="button"
            label="+ Ajouter"
            severity="secondary"
            outlined
            size="small"
            className="ts-btn-secondary ts-btn-profile"
            onClick={addItem}
          />
        </div>
      )}
    </div>
  );
};

export default KnowledgeListEditor;
