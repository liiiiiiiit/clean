import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, Menu, X, Globe, ChevronDown, Inbox } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onBookClick: () => void;
  onOpenAdmin?: () => void;
  newBookingsCount?: number;
}

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: 'hy', label: 'Հայերեն', short: 'HY' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onBookClick,
  onOpenAdmin,
  newBookingsCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 text-slate-900 group whitespace-nowrap shrink-0"
            aria-label="Shine Cleaning Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-amber-300 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                Shine Cleaning
              </span>
              <span className="text-[11px] tracking-wide text-sky-700 font-medium -mt-1 hidden sm:block">
                Armenia
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
              {t.nav.home}
            </a>
            <a href="#about" className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
              {t.nav.about}
            </a>
            <a href="#services" className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
              {t.nav.services}
            </a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
              {t.nav.pricing}
            </a>
            <a href="#contact" className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
              {t.nav.contact}
            </a>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 text-slate-600 font-semibold flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <span>Admin Panel</span>
                {newBookingsCount !== undefined && newBookingsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {newBookingsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Zone 3: Language Switcher & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                aria-label="Select Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>{currentLangObj.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                >
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentLang === item.code
                          ? 'bg-sky-50 font-semibold text-sky-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{item.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Bookings Inbox Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="relative p-2 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Bookings Inbox / Staff Portal"
                aria-label="Staff Portal"
              >
                <Inbox className="w-4 h-4" />
                {newBookingsCount !== undefined && newBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {newBookingsCount}
                  </span>
                )}
              </button>
            )}

            {/* Direct Phone Link */}
            <a
              href="tel:+37477442554"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-300 transition-all whitespace-nowrap shrink-0"
              title="Call Irina: +374 77 442554"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600 fill-sky-50" />
              <span className="tabular-nums">+374 77 442554</span>
            </a>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onBookClick}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm shadow-sky-600/25 transition-all whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">{t.nav.bookNow}</span>
              <span className="sm:hidden">
                {currentLang === 'hy' ? 'Պատվիրել' : currentLang === 'ru' ? 'Заказ' : 'Book'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg"
            >
              {t.nav.home}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg"
            >
              {t.nav.about}
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg"
            >
              {t.nav.services}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg"
            >
              {t.nav.pricing}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg"
            >
              {t.nav.contact}
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
              {currentLang === 'hy' ? 'Լեզու' : currentLang === 'ru' ? 'Язык' : 'Language'}
            </div>
            <div className="grid grid-cols-3 gap-2 px-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    currentLang === lang.code
                      ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg"
              >
                <Inbox className="w-4 h-4 text-sky-600" />
                <span>Staff Bookings Portal</span>
                {newBookingsCount !== undefined && newBookingsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                    {newBookingsCount} New
                  </span>
                )}
              </button>
            )}

            <a
              href="tel:+37477442554"
              className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>+374 77 442554 (Irina)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
