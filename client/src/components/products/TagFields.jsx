import { useFieldArray } from "react-hook-form"

import XMark from "../../assets/icons/xmark.svg?react"

import Button from "../common/Button"
import Input from "../common/Input"

const TagFields = ({ control, register, errors, onRemove }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    keyName: "fieldKey",
  })

  return (
    <div>
      <label className="block mb-2 text-sm">Tags (key/value pairs)</label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-center gap-2 mb-2"
        >
          <Input
            {...register(`tags.${index}.key`, { required: "key is required" })}
            label="key"
          />
          <Input
            {...register(`tags.${index}.value`, { required: "value is required" })}
            label="value"
          />
          <Button
            type="button"
            className="mt-auto px-2.5 border-1 border-primary"
            onClick={() => {
              console.log(`deleting ${field.id}`)

              onRemove(field.id)
              remove(index)
            }}
          >
            <XMark className="icon text-background" />
          </Button>
        </div>
      ))}
      {errors.tags && <p className="text-red">{errors.tags.message}</p>}
      <Button
        type="button"
        onClick={() => append({ key: "", value: "" })}
      >
        add tag
      </Button>
    </div>
  )
}

export default TagFields
