import { useLayoutEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sectorAllocations } from "../../data/budget";
import { pesoCompact } from "../../lib/format";

const data = [...sectorAllocations].sort((a, b) => b.amount - a.amount);

const BLUE = "#2563eb"; // blue-600
const CHART_HEIGHT = 288;

interface TooltipPayload {
  payload: { sector: string; amount: number };
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const { sector, amount } = payload[0].payload;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <div className="text-slate-900">{sector}</div>
      <div className="text-slate-500">{pesoCompact(amount)}</div>
    </div>
  );
}

// Measure the container width directly instead of using recharts'
// ResponsiveContainer, whose ResizeObserver can fail to settle in some
// headless/preview renderers (leaving the chart unpainted).
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) setWidth(ref.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return { ref, width };
}

export function SectorChart() {
  const { ref, width } = useContainerWidth();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-medium text-slate-900">
        Where the 2026 budget goes
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Top sector allocations under the 2026 national budget (RA 12314).
      </p>

      <div ref={ref} className="mt-4" style={{ height: CHART_HEIGHT }}>
        {width > 0 && (
          <BarChart
            width={width}
            height={CHART_HEIGHT}
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 56, bottom: 0, left: 8 }}
            barCategoryGap={12}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="sector"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#475569", fontSize: 13 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              content={<ChartTooltip />}
            />
            <Bar
              dataKey="amount"
              fill={BLUE}
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.sector} />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                formatter={(v) => pesoCompact(Number(v))}
                fill="#475569"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        )}
      </div>
    </div>
  );
}
