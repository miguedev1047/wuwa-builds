interface NumberConverterProps {
  input: string
}

export function numberConverter({ input }: NumberConverterProps): number {
  const match = input.match(/[+-]?\d+(\.\d+)?/)
  const number = match ? parseFloat(match[0]) : 0

  return number
}
