import {
  authRelations,
  buildsRelations,
  echoRelations,
  resonatorRelations,
  weaponRelations,
} from "@/db/schema"

/**
 * Every table part contributes its own key, so a plain spread merges them.
 * Only `user` is shared (auth + builds), so its nested relations are merged
 * explicitly instead of letting one part overwrite the other.
 */
export const relations = {
  ...authRelations,
  ...buildsRelations,
  ...resonatorRelations,
  ...weaponRelations,
  ...echoRelations,
  user: {
    ...authRelations.user,
    ...buildsRelations.user,
    relations: {
      ...authRelations.user.relations,
      ...buildsRelations.user.relations,
    },
  },
}
