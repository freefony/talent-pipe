import { useSearchParams } from "@remix-run/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import sources from 'fixtures/sources.json';

export function FilterApplicationsBySources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allparams = searchParams.entries();
  const source = searchParams.get("source") || undefined;

  const clearSourceFilter = () => {
    const params = Object.fromEntries(allparams);
    delete params.source;
    setSearchParams(params);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={source} onValueChange={(value) => {
        if (value === 'all') {
          clearSourceFilter();
        } else {
          setSearchParams({ ...Object.fromEntries(allparams), source: value });
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select a source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="capitalize">Clear</SelectItem>
          {sources.map((source) => (
            <SelectItem key={source} value={source.replaceAll(" ", "-")} className="capitalize">{source.replaceAll("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}