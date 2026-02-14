import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coding Agent Assistant',
  description: 'AI-powered coding assistant with knowledge base integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
