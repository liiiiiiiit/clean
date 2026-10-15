import React from 'react';
import { Sparkles, Shield, HeartHandshake, CheckCircle } from 'lucide-react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Founder commitment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{t.about.sectionTitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.about.leadTitle}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>{t.about.storyParagraph1}</p>
              <p>{t.about.storyParagraph2}</p>
            </div>

            {/* Founder Quote Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-50/80 via-white to-amber-50/40 border border-sky-100/80 shadow-xs relative">
              <div className="text-sm sm:text-base italic font-medium text-slate-700 leading-relaxed">
                {t.about.founderQuote}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.about.founderName}</div>
                  <div className="text-xs text-sky-700 font-medium">{t.about.founderRole}</div>
                </div>
                <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  +374 77 442554
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Quality Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                {t.about.pillar1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.about.pillar1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                {t.about.pillar2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.about.pillar2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                {t.about.pillar3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.about.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
