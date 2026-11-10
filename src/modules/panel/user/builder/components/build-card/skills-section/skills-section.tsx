import { BuildCardSectionDialog } from "@builder/ui/build-card-section"
import { SkillsEditor } from "@builder/components/build-card/skills-section/skills-editor"
import { SkillsTrigger } from "@builder/components/build-card/skills-section/skills-trigger"

/** Editable card for the resonator skills and passives. */
export function SkillsSection() {
  return (
    <BuildCardSectionDialog
      title="Habilidades"
      description="Ajusta los niveles de las habilidades y activa las pasivas del resonador."
      dialogContent={{ size: "lg" }}
      trigger={<SkillsTrigger />}
    >
      {() => <SkillsEditor />}
    </BuildCardSectionDialog>
  )
}
