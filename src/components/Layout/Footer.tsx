import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'View Reports', path: '/reports' },
        { name: 'Submit Report', path: '/report/new' },
        { name: 'Emergency Contacts', path: '/emergency' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Safety Guidelines', path: '/safety' },
        { name: 'Emergency Preparedness', path: '/preparedness' },
        { name: 'Community Support', path: '/support' },
        { name: 'Training Materials', path: '/training' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Report Issues', path: '/issues' },
        { name: 'Feedback', path: '/feedback' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">DisasterWatch</h3>
                <p className="text-sm text-gray-400">Community Reporting</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone size={16} />
                <span>Emergency: 911</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail size={16} />
                <span>support@disasterwatch.org</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin size={16} />
                <span>Available Nationwide</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} DisasterWatch. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/accessibility"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
