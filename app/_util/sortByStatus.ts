import type TeamDetailStatusBySection from '@/app/@types/TeamDetailStatusBySection'

export function sortByStatus (a: TeamDetailStatusBySection, b: TeamDetailStatusBySection): number {
  if (a.points !== b.points) {
    return b.points - a.points
  }
  if (a.goalDifference !== b.goalDifference) {
    return b.goalDifference - a.goalDifference
  }
  if (a.goalFor !== b.goalFor) {
    return b.goalFor - a.goalFor
  }
  return 0
}
