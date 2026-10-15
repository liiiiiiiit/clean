import React from 'react';
import { Calculator, Check, ArrowRight, Info, Users, Clock } from 'lucide-react';
import { FrequencyType, Language, ServiceType } from '../types.ts';
import {
  calculateEstimatedPrice,
  formatAMD,
  SERVICE_RATES,
  ADD_ON_DEFINITIONS,
} from '../utils/calculator.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface PricingCalculatorProps {
  currentLang: Language;
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  areaSqM: number;
  onAreaChange: (area: number) => void;
  selectedAddOns: string[];
  onToggleAddOn: (id: string) => void;
  frequency: FrequencyType;
  onFrequencyChange: (freq: FrequencyType) => void;
  onApplyEstimateToBooking: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  currentLang,
  selectedService,
  onServiceChange,
  areaSqM,
  onAreaChange,
  selectedAddOns,
  onToggleAddOn,
  frequency,
  onFrequencyChange,
  onApplyEstimateToBooking,
}) => {
  const t = TRANSLATIONS[currentLang];
  const calcResult = calculateEstimatedPrice({
    serviceType: selectedService,
    areaSqM,
    addOnIds: selectedAddOns,
    frequency,
  });

  const currentRate = SERVICE_RATES[selectedService];
  const staff = currentRate.recommendedStaff(areaSqM);
  const estHours = currentRate.estimatedHours(areaSqM);

  const serviceOptions: { id: ServiceType; name: string }[] = [
    {
      id: 'home',
      name:
        currentLang === 'hy'
          ? 'Տների մաքրում'
          : currentLang === 'ru'
          ? 'Уборка домов'
          : 'Home Cleaning',
    },
    {
      id: 'office',
      name:
        currentLang === 'hy'
          ? 'Գրասենյակների մաքրում'
          : currentLang === 'ru'
          ? 'Уборка офисов'
          : 'Office Cleaning',
    },
    {
      id: 'commercial',
      name:
        currentLang === 'hy'
          ? 'Առևտրային տարածքներ'
          : currentLang === 'ru'
          ? 'Коммерческие помещения'
          : 'Commercial Premises',
    },
    {
      id: 'deep_dryclean',
      name:
        currentLang === 'hy'
          ? 'Քիմմաքրում / Խորացված'
          : currentLang === 'ru'
          ? 'Химчистка / Генеральная'
          : 'Deep & Dry Cleaning',
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.sectionTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.calculator.sectionSubtitle}
          </h2>
        </div>

        {/* Transparent Rates Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              {currentLang === 'hy' ? 'Տների մաքրում' : currentLang === 'ru' ? 'Уборка домов' : 'Home Cleaning'}
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">450 ֏ <span className="text-xs font-normal text-slate-500">/ m²</span></div>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentLang === 'hy' ? 'Նվազագույնը՝ 18,000 ֏' : currentLang === 'ru' ? 'Мин. заказ: 18,000 ֏' : 'Min: 18,000 ֏'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              {currentLang === 'hy' ? 'Գրասենյակներ' : currentLang === 'ru' ? 'Офисы' : 'Office Cleaning'}
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">380 ֏ <span className="text-xs font-normal text-slate-500">/ m²</span></div>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentLang === 'hy' ? 'Նվազագույնը՝ 20,000 ֏' : currentLang === 'ru' ? 'Мин. заказ: 20,000 ֏' : 'Min: 20,000 ֏'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              {currentLang === 'hy' ? 'Առևտրային' : currentLang === 'ru' ? 'Коммерческие' : 'Commercial'}
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">420 ֏ <span className="text-xs font-normal text-slate-500">/ m²</span></div>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentLang === 'hy' ? 'Նվազագույնը՝ 25,000 ֏' : currentLang === 'ru' ? 'Мин. заказ: 25,000 ֏' : 'Min: 25,000 ֏'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              {currentLang === 'hy' ? 'Քիմմաքրում' : currentLang === 'ru' ? 'Химчистка' : 'Deep Dry Clean'}
            </div>
            <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">650 ֏ <span className="text-xs font-normal text-slate-500">/ m²</span></div>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentLang === 'hy' ? 'Նվազագույնը՝ 25,000 ֏' : currentLang === 'ru' ? 'Мин. заказ: 25,000 ֏' : 'Min: 25,000 ֏'}
            </div>
          </div>
        </div>

        {/* Interactive Calculator Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* 1. Service Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                {t.calculator.serviceLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onServiceChange(opt.id)}
                    className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      selectedService === opt.id
                        ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-xs ring-1 ring-sky-600'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Area Size Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="area-range" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.calculator.areaLabel}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={15}
                    max={600}
                    value={areaSqM}
                    onChange={(e) => onAreaChange(Math.max(10, Math.min(1000, Number(e.target.value) || 10)))}
                    className="w-20 px-2 py-1 text-right text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                  />
                  <span className="text-xs font-bold text-slate-500">m²</span>
                </div>
              </div>

              <input
                id="area-range"
                type="range"
                min={20}
                max={400}
                step={5}
                value={areaSqM}
                onChange={(e) => onAreaChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 mt-1 tabular-nums">
                <span>20 m² (Studio)</span>
                <span>80 m² (2-3 Rooms)</span>
                <span>150 m² (House/Office)</span>
                <span>400 m² (Large Space)</span>
              </div>
            </div>

            {/* 3. Frequency Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {t.calculator.frequencyLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(['one_time', 'weekly', 'biweekly', 'monthly'] as FrequencyType[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => onFrequencyChange(freq)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                      frequency === freq
                        ? 'border-sky-600 bg-sky-50 text-sky-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.calculator.frequencies[freq]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Add-ons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                {t.calculator.addOnsLabel}
              </label>
              <div className="space-y-2">
                {ADD_ON_DEFINITIONS.map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.id);
                  const translationKey = addon.id as keyof typeof t.calculator.addOns;
                  const itemInfo = t.calculator.addOns[translationKey];

                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-sky-400 bg-sky-50/60 text-sky-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleAddOn(addon.id)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                        />
                        <span>{itemInfo?.title || addon.id}</span>
                      </div>
                      <span className="text-xs font-bold text-sky-700 tabular-nums">
                        {itemInfo?.price || `+${formatAMD(addon.priceAMD)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">{t.calculator.summaryTitle}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 font-semibold border border-sky-100">
                {areaSqM} m²
              </span>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t.calculator.ratePerSqM}:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {currentRate.ratePerSqM} ֏ / m²
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>
                  {currentLang === 'hy'
                    ? 'Բազային արժեք'
                    : currentLang === 'ru'
                    ? 'Базовая стоимость'
                    : 'Base area cost'}
                  :
                </span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {formatAMD(calcResult.basePriceAMD)}
                </span>
              </div>

              {calcResult.addOnsTotalAMD > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>
                    {currentLang === 'hy'
                      ? 'Լրացուցիչ ծառայություններ'
                      : currentLang === 'ru'
                      ? 'Дополнительные опции'
                      : 'Add-ons total'}
                    :
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    +{formatAMD(calcResult.addOnsTotalAMD)}
                  </span>
                </div>
              )}

              {calcResult.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>
                    {currentLang === 'hy'
                      ? `Զեղչ (${calcResult.discountPercent}%)`
                      : currentLang === 'ru'
                      ? `Скидка (${calcResult.discountPercent}%)`
                      : `Discount (${calcResult.discountPercent}%)`}
                    :
                  </span>
                  <span className="tabular-nums font-semibold">
                    -{formatAMD(calcResult.discountAMD)}
                  </span>
                </div>
              )}

              {/* Work parameters */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">{t.calculator.staffNeeded}</div>
                    <div className="font-bold text-slate-800">
                      {staff}{' '}
                      {currentLang === 'hy'
                        ? 'մասնագետ'
                        : currentLang === 'ru'
                        ? 'клинера'
                        : 'staff'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">{t.calculator.approxTime}</div>
                    <div className="font-bold text-slate-800">{estHours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 via-sky-50/50 to-amber-50/30 border border-sky-100 text-center">
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider block mb-1">
                {t.calculator.estimatedTotal}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-950 tabular-nums">
                {formatAMD(calcResult.finalPriceAMD)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-center gap-1">
                <Info className="w-3 h-3 text-sky-600 shrink-0" />
                <span>{t.calculator.minPriceNote}</span>
              </div>
            </div>

            {/* Booking action button */}
            <button
              type="button"
              onClick={onApplyEstimateToBooking}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md shadow-sky-600/20 transition-all"
            >
              <span>{t.calculator.bookWithEstimate}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
