import type TeamDetailStatusBySection from './TeamDetailStatusBySection'
import type Rank from './Rank'

type TeamDetailStatusBySectionWithTable = TeamDetailStatusBySection & Rank & { matches: number }

export default TeamDetailStatusBySectionWithTable
