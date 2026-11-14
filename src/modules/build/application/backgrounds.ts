import background1 from "@/assets/backgrounds/background-01.webp"
import background2 from "@/assets/backgrounds/background-02.webp"
import background3 from "@/assets/backgrounds/background-03.webp"
import background4 from "@/assets/backgrounds/background-04.webp"
import background5 from "@/assets/backgrounds/background-05.webp"
import background6 from "@/assets/backgrounds/background-06.webp"
import background7 from "@/assets/backgrounds/background-07.webp"
import background8 from "@/assets/backgrounds/background-08.webp"
import background9 from "@/assets/backgrounds/background-09.webp"
import background10 from "@/assets/backgrounds/background-10.webp"
import background11 from "@/assets/backgrounds/background-11.webp"
import background12 from "@/assets/backgrounds/background-12.webp"
import background13 from "@/assets/backgrounds/background-13.webp"

export const BACKGROUNDS = [
  background1,
  background2,
  background3,
  background4,
  background5,
  background6,
  background7,
  background8,
  background9,
  background10,
  background11,
  background12,
  background13,
]

/** Index of a random background, used to seed new builds. */
export function randomBackgroundIndex(): number {
  return Math.floor(Math.random() * BACKGROUNDS.length)
}
