/// <reference types="bun" />

import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { EditableSection } from "@catalog/presentation/components/editable-section"

type Row = { id: number; name: string }

const rows: Row[] = [
  { id: 1, name: "Yangyang" },
  { id: 2, name: "Rover" },
]

describe("EditableSection", () => {
  test("renders the section shell with media and body", () => {
    const html = renderToStaticMarkup(
      <EditableSection.Root>
        <EditableSection.Header>
          <EditableSection.Title>Resonador: Yangyang</EditableSection.Title>
          <EditableSection.Description>
            Datos de la base de datos
          </EditableSection.Description>
          <EditableSection.Action>
            <button type="button">Editar</button>
          </EditableSection.Action>
        </EditableSection.Header>

        <EditableSection.Content className="flex gap-4">
          <EditableSection.Media />
          <EditableSection.Body>
            <EditableSection.Heading>Yangyang</EditableSection.Heading>
            <EditableSection.Text>Introducción</EditableSection.Text>
          </EditableSection.Body>
        </EditableSection.Content>
      </EditableSection.Root>
    )

    expect(html).toContain('data-slot="editable-section"')
    expect(html).toContain('data-slot="editable-section-header"')
    expect(html).toContain('data-slot="editable-section-action"')
    expect(html).toContain('data-slot="editable-section-description"')
    expect(html).toContain('data-slot="editable-section-media"')
    expect(html).toContain("Resonador: Yangyang")
    expect(html).toContain("Introducción")
  })

  test("renders a list of items through the render prop", () => {
    const html = renderToStaticMarkup(
      <EditableSection.List items={rows} getItemKey={(row) => row.id}>
        {(row) => (
          <EditableSection.Item>
            <EditableSection.ItemMedia variant="image" />
            <EditableSection.ItemContent>
              <EditableSection.ItemTitle>{row.name}</EditableSection.ItemTitle>
              <EditableSection.ItemDescription>
                Descripción
              </EditableSection.ItemDescription>
            </EditableSection.ItemContent>
            <EditableSection.ItemActions>
              <button type="button">Editar</button>
            </EditableSection.ItemActions>
          </EditableSection.Item>
        )}
      </EditableSection.List>
    )

    expect(html).toContain('role="list"')
    expect(html.match(/data-slot="editable-section-item"/g)).toHaveLength(2)
    expect(html).toContain("Yangyang")
    expect(html).toContain("Rover")
    expect(html).toContain('data-slot="item-actions"')
  })

  test("renders the empty slot instead of the list", () => {
    const html = renderToStaticMarkup(
      <EditableSection.List items={[] as Row[]} empty={<p>Sin elementos</p>}>
        {(row) => <EditableSection.Item>{row.name}</EditableSection.Item>}
      </EditableSection.List>
    )

    expect(html).toContain("Sin elementos")
    expect(html).not.toContain('role="list"')
  })

  test("renders the card parts through the compound", () => {
    const html = renderToStaticMarkup(
      <EditableSection.Card>
        <EditableSection.CardHeader>
          <EditableSection.CardTitle>Titulo</EditableSection.CardTitle>
          <EditableSection.CardDescription>
            Descripcion
          </EditableSection.CardDescription>
          <EditableSection.CardAction>
            <button type="button">Editar</button>
          </EditableSection.CardAction>
        </EditableSection.CardHeader>

        <EditableSection.CardContent>Contenido</EditableSection.CardContent>
        <EditableSection.CardFooter>Pie</EditableSection.CardFooter>
      </EditableSection.Card>
    )

    expect(html).toContain('data-slot="editable-section-card"')
    expect(html).toContain('data-slot="editable-section-card-header"')
    expect(html).toContain('data-slot="editable-section-card-title"')
    expect(html).toContain('data-slot="editable-section-card-description"')
    expect(html).toContain('data-slot="editable-section-card-action"')
    expect(html).toContain('data-slot="editable-section-card-content"')
    expect(html).toContain('data-slot="editable-section-card-footer"')
    expect(html).toContain("text-xs/relaxed")
  })

  test("add, edit and delete actions render their triggers", () => {
    const html = renderToStaticMarkup(
      <>
        <EditableSection.AddAction title="Agregar propiedad">
          {() => null}
        </EditableSection.AddAction>
        <EditableSection.EditAction title="Editar resonador">
          {() => null}
        </EditableSection.EditAction>
        <EditableSection.DeleteAction
          title="Eliminar resonador"
          onConfirm={() => {}}
        />
      </>
    )

    expect(html).toContain('aria-label="Agregar"')
    expect(html).toContain('aria-label="Editar"')
    expect(html).toContain('aria-label="Eliminar"')
  })
})
