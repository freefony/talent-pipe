import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Box } from "~/components/box";
import { Funnel, FunnelSegment } from "~/components/funnel";
import { getApplicationAnalysis } from "~/services/applications";
import { SourceEffectivenessChart } from "./components/source-effectiveness";
import { TimeToHireTrend } from "./components/time-to-hire-trend";
import { DateRangePicker } from "~/components/date-range-picker";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Filters } from "./components/filters";
import { FilterApplicationsByDates } from "./components/filters/by-dates";

export const meta: MetaFunction = () => {
  return [
    { title: "Talent pipeline analytics" },
    { name: "description", content: "Talent pipeline analytics" },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from") || undefined; 
  const to = url.searchParams.get("to") || undefined;

  return { data: getApplicationAnalysis({ byDate: { from, to }}) }
}



export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <Box className="p-3 shadow-sm">
        <span className="text-lg font-bold">Talent pipeline analytics</span>
      </Box>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {({ progression, applicationCount, sourceEffectiveness, timeToHireTrend }) => {
            // layout
            return (<div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full p-3">
              <Box className="col-span-1 md:col-span-4 p-3">
                <h1 className="text-lg font-bold p-3">Filters:</h1>
                <Box className="flex gap-6 items-center">
                  <FilterApplicationsByDates />
                </Box>
              </Box>
              <Box className="col-span-1 md:col-span-4 p-6 rounded-lg">
                <h1 className="text-lg font-bold text-center p-3">Talent pipeline progression and pass-through rates by stages</h1>
                <Funnel load={applicationCount} segments={progression.length}>
                  {progression.map((item, index) => {
                    const passThroughRate = index === 0 ? 0 : (item.value / progression[index - 1].value) * 100
                    return (
                      <FunnelSegment
                        key={index}
                        name={item.name}
                        value={item.value}
                        sup={<span className="text-xs text-center">{Math.round(passThroughRate)}%</span>}
                        className="bg-slate-200"
                      />
                    )
                  })}
                </Funnel>
              </Box>
              <Box className="col-span-1 md:col-span-2">
                <TimeToHireTrend timeToHireTrend={timeToHireTrend} />
              </Box>
              <Box className="col-span-1 md:col-span-2">
                <SourceEffectivenessChart data={sourceEffectiveness} />
              </Box>
            </div>);
          }}

        </Await>
      </Suspense>
    </div>
  );
}


