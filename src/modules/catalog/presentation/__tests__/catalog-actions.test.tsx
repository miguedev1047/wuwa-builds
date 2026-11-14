import { expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import {
  CatalogActionsProvider,
  useCatalogActions,
} from "@catalog/presentation/catalog-actions"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import type { ReactNode } from "react"

/** A non-router host can supply ordinary links to the catalog. */
function DetailLink({ id, children }: { id: number; children: ReactNode }) {
  return <a href={`#weapon-${id}`}>{children}</a>
}

/** Exercises the same navigation contract used by lists and forms. */
function CatalogContent() {
  const { DetailLink: ItemLink, createLink } = useCatalogActions()
  return (
    <>
      <ItemLink id={123}>Weapon</ItemLink>
      <CatalogSection.Empty
        title="Empty"
        description="No items"
        action={createLink}
      />
    </>
  )
}

test("catalog navigation slots render without a router provider", () => {
  const html = renderToStaticMarkup(
    <CatalogActionsProvider
      actions={{
        DetailLink,
        createLink: <a href="#new">Create weapon</a>,
        onCreated: () => {},
        onDeleted: () => {},
      }}
    >
      <CatalogContent />
    </CatalogActionsProvider>
  )
  expect(html).toContain('href="#weapon-123"')
  expect(html).toContain('href="#new"')
  expect(html).toContain("Create weapon")
})

test("missing host callbacks fail explicitly", () => {
  expect(() => renderToStaticMarkup(<CatalogContent />)).toThrow(
    "CatalogActionsProvider is required"
  )
})
