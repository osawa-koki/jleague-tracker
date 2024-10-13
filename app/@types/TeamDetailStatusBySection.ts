import type GameResult from './GameResult'
import type TeamName from './TeamName'

export default interface TeamDetailStatusBySection {
  teamName: TeamName

  section: number
  gameResults: GameResult[]

  points: number

  win: number
  draw: number
  lose: number

  goalFor: number
  goalAgainst: number
  goalDifference: number
}
