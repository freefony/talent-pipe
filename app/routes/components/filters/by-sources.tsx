import { useSearchParams } from "@remix-run/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import sources from 'fixtures/sources.json';

export function FilterApplicationsBySources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allparams = searchParams.entries();
  const source = searchParams.get("source") || undefined;

  return (
    <div className="flex gap-2 items-center">
      <Select value={source} onValueChange={(source) => setSearchParams({ ...Object.fromEntries(allparams), source })}>
        <SelectTrigger>
          <SelectValue placeholder="Select a source" />
        </SelectTrigger>
        <SelectContent>
          {sources.map((source) => (
            <SelectItem key={source} value={source.replaceAll(" ", "-")} className="capitalize">{source.replaceAll("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}