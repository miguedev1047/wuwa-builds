import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { EditableSectionAction } from "@catalog/presentation/components/editable-section/components/editable-section-action"
import {
  EditableSectionCard,
  EditableSectionCardAction,
  EditableSectionCardContent,
  EditableSectionCardDescription,
  EditableSectionCardFooter,
  EditableSectionCardHeader,
  EditableSectionCardTitle,
} from "@catalog/presentation/components/editable-section/components/editable-section-card"
import {
  EditableSectionImage,
  EditableSectionItemMedia,
} from "@catalog/presentation/components/editable-section/components/editable-section-image"
import {
  EditableSectionActions,
  EditableSectionContent,
  EditableSectionDescription,
  EditableSectionHeader,
  EditableSectionRoot,
  EditableSectionTitle,
} from "@catalog/presentation/components/editable-section/components/editable-section-layout"
import {
  EditableSectionItem,
  EditableSectionList,
} from "@catalog/presentation/components/editable-section/components/editable-section-list"
import {
  EditableSectionBody,
  EditableSectionHeading,
  EditableSectionMedia,
  EditableSectionText,
} from "@catalog/presentation/components/editable-section/components/editable-section-media"
export const EditableSection = {
  Root: EditableSectionRoot,
  Header: EditableSectionHeader,
  Title: EditableSectionTitle,
  Description: EditableSectionDescription,
  Actions: EditableSectionActions,
  Action: EditableSectionAction,
  Content: EditableSectionContent,
  Media: EditableSectionMedia,
  Body: EditableSectionBody,
  Heading: EditableSectionHeading,
  Text: EditableSectionText,
  List: EditableSectionList,
  Image: EditableSectionImage,
  Item: EditableSectionItem,
  ItemMedia: EditableSectionItemMedia,
  ItemContent: ItemContent,
  ItemTitle: ItemTitle,
  ItemDescription: ItemDescription,
  ItemActions: ItemActions,
  Card: EditableSectionCard,
  CardHeader: EditableSectionCardHeader,
  CardTitle: EditableSectionCardTitle,
  CardDescription: EditableSectionCardDescription,
  CardAction: EditableSectionCardAction,
  CardContent: EditableSectionCardContent,
  CardFooter: EditableSectionCardFooter,
} as const
