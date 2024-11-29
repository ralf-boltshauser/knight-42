import { prisma } from "@/lib/client";

export default async function Observability() {
  const metrics = await prisma.$metrics.json();
  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.counters.map((counter) => (
          <div key={counter.key} className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-sm text-muted-foreground">
              {counter.description}
            </h3>
            <p className="text-2xl font-bold mt-2">{counter.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.gauges.map((gauge) => (
          <div key={gauge.key} className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-sm text-muted-foreground">
              {gauge.description}
            </h3>
            <p className="text-2xl font-bold mt-2">{gauge.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metrics.histograms.map((histogram) => (
          <div key={histogram.key} className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium text-sm text-muted-foreground mb-4">
              {histogram.description}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Count: {histogram.value.count}</span>
                <span>Sum: {histogram.value.sum.toFixed(2)}ms</span>
              </div>
              <div className="space-y-1">
                {histogram.value.buckets.map(([threshold, count], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-xs w-12">{`≤${threshold}ms`}</div>
                    <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{
                          width: `${
                            (count / histogram.value.count) * 100 || 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="text-xs w-8 text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
