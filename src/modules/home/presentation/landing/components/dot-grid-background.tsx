import { DotGrid } from "@/components/ui/dot-grid"

export function DotGridBackground() {
  return (
    <div className="absolute inset-x-0 top-0 z-0 h-300 w-full mask-y-from-80% opacity-10">
      <DotGrid
        className="z-0 size-full"
        baseColor="var(--accent)"
        activeColor="#ffffff"
        shape="square"
        dotSize={6}
        gap={14}
        proximity={140}
        strength={1}
        bounce={0.7}
        tension={0.3}
        returnDuration={0.8}
        shockRadius={320}
        shockStrength={5}
        swell={0.8}
        stretch={0.4}
        glow={0.2}
        fade={0}
        intro
        opacity={1}
        mouseInteraction
        clickShock
      />
    </div>
  )
}
