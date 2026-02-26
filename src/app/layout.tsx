import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'POSMariche | Excelencia en Ventas Administrativas',
  description: 'Un programa de ventas administrativas moderno diseñado para optimizar los flujos de trabajo y automatizar las operaciones de ventas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
