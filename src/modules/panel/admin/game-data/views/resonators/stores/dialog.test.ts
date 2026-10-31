/// <reference types="bun" />

import { beforeEach, describe, expect, test } from "bun:test"
import { useResonatorDialog } from "./dialog"

describe("useResonatorDialog", () => {
  beforeEach(() => {
    useResonatorDialog.getState().close()
  })

  test("opens and closes through the actions", () => {
    expect(useResonatorDialog.getState().isOpen).toBe(false)

    useResonatorDialog.getState().open()
    expect(useResonatorDialog.getState().isOpen).toBe(true)

    useResonatorDialog.getState().close()
    expect(useResonatorDialog.getState().isOpen).toBe(false)
  })

  test("setIsOpen updates the state", () => {
    useResonatorDialog.getState().setIsOpen(true)
    expect(useResonatorDialog.getState().isOpen).toBe(true)
  })

  test("toggle flips the current value", () => {
    useResonatorDialog.getState().toggle()
    expect(useResonatorDialog.getState().isOpen).toBe(true)
    useResonatorDialog.getState().toggle()
    expect(useResonatorDialog.getState().isOpen).toBe(false)
  })
})
