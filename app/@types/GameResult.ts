import type TeamName from './TeamName'

export default interface GameResult {
  ourScore: number
  theirScore: number
  isHome: boolean
  opponentTeamName: TeamName
}
