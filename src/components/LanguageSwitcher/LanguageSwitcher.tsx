import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'my',
    name: 'Myanmar',
    nativeName: 'မြန်မာ',
    flag: '🇲🇲'
  }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document direction for Myanmar
    if (languageCode === 'my') {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'my');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button flex items-center space-x-2 px-3 py-2.5 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-sm"
        aria-label="Change language"
      >
        <Globe size={16} className="text-gray-600" />
        <span className="text-sm font-semibold hidden sm:inline">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Enhanced Dropdown */}
          <div className="absolute right-0 mt-2 w-52 glass-dropdown rounded-xl z-20 overflow-hidden">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full dropdown-item justify-between mx-2 my-1 ${
                    currentLanguage.code === language.code
                      ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-600 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-semibold text-sm">{language.nativeName}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {language.name}
                      </div>
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
