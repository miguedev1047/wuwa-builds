import { Card } from "@/components/panelui/card"
import { cn } from "cn"
import { type ComponentProps } from "react"

export function EditableSectionCard({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="editable-section-card"
      className={cn("rounded-lg", className)}
      {...props}
    />
  )
}

export function EditableSectionCardHeader({
  className,
  ...props
}: ComponentProps<typeof Card.Header>) {
  return (
    <Card.Header
      data-slot="editable-section-card-header"
      className={className}
      {...props}
    />
  )
}

export function EditableSectionCardTitle({
  className,
  ...props
}: ComponentProps<typeof Card.Title>) {
  return (
    <Card.Title
      data-slot="editable-section-card-title"
      className={cn("text-xs/relaxed", className)}
      {...props}
    />
  )
}

export function EditableSectionCardDescription({
  className,
  ...props
}: ComponentProps<typeof Card.Description>) {
  return (
    <Card.Description
      data-slot="editable-section-card-description"
      className={className}
      {...props}
    />
  )
}

export function EditableSectionCardAction({
  className,
  ...props
}: ComponentProps<typeof Card.Action>) {
  return (
    <Card.Action
      data-slot="editable-section-card-action"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

export function EditableSectionCardContent({
  className,
  ...props
}: ComponentProps<typeof Card.Content>) {
  return (
    <Card.Content
      data-slot="editable-section-card-content"
      className={className}
      {...props}
    />
  )
}

export function EditableSectionCardFooter({
  className,
  ...props
}: ComponentProps<typeof Card.Footer>) {
  return (
    <Card.Footer
      data-slot="editable-section-card-footer"
      className={className}
      {...props}
    />
  )
}
