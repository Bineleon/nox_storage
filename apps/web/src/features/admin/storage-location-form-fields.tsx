import type { StorageLocationInput } from "@deco/shared";

type StorageLocationFormFieldsProps = {
  values: StorageLocationInput;
  onChange: (values: StorageLocationInput) => void;
  idPrefix: string;
  disabled?: boolean;
};

export function StorageLocationFormFields({
  values,
  onChange,
  idPrefix,
  disabled = false
}: StorageLocationFormFieldsProps) {
  const update = <K extends keyof StorageLocationInput>(field: K, value: StorageLocationInput[K]) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <>
      <div className="field">
        <label htmlFor={`${idPrefix}-name`}>Nom</label>
        <input
          id={`${idPrefix}-name`}
          value={values.name}
          onChange={event => update("name", event.target.value)}
          maxLength={120}
          required
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-description`}>Description</label>
        <textarea
          id={`${idPrefix}-description`}
          value={values.description ?? ""}
          onChange={event => update("description", event.target.value || null)}
          maxLength={500}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-address`}>Adresse</label>
        <input
          id={`${idPrefix}-address`}
          value={values.addressLine}
          onChange={event => update("addressLine", event.target.value)}
          maxLength={255}
          required
          disabled={disabled}
        />
      </div>
      <div className="grid grid-2">
        <div className="field">
          <label htmlFor={`${idPrefix}-postal`}>Code postal</label>
          <input
            id={`${idPrefix}-postal`}
            value={values.postalCode}
            onChange={event => update("postalCode", event.target.value)}
            maxLength={20}
            required
            disabled={disabled}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-city`}>Ville</label>
          <input
            id={`${idPrefix}-city`}
            value={values.city}
            onChange={event => update("city", event.target.value)}
            maxLength={120}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
}

export const emptyStorageLocationInput: StorageLocationInput = {
  name: "",
  description: null,
  addressLine: "",
  postalCode: "",
  city: ""
};

export function toStorageLocationInput(row: {
  name: string;
  description: string | null;
  addressLine: string;
  postalCode: string;
  city: string;
}): StorageLocationInput {
  return {
    name: row.name,
    description: row.description,
    addressLine: row.addressLine,
    postalCode: row.postalCode,
    city: row.city
  };
}
