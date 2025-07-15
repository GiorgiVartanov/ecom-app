import { useFieldArray } from "react-hook-form"

import useAdminStore from "../../store/useAdminStore"

import Button from "../common/Button"
import Input from "../common/Input"
import TagField from "./TagField"

const TagFields = ({
  control,
  register,
  setAsSearchTag,
  removeFromSearchTags,
  errors,
  clearErrors,
  onRemove,
}) => {
  const existingTags = useAdminStore((state) => state.tags)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    keyName: "fieldKey",
  })

  return (
    <div className="py-4 border-b-2 border-t-2 border-gray-200">
      <label className="block mb-2 text-sm">Tags (key/value pairs)</label>
      {fields.map((field, index) => {
        return (
          <TagField
            key={field.fieldKey}
            existingTags={existingTags}
            index={index}
            field={field}
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            isSearchable={field.isSearchable}
            onSetAsSearchTag={() => setAsSearchTag(index)}
            onRemoveFromSearchTags={() => {
              removeFromSearchTags(index)
            }}
            onRemove={(id) => {
              onRemove(id)
              remove(index)
            }}
          />
        )
      })}
      <Button
        type="button"
        variant="primary"
        wrapperClassName="w-fit"
        className="bg-primary-gradient mt-1"
        tooltip="add key and value fields for a new category"
        tooltipPosition="right"
        onClick={() => append({ key: "", value: "", isSearchable: false })}
      >
        Add tag
      </Button>
    </div>
  )
}

export default TagFields
