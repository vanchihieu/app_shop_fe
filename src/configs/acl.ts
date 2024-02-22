import { AbilityBuilder, Ability } from '@casl/ability'
import { PERMISSIONS } from 'src/configs/permission'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (permissionUser: string[], permission?: string[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (
    !permission?.length ||
    permissionUser.includes(PERMISSIONS.ADMIN) ||
    permission.every(item => permissionUser.includes(item))
  ) {
    can('manage', 'all')
  }

  return rules
}

export const buildAbilityFor = (permissionUser: string[], permission?: string[]): AppAbility => {
  return new AppAbility(defineRulesFor(permissionUser, permission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
