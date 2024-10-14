'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Form, Table } from 'react-bootstrap'

import type TeamStatus from '@/app/@types/TeamStatus'
import Image from 'next/image'

interface Props {
  teamStatuses: TeamStatus[]
}

export default function LeagueTeam (props: Props): React.JSX.Element {
  const { teamStatuses } = props

  const searchParams = useSearchParams()

  const [selectedTeam, setSelectedTeam] = useState<TeamStatus>(teamStatuses[0])

  const detail = useMemo(() => {
    return {
      gameResults: selectedTeam.gameResults
    }
  }, [selectedTeam])

  useEffect(() => {
    const team = searchParams.get('team')
    const teamStatus = teamStatuses.find((ts) => ts.teamName.englishName === team)
    if (team != null && teamStatus != null) {
      setSelectedTeam(teamStatus)
    } else {
      setSelectedTeam(teamStatuses[0])
    }
  }, [searchParams, teamStatuses])

  function saveSearchParams (key: 'team', value: string): void {
    const englishName = teamStatuses.find((ts) => ts.teamName.shortName === value)?.teamName.englishName
    if (englishName == null) return
    const url = new URL(window.location.href)
    url.searchParams.set(key, englishName)
    window.history.pushState({ path: url.href }, '', url.href)
  }

  return (
    <>
      <h2>チーム成績</h2>
      <Form.Select value={selectedTeam.teamName.shortName} onChange={(e) => {
        saveSearchParams('team', e.target.value)
      }}>
        {teamStatuses.map((ts) => (
          <option key={ts.teamName.shortName} value={ts.teamName.shortName}>{ts.teamName.longName}</option>
        ))}
      </Form.Select>
      <hr />
      <h3>統計</h3>
      <Table>
        <tbody>
          <tr>
            <th>試合数</th>
            <td>{detail.gameResults.length}</td>
          </tr>
          <tr>
            <th>勝点</th>
            <td>{detail.gameResults.reduce((sum, gr) => sum + (gr.ourScore > gr.theirScore ? 3 : gr.ourScore === gr.theirScore ? 1 : 0), 0)}</td>
          </tr>
          <tr>
            <th>勝利数</th>
            <td>{detail.gameResults.filter((gr) => gr.ourScore > gr.theirScore).length}</td>
          </tr>
          <tr>
            <th>敗北数</th>
            <td>{detail.gameResults.filter((gr) => gr.ourScore < gr.theirScore).length}</td>
          </tr>
          <tr>
            <th>引分数</th>
            <td>{detail.gameResults.filter((gr) => gr.ourScore === gr.theirScore).length}</td>
          </tr>
          <tr>
            <th>得点数</th>
            <td>{detail.gameResults.reduce((sum, gr) => sum + gr.ourScore, 0)}</td>
          </tr>
          <tr>
            <th>失点数</th>
            <td>{detail.gameResults.reduce((sum, gr) => sum + gr.theirScore, 0)}</td>
          </tr>
          <tr>
            <th>得失点差</th>
            <td>{detail.gameResults.reduce((sum, gr) => sum + gr.ourScore - gr.theirScore, 0)}</td>
          </tr>
          <tr>
            <th>勝率</th>
            <td>{((detail.gameResults.filter((gr) => gr.ourScore > gr.theirScore).length / detail.gameResults.length) * 100).toFixed(2)}%</td>
          </tr>
          <tr>
            <th>ホーム勝率</th>
            <td>{((detail.gameResults.filter((gr) => gr.isHome && gr.ourScore > gr.theirScore).length / detail.gameResults.filter((gr) => gr.isHome).length) * 100).toFixed(2)}%</td>
          </tr>
          <tr>
            <th>アウェイ勝率</th>
            <td>{((detail.gameResults.filter((gr) => !gr.isHome && gr.ourScore > gr.theirScore).length / detail.gameResults.filter((gr) => !gr.isHome).length) * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <h3>試合結果</h3>
      <Table>
        <thead>
          <tr>
            <th>節</th>
            <th>ホーム</th>
            <th>結果</th>
            <th>スコア</th>
            <th>対戦相手</th>
          </tr>
        </thead>
        <tbody>
          {detail.gameResults.map((gameResult, index) => (
            <tr key={index}>
              <td>第{index + 1}節</td>
              <td>{gameResult.isHome ? '🏠' : ''}</td>
              <td>{(() => {
                switch (true) {
                  case gameResult.ourScore > gameResult.theirScore:
                    return <span className='text-success'><Image src='/images/win.svg' alt='勝' width={16} height={16} /> 勝</span>
                  case gameResult.ourScore < gameResult.theirScore:
                    return <span className='text-danger'><Image src='/images/loss.svg' alt='負' width={16} height={16} /> 敗</span>
                  default:
                    return <span className='text-secondary'><Image src='/images/draw.svg' alt='分' width={16} height={16} /> 分</span>
                }
              })()}</td>
              <td>
                {(() => {
                  if (gameResult.isHome) {
                    return <><span className='fw-bold'>{gameResult.ourScore}</span> - <span>{gameResult.theirScore}</span></>
                  }
                  return <><span>{gameResult.theirScore}</span> - <span className='fw-bold'>{gameResult.ourScore}</span></>
                })()}
              </td>
              <td>vs {gameResult.opponentTeamName.longName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
