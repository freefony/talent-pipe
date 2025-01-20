import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Funnel, FunnelSegment } from "~/components/funnel";
import { getApplicationAnalysis } from "~/services/applications";

export const meta: MetaFunction = () => {
  return [
    { title: "Talent pipeline analytics" },
    { name: "description", content: "Talent pipeline analytics" },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {

  return { data: getApplicationAnalysis() }
}



export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-screen items-center justify-center">

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {({ progression, applicationCount }) => {

            // layout

            return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full m-2">
              <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg">
                <h1 className="text-xl font-bold text-center p-3">Talent pipeline progression</h1>
                <Funnel load={applicationCount} segments={progression.length}>
                  {progression.map((item, index) => (
                    <FunnelSegment key={index} name={item.name} value={item.value} />

                  ))}
                </Funnel>
              </div>
            </div>);
          }}

        </Await>
      </Suspense>
    </div>
  );
}


