// import { DM_Sans } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/next"

// const outfit = Outfit({
//   subsets: ["latin"],
// });
// const dm = DM_Sans({
//   subsets: ['latin'],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`dark:bg-gray-900`}>
        <Analytics />
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
          <Toaster position="top-right" richColors/>
        </ThemeProvider>
      </body>
    </html>
  );
}
