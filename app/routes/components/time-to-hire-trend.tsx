import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts"
import { Box } from "~/components/box"
import { ChartContainer } from "~/components/ui/chart"
import { TimeToHireTrendProps } from "~/services/applications"

type Props = {
  timeToHireTrend: TimeToHireTrendProps[]
}
export const TimeToHireTrend = ({ timeToHireTrend }: Props) => {
  return (
    <Box>
      <h1 className="text-lg font-bold text-center p-3">Time to hire trend</h1>
      <ChartContainer config={{
        averageTimeToHire: {
          label: "Average Time to Hire",
          color: "#8884d8"
        },
        maxTimeToHire: {
          label: "Max Time to Hire",
          color: '#0284c7',
        },
        minTimeToHire: {
          label: "Min Time to Hire",
          color: '#0d9488',
        }
      }}>
        <AreaChart data={timeToHireTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="averageTimeToHire" name="Average Time to Hire" fill='var(--color-averageTimeToHire)' />
          <Area type="monotone" dataKey="maxTimeToHire" name="Max Time to Hire" fill='var(--color-maxTimeToHire)' />
          <Area type="monotone" dataKey="minTimeToHire" name="Min Time to Hire" fill='var(--color-minTimeToHire)' />
        </AreaChart>
      </ChartContainer>
    </Box>
  )
}