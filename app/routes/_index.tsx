import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Box } from "~/components/box";
import { Funnel, FunnelSegment } from "~/components/funnel";
import { getApplicationAnalysis } from "~/services/applications";
import { SourceEffectivenessChart } from "./components/source-effectiveness";

export const meta: MetaFunction = () => {
  return [
    { title: "Talent pipeline analytics" },
    { name: "description", content: "Talent pipeline analytics" },
  ];
};

export function loader() {

  return { data: getApplicationAnalysis() }
}



export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className=" h-screen">
      <Box className="p-6">Header</Box>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {({ progression, applicationCount, sourceEffectiveness }) => {
            
            // layout
            return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
              <Box className="col-span-1 md:col-span-3 p-6 rounded-lg">
                <h1 className="text-lg font-bold text-center p-3">Talent pipeline progression and pass-through rates by stages</h1>
                <Funnel load={applicationCount} segments={progression.length}>
                  {progression.map((item, index) => {
                    const passThroughRate = index === 0 ? 0 : (item.value / progression[index - 1].value ) *  100
                    return (
                    <FunnelSegment key={index} name={item.name} value={item.value} sup={<span className="text-xs text-center">{Math.round(passThroughRate)}%</span>} />
                  )
                  })}
                </Funnel>
              </Box>
              <Box></Box>
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


