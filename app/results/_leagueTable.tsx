'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Form, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

import type TeamStatus from '@/app/@types/TeamStatus'
import type TeamDetailStatusBySection from '@/app/@types/TeamDetailStatusBySection'
import { sortByStatus } from '@/app/_util/sortByStatus'
import sum from '@/app/_util/sum'
import Image from 'next/image'

interface Props {
  teamStatuses: TeamStatus[]
}

export default function LeagueTable (props: Props): React.JSX.Element {
  const { teamStatuses } = props

  const searchParams = useSearchParams()

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
        teamName,
        section,
        gameResults: targetGameResults,
        points,
        win,
        draw,
        lose,
        goalFor,
        goalAgainst,
        goalDifference
      }
    })
  }, [section, teamStatuses])

  const sortedTeamDetailStatuses = useMemo(() => {
    return teamDetailStatuses.sort(sortByStatus)
  }, [teamDetailStatuses])

  useEffect(() => {
    const section = searchParams.get('section')
    if (section != null && section.length >= 1 && parseInt(section) <= maxSection) {
      setSection(parseInt(section))
    } else {
      setSection(maxSection)
    }
  }, [searchParams, maxSection])

  function saveSearchParams (key: 'section', value: string): void {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.pushState({ path: url.href }, '', url.href)
  }

  return (
    <div>
      <h2>リーグ表</h2>
      <Table>
        <tbody>
          <tr>
            <td>
              <Form.Range
                id='sectionRange'
                name='section'
                min='1'
                max={maxSection}
                value={section}
                onChange={(e) => { saveSearchParams('section', e.target.value) }}
              />
            </td>
            <td>第{section}節</td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <Table id='league-table'>
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
              <td>
                <OverlayTrigger
                  placement='top'
                  delay={{ show: 100, hide: 500 }}
                  overlay={(props) => {
                    return (
                      <Tooltip {...props}>
                        {status.gameResults.map((result, index) => {
                          switch (true) {
                            case result.ourScore === result.theirScore:
                              return <Image key={index} src='/images/draw.svg' alt='引分' width={16} height={16} />
                            case result.ourScore > result.theirScore:
                              return <Image key={index} src='/images/win.svg' alt='勝利' width={16} height={16} />
                            case result.ourScore < result.theirScore:
                              return <Image key={index} src='/images/loss.svg' alt='敗北' width={16} height={16} />
                            default:
                              throw new Error('Unexpected result')
                          }
                        })}
                      </Tooltip>
                    )
                  }}
                >
                  <span>{status.teamName.longName}</span>
                </OverlayTrigger>
              </td>
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
