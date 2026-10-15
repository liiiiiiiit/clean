import React from 'react';
import { Sparkles, Phone, MapPin, Mail } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface FooterProps {
  currentLang: Language;
  onOpenAdmin?: () => void;
  newBookingsCount?: number;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenAdmin, newBookingsCount }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-400 to-amber-300 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Shine Cleaning
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="text-xs text-slate-400 pt-1">
              {currentLang === 'hy'
                ? 'Կոնտակտային անձ՝ Իրինա'
                : currentLang === 'ru'
                ? 'Контактное лицо: Ирина'
                : 'Customer Care: Irina'}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-sky-400 transition-colors">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-400 transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-sky-400 transition-colors">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-400 transition-colors">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+37477442554" className="hover:text-sky-400 transition-colors font-medium tabular-nums">
                  +374 77 442554
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Yerevan, Armenia</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>info@shinecleaning.am</span>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.serviceAreas}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.footer.serviceAreasText}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              {currentLang === 'hy'
                ? 'Աշխատում ենք շաբաթական 7 օր՝ 08:00 - 21:00'
                : currentLang === 'ru'
                ? 'Работаем без выходных: 08:00 - 21:00'
                : 'Open 7 days a week: 08:00 – 21:00'}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>{t.footer.copyright}</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Shine Cleaning Armenia · High-Standard Sanitization</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Staff Portal</span>
                {newBookingsCount !== undefined && newBookingsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
