import { ThemeProvider } from "@/components/theme-provider";

// ============================================================
// CALLFOLIO APP LAYOUT (callfolio.io)
// ============================================================
// Layout for authenticated app routes with ThemeProvider.
// Inherits <html> and <body> from root layout.
// ============================================================

import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <div className={cn("min-h-screen flex w-full", "h-screen")}>
        <AppSidebar />
        <main className="flex-1 h-full overflow-hidden border-l border-slate-200 rounded-tl-2xl rounded-bl-2xl shadow-xl flex flex-col bg-white">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
