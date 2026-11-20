// Adapted from React Bits Scroll Reveal (TS-TW).
// https://reactbits.dev/text-animations/scroll-reveal
import { useEffect, useRef } from "react"

type ScrollRevealProps = {
  /** Plain text, with a newline at each intentional line break. */
  children: string
}

/** Reveals words in reading order as each line enters the viewport. */
export function ScrollReveal({ children }: ScrollRevealProps) {
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const element = heading.current
    if (!element || !("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue

          target.setAttribute("data-revealed", "")
          observer.unobserve(target)
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.1 }
    )

    for (const word of element.querySelectorAll("[data-reveal-word]")) {
      observer.observe(word)
    }
    element.setAttribute("data-reveal-ready", "")

    return () => observer.disconnect()
  }, [])

  const lines = children.split("\n").map((line) => line.split(" "))
  const words = lines.flat()

  return (
    <h2
      ref={heading}
      aria-label={words.join(" ")}
      className="motion-safe:data-reveal-ready:[&_[data-reveal-word]:not([data-revealed])]:opacity-30"
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block" aria-hidden="true">
          {line.map((word, index) => (
            <RevealWord
              key={index}
              order={lines
                .slice(0, lineIndex)
                .reduce((count, previous) => count + previous.length, index)}
            >
              {word}
            </RevealWord>
          ))}
        </span>
      ))}
    </h2>
  )
}

function RevealWord({ children, order }: { children: string; order: number }) {
  return (
    <>
      <span
        data-reveal-word=""
        className="inline-block motion-safe:data-revealed:transition-opacity motion-safe:data-revealed:duration-700 motion-safe:data-revealed:ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transitionDelay: `${order * 65}ms` }}
      >
        {children}
      </span>{" "}
    </>
  )
}
