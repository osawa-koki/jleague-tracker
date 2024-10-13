import React, { useMemo, useState } from 'react'

import { Form, Table } from 'react-bootstrap'
import TeamStatus from '@/app/@types/TeamStatus'
import TeamDetailStatusBySection from '@/app/@types/TeamDetailStatusBySection'
import { sortByStatus } from '@/app/_util/sortByStatus'
import sum from '@/app/_util/sum'

interface Props {
  teamStatuses: TeamStatus[]
}

export default function LeagueTable(props: Props) {
  const { teamStatuses } = props

  const maxSection = useMemo(() => {
    return Math.max(...teamStatuses.map(status => status.gameResults.length))
  }, [teamStatuses])
  const [section, setSection] = useState<number>(maxSection)

  const teamDetailStatuses = useMemo(() => {
    return teamStatuses.map((status): TeamDetailStatusBySection => {
      const teamName = status.teamName
      const targetGameResults = status.gameResults.slice(0, section)
      const win = targetGameResults.filter(result => result.ourScore > result.theirScore).length
      const draw = targetGameResults.filter(result => result.ourScore === result.theirScore).length
      const lose = targetGameResults.filter(result => result.ourScore < result.theirScore).length
      const points = win * 3 + draw
      const goalFor = targetGameResults.reduce((sum, result) => sum + result.ourScore, 0)
      const goalAgainst = targetGameResults.reduce((sum, result) => sum + result.theirScore, 0)
      const goalDifference = goalFor - goalAgainst

      return {
        teamName: teamName,
        section,
        points,
        win,
        draw,
        lose,
        goalFor,
        goalAgainst,
        goalDifference,
      }
    })
  }, [section, teamStatuses])

  const sortedTeamDetailStatuses = useMemo(() => {
    return teamDetailStatuses.sort(sortByStatus)
  }, [teamDetailStatuses])

  return (
    <div>
      <h2>リーグ表</h2>
      <Table>
        <tbody>
          <tr>
            <td>
              <Form.Range
                id='sectionRange'
                min='1'
                max={maxSection}
                value={section}
                onChange={(e) => setSection(parseInt(e.target.value))}
              />
            </td>
            <td>第{section}節</td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>順位</th>
            <th>チーム</th>
            <th>試合数</th>
            <th>勝</th>
            <th>引</th>
            <th>負</th>
            <th>得</th>
            <th>失</th>
            <th>差</th>
            <th className='fw-bold'>点</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeamDetailStatuses.map((status, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{status.teamName.longName}</td>
              <td>{sum(status.win, status.draw, status.lose)}</td>
              <td>{status.win}</td>
              <td>{status.draw}</td>
              <td>{status.lose}</td>
              <td>{status.goalFor}</td>
              <td>{status.goalAgainst}</td>
              <td>{status.goalDifference}</td>
              <td className='fw-bold'>{status.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
