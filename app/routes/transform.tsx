import { ActionFunctionArgs } from "@remix-run/node";
import { data, useActionData, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loadToFile } from "~/load-to-file";
import { transformApplicationsStages } from "~/services/transform/applications";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const intent = body.get("intent");
  if (intent === "transform") {
    const transformedApplications = transformApplicationsStages();
    await loadToFile(transformedApplications, 'applications');
    return { ok: true };
  }
  return null;
};

export default function Transform() {
  const [transforming, setTransforming] = useState<'Inprogress' | 'completed' | 'failed' | undefined>();
  const [hasStarted, setHasStarted] = useState(false);
  const fetcher = useFetcher<{ ok: boolean }>();

  const handleTransform = () => {
    setHasStarted(true);
    fetcher.submit({
      intent: "transform",
    }, {
      method: "POST",
    });
    setTransforming('Inprogress');
  };

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.data.ok) {
      setTransforming('completed');
    } else {
      setTransforming('failed'); 
    }
  }, [fetcher.data]);

  return (
    <div className="flex h-screen items-center justify-center">
      {!hasStarted && (
        <button 
          onClick={handleTransform}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {transforming === 'Inprogress' && 'Transforming...'}
          {transforming === 'completed' && 'Transform Complete!'}
          {transforming === 'failed' && 'Transform Failed'}
          {!transforming && 'Start Transformation'}
        </button>
      )}
    </div>
  );
}

export { ErrorBoundary } from "~/components/errorboundary";