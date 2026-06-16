import { ThemeProvider } from "@/components/theme-provider";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            forcedTheme="light"
            disableTransitionOnChange
        >
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
                {children}
            </div>
        </ThemeProvider>
    );
}
