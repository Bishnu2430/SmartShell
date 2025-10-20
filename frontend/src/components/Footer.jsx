import React from "react";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-white">
                EcoHealth Society
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Real-time air quality monitoring and health protection products
              for a sustainable future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-green-500 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-green-500 transition">
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-green-500 transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-green-500 transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span>support@ecohealth.society</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Pitampura, Delhi - 110034</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 EcoHealth Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
