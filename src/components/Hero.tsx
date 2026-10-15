import React from 'react';
import { ShieldCheck, Sparkles, Clock, CheckCircle2, ArrowRight, Calculator } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface HeroProps {
  currentLang: Language;
  onBookClick: () => void;
  onCalculateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onBookClick, onCalculateClick }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="home" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-slate-50">
      {/* Subtle background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs sm:text-sm font-semibold tracking-wide border border-sky-200/60 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{t.hero.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              {t.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-md shadow-sky-600/20 transition-all group"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onCalculateClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl border border-slate-300 shadow-xs transition-all"
              >
                <Calculator className="w-4 h-4 text-sky-600" />
                <span>{t.hero.ctaSecondary}</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{t.hero.trust3}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.hero.trust4}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
              <img
                src="/src/assets/images/hero_cleaning_interior_1792068594017.jpg"
                alt="Pristine bright home interior cleaned by Shine Cleaning"
                className="w-full h-[380px] sm:h-[420px] lg:h-[460px] object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating trust card overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-lg text-slate-900 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-sky-600 font-bold">
                    Shine Cleaning
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {currentLang === 'hy'
                      ? 'Պրոֆեսիոնալ մաքրություն'
                      : currentLang === 'ru'
                      ? 'Профессиональная чистота'
                      : 'Professional Standards'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {currentLang === 'hy' ? 'Կոնտակտ' : currentLang === 'ru' ? 'Контакт' : 'Contact'}
                  </div>
                  <a
                    href="tel:+37477442554"
                    className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 tabular-nums"
                  >
                    +374 77 442554
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
