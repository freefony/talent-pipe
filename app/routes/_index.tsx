import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Talent pipeline analytics" },
    { name: "description", content: "Talent pipeline analytics" },
  ];
};



export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      
    </div>
  );
}


