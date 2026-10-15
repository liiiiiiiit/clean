import { Language, ServiceType } from '../types.ts';

export interface ServiceContent {
  id: ServiceType;
  title: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  rateLabel: string;
  features: string[];
  equipment: string[];
}

export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    services: string;
    pricing: string;
    contact: string;
    bookNow: string;
    callNow: string;
  };
  hero: {
    tagline: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust1: string;
    trust2: string;
    trust3: string;
    trust4: string;
  };
  about: {
    sectionTitle: string;
    leadTitle: string;
    storyParagraph1: string;
    storyParagraph2: string;
    founderQuote: string;
    founderName: string;
    founderRole: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    includedHeader: string;
    equipmentHeader: string;
    selectServiceCTA: string;
    items: ServiceContent[];
  };
  calculator: {
    sectionTitle: string;
    sectionSubtitle: string;
    serviceLabel: string;
    areaLabel: string;
    frequencyLabel: string;
    addOnsLabel: string;
    estimatedTotal: string;
    minPriceNote: string;
    bookWithEstimate: string;
    summaryTitle: string;
    ratePerSqM: string;
    staffNeeded: string;
    approxTime: string;
    frequencies: {
      one_time: string;
      weekly: string;
      biweekly: string;
      monthly: string;
    };
    addOns: {
      windows: { title: string; price: string };
      appliances: { title: string; price: string };
      balcony: { title: string; price: string };
      sofa_dryclean: { title: string; price: string };
      eco_disinfect: { title: string; price: string };
    };
  };
  contact: {
    sectionTitle: string;
    inquiryHeadline: string;
    contactPersonLabel: string;
    contactPersonName: string;
    phoneLabel: string;
    phoneNumber: string;
    hoursLabel: string;
    hoursValue: string;
    locationLabel: string;
    locationValue: string;
    formTitle: string;
    formSubtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneFieldLabel: string;
    phoneFieldPlaceholder: string;
    serviceFieldLabel: string;
    areaFieldLabel: string;
    dateFieldLabel: string;
    addressFieldLabel: string;
    addressFieldPlaceholder: string;
    notesFieldLabel: string;
    notesFieldPlaceholder: string;
    submitButton: string;
    submitting: string;
    directChatWhatsApp: string;
    callDirectly: string;
    successTitle: string;
    successMessage: string;
    bookAnother: string;
    refNumberLabel: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    quickLinks: string;
    contactUs: string;
    serviceAreas: string;
    serviceAreasText: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      pricing: 'Pricing',
      contact: 'Contact',
      bookNow: 'Book a Cleaning',
      callNow: 'Call Us',
    },
    hero: {
      tagline: 'A Brighter Home, A Brighter You',
      headline: 'Professional Cleaning & Deep Cleaning Services in Armenia',
      subheadline: 'Expert cleaning solutions for offices, homes, and commercial premises.',
      ctaPrimary: 'Book a Cleaning',
      ctaSecondary: 'Calculate Estimate',
      trust1: 'Operating in Yerevan & all regions',
      trust2: 'Punctual & vetted cleaning professionals',
      trust3: 'Safe, eco-friendly certified detergents',
      trust4: '100% Quality & satisfaction guaranteed',
    },
    about: {
      sectionTitle: 'About Shine Cleaning',
      leadTitle: 'Elevating hygiene standards across Armenia with care and perfection',
      storyParagraph1:
        'Shine Cleaning was founded with a clear commitment: to bring spotless cleanliness, healthier living spaces, and reliable service to residences and businesses across Armenia. We understand that your home is your sanctuary and your office is your company’s face.',
      storyParagraph2:
        'Our trained specialists arrive fully equipped with certified industrial German cleaning gear (Kärcher vacuum and extraction systems) and hypoallergenic, pet-safe formulations that protect your surfaces while removing deep-seated dirt, dust mites, and bacteria.',
      founderQuote:
        '“We treat every home and office with the same attention and respect as our own. True cleanliness brings peace of mind.”',
      founderName: 'Irina',
      founderRole: 'Founder & Customer Care Director',
      pillar1Title: 'Hospital-Grade Equipment',
      pillar1Desc: 'We utilize multi-stage HEPA filtration extractors, rotary scrubbers, and high-temp steam units.',
      pillar2Title: 'Eco-Safe Certified Chemistry',
      pillar2Desc: 'Biodegradable, non-toxic detergents gentle for children, pets, allergy sufferers, and luxury surfaces.',
      pillar3Title: 'Strict Quality Control',
      pillar3Desc: 'Detailed checklist inspection on every premise before handover, managed personally by Irina.',
    },
    services: {
      sectionTitle: 'Our Cleaning Services',
      sectionSubtitle: 'Tailored cleaning programs for residential, corporate, and commercial properties',
      includedHeader: "What's Included",
      equipmentHeader: 'Equipment & Technology',
      selectServiceCTA: 'Select for Price Estimate',
      items: [
        {
          id: 'office',
          title: 'Office Cleaning',
          tagline: 'Գրասենյակների մաքրում / Уборка офисов',
          description:
            'Complete corporate facility maintenance ensuring a healthy, energizing work environment for your team and an impressive impression for clients.',
          image: '/src/assets/images/service_office_cleaning_1792068594519.jpg',
          badge: 'Corporate',
          rateLabel: 'From 380 ֏ / m²',
          features: [
            'Daily, weekly, or after-hours corporate schedules',
            'Desks, conference rooms, keyboard & tech sanitization',
            'Full kitchen pantry deep cleaning & dishwashing',
            'Restroom disinfection and restocking',
            'Floor scrubbing, mopping, and vacuuming',
            'Waste disposal and recycling management',
          ],
          equipment: ['Quiet industrial HEPA vacuums', 'Surface antiviral disinfectants', 'Color-coded microfiber cross-contamination system'],
        },
        {
          id: 'home',
          title: 'Home Cleaning',
          tagline: 'Տների մաքրում / Уборка домов',
          description:
            'Comprehensive regular and seasonal apartment and house cleaning so you can spend your weekends relaxing rather than scrubbing.',
          image: '/src/assets/images/service_home_cleaning_1792068594713.jpg',
          badge: 'Residential',
          rateLabel: 'From 450 ֏ / m²',
          features: [
            'All bedrooms, living areas, and corridors dusted & mopped',
            'Kitchen degreasing, exterior stove & countertop polish',
            'Bathroom tile descaling, mirrors, shower & toilet sanitization',
            'High-touch switch and handle disinfection',
            'Interior window glass and sill wiping',
            'Linen changing and bed making upon request',
          ],
          equipment: ['Non-toxic EU certified detergents', 'Steam sanitizers', 'Scratch-free microfiber cloths'],
        },
        {
          id: 'commercial',
          title: 'Commercial Premises Cleaning',
          tagline: 'Առևտրային տարածքների մաքրում / Уборка коммерческих помещений',
          description:
            'Heavy-duty sanitization and presentation maintenance for retail boutiques, showrooms, beauty salons, gyms, and restaurants.',
          image: '/src/assets/images/service_commercial_cleaning_1792068611780.jpg',
          badge: 'Commercial',
          rateLabel: 'From 420 ֏ / m²',
          features: [
            'High-traffic floor buffing and scrubbing',
            'Storefront showcase window polishing',
            'Display cases, shelves, and merchandise surface dusting',
            'Food service and customer restroom deep sanitization',
            'Post-event and pre-opening rapid turnaround',
            'Full compliance with health & safety standards',
          ],
          equipment: ['Rotary floor scrubbers', 'Streak-free window squeegees', 'High-volume commercial extractors'],
        },
        {
          id: 'deep_dryclean',
          title: 'Deep Cleaning & Chemical Dry Cleaning',
          tagline: 'Քիմմաքրում / Химчистка',
          description:
            'Intensive post-renovation, move-in/move-out deep scrub, plus professional on-site chemical extraction dry cleaning for sofas, carpets, and mattresses.',
          image: '/src/assets/images/hero_cleaning_interior_1792068594017.jpg',
          badge: 'Deep / Extraction',
          rateLabel: 'From 650 ֏ / m²',
          features: [
            'Post-construction paint, plaster, and grout residue removal',
            'Upholstery fabric stain removal (wine, coffee, pet marks)',
            'Carpet and rug deep fiber water extraction',
            'Mattress dust mite and allergen elimination',
            'Deep kitchen oven, extractor hood, and grease trap degreasing',
            'Tile grout pressure steam rejuvenation',
          ],
          equipment: ['Kärcher Puzzi professional spray-extraction units', 'Steam generators up to 160°C', 'Stain-specific enzyme removers'],
        },
      ],
    },
    calculator: {
      sectionTitle: 'Interactive Pricing & Estimation',
      sectionSubtitle: 'Instant, transparent pricing in Armenian Dram (AMD) based on your space and needs',
      serviceLabel: 'Select Service Type',
      areaLabel: 'Area Size (Square Meters)',
      frequencyLabel: 'Cleaning Frequency',
      addOnsLabel: 'Optional Add-on Services',
      estimatedTotal: 'Estimated Price',
      minPriceNote: '* Final price may vary based on actual contamination level or customized requirements.',
      bookWithEstimate: 'Book with this Estimate',
      summaryTitle: 'Estimate Summary',
      ratePerSqM: 'Base Rate',
      staffNeeded: 'Recommended Crew',
      approxTime: 'Estimated Duration',
      frequencies: {
        one_time: 'One-Time Cleaning (Standard)',
        weekly: 'Weekly Subscription (-15%)',
        biweekly: 'Bi-Weekly (-10%)',
        monthly: 'Monthly Subscription (-5%)',
      },
      addOns: {
        windows: { title: 'Window Deep Washing', price: '+6,000 ֏' },
        appliances: { title: 'Oven & Refrigerator Interior', price: '+8,000 ֏' },
        balcony: { title: 'Balcony / Terrace Scrub', price: '+5,000 ֏' },
        sofa_dryclean: { title: 'Sofa Fabric Chemical Extraction', price: '+12,000 ֏' },
        eco_disinfect: { title: 'Full Anti-Allergen Disinfection', price: '+7,000 ֏' },
      },
    },
    contact: {
      sectionTitle: 'Contact & Booking',
      inquiryHeadline: 'For inquiries, please call us',
      contactPersonLabel: 'Direct Contact Person',
      contactPersonName: 'Irina',
      phoneLabel: 'Phone & WhatsApp',
      phoneNumber: '+374 77 442554',
      hoursLabel: 'Operating Hours',
      hoursValue: 'Monday – Sunday: 08:00 – 21:00',
      locationLabel: 'Service Coverage',
      locationValue: 'Yerevan, Kotayk, Ararat, and across Armenia',
      formTitle: 'Schedule Your Cleaning',
      formSubtitle: 'Fill out the form below. Irina will call you back within 15 minutes to confirm details.',
      fullNameLabel: 'Your Full Name',
      fullNamePlaceholder: 'e.g., Armen Sargsyan',
      phoneFieldLabel: 'Phone Number',
      phoneFieldPlaceholder: '+374 XX XXXXXX',
      serviceFieldLabel: 'Service Type',
      areaFieldLabel: 'Approximate Area (m²)',
      dateFieldLabel: 'Preferred Date',
      addressFieldLabel: 'Address / District',
      addressFieldPlaceholder: 'e.g., Yerevan, Kentron, Northern Ave 10',
      notesFieldLabel: 'Special Instructions / Access Details',
      notesFieldPlaceholder: 'Any specific requests (pets in house, parking notes, keys, etc.)',
      submitButton: 'Submit Booking Request',
      submitting: 'Submitting...',
      directChatWhatsApp: 'Chat with Irina on WhatsApp',
      callDirectly: 'Call +374 77 442554',
      successTitle: 'Booking Request Received!',
      successMessage: 'Thank you! Irina from Shine Cleaning will call you shortly to confirm the scheduled time and requirements.',
      bookAnother: 'Submit Another Request',
      refNumberLabel: 'Booking Reference',
    },
    footer: {
      tagline: 'A Brighter Home, A Brighter You. Professional cleaning solutions throughout Armenia.',
      copyright: '© 2026 Shine Cleaning. All rights reserved.',
      quickLinks: 'Navigation',
      contactUs: 'Direct Contacts',
      serviceAreas: 'Service Area',
      serviceAreasText: 'Serving residential, corporate, and commercial clients in Yerevan and throughout the regions of Armenia.',
    },
  },

  hy: {
    nav: {
      home: 'Գլխավոր',
      about: 'Մեր մասին',
      services: 'Ծառայություններ',
      pricing: 'Գներ',
      contact: 'Կապ',
      bookNow: 'Պատվիրել մաքրում',
      callNow: 'Զանգահարել',
    },
    hero: {
      tagline: 'Ավելի պայծառ տուն, ավելի պայծառ դուք',
      headline: 'Պրոֆեսիոնալ և խորացված մաքրման ծառայություններ Հայաստանում',
      subheadline: 'Մասնագիտացված մաքրման լուծումներ գրասենյակների, բնակարանների և առևտրային տարածքների համար:',
      ctaPrimary: 'Պատվիրել մաքրում',
      ctaSecondary: 'Հաշվել գինը',
      trust1: 'Գործում ենք Երևանում և ողջ Հայաստանում',
      trust2: 'Պատասխանատու և փորձառու մասնագետներ',
      trust3: 'Անվտանգ, էկոլոգիապես մաքուր նյութեր',
      trust4: '100% որակի և գոհունակության երաշխիք',
    },
    about: {
      sectionTitle: 'Մեր մասին',
      leadTitle: 'Մաքրության նոր չափանիշներ Հայաստանում՝ խնամքով և պատասխանատվությամբ',
      storyParagraph1:
        '«Shine Cleaning»-ը ստեղծվել է հստակ առաքելությամբ՝ ապահովել անթերի մաքրություն, առողջ միջավայր և վստահելի սպասարկում Հայաստանի բնակարանների, առանձնատների և բիզնեսների համար: Ձեր տունը ձեր հանգստությունն է, իսկ գրասենյակը՝ ձեր ընկերության դեմքը:',
      storyParagraph2:
        'Մեր թիմն աշխատում է գերմանական պրոֆեսիոնալ սարքավորումներով (Kärcher) և միջազգային սերտիֆիկացում ունեցող հիպոալերգիկ նյութերով, որոնք անվտանգ են երեխաների և ընտանի կենդանիների համար:',
      founderQuote:
        '«Մենք յուրաքանչյուր տարածք մաքրում ենք այնպես, ինչպես մեր սեփական տունը: Իսկական մաքրությունը բերում է ներդաշնակություն և հանգստություն:»',
      founderName: 'Իրինա',
      founderRole: 'Հիմնադիր և Հաճախորդների սպասարկման ղեկավար',
      pillar1Title: 'Պրոֆեսիոնալ սարքավորումներ',
      pillar1Desc: 'Բարձր ճնշման էքստրակտորներ, HEPA ֆիլտրացիայով փոշեկուլներ և գոլորշային սարքեր:',
      pillar2Title: 'Էկոլոգիական և անվտանգ նյութեր',
      pillar2Desc: 'Եվրոպական ստանդարտների համապատասխան մաքրող միջոցներ, որոնք չեն վնասում մակերեսները:',
      pillar3Title: 'Որակի անձնական վերահսկողություն',
      pillar3Desc: 'Յուրաքանչյուր աշխատանքի ավարտից հետո մանրակրկիտ ստուգում Իրինայի անձնական հսկողությամբ:',
    },
    services: {
      sectionTitle: 'Մեր ծառայությունները',
      sectionSubtitle: 'Մաքրման համապարփակ ծառայություններ բնակելի, կորպորատիվ և առևտրային տարածքների համար',
      includedHeader: 'Ինչ է ներառված',
      equipmentHeader: 'Սարքավորումներ և նյութեր',
      selectServiceCTA: 'Ընտրել հաշվարկի համար',
      items: [
        {
          id: 'office',
          title: 'Գրասենյակների մաքրում',
          tagline: 'Գրասենյակների մաքրում / Уборка офисов',
          description:
            'Կորպորատիվ տարածքների ամբողջական մաքրում և սանիտարական մշակում՝ աշխատակիցների արդյունավետության և հյուրերի հիանալի տպավորության համար:',
          image: '/src/assets/images/service_office_cleaning_1792068594519.jpg',
          badge: 'Կորպորատիվ',
          rateLabel: 'Սկսած 380 ֏ / մ²-ից',
          features: [
            'Ամենօրյա, շաբաթական կամ երեկոյան գրաֆիկով մաքրում',
            'Աշխատասեղանների, համակարգիչների և սարքավորումների ախտահանում',
            'Խոհանոցային հատվածի և սպասքի մաքրում',
            'Սանհանգույցների մանրակրկիտ ախտահանում',
            'Հատակների լվացում և փոշեկուլով մշակում',
            'Աղբի հավաքում և տոպրակների փոխարինում',
          ],
          equipment: ['Անաղմուկ HEPA փոշեկուլներ', 'Մակերեսների հակավիրուսային ախտահանիչներ', 'Հատուկ միկրոֆիբրե կտորներ'],
        },
        {
          id: 'home',
          title: 'Տների մաքրում',
          tagline: 'Տների մաքրում / Уборка домов',
          description:
            'Բնակարանների և առանձնատների ընթացիկ և գեներալ մաքրում: Վայելեք ձեր հանգիստը, իսկ մաքրությունը վստահեք պրոֆեսիոնալներին:',
          image: '/src/assets/images/service_home_cleaning_1792068594713.jpg',
          badge: 'Բնակելի',
          rateLabel: 'Սկսած 450 ֏ / մ²-ից',
          features: [
            'Բոլոր սենյակների փոշեմաքրում և հատակի լվացում',
            'Խոհանոցի ճարպազերծում և մակերեսների փայլեցում',
            'Սանհանգույցի կաֆելների, լոգախցիկի և զուգարանակոնքի ախտահանում',
            'Դռների բռնակների և անջատիչների ախտահանում',
            'Ներքին ապակիների և պատուհանագոգերի մաքրում',
            'Անկողնային պարագաների փոխում ըստ ցանկության',
          ],
          equipment: ['Եվրոպական սերտիֆիկացված էկո-նյութեր', 'Գոլորշային ախտահանիչներ', 'Փափուկ միկրոֆիբրներ'],
        },
        {
          id: 'commercial',
          title: 'Առևտրային տարածքների մաքրում',
          tagline: 'Առևտրային տարածքների մաքրում / Уборка коммерческих помещений',
          description:
            'Խանութների, ցուցասրահների, գեղեցկության սրահների, մարզասրահների և ռեստորանների պրոֆեսիոնալ մաքրում:',
          image: '/src/assets/images/service_commercial_cleaning_1792068611780.jpg',
          badge: 'Առևտրային',
          rateLabel: 'Սկսած 420 ֏ / մ²-ից',
          features: [
            'Մեծ ծանրաբեռնվածության հատակների լվացում և փայլեցում',
            'Ցուցափեղկերի և վիտրինաների ապակիների լվացում',
            'Ցուցադրական վահանակների և դարակների փոշեմաքրում',
            'Հաճախորդների սանհանգույցների խորքային ախտահանում',
            'Միջոցառումներից հետո կամ բացումից առաջ շտապ մաքրում',
            'Սանիտարահիգիենիկ բոլոր նորմերի պահպանում',
          ],
          equipment: ['Պրոֆեսիոնալ ռոտորային հատակալվաց մեքենաներ', 'Ապակու հատուկ սարքավորումներ', 'Արդյունաբերական էքստրակտորներ'],
        },
        {
          id: 'deep_dryclean',
          title: 'Քիմմաքրում և խորացված մաքրում',
          tagline: 'Քիմմաքրում / Химчистка',
          description:
            'Նորոգումից հետո խորացված մաքրում, ինչպես նաև փափուկ կահույքի (բազմոցներ, աթոռներ), գորգերի և ներքնակների պրոֆեսիոնալ քիմմաքրում տեղում:',
          image: '/src/assets/images/hero_cleaning_interior_1792068594017.jpg',
          badge: 'Քիմմաքրում',
          rateLabel: 'Սկսած 650 ֏ / մ²-ից',
          features: [
            'Շինարարական փոշու, ներկի և շաղախի հետքերի հեռացում',
            'Կահույքի բծերի հեռացում (սուրճ, գինի, ճարպային հետքեր)',
            'Գորգերի խորքային լվացում և ջրի էքստրակցիա',
            'Ներքնակների հակաալերգեն մշակում և տիզերի ոչնչացում',
            'Խոհանոցային գազօջախի և օդաքաշի խորացված ճարպազերծում',
            'Սալիկների կարերի շոգեմաքրում',
          ],
          equipment: ['Kärcher Puzzi պրոֆեսիոնալ քիմմաքրման էքստրակտորներ', '160°C գոլորշային գեներատորներ', 'Հատուկ էնզիմային բծահաններ'],
        },
      ],
    },
    calculator: {
      sectionTitle: 'Գնի ինտերակտիվ հաշվիչ',
      sectionSubtitle: 'Հաշվարկեք նախնական արժեքը ՀՀ դրամով (AMD)՝ ըստ մակերեսի և անհրաժեշտ ծառայությունների',
      serviceLabel: 'Ընտրեք ծառայության տեսակը',
      areaLabel: 'Տարածքի մակերեսը (քմ / m²)',
      frequencyLabel: 'Մաքրման պարբերականությունը',
      addOnsLabel: 'Լրացուցիչ ծառայություններ',
      estimatedTotal: 'Հաշվարկված գին',
      minPriceNote: '* Վերջնական արժեքը կարող է ճշգրտվել ըստ աղտոտվածության աստիճանի և հատուկ պահանջների:',
      bookWithEstimate: 'Պատվիրել այս հաշվարկով',
      summaryTitle: 'Հաշվարկի ամփոփում',
      ratePerSqM: 'Բազային սակագին',
      staffNeeded: 'Մասնագետների քանակ',
      approxTime: 'Մոտավոր տևողություն',
      frequencies: {
        one_time: 'Մեկանգամյա մաքրում (ստանդարտ)',
        weekly: 'Շաբաթական բաժանորդագրություն (-15%)',
        biweekly: 'Երկու շաբաթը մեկ (-10%)',
        monthly: 'Ամսական բաժանորդագրություն (-5%)',
      },
      addOns: {
        windows: { title: 'Պատուհանների խորացված լվացում', price: '+6,000 ֏' },
        appliances: { title: 'Գազօջախի և սառնարանի ներսի մաքրում', price: '+8,000 ֏' },
        balcony: { title: 'Պատշգամբի լվացում', price: '+5,000 ֏' },
        sofa_dryclean: { title: 'Բազմոցի քիմմաքրում տեղում', price: '+12,000 ֏' },
        eco_disinfect: { title: 'Ամբողջական հակաալերգեն ախտահանում', price: '+7,000 ֏' },
      },
    },
    contact: {
      sectionTitle: 'Կապ և պատվեր',
      inquiryHeadline: 'Հարցերի դեպքում խնդրում ենք զանգահարել մեզ',
      contactPersonLabel: 'Կոնտակտային անձ',
      contactPersonName: 'Իրինա',
      phoneLabel: 'Հեռախոսահամար և WhatsApp',
      phoneNumber: '+374 77 442554',
      hoursLabel: 'Աշխատանքային ժամեր',
      hoursValue: 'Երկուշաբթի – Կիրակի՝ 08:00 – 21:00',
      locationLabel: 'Սպասարկման տարածք',
      locationValue: 'Երևան, Կոտայք, Արարատ և ողջ Հայաստան',
      formTitle: 'Առցանց պատվեր',
      formSubtitle: 'Լրացրեք ձևաթուղթը, և Իրինան կզանգահարի ձեզ 15 րոպեի ընթացքում՝ մանրամասները ճշտելու համար:',
      fullNameLabel: 'Ձեր անունը, ազգանունը',
      fullNamePlaceholder: 'Օր.՝ Արմեն Սարգսյան',
      phoneFieldLabel: 'Հեռախոսահամար',
      phoneFieldPlaceholder: '+374 XX XXXXXX',
      serviceFieldLabel: 'Ծառայության տեսակը',
      areaFieldLabel: 'Մոտավոր մակերեսը (քմ)',
      dateFieldLabel: 'Նախընտրելի օրը',
      addressFieldLabel: 'Հասցե / Համայնք',
      addressFieldPlaceholder: 'Օր.՝ ք. Երևան, Կենտրոն, Հյուսիսային պողոտա',
      notesFieldLabel: 'Լրացուցիչ նշումներ',
      notesFieldPlaceholder: 'Հատուկ նշումներ (կենդանիներ, բանալիներ, կայանատեղի և այլն)',
      submitButton: 'Ուղարկել պատվերը',
      submitting: 'Ուղարկվում է...',
      directChatWhatsApp: 'Գրել Իրինային WhatsApp-ով',
      callDirectly: 'Զանգահարել +374 77 442554',
      successTitle: 'Պատվերն ընդունված է:',
      successMessage: 'Շնորհակալություն: Իրինան «Shine Cleaning»-ից շուտով կապ կհաստատի ձեզ հետ:',
      bookAnother: 'Լրացնել նոր պատվեր',
      refNumberLabel: 'Պատվերի համար',
    },
    footer: {
      tagline: 'Ավելի պայծառ տուն, ավելի պայծառ դուք: Պրոֆեսիոնալ մաքրման ծառայություններ ողջ Հայաստանում:',
      copyright: '© 2026 Shine Cleaning: Բոլոր իրավունքները պաշտպանված են:',
      quickLinks: 'Էջեր',
      contactUs: 'Ուղիղ կապ',
      serviceAreas: 'Գործունեության վայր',
      serviceAreasText: 'Սպասարկում ենք բնակարաններ, գրասենյակներ և առևտրային տարածքներ Երևանում և մարզերում:',
    },
  },

  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Услуги',
      pricing: 'Цены',
      contact: 'Контакты',
      bookNow: 'Заказать уборку',
      callNow: 'Позвонить',
    },
    hero: {
      tagline: 'Светлый дом — светлое настроение',
      headline: 'Профессиональный клининг и генеральная уборка в Армении',
      subheadline: 'Экспертные решения по уборке для офисов, домов и коммерческих помещений.',
      ctaPrimary: 'Заказать уборку',
      ctaSecondary: 'Рассчитать стоимость',
      trust1: 'Работаем в Ереване и по всей Армении',
      trust2: 'Пунктуальные и проверенные клинеры',
      trust3: 'Безопасные эко-сертифицированные средства',
      trust4: '100% гарантия качества и чистоты',
    },
    about: {
      sectionTitle: 'О компании Shine Cleaning',
      leadTitle: 'Новые стандарты чистоты и уюта в Армении с заботой о каждом клиенте',
      storyParagraph1:
        'Компания Shine Cleaning основана с ясной целью: обеспечить безупречную чистоту, здоровую атмосферу и надежный сервис для жилых домов и бизнеса в Армении. Мы знаем, что ваш дом — это место силы, а офис — визитная карточка компании.',
      storyParagraph2:
        'Наши клинеры приезжают с полным комплектом немецкого оборудования Kärcher и гипоаллергенной европейской химией, безопасной для детей и домашних питомцев.',
      founderQuote:
        '«Мы наводим порядок в каждом помещении так же бережно и тщательно, как в собственном доме. Настоящая чистота дарит душевный покой.»',
      founderName: 'Ирина',
      founderRole: 'Основатель и руководитель отдела заботы о клиентах',
      pillar1Title: 'Профессиональная техника',
      pillar1Desc: 'Мощные экстракторы Kärcher, пылесосы с фильтрацией HEPA и пароочистители.',
      pillar2Title: 'Безопасная химия',
      pillar2Desc: 'Сертифицированные биоразлагаемые эко-составы без едкого запаха.',
      pillar3Title: 'Личный контроль качества',
      pillar3Desc: 'Каждый объект принимается по строгому чек-листу под кураторством Ирины.',
    },
    services: {
      sectionTitle: 'Наши услуги',
      sectionSubtitle: 'Комплексные программы клининга для жилых, офисных и коммерческих помещений',
      includedHeader: 'Что входит в услугу',
      equipmentHeader: 'Оборудование и химия',
      selectServiceCTA: 'Выбрать для расчета',
      items: [
        {
          id: 'office',
          title: 'Уборка офисов',
          tagline: 'Գրասենյակների մաքրում / Уборка офисов',
          description:
            'Комплексное обслуживание бизнес-пространств: здоровая среда для команды и респектабельный вид для ваших партнеров и гостей.',
          image: '/src/assets/images/service_office_cleaning_1792068594519.jpg',
          badge: 'Для бизнеса',
          rateLabel: 'От 380 ֏ / м²',
          features: [
            'Регулярная, утренняя, вечерняя или поддерживающая уборка',
            'Обеспыливание и антибактериальная обработка рабочих мест',
            'Уборка офисной кухни, кофе-зоны и мытье посуды',
            'Дезинфекция и санитарная обработка санузлов',
            'Влажная и сухая уборка напольных покрытий',
            'Сбор и вынос мусора, замена пакетов',
          ],
          equipment: ['Бесшумные HEPA-пылесосы', 'Антисептические средства для поверхностей', 'Система цветового кодирования салфеток'],
        },
        {
          id: 'home',
          title: 'Уборка домов и квартир',
          tagline: 'Տների մաքրում / Уборка домов',
          description:
            'Поддерживающая и генеральная уборка квартир и частных домов. Проведите выходные с близкими, а заботу о чистоте доверьте нам.',
          image: '/src/assets/images/service_home_cleaning_1792068594713.jpg',
          badge: 'Жилые помещения',
          rateLabel: 'От 450 ֏ / м²',
          features: [
            'Обеспыливание всех комнат, плинтусов и мытье полов',
            'Обезжиривание кухонных поверхностей, плиты и фартука',
            'Удаление известкового налета в ванной, дезинфекция сантехники',
            'Дезинфекция выключателей, розеток и дверных ручек',
            'Мытье зеркал, подоконников и внутренних стекол',
            'Смена постельного белья по согласованию',
          ],
          equipment: ['Экологичные гипоаллергенные средства ЕС', 'Паровые дезинфекторы', 'Специальные микрофибровые салфетки'],
        },
        {
          id: 'commercial',
          title: 'Уборка коммерческих помещений',
          tagline: 'Առևտրային տարածքների մաքրում / Уборка коммерческих помещений',
          description:
            'Профессиональный клининг для магазинов, шоурумов, салонов красоты, фитнес-центров и ресторанов с высокой проходимостью.',
          image: '/src/assets/images/service_commercial_cleaning_1792068611780.jpg',
          badge: 'Коммерческая',
          rateLabel: 'От 420 ֏ / м²',
          features: [
            'Глубокая чистка и полировка полов большой проходимости',
            'Мытье витрин, входных групп и панорамных стекол',
            'Очистка стеллажей, выставочных полок и стендов',
            'Генеральная дезинфекция гостевых зон и санузлов',
            'Срочная уборка после мероприятий или перед открытием',
            'Полное соблюдение санитарно-гигиенических стандартов',
          ],
          equipment: ['Роторные поломоечные машины', 'Профессиональные склиджи для стекол', 'Промышленные экстракторы'],
        },
        {
          id: 'deep_dryclean',
          title: 'Химчистка и генеральная уборка',
          tagline: 'Քիմմաքրում / Химчистка',
          description:
            'Генеральная уборка после ремонта, перед заселением, а также профессиональная выездная химчистка мягкой мебели, диванов, ковров и матрасов.',
          image: '/src/assets/images/hero_cleaning_interior_1792068594017.jpg',
          badge: 'Глубокая чистка',
          rateLabel: 'От 650 ֏ / м²',
          features: [
            'Удаление строительной пыли, следов краски, скотча и затирки',
            'Выведение сложных пятен с обивки (кофе, вино, жир, следы животных)',
            'Глубокая экстракционная чистка ворса ковров',
            'Антибактериальная обработка матрасов от пылевых клещей',
            'Интенсивная очистка духовых шкафов, вытяжек и решеток',
            'Очистка межплиточных швов горячим паром',
          ],
          equipment: ['Экстракционные аппараты Kärcher Puzzi', 'Парогенераторы до 160°C', 'Специализированные пятновыводители'],
        },
      ],
    },
    calculator: {
      sectionTitle: 'Калькулятор стоимости уборки',
      sectionSubtitle: 'Прозрачный онлайн-расчет стоимости в армянских драмах (AMD) с учетом площади и доп. опций',
      serviceLabel: 'Выберите тип клининга',
      areaLabel: 'Площадь помещения (кв. метры / м²)',
      frequencyLabel: 'Периодичность уборки',
      addOnsLabel: 'Дополнительные услуги',
      estimatedTotal: 'Ориентировочная цена',
      minPriceNote: '* Итоговая стоимость может незначительно корректироваться в зависимости от степени загрязнения.',
      bookWithEstimate: 'Заказать с этим расчетом',
      summaryTitle: 'Детализация расчета',
      ratePerSqM: 'Базовый тариф',
      staffNeeded: 'Состав бригады',
      approxTime: 'Примерное время',
      frequencies: {
        one_time: 'Разовая уборка (стандарт)',
        weekly: 'Еженедельно по подписке (-15%)',
        biweekly: 'Раз в две недели (-10%)',
        monthly: 'Раз в месяц (-5%)',
      },
      addOns: {
        windows: { title: 'Мытье окон с двух сторон', price: '+6,000 ֏' },
        appliances: { title: 'Духовка и холодильник внутри', price: '+8,000 ֏' },
        balcony: { title: 'Уборка балкона / лоджии', price: '+5,000 ֏' },
        sofa_dryclean: { title: 'Химчистка дивана на дому', price: '+12,000 ֏' },
        eco_disinfect: { title: 'Полная противоаллергенная дезинфекция', price: '+7,000 ֏' },
      },
    },
    contact: {
      sectionTitle: 'Контакты и бронирование',
      inquiryHeadline: 'По всем вопросам звоните нам',
      contactPersonLabel: 'Контактное лицо',
      contactPersonName: 'Ирина',
      phoneLabel: 'Телефон и WhatsApp',
      phoneNumber: '+374 77 442554',
      hoursLabel: 'Режим работы',
      hoursValue: 'Понедельник – Воскресенье: 08:00 – 21:00',
      locationLabel: 'География работы',
      locationValue: 'Ереван, Котайк, Арарат и по всей территории Армении',
      formTitle: 'Онлайн-заявка на клининг',
      formSubtitle: 'Заполните форму, и Ирина перезвонит вам в течение 15 минут для подтверждения времени и деталей.',
      fullNameLabel: 'Ваше имя и фамилия',
      fullNamePlaceholder: 'Например, Армен Саргсян',
      phoneFieldLabel: 'Номер телефона',
      phoneFieldPlaceholder: '+374 XX XXXXXX',
      serviceFieldLabel: 'Тип услуги',
      areaFieldLabel: 'Ориентировочная площадь (м²)',
      dateFieldLabel: 'Желаемая дата',
      addressFieldLabel: 'Адрес / Район',
      addressFieldPlaceholder: 'Например, г. Ереван, Кентрон, Северный проспект 10',
      notesFieldLabel: 'Особые пожелания и комментарии',
      notesFieldPlaceholder: 'Домашние животные, доступ, парковка или спецпожелания',
      submitButton: 'Отправить заявку',
      submitting: 'Отправка...',
      directChatWhatsApp: 'Написать Ирине в WhatsApp',
      callDirectly: 'Позвонить +374 77 442554',
      successTitle: 'Заявка успешно принята!',
      successMessage: 'Спасибо! Ирина из Shine Cleaning свяжется с вами в ближайшее время для подтверждения заказа.',
      bookAnother: 'Отправить еще одну заявку',
      refNumberLabel: 'Номер заявки',
    },
    footer: {
      tagline: 'Светлый дом — светлое настроение. Профессиональные клининговые услуги по всей Армении.',
      copyright: '© 2026 Shine Cleaning. Все права защищены.',
      quickLinks: 'Разделы сайта',
      contactUs: 'Прямые контакты',
      serviceAreas: 'Территория обслуживания',
      serviceAreasText: 'Обслуживаем квартиры, частные дома, офисы и коммерческие объекты в Ереване и регионах Армении.',
    },
  },
};
