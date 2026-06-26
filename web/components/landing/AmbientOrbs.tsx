// Subtle green/cyan light orbs for a lively, glassy backdrop.
// Drop into any `relative` section as the first child — sits behind content.
export function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[12%] top-[15%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.06),transparent_70%)] blur-3xl" />
    </div>
  );
}
