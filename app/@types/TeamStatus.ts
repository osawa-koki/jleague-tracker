import TeamName from "./TeamName"
import GameResult from "./GameResult"

export default interface TeamStatus {
  team_name: TeamName
  game_results: GameResult[]
}
