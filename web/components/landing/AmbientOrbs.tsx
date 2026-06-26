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

// Dieselbe feine "Operations"-Grid wie im Hero — läuft subtil durch die Story.
// Die Maske lässt sie an den Rändern (und damit an den Sektionsnähten) ausfaden,
// sodass kein harter Kantenabschluss entsteht.
export function FlowGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "54px 54px",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 75% at 50% 45%, #000 0%, transparent 80%)",
        maskImage:
          "radial-gradient(ellipse 90% 75% at 50% 45%, #000 0%, transparent 80%)",
      }}
    />
  );
}
