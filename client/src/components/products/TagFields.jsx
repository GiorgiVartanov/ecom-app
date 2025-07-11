import { useFieldArray } from "react-hook-form"

import XMarkIcon from "../../assets/icons/xmark.svg?react"
import SearchIcon from "../../assets/icons/search.svg?react"

import Button from "../common/Button"
import Input from "../common/Input"
import TagField from "./TagField"

// works incorrectly, need to fix
const TagFields = ({
  control,
  register,
  setAsSearchTag,
  removeFromSearchTags,
  searchTagIds,
  removedSearchTagIds,
  errors,
  clearErrors,
  onRemove,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    keyName: "fieldKey",
  })

  return (
    <div className="py-4 border-b-2 border-t-2 border-gray-200">
      <label className="block mb-2 text-sm">Tags (key/value pairs)</label>
      {fields.map((field, index) => {
        // Determine if this tag is a search tag and not removed
        const isSearchTag =
          (searchTagIds.includes(field.id) ||
            searchTagIds.includes(field.key) ||
            field.isSearchTag) &&
          !removedSearchTagIds.includes(field.id)

        return (
          <TagField
            key={field.fieldKey}
            index={index}
            field={field}
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            isSearchTag={isSearchTag}
            onSetAsSearchTag={(idOrKey) => setAsSearchTag(idOrKey)}
            onRemoveFromSearchTags={(idOrKey) => {
              removeFromSearchTags(idOrKey)
            }}
            onRemove={(id) => {
              onRemove(id)
              remove(index)
            }}
          />
        )
      })}
      {/* {errors?.tags?.message && <p className="text-red">{errors.tags.message}</p>} */}
      <Button
        type="button"
        variant="primary"
        wrapperClassName="w-fit"
        className="bg-primary-gradient mt-1"
        tooltip="add key and value fields for a new category"
        tooltipPosition="right"
        onClick={() => append({ key: "", value: "" })}
      >
        Add tag
      </Button>
    </div>
  )
}

export default TagFields
