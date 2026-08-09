import Link from 'next/link';
import { Utensils, Heart, Mail, Phone, MapPin, Github, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">RecipeHub</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              RecipeHub is the premiere community platform for food enthusiasts to discover, share, and master extraordinary culinary creations from around the world.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-amber-400 transition-colors">Browse Recipes</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">Login / Register</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>742 Gourmet Way, Culinary City, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@recipehub.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (800) 555-CHEF</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links & Newsletter */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Follow Us</h4>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              Subscribe to our weekly recipe digest for fresh chef highlights.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for food enthusiasts worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
