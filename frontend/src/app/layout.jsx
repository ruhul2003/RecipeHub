import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RecipeHub — Premier Recipe Sharing & Culinary Platform',
  description: 'Discover, share, and save world-class recipes with passionate home chefs and food enthusiasts on RecipeHub.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
