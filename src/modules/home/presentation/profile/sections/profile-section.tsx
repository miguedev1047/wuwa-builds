import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Avatar } from "@/components/panelui/avatar"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { ProfileView } from "@/modules/home/domain/profile"
import { ProfileDialog } from "../components/profile-dialog"

interface ProfileSectionProps {
  /** Authorized profile displayed in the header. */
  profile: ProfileView
  /** Refreshes the profile query after saving. */
  onSaved: () => Promise<void>
}

/** Renders the profile header and its owner actions. */
export function ProfileSection({ profile, onSaved }: ProfileSectionProps) {
  return (
    <RouteNavigation.Root variant="wide">
      <RouteNavigation.Content>
        <div className="relative h-120 w-full space-y-4">
          <Show
            when={profile.thumbnailUrl}
            fallback={<div className="size-full rounded-md bg-accent" />}
          >
            {(thumbnail) => (
              <Image
                src={thumbnail}
                size="full"
                background="transparent"
                className="size-full object-cover"
                alt={profile.name}
              />
            )}
          </Show>
          <div className="absolute bottom-0 left-8 translate-y-1/2">
            <Avatar
              alt={profile.name}
              src={profile.photoUrl ?? undefined}
              name={profile.name}
              size="2xl"
            />
          </div>
          <div className="ml-40 flex items-center justify-between">
            <RouteNavigation.Title>
              {profile.gameName ? profile.gameName : profile.name}
            </RouteNavigation.Title>
            <ProfileDialog profile={profile} onSaved={onSaved} />
          </div>
        </div>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}
