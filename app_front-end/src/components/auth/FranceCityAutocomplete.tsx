import React, { useEffect, useId, useState } from "react";
import { InputText } from "primereact/inputtext";
import { cn } from "@/lib/utils";
import { useBanCommuneSearch } from "@/hooks/useBanCommuneSearch";
import type { BanCommuneSuggestion } from "@/types/ban.types";

type FranceCityAutocompleteProps = {
  value: string;
  onChange: (city: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

export const FranceCityAutocomplete: React.FC<FranceCityAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
}) => {
  const listId = useId();
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const { data, isFetching, error } = useBanCommuneSearch(
    inputValue,
    isOpen && !disabled,
  );

  const suggestions = data ?? [];

  const handleSelect = (suggestion: BanCommuneSuggestion) => {
    setInputValue(suggestion.city);
    onChange(suggestion.city);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-1">
      <InputText
        value={inputValue}
        disabled={disabled}
        placeholder="Commune (ex. Paris, 75001…)"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          onBlur?.();
          window.setTimeout(() => setIsOpen(false), 150);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setInputValue(next);
          onChange(next);
          setIsOpen(true);
        }}
      />

      {error && (
        <p className="auth-message-error">
          {error instanceof Error
            ? error.message
            : "Impossible de contacter l'API BAN."}
        </p>
      )}

      {isOpen && !disabled && inputValue.trim().length >= 2 && (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            "absolute top-full z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-[10px]",
            "border border-white/30 bg-white py-1 shadow-lg",
          )}
        >
          {isFetching && (
            <li className="px-4 py-2 text-sm text-text">Recherche…</li>
          )}

          {!isFetching && suggestions.length === 0 && (
            <li className="px-4 py-2 text-sm text-text">
              Aucune commune trouvée
            </li>
          )}

          {!isFetching &&
            suggestions.map((suggestion) => (
              <li key={suggestion.code} role="option">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-[#fafbf9]"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(suggestion)}
                >
                  {suggestion.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
