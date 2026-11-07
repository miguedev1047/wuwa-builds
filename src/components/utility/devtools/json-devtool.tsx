import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JsonDevtoolProps {
  data: unknown
  title?: string
}

/** Dev-only card that prints any payload as formatted JSON. */
export function JsonDevtool({ data, title = "Response" }: JsonDevtoolProps) {
  if (!import.meta.env.DEV) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="min-w-0">
        <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-4 text-xs">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  )
}
