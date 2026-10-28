import { authRelations, buildsRelations } from "@/db/schema"

/**
 * Both relation parts add fields to `user`, so the nested `relations` object is
 * merged instead of letting one part overwrite the other.
 */
export const relations = {
  ...authRelations,
  ...buildsRelations,
  user: {
    ...authRelations.user,
    ...buildsRelations.user,
    relations: {
      ...authRelations.user.relations,
      ...buildsRelations.user.relations,
    },
  },
}
