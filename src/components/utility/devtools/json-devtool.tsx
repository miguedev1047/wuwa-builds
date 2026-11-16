import { Card } from "@/components/panelui/card"

interface JsonDevtoolProps {
  data: unknown
  title?: string
}

/** Dev-only card that prints any payload as formatted JSON. */
export function JsonDevtool({ data, title = "Response" }: JsonDevtoolProps) {
  if (!import.meta.env.DEV) return null

  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>

      <Card.Content className="min-w-0">
        <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-4 text-xs">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </Card.Content>
    </Card>
  )
}
