import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AnalyzeProvider } from '@/context/analyze-context';
import { ThemeProvider } from '@/context/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MetaCheck — Preview your site on Google, Facebook, Twitter & LinkedIn',
  description:
    'Analyze meta tags, Open Graph, Twitter Cards, and schema.org for any URL. Get a visual preview and technical report in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnalyzeProvider>{children}</AnalyzeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
