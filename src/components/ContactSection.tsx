import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, MapPin, Clock, CheckCircle2, Send, Sparkles, User } from 'lucide-react';
import { BookingFormData, Language, ServiceType } from '../types.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { formatAMD, SERVICE_RATES } from '../utils/calculator.ts';

import { saveNewBooking } from '../utils/bookingStorage.ts';

interface ContactSectionProps {
  currentLang: Language;
  formData: BookingFormData;
  onFormChange: (data: Partial<BookingFormData>) => void;
  estimatedPriceAMD?: number;
  onBookingCreated?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLang,
  formData,
  onFormChange,
  estimatedPriceAMD,
  onBookingCreated,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName =
        currentLang === 'hy'
          ? 'Խնդրում ենք նշել ձեր անունը'
          : currentLang === 'ru'
          ? 'Пожалуйста, укажите ваше имя'
          : 'Please enter your name';
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.trim().length < 6) {
      newErrors.phoneNumber =
        currentLang === 'hy'
          ? 'Խնդրում ենք նշել գործող հեռախոսահամար'
          : currentLang === 'ru'
          ? 'Пожалуйста, введите корректный номер'
          : 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Save permanently to storage
      const saved = saveNewBooking({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        serviceType: formData.serviceType,
        areaSqM: formData.areaSqM,
        date: formData.date || new Date().toISOString().slice(0, 10),
        address: formData.address || 'Yerevan',
        notes: formData.notes,
        addOns: formData.addOns,
        estimatedPriceAMD: estimatedPriceAMD || formData.areaSqM * 450,
      });

      setIsSubmitting(false);
      setSubmittedRef(saved.refNumber);
      if (onBookingCreated) {
        onBookingCreated();
      }
    }, 400);
  };

  // WhatsApp prefilled message
  const serviceTitle =
    t.services.items.find((s) => s.id === formData.serviceType)?.title || formData.serviceType;
  const whatsappText = encodeURIComponent(
    `Hello Irina, I would like to book a cleaning service with Shine Cleaning:\n` +
      `• Name: ${formData.fullName}\n` +
      `• Phone: ${formData.phoneNumber}\n` +
      `• Service: ${serviceTitle}\n` +
      `• Area: ${formData.areaSqM} m²\n` +
      (formData.date ? `• Preferred Date: ${formData.date}\n` : '') +
      (formData.address ? `• Location: ${formData.address}\n` : '') +
      (estimatedPriceAMD ? `• Estimated Price: ${formatAMD(estimatedPriceAMD)}\n` : '') +
      (formData.notes ? `• Notes: ${formData.notes}` : '')
  );

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            {t.contact.sectionTitle}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.inquiryHeadline}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Phone & Contact Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Phone Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-sky-100 font-semibold">
                  {t.contact.contactPersonLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-xs">
                  {currentLang === 'hy' ? 'Ակտիվ' : currentLang === 'ru' ? 'На связи' : 'Available'}
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-300" />
                  <span>{t.contact.contactPersonName}</span>
                </div>
                <p className="text-xs text-sky-100 mt-1">
                  {currentLang === 'hy'
                    ? 'Հաճախորդների սպասարկման անձնական պատասխանատու'
                    : currentLang === 'ru'
                    ? 'Персональный менеджер по клинингу'
                    : 'Personal cleaning director & coordinator'}
                </p>
              </div>

              {/* Big Phone Number Display */}
              <div className="pt-2">
                <a
                  href="tel:+37477442554"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-lg sm:text-xl shadow-xs hover:bg-sky-50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-sky-600 shrink-0" />
                  <span className="tabular-nums">+374 77 442554</span>
                </a>
              </div>

              {/* WhatsApp direct button */}
              <a
                href={`https://wa.me/37477442554?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.contact.directChatWhatsApp}</span>
              </a>
            </div>

            {/* Operating Details Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-700">{t.contact.hoursLabel}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.contact.hoursValue}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-700">{t.contact.locationLabel}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.contact.locationValue}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
            {submittedRef ? (
              <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    {t.contact.successMessage}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 max-w-sm mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">{t.contact.refNumberLabel}:</span>
                    <span className="font-bold font-mono text-sky-700">{submittedRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.contact.fullNameLabel}:</span>
                    <span className="font-semibold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.contact.phoneFieldLabel}:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{formData.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.contact.serviceFieldLabel}:</span>
                    <span className="font-semibold text-slate-800">{serviceTitle}</span>
                  </div>
                  {estimatedPriceAMD && (
                    <div className="flex justify-between border-t pt-2 font-bold text-sky-900">
                      <span>{t.calculator.estimatedTotal}:</span>
                      <span className="tabular-nums">{formatAMD(estimatedPriceAMD)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/37477442554?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs hover:bg-emerald-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send details via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      onFormChange({ fullName: '', phoneNumber: '', notes: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white"
                  >
                    {t.contact.bookAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t.contact.formTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.contact.formSubtitle}</p>
                </div>

                {/* Estimate badge if applied from calculator */}
                {estimatedPriceAMD && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>
                        {currentLang === 'hy'
                          ? 'Հաշվարկված նախնական գինը՝'
                          : currentLang === 'ru'
                          ? 'Расчитанная стоимость:'
                          : 'Calculated estimate:'}
                      </span>
                    </div>
                    <span className="font-bold text-sm tabular-nums text-sky-800">
                      {formatAMD(estimatedPriceAMD)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.fullNameLabel} *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => onFormChange({ fullName: e.target.value })}
                      placeholder={t.contact.fullNamePlaceholder}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.phoneFieldLabel} *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => onFormChange({ phoneNumber: e.target.value })}
                      placeholder={t.contact.phoneFieldPlaceholder}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        errors.phoneNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.serviceFieldLabel}
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => onFormChange({ serviceType: e.target.value as ServiceType })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="home">
                        {currentLang === 'hy'
                          ? 'Տների մաքրում'
                          : currentLang === 'ru'
                          ? 'Уборка домов'
                          : 'Home Cleaning'}
                      </option>
                      <option value="office">
                        {currentLang === 'hy'
                          ? 'Գրասենյակների մաքրում'
                          : currentLang === 'ru'
                          ? 'Уборка офисов'
                          : 'Office Cleaning'}
                      </option>
                      <option value="commercial">
                        {currentLang === 'hy'
                          ? 'Առևտրային տարածքներ'
                          : currentLang === 'ru'
                          ? 'Коммерческие помещения'
                          : 'Commercial Premises'}
                      </option>
                      <option value="deep_dryclean">
                        {currentLang === 'hy'
                          ? 'Քիմմաքրում / Խորացված'
                          : currentLang === 'ru'
                          ? 'Химчистка / Генеральная'
                          : 'Deep & Dry Cleaning'}
                      </option>
                    </select>
                  </div>

                  {/* Area input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.areaFieldLabel}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min={10}
                        max={1000}
                        value={formData.areaSqM}
                        onChange={(e) => onFormChange({ areaSqM: Number(e.target.value) || 20 })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                      />
                      <span className="ml-2 text-xs font-bold text-slate-500">m²</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.dateFieldLabel}
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => onFormChange({ date: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.contact.addressFieldLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => onFormChange({ address: e.target.value })}
                      placeholder={t.contact.addressFieldPlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t.contact.notesFieldLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => onFormChange({ notes: e.target.value })}
                    placeholder={t.contact.notesFieldPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md shadow-sky-600/20 disabled:opacity-75 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t.contact.submitting : t.contact.submitButton}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
