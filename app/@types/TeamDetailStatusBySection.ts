import TeamName from "./TeamName"

export default interface TeamDetailStatusBySection {
  teamName: TeamName

  section: number

  points: number

  win: number
  draw: number
  lose: number

  goalFor: number
  goalAgainst: number
  goalDifference: number
}
