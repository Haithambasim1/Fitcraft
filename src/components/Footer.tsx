
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-6 w-6 text-fitcraft-primary" />
              <span className="font-bold text-xl text-fitcraft-dark">FitCraft</span>
            </Link>
            <p className="text-slate-600 mb-4">
              AI-powered fitness solutions tailored to your goals and preferences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-fitcraft-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-fitcraft-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-fitcraft-primary transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-600 hover:text-fitcraft-primary transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FitCraft. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center">
            Made with <Heart size={14} className="mx-1 text-pink-500" /> for a healthier world
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
