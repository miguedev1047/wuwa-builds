import { Select } from "@/components/panelui/select"

/** Select item displayed by QuerySelect. */
export type QuerySelectItem = {
  label: string
  value: string | number
  icon?: string
}

/** Controlled select primitive for values backed by URL or other state. */
export type QuerySelectProps = {
  items: QuerySelectItem[]
  value: string | number | null
  onValueChange: (value: string | number | null) => void
  placeholder: string
  disabled?: boolean
}

/** Renders a controlled select without coupling it to a query-state library. */
export function QuerySelect({
  items,
  value,
  onValueChange,
  placeholder,
  disabled,
}: QuerySelectProps) {
  return (
    <Select<string | number>
      value={value}
      items={items}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content className="max-h-100!">
        {items.map((option) => (
          <Select.Item
            key={option.value}
            value={option.value}
            icon={
              option.icon ? (
                <img
                  src={option.icon}
                  alt=""
                  className="size-full object-contain"
                />
              ) : undefined
            }
          >
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
