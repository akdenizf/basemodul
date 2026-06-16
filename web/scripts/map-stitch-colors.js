const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../components/landing');
const filesToProcess = [
    'Navbar.tsx', 'HeroSection.tsx', 'PainSection.tsx', 'RoiSection.tsx',
    'VisualContextSection.tsx', 'HowItWorksSection.tsx', 'PricingSection.tsx',
    'TrustSection.tsx', 'FaqSection.tsx', 'FinalCtaSection.tsx', 'Footer.tsx',
    'FloatingCta.tsx'
];

const colorMap = {
    // Dark Backgrounds / Overlays
    'bg-foreground': 'bg-[#0A0A0A]',
    'text-background': 'text-white',
    'border-background/10': 'border-white/10',
    'border-background/20': 'border-white/20',
    'bg-background/5': 'bg-white/5',
    'bg-background/10': 'bg-white/10',
    'bg-background/20': 'bg-white/20',
    'bg-background/70': 'bg-white/70',
    'bg-background/95': 'bg-white/95',
    'text-background/60': 'text-white/60',
    'text-background/80': 'text-white/80',

    // Light Backgrounds / Overlays
    'bg-background': 'bg-white',

    // Foreground / Text / Borders (when on light)
    'text-foreground': 'text-slate-950',
    'text-muted-foreground': 'text-slate-500',
    'border-border': 'border-slate-200',
    'bg-card': 'bg-white',

    // Brand Colors
    'bg-primary': 'bg-indigo-600',
    'text-primary': 'text-indigo-600',
    'border-primary': 'border-indigo-600',
    'shadow-primary': 'shadow-indigo-600',
    'text-primary-foreground': 'text-white',
    'bg-primary/5': 'bg-indigo-600/5',
    'bg-primary/10': 'bg-indigo-600/10',
    'bg-primary/20': 'bg-indigo-600/20',
    'shadow-primary/5': 'shadow-indigo-600/5',
    'shadow-primary/20': 'shadow-indigo-600/20',
    'shadow-primary/25': 'shadow-indigo-600/25',
    'shadow-primary/30': 'shadow-indigo-600/30',

    // Accents & Secondary
    'bg-accent': 'bg-emerald-500',
    'text-accent': 'text-emerald-500',
    'bg-accent/5': 'bg-emerald-500/5',
    'bg-accent/15': 'bg-emerald-500/15',
    'bg-accent/20': 'bg-emerald-500/20',
    'border-accent/30': 'border-emerald-500/30',

    // Destructive
    'bg-destructive': 'bg-red-500',
    'text-destructive': 'text-red-500',
    'bg-destructive/5': 'bg-red-500/5',
    'bg-destructive/15': 'bg-red-500/15',
    'border-destructive/20': 'border-red-500/20',

    // Secondary Light
    'bg-secondary': 'bg-slate-50',
    'bg-secondary/50': 'bg-slate-50/50',
    'text-secondary-foreground': 'text-slate-900',

    // Extra specific fixes
    'border-border/40': 'border-slate-200/40',
};

filesToProcess.forEach(file => {
    const filePath = path.join(targetDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} - not found`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace using word boundaries to prevent substring collision
    // Sort keys by length descending so longer matches happen first
    const sortedKeys = Object.keys(colorMap).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
        // Escape specific regex chars just in case (e.g. slashes)
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // We use a regex to ensure exact match of tailwind classes (can have arbitrary prefixes but we replace exactly this token)
        const regex = new RegExp(`(?<=[\\s"'\\\`])${escapedKey}(?=[\\s"'\\\`])`, 'g');
        content = content.replace(regex, colorMap[key]);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${file}`);
});
