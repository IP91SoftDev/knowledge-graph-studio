/**
 * UI Analysis Tool
 * 
 * Analyzes captured HTML snapshots to extract:
 * - Layout containers (sidebar/header/main)
 * - Theme toggle presence
 * - Component patterns (cards, tables, etc.)
 * - Spacing scale guesses
 * 
 * Usage: pnpm ui:analyze <snapshot-dir>
 * 
 * Output: ui-report.md in snapshot folder
 */

import fs from 'fs';
import path from 'path';

interface UIReport {
  layout: {
    hasSidebar: boolean;
    hasHeader: boolean;
    hasMain: boolean;
    sidebarPosition?: 'left' | 'right';
  };
  theme: {
    hasDarkMode: boolean;
    hasThemeToggle: boolean;
    themeAttribute?: string;
    themeClasses?: string[];
  };
  components: {
    cards: number;
    tables: number;
    buttons: number;
    inputs: number;
    badges: number;
  };
  spacing: {
    guessedScale: string;
    commonClasses: string[];
  };
  recommendations: string[];
}

function analyzeHTML(html: string): UIReport {
  const report: UIReport = {
    layout: {
      hasSidebar: false,
      hasHeader: false,
      hasMain: false,
      sidebarPosition: undefined,
    },
    theme: {
      hasDarkMode: false,
      hasThemeToggle: false,
      themeAttribute: undefined,
      themeClasses: [],
    },
    components: {
      cards: 0,
      tables: 0,
      buttons: 0,
      inputs: 0,
      badges: 0,
    },
    spacing: {
      guessedScale: 'unknown',
      commonClasses: [],
    },
    recommendations: [],
  };

  // ==========================================================================
  // Layout Detection
  // ==========================================================================

  // Sidebar detection
  const sidebarPatterns = [
    /<aside[^>]*sidebar/i,
    /class="[^"]*sidebar[^"]*"/i,
    /data-sidebar/i,
    /class="[^"]*w-64[^"]*"/, // Common sidebar width
    /class="[^"]*w-56[^"]*"/,
  ];

  for (const pattern of sidebarPatterns) {
    if (pattern.test(html)) {
      report.layout.hasSidebar = true;
      break;
    }
  }

  // Sidebar position
  if (/class="[^"]*left-0[^"]*"/.test(html) || /class="[^"]*fixed[^"]*sidebar/.test(html)) {
    report.layout.sidebarPosition = 'left';
  } else if (/class="[^"]*right-0[^"]*"/.test(html)) {
    report.layout.sidebarPosition = 'right';
  }

  // Header detection
  const headerPatterns = [
    /<header[^>]*class="[^"]*h-16/i,
    /class="[^"]*top-0[^"]*"/,
    /<nav[^>]*class="[^"]*border-b/i,
  ];

  for (const pattern of headerPatterns) {
    if (pattern.test(html)) {
      report.layout.hasHeader = true;
      break;
    }
  }

  // Main content detection
  if (/<main[^>]*>/i.test(html) || /class="[^"]*flex-1[^"]*"/.test(html)) {
    report.layout.hasMain = true;
  }

  // ==========================================================================
  // Theme Detection
  // ==========================================================================

  // Dark mode indicators
  const darkModePatterns = [
    /data-theme="dark"/i,
    /class="[^"]*dark[^"]*"/i,
    /dark:/, // Tailwind dark mode prefix
    /next-themes/i,
    /ThemeProvider/i,
  ];

  for (const pattern of darkModePatterns) {
    if (pattern.test(html)) {
      report.theme.hasDarkMode = true;
      break;
    }
  }

  // Theme toggle button
  const togglePatterns = [
    /aria-label="[^"]*theme/i,
    /onClick.*setTheme/i,
    /useTheme\(\)/i,
    /[🌙☀️]/, // Moon/sun emojis
  ];

  for (const pattern of togglePatterns) {
    if (pattern.test(html)) {
      report.theme.hasThemeToggle = true;
      break;
    }
  }

  // Extract theme-related classes
  const themeClassMatches = html.match(/class="[^"]*(dark:|light:|theme)[^"]*"/gi) || [];
  report.theme.themeClasses = [...new Set(themeClassMatches.map((m) => m.slice(7, -1)))].slice(0, 10);

  // ==========================================================================
  // Component Detection
  // ==========================================================================

  // Cards
  report.components.cards = (html.match(/class="[^"]*(card|rounded.*shadow|bg-white.*p-6)/gi) || []).length;

  // Tables
  report.components.tables = (html.match(/<table/gi) || []).length;

  // Buttons
  report.components.buttons = (html.match(/<button/gi) || []).length;

  // Inputs
  report.components.inputs = (html.match(/<input/gi) || []).length;

  // Badges/Status chips
  report.components.badges = (html.match(/class="[^"]*(badge|chip|pill|tag)/gi) || []).length;

  // ==========================================================================
  // Spacing Analysis
  // ==========================================================================

  const spacingClasses = html.match(/(p-|m-|gap-|px-|py-|mx-|my-)[0-9]+/gi) || [];
  const spacingCounts: Record<string, number> = {};

  spacingClasses.forEach((cls) => {
    spacingCounts[cls] = (spacingCounts[cls] || 0) + 1;
  });

  // Sort by frequency
  const sortedSpacing = Object.entries(spacingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cls]) => cls);

  report.spacing.commonClasses = sortedSpacing;

  // Guess spacing scale
  const hasTailwindScale = sortedSpacing.some((cls) => /-[0-9]+$/.test(cls));
  if (hasTailwindScale) {
    report.spacing.guessedScale = 'Tailwind (4px base)';
  } else {
    report.spacing.guessedScale = 'Custom or inline styles';
  }

  // ==========================================================================
  // Recommendations
  // ==========================================================================

  if (report.layout.hasSidebar && report.layout.sidebarPosition === 'left') {
    report.recommendations.push('✅ Sidebar-first layout detected (matches Square UI pattern)');
  }

  if (!report.layout.hasSidebar) {
    report.recommendations.push('⚠️  No sidebar detected - consider adding for navigation');
  }

  if (report.theme.hasDarkMode && report.theme.hasThemeToggle) {
    report.recommendations.push('✅ Dark mode with toggle implemented');
  } else if (report.theme.hasDarkMode) {
    report.recommendations.push('⚠️  Dark mode detected but no toggle found');
  } else {
    report.recommendations.push('💡 Consider adding dark mode support (next-themes recommended)');
  }

  if (report.components.cards > 0) {
    report.recommendations.push(`✅ Card-based layout detected (${report.components.cards} cards)`);
  }

  if (report.components.tables > 0) {
    report.recommendations.push(`✅ Data tables present (${report.components.tables} tables)`);
  }

  if (report.components.buttons > 10) {
    report.recommendations.push(`💡 Many buttons detected (${report.components.buttons}) - consider consistent button styles`);
  }

  return report;
}

function generateMarkdown(report: UIReport, url: string): string {
  return `# UI Analysis Report

**Source:** ${url}
**Generated:** ${new Date().toISOString()}

---

## Layout Structure

| Element | Detected |
|---------|----------|
| Sidebar | ${report.layout.hasSidebar ? '✅ Yes' : '❌ No'} ${report.layout.sidebarPosition ? `(${report.layout.sidebarPosition})` : ''} |
| Header | ${report.layout.hasHeader ? '✅ Yes' : '❌ No'} |
| Main | ${report.layout.hasMain ? '✅ Yes' : '❌ No'} |

---

## Theme Support

| Feature | Status |
|---------|--------|
| Dark Mode | ${report.theme.hasDarkMode ? '✅ Yes' : '❌ No'} |
| Theme Toggle | ${report.theme.hasThemeToggle ? '✅ Yes' : '❌ No'} |

${report.theme.themeClasses.length > 0 ? `**Theme Classes Found:**
${report.theme.themeClasses.map((c) => `- \`${c}\``).join('\n')}` : ''}

---

## Components Detected

| Component | Count |
|-----------|-------|
| Cards | ${report.components.cards} |
| Tables | ${report.components.tables} |
| Buttons | ${report.components.buttons} |
| Inputs | ${report.components.inputs} |
| Badges | ${report.components.badges} |

---

## Spacing Scale

**Guessed System:** ${report.spacing.guessedScale}

**Most Common Classes:**
${report.spacing.commonClasses.map((cls) => `- \`${cls}\``).join('\n')}

---

## Recommendations

${report.recommendations.map((r) => `- ${r}`).join('\n')}

---

## Implementation Notes for KGS

Based on this analysis, here's what we should adopt:

1. **Layout:** ${report.layout.hasSidebar ? 'Keep sidebar-first approach' : 'Consider adding sidebar navigation'}
2. **Theme:** ${report.theme.hasDarkMode ? 'Implement dark mode with next-themes' : 'Add dark mode support'}
3. **Components:** Use shadcn/ui for cards, tables, buttons
4. **Spacing:** Follow Tailwind spacing scale (${report.spacing.guessedScale})

---

*Generated by KGS UI Analyzer*
`;
}

async function main() {
  const snapshotDir = process.argv[2];

  if (!snapshotDir) {
    console.error('Usage: pnpm ui:analyze <snapshot-dir>');
    console.error('');
    console.error('Example:');
    console.error('  pnpm ui:analyze docs/snapshots/2026-03-03T12-00-00-abc123');
    process.exit(1);
  }

  const htmlPath = path.join(snapshotDir, 'snapshot.html');
  const metadataPath = path.join(snapshotDir, 'metadata.json');

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ snapshot.html not found: ${htmlPath}`);
    process.exit(1);
  }

  console.log(`🔍 Analyzing: ${snapshotDir}`);

  const html = fs.readFileSync(htmlPath, 'utf8');
  const report = analyzeHTML(html);

  // Get URL from metadata or use placeholder
  let url = snapshotDir;
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    url = metadata.url || url;
  }

  // Generate report
  const markdown = generateMarkdown(report, url);
  const reportPath = path.join(snapshotDir, 'ui-report.md');
  fs.writeFileSync(reportPath, markdown, 'utf8');

  console.log('');
  console.log('✅ Analysis complete!');
  console.log(`   Report saved to: ${reportPath}`);
  console.log('');
  console.log('Summary:');
  console.log(`   Layout: Sidebar=${report.layout.hasSidebar}, Header=${report.layout.hasHeader}, Main=${report.layout.hasMain}`);
  console.log(`   Theme: Dark=${report.theme.hasDarkMode}, Toggle=${report.theme.hasThemeToggle}`);
  console.log(`   Components: Cards=${report.components.cards}, Tables=${report.components.tables}, Buttons=${report.components.buttons}`);
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
