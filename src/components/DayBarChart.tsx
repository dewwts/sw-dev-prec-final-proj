import type { DayBucket } from "@/libs/stats";

// Single-series column chart: appointments per day. Hover or focus a column to see its value.
export default function DayBarChart({ days }: { days: DayBucket[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  // round the top of the scale up so the tallest bar never touches the top
  const top = Math.max(2, Math.ceil(max / 2) * 2);

  return (
    <figure className="m-0">
      <div className="relative h-44" aria-hidden>
        {/* recessive gridlines at 0, half and top */}
        {[0, 0.5, 1].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-neutral-100" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2.5 right-full mr-2 text-[11px] tabular-nums text-neutral-400">{Math.round(top * f)}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-2 border-b border-neutral-300">
          {days.map((d) => (
            <div key={d.key} tabIndex={0} className="group relative flex h-full flex-1 items-end justify-center outline-none">
              <div
                className="w-full max-w-9 rounded-t bg-neutral-900 transition group-hover:bg-neutral-700 group-focus-visible:bg-neutral-700"
                style={{ height: `${(d.count / top) * 100}%`, minHeight: d.count ? 4 : 0 }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-sm group-hover:block group-focus-visible:block">
                {d.fullLabel} · <span className="font-medium tabular-nums">{d.count} นัด</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-2" aria-hidden>
        {days.map((d, i) => (
          <span key={d.key} className={`flex-1 text-center text-xs ${i === 0 ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
            {d.label}
          </span>
        ))}
      </div>
      {/* the same numbers as a table for screen readers */}
      <table className="sr-only">
        <caption>จำนวนนัดหมาย 7 วันข้างหน้า</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.fullLabel}</th>
              <td>{d.count} นัด</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
