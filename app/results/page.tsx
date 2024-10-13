'use client'

import React, { useState } from 'react'

import { Alert, Form, Table, Spinner } from 'react-bootstrap'
import useSWR from 'swr'

import TeamStatus from '@/app/@types/TeamStatus'
import fetcher from '@/app/_util/fetcher'

const years = Array.from({ length: 2024 - 2017 + 1 }, (_, i) => 2024 - i)
const categories = ['J1', 'J2', 'J3']

export default function ResultsPage(): React.JSX.Element {
  const [selectedYear, setSelectedYear] = useState(years[0])
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const { data: teamStatuses, error } = useSWR<TeamStatus[]>(
    `/team_statuses/${selectedYear}_${selectedCategory}.json`,
    fetcher
  )

  if (teamStatuses == null) {
    return <Spinner animation='border' />
  }

  if (error != null) {
    return <Alert variant='danger'>{error.message}</Alert>
  }

  return (
    <>
      <div id='Results'>
        <h1>Results</h1>
        <Table bordered hover>
          <tbody>
            <tr>
              <th>Year</th>
              <td>
                <Form.Control
                  as='select'
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
              </td>
            </tr>
          </tbody>
        </Table>
        {JSON.stringify(teamStatuses)}
      </div>
    </>
  )
}
