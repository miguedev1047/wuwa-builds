import { FlickeringGrid } from "@/components/ui/flickering-grid"

export function DotGridBackground() {
  return (
    <div className="absolute inset-x-0 h-125 w-full mask-t-from-90% mask-b-from-50%">
      <FlickeringGrid
        className="size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </div>
  )
}
