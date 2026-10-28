export interface EncorePropertyGrowth {
  level: number
  value: number | string
}

export interface EncoreProperty {
  name: string
  icon: string
  baseValue: number
  growth: EncorePropertyGrowth[]
}
