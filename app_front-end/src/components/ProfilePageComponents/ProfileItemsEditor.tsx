import React from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { formatIsoDate, parseIsoDate } from "../../utils/dateHelpers";

type FieldType = "text" | "textarea" | "date";

export type ProfileItemField<T> = {
  key: keyof T;
  label: string;
  type?: FieldType;
  placeholder?: string;
  halfWidth?: boolean;
};

interface ProfileItemsEditorProps<T extends object> {
  id: string;
  label: string;
  items: T[];
  fields: ProfileItemField<T>[];
  createEmpty: () => T;
  itemTitle: (index: number) => string;
  onChange: (items: T[]) => void;
}

function ProfileItemsEditor<T extends object>({
  id,
  label,
  items,
  fields,
  createEmpty,
  itemTitle,
  onChange,
}: ProfileItemsEditorProps<T>) {
  const updateField = (index: number, key: keyof T, value: string) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const addItem = () => {
    onChange([...items, createEmpty()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <span className="profile-field-label">{label}</span>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${id}-${index}`}
            className="profile-form-block space-y-3 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-text">
                {itemTitle(index)}
              </p>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const fieldId = `${id}-${String(field.key)}-${index}`;
                const value = (item[field.key] as string | undefined) ?? "";

                if (field.type === "textarea") {
                  return (
                    <div
                      key={fieldId}
                      className="profile-field space-y-2 sm:col-span-2"
                    >
                      <label htmlFor={fieldId} className="profile-field-label">
                        {field.label}
                      </label>
                      <InputTextarea
                        id={fieldId}
                        value={value}
                        placeholder={field.placeholder}
                        rows={4}
                        autoResize
                        onChange={(e) =>
                          updateField(index, field.key, e.target.value)
                        }
                      />
                    </div>
                  );
                }

                if (field.type === "date") {
                  return (
                    <div
                      key={fieldId}
                      className={`profile-field space-y-2 ${field.halfWidth ? "" : "sm:col-span-2"}`}
                    >
                      <label htmlFor={fieldId} className="profile-field-label">
                        {field.label}
                      </label>
                      <Calendar
                        inputId={fieldId}
                        value={parseIsoDate(value)}
                        dateFormat="yy-mm-dd"
                        showIcon
                        panelClassName="ts-calendar-panel"
                        onChange={(e) =>
                          updateField(
                            index,
                            field.key,
                            formatIsoDate(e.value as Date | null),
                          )
                        }
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={fieldId}
                    className={`profile-field space-y-2 ${field.halfWidth ? "" : "sm:col-span-2"}`}
                  >
                    <label htmlFor={fieldId} className="profile-field-label">
                      {field.label}
                    </label>
                    <InputText
                      id={fieldId}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(e) =>
                        updateField(index, field.key, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
  );
}

export default ProfileItemsEditor;
