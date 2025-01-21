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
    <div className="flex flex-col h-screen items-center justify-center">

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {({ progression, applicationCount, sourceEffectiveness }) => {
            // layout
            return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full m-2">
              <Box className="col-span-1 md:col-span-3 p-6 rounded-lg">
                <h1 className="text-xl font-bold text-center p-3">Talent pipeline progression</h1>
                <Funnel load={applicationCount} segments={progression.length}>
                  {progression.map((item, index) => (
                    <FunnelSegment key={index} name={item.name} value={item.value} />

                  ))}
                </Funnel>
              </Box>
              <Box></Box><Box className="col-span-1 md:col-span-2"><SourceEffectivenessChart data={sourceEffectiveness} /></Box>
            </div>);
          }}

        </Await>
      </Suspense>
    </div>
  );
}


