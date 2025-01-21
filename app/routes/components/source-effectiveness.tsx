import { l } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer } from '~/components/ui/chart';

type SourceEffectivenessChartProps = {
  data: {
    source: string;
    hires: number;
    totalApplications: number;
  }[];
};
export const SourceEffectivenessChart = ({ data }: SourceEffectivenessChartProps) => {

  const config = {
    totalApplications: {
      label: 'Total Applications',
      color: '#0d9488',
    },
    hires: {
      label: 'Total Hired',
      color: '#0284c7',
    }
  } satisfies ChartConfig

  return (
    <>
      <h1 className="text-xl font-bold text-center p-3">Source Effectiveness</h1>
      <ChartContainer title="Source effectiveness" config={config}>
        <BarChart width={800} height={400} data={data}>
          <XAxis dataKey="source" />
          <YAxis />
          <CartesianGrid stroke="#f5f5f5" />
          <Legend />
          <Tooltip />
          <Bar dataKey="hires" radius={5} fill='var(--color-hires)' />
          <Bar dataKey="totalApplications" radius={5} fill='var(--color-totalApplications)' />
        </BarChart>
      </ChartContainer>
    </>
  )
};

