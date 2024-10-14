'use client'

import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Alert, Form, Table, Spinner, Button } from 'react-bootstrap'
import useSWR from 'swr'

import type TeamStatus from '@/app/@types/TeamStatus'
import fetcher from '@/app/_util/fetcher'

import LeagueTable from './_leagueTable'
import LeagueGraph from './_leagueGraph'
import LeagueTeam from './_leagueTeam'

const years = Array.from({ length: 2024 - 2017 + 1 }, (_, i) => 2024 - i)
const categoryEnum = ['J1', 'J2', 'J3'] as const
const displayEnum = ['table', 'graph', 'team'] as const

export default function ResultsPage (): React.JSX.Element {
  const searchParams = useSearchParams()

  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<typeof categoryEnum[number] | null>(null)
  const [selectedDisplay, setSelectedDisplay] = useState<typeof displayEnum[number] | null>(null)

  const { data: teamStatuses, error } = useSWR<TeamStatus[]>(
    selectedYear != null && selectedCategory != null
      ? `/team_statuses/${selectedYear}_${selectedCategory.toLowerCase()}.json`
      : null,
    fetcher
  )

  useEffect(() => {
    const year = searchParams.get('year')
    const category = searchParams.get('category')?.toUpperCase()
    const display = searchParams.get('display')
    if (year != null && years.includes(parseInt(year))) {
      setSelectedYear(parseInt(year))
    } else {
      setSelectedYear(years[0])
    }
    if (category != null && categoryEnum.includes(category as typeof categoryEnum[number])) {
      setSelectedCategory(category as typeof categoryEnum[number])
    } else {
      setSelectedCategory(categoryEnum[0])
    }
    if (display != null && displayEnum.includes(display as typeof displayEnum[number])) {
      setSelectedDisplay(display as typeof displayEnum[number])
    } else {
      setSelectedDisplay(displayEnum[0])
    }
  }, [searchParams])

  function saveSearchParams (key: 'year' | 'category' | 'display', value: string): void {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.pushState({ path: url.href }, '', url.href)
  }

  if (teamStatuses == null) {
    return <Spinner animation='border' />
  }

  if (error != null) {
    return <Alert variant='danger'>{error.message}</Alert>
  }

  if (selectedYear == null || selectedCategory == null || selectedDisplay == null) {
    return <Spinner animation='border' />
  }

  return (
    <>
      <div id='Results'>
        <h1>試合結果</h1>
        <Table bordered hover>
          <tbody>
            <tr>
              <th>Year</th>
              <td>
                <Form.Control
                  as='select'
                  value={selectedYear}
                  onChange={(e) => { saveSearchParams('year', e.target.value) }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </td>
            </tr>
            <tr>
              <th>Category</th>
              <td>
                <Form.Control
                  as='select'
                  value={selectedCategory}
                  onChange={(e) => { saveSearchParams('category', e.target.value) }}
                >
                  {categoryEnum.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </td>
            </tr>
            <tr>
              <th>Display</th>
              <td>
                {displayEnum.map((style) => (
                  <Button
                    key={style}
                    className='ms-1'
                    variant={selectedDisplay === style ? 'primary' : 'light'}
                    onClick={() => { saveSearchParams('display', style) }}
                  >
                    {style}
                  </Button>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>
        {selectedDisplay === 'table' && <LeagueTable teamStatuses={teamStatuses} />}
        {selectedDisplay === 'graph' && <LeagueGraph teamStatuses={teamStatuses} />}
        {selectedDisplay === 'team' && <LeagueTeam teamStatuses={teamStatuses} />}
      </div>
    </>
  )
}
