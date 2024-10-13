import type TeamName from './TeamName'
import type GameResult from './GameResult'

export default interface TeamStatus {
  teamName: TeamName
  gameResults: GameResult[]
}
