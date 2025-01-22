import { useParams, useSearchParams } from "@remix-run/react";
import { addDays, format } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "~/components/date-range-picker";

export function FilterApplicationsByDates() {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const startDate = from ? new Date(from) : new Date();
  const endDate = to ? new Date(to) : addDays(startDate, 20);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })

  const handleSubmit = () => {
    const { from, to } = date || {};

    if (from && to) {
     setSearchParams({
       from: format(from, "yyyy-MM-dd"),
       to: format(to, "yyyy-MM-dd"),
     })
    }
  }

  return (
    <div className="flex gap-2 items-center">
        <DateRangePicker onChange={(range) => setDate(range as DateRange)} startDate={date?.from} endDate={date?.to} />
        <button type="submit" onClick={() => handleSubmit()} className="bg-sky-600 text-white px-4 py-1 rounded">Filter</button>
    </div>
  )
}
