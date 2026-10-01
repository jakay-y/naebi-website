import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naebi Dynamic Concepts | Helicopter Surveillance & Airspace Security, Nigeria',
  description:
    'Naebi Dynamic Concepts monitors civil helicopter operations across Nigerian airspace, working with NAMA, NCAA and FAAN to track, verify and record every landing and take-off.',
  openGraph: {
    title: 'Naebi Dynamic Concepts',
    description: 'Every rotor. Every landing. Accounted for.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0c10',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
