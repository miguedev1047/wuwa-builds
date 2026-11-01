/** Database ids are positive integers; guard client actions before mutating. */
export function isValidId(id: number): boolean {
  return Number.isInteger(id) && id > 0
}
