/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PricingCalculator } from './components/PricingCalculator.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { BookingFormData, FrequencyType, Language, ServiceType } from './types.ts';
import { calculateEstimatedPrice } from './utils/calculator.ts';
import { getStoredBookings } from './utils/bookingStorage.ts';
import { Phone, MessageCircle, Shield } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // App View: 'website' or 'admin'
  const [currentView, setCurrentView] = useState<'website' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.search.includes('view=admin')) {
        return 'admin';
      }
    }
    return 'website';
  });

  const [newBookingsCount, setNewBookingsCount] = useState(0);

  const refreshBookingsCount = () => {
    const list = getStoredBookings();
    const count = list.filter((b) => b.status === 'new').length;
    setNewBookingsCount(count);
  };

  useEffect(() => {
    refreshBookingsCount();

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#home' || window.location.hash === '') {
        setCurrentView('website');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Calculator State
  const [selectedService, setSelectedService] = useState<ServiceType>('home');
  const [areaSqM, setAreaSqM] = useState<number>(75);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<FrequencyType>('one_time');

  // Booking Form State
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phoneNumber: '',
    serviceType: 'home',
    areaSqM: 75,
    date: '',
    timeSlot: 'morning',
    address: '',
    notes: '',
    addOns: [],
  });

  const [appliedEstimatePrice, setAppliedEstimatePrice] = useState<number | undefined>(undefined);

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyEstimateToBooking = () => {
    const result = calculateEstimatedPrice({
      serviceType: selectedService,
      areaSqM,
      addOnIds: selectedAddOns,
      frequency,
    });

    setAppliedEstimatePrice(result.finalPriceAMD);
    setFormData((prev) => ({
      ...prev,
      serviceType: selectedService,
      areaSqM,
      addOns: selectedAddOns,
    }));

    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormChange = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // If viewing Admin Panel:
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToWebsite={() => {
          window.location.hash = '#home';
          setCurrentView('website');
          refreshBookingsCount();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sticky Header with 3-Zone Contract, Language Selector & Admin Panel Link */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onBookClick={scrollToContact}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
        newBookingsCount={newBookingsCount}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          currentLang={currentLang}
          onBookClick={scrollToContact}
          onCalculateClick={scrollToPricing}
        />

        {/* 2. Services Section (Office, Home, Commercial, Deep & Dry Cleaning) */}
        <ServicesSection
          currentLang={currentLang}
          onSelectService={(srv) => {
            setSelectedService(srv);
            setFormData((prev) => ({ ...prev, serviceType: srv }));
          }}
        />

        {/* 3. Pricing & Interactive Calculator Section */}
        <PricingCalculator
          currentLang={currentLang}
          selectedService={selectedService}
          onServiceChange={(srv) => {
            setSelectedService(srv);
            setFormData((prev) => ({ ...prev, serviceType: srv }));
          }}
          areaSqM={areaSqM}
          onAreaChange={setAreaSqM}
          selectedAddOns={selectedAddOns}
          onToggleAddOn={handleToggleAddOn}
          frequency={frequency}
          onFrequencyChange={setFrequency}
          onApplyEstimateToBooking={handleApplyEstimateToBooking}
        />

        {/* 4. About Us Section */}
        <AboutSection currentLang={currentLang} />

        {/* 5. Contact & Booking Form Section */}
        <ContactSection
          currentLang={currentLang}
          formData={formData}
          onFormChange={handleFormChange}
          estimatedPriceAMD={appliedEstimatePrice}
          onBookingCreated={refreshBookingsCount}
        />
      </main>

      {/* Floating Call & WhatsApp Quick Trigger (Mobile & Desktop) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#admin';
            setCurrentView('admin');
          }}
          title="Open Staff Admin Panel"
          className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-900/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative"
        >
          <Shield className="w-5 h-5 text-amber-300" />
          {newBookingsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {newBookingsCount}
            </span>
          )}
        </button>
        <a
          href="https://wa.me/37477442554"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="WhatsApp Irina"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href="tel:+37477442554"
          aria-label="Call Irina +374 77 442554"
          className="w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
        newBookingsCount={newBookingsCount}
      />
    </div>
  );
}
