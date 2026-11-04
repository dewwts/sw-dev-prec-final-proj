export default function Alert({ kind = "error", children }: { kind?: "error" | "success" | "info"; children: React.ReactNode }) {
  const styles = {
    error: "border-red-100 bg-red-50/60 text-red-700",
    success: "border-emerald-100 bg-emerald-50/60 text-emerald-700",
    info: "border-neutral-200 bg-neutral-50 text-neutral-700",
  }[kind];
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
