import { expect, test } from "bun:test"
import ts from "typescript"

/** Resolves imports structurally so comments and strings are not violations. */
test("modules respect the routing boundary", async () => {
  const violations: string[] = []
  const root = new URL("../../modules/", import.meta.url).pathname
  for await (const path of new Bun.Glob("**/*.{ts,tsx}").scan(root)) {
    const source = await Bun.file(`${root}${path}`).text()
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true)
    const isPresentation = path.split("/").includes("presentation")
    const visit = (node: ts.Node) => {
      let target: string | undefined
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        target = node.moduleSpecifier.text
      }
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          node.expression.getText(file) === "require") &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        target = node.arguments[0].text
      }
      const importsRouter =
        !!target && /^@tanstack\/react-router(?:\/|$)/.test(target)
      const importsRouting =
        !!target &&
        (/^@\/(routes|routing)(\/|$)/.test(target) ||
          /(?:^|\/)\.\.(?:\/.*)?\/(routes|routing)(?:\/|$)/.test(target))
      if ((!isPresentation && importsRouter) || importsRouting) {
        violations.push(`${path}: ${target}`)
      }
      ts.forEachChild(node, visit)
    }
    visit(file)
  }
  expect(violations).toEqual([])
})
