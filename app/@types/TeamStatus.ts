import TeamName from "./TeamName"
import GameResult from "./GameResult"

export default interface TeamStatus {
  teamName: TeamName
  gameResults: GameResult[]
}
