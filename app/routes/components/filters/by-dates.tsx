import { useParams, useSearchParams } from "@remix-run/react";
import { addDays, format } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "~/components/date-range-picker";

export function FilterApplicationsByDates() {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const startDate = from ? new Date(from) : undefined;
  const endDate = to ? new Date(to) : undefined;

  const defaultDateRange = {
    from: startDate,
    to: endDate,
  }

  const [date, setDate] = React.useState<DateRange | undefined>(defaultDateRange)

  const handleSubmit = () => {
    const { from, to } = date || {};

    if (from && to) {
     setSearchParams({
       from: format(from, "yyyy-MM-dd"),
       to: format(to, "yyyy-MM-dd"),
     })
    }
  }

  const clearSourceFilter = () => {
    const allparams = searchParams.entries();
    const params = Object.fromEntries(allparams);
    delete params.from;
    delete params.to;
    setSearchParams(params);
    setDate(defaultDateRange)
  };

  return (
    <div className="flex gap-2 items-center">
        <DateRangePicker onChange={(range) => setDate(range as DateRange)} startDate={date?.from} endDate={date?.to} />
        <button type="submit" onClick={() => handleSubmit()} className="bg-sky-600 text-white px-4 py-1 rounded">Filter</button>
        <button type="submit" onClick={() => clearSourceFilter()} className="bg-slate-400 text-white px-4 py-1 rounded">Clear</button>
    </div>
  )
}
