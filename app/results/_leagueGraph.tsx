import React, { useMemo } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartDataset
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import type TeamStatus from '@/app/@types/TeamStatus'
import presetColors from '@/app/_util/presetColors'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  teamStatuses: TeamStatus[]
}

export default function LeagueGraph (props: Props): React.JSX.Element {
  const { teamStatuses } = props

  const maxSection = useMemo(() => {
    return Math.max(...teamStatuses.map(status => status.gameResults.length))
  }, [teamStatuses])

  const labels = useMemo(() => {
    return Array.from({ length: maxSection }, (_, i) => maxSection - i).reverse().map(section => `第${section}節`)
  }, [maxSection])

  const graphData = useMemo(() => {
    const colors = [...presetColors]
    const datasets = teamStatuses.map((status) => {
      const pointHistories = status.gameResults.map((result) => {
        switch (true) {
          case result.ourScore > result.theirScore: return 3
          case result.ourScore === result.theirScore: return 1
          case result.ourScore < result.theirScore: return 0
          default: throw new Error('Invalid game result')
        }
      })
      const accumulatedPoints = pointHistories.reduce<number[]>((acc, point, index) => {
        const previousTotal = index > 0 ? acc[index - 1] : 0
        acc.push(previousTotal + point)
        return acc
      }, [])
      return {
        label: status.teamName.shortName,
        data: accumulatedPoints,
        borderColor: colors.shift()
      } satisfies ChartDataset<'line'>
    })

    return { labels, datasets }
  }, [teamStatuses])

  return (
    <>
      <h2>勝点グラフ</h2>
      <Line data={graphData} />
    </>
  )
}
