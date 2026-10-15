import React, { useState } from 'react';
import { Check, Shield, Wrench, ArrowUpRight } from 'lucide-react';
import { Language, ServiceType } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface ServicesSectionProps {
  currentLang: Language;
  onSelectService: (serviceType: ServiceType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ currentLang, onSelectService }) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<ServiceType>('home');

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            {t.services.sectionTitle}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.services.sectionSubtitle}
          </h2>
        </div>

        {/* Interactive Service Selector Pills/Tabs */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            {t.services.items.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setActiveTab(srv.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === srv.id
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {srv.title}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.services.items.map((service) => {
            const isHighlighted = activeTab === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isHighlighted
                    ? 'border-sky-400 ring-2 ring-sky-400/20 shadow-md bg-white'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Service Card Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-md bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                        {service.badge}
                      </span>
                    </div>

                    {/* Rate preview in image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-medium text-sky-200">{service.tagline}</p>
                      <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Rate pill & Quick Specs */}
                    <div className="flex items-center justify-between text-xs py-2 px-3 bg-sky-50/70 rounded-lg border border-sky-100 text-sky-900 font-semibold">
                      <span>{service.rateLabel}</span>
                      <span className="text-sky-700 font-normal">
                        {currentLang === 'hy'
                          ? 'Գերմանական Kärcher տեխնիկա'
                          : currentLang === 'ru'
                          ? 'Техника Kärcher'
                          : 'German Kärcher gear'}
                      </span>
                    </div>

                    {/* Included Checklist */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-sky-600" />
                        <span>{t.services.includedHeader}</span>
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Equipment Details */}
                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.services.equipmentHeader}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {service.equipment.map((eq, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 text-[11px] font-medium bg-slate-50 text-slate-700 rounded border border-slate-200"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectService(service.id);
                      const el = document.getElementById('pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 border border-sky-200 transition-colors"
                  >
                    <span>{t.services.selectServiceCTA}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
