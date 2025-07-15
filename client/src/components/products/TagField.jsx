import XMarkIcon from "../../assets/icons/xmark.svg?react"
import SearchIcon from "../../assets/icons/search.svg?react"

import Button from "../common/Button"
import Input from "../common/Input"

const TagField = ({
  index,
  field,
  register,
  errors,
  clearErrors,
  isSearchable,
  onSetAsSearchTag,
  onRemoveFromSearchTags,
  onRemove,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Input
        {...register(`tags.${index}.key`, {
          required: "key is required",
          onChange: () => clearErrors && clearErrors(`tags.${field.id}.key`),
        })}
        label={index === 0 ? "key" : ""}
        disabled={disabled}
        error={errors?.tags?.[index]?.key?.message}
      />
      <Input
        {...register(`tags.${index}.value`, {
          required: "value is required",
          onChange: () => clearErrors && clearErrors(`tags.${field.id}.value`),
        })}
        label={index === 0 ? "value" : ""}
        disabled={disabled}
        error={errors?.tags?.[index]?.value?.message}
      />
      {isSearchable ? (
        <Button
          type="button"
          wrapperClassName="mt-auto my-1"
          className="h-8 w-8 grid place-content-center bg-blue-400 hover:bg-blue-500"
          tooltip="remove from search tags"
          onClick={onRemoveFromSearchTags}
          disabled={disabled}
        >
          <SearchIcon className="icon text-background" />
        </Button>
      ) : (
        <Button
          type="button"
          wrapperClassName="mt-auto my-1"
          className="h-8 w-8 grid place-content-center bg-gray-500 hover:bg-gray-600"
          tooltip="set as search tag"
          onClick={onSetAsSearchTag}
          disabled={disabled}
        >
          <SearchIcon className="icon text-background" />
        </Button>
      )}
      <Button
        type="button"
        wrapperClassName="mt-auto my-1"
        className="mt-auto h-8 w-8 grid place-content-center bg-red"
        tooltip="remove tag"
        tooltipPosition="right"
        onClick={() => onRemove(field.id)}
        disabled={disabled}
      >
        <XMarkIcon className="icon text-background" />
      </Button>
    </div>
  )
}

export default TagField
