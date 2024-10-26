import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Form, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

import {
  TiArrowSortedDown,
  TiArrowSortedUp
} from 'react-icons/ti'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState
} from '@tanstack/react-table'

import type TeamStatus from '@/app/@types/TeamStatus'
import type TeamDetailStatusBySection from '@/app/@types/TeamDetailStatusBySection'
import type TeamDetailStatusBySectionForTable from '@/app/@types/TeamDetailStatusBySectionForTable'

import { sortByStatus } from '@/app/_util/sortByStatus'
import sum from '@/app/_util/sum'

const getSortIcon = (sortDirection: false | 'asc' | 'desc'): JSX.Element => {
  switch (sortDirection) {
    case 'asc':
      return <TiArrowSortedUp />
    case 'desc':
      return <TiArrowSortedDown />
    default:
      return <></>
  }
}

interface Props {
  teamStatuses: TeamStatus[]
}

export default function LeagueTable (props: Props): React.JSX.Element {
  const { teamStatuses } = props

  const searchParams = useSearchParams()

  const [sorting, setSorting] = useState<SortingState>([])

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

  const sortedTeamDetailStatusesForTable: TeamDetailStatusBySectionForTable[] = useMemo(() => {
    return teamDetailStatuses.sort(sortByStatus).map((status, index) => {
      return {
        ...status,
        rank: index + 1,
        matches: sum(status.win, status.draw, status.lose)
      }
    })
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

  const columnHelper = createColumnHelper<TeamDetailStatusBySectionForTable>()

  const columns = [
    columnHelper.accessor('rank', {
      header: '順位',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('teamName.longName', {
      header: 'チーム名',
      cell: (info) => (
        <>
          <OverlayTrigger
            placement='top'
            delay={{ show: 100, hide: 500 }}
            overlay={(props) => {
              return (
                <Tooltip {...props}>
                  {info.row.original.gameResults.map((result, index) => {
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
            <span>{info.row.original.teamName.longName}</span>
          </OverlayTrigger>
        </>
      )
    }),
    columnHelper.accessor('matches', {
      header: '試合数',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('win', {
      header: '勝',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('draw', {
      header: '分',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('lose', {
      header: '敗',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('goalFor', {
      header: '得',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('goalAgainst', {
      header: '失',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('goalDifference', {
      header: '差',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('points', {
      header: '勝点',
      cell: (info) => <span className='fw-bold'>{info.getValue()}</span>
    })
  ]

  const table = useReactTable({
    data: sortedTeamDetailStatusesForTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting
  })

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
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  {getSortIcon(header.column.getIsSorted())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
