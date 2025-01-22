import { useSearchParams } from "@remix-run/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import jobTitles from 'fixtures/job-titles.json';

export function FilterApplicationsByLevels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allparams = searchParams.entries();
  const level = searchParams.get("level") || undefined;

  const clearSourceFilter = () => {
    const params = Object.fromEntries(allparams);
    delete params.level;
    setSearchParams(params);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={level} onValueChange={(level) => {
        if (level === 'all') { 
          clearSourceFilter(); 
          } else { 
            setSearchParams({ ...Object.fromEntries(allparams), level })
          }}}>
        <SelectTrigger>
          <SelectValue placeholder="Select a level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="capitalize">Clear</SelectItem>
          {jobTitles.map((title) => (
            <SelectItem key={title} value={title.replaceAll(" ", "-")} className="capitalize">{title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}