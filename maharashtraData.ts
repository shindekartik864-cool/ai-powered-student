export interface CropInfo {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  season: 'kharif' | 'rabi' | 'summer' | 'annual';
  durationDays: number;
  expectedYieldPerAcre: number; // in quintals
  yieldUnit: string;
  defaultMandiPrice: number; // in ₹/quintal
  mspPrice: number; // Govt MSP
  waterNeed: 'कमी (Low)' | 'मध्यम (Medium)' | 'जास्त (High)';
  profitScore: number; // 1-100
  recommendedDistricts: string[];
  defaultCosts: {
    landPrep: number;
    seeds: number;
    fertilizer: number;
    pesticide: number;
    labour: number;
    irrigation: number;
    machinery: number;
    transport: number;
  };
  keyPests: string[];
  intercropPair: string;
}

export const MAHARASHTRA_CROPS: CropInfo[] = [
  {
    id: 'onion',
    nameEn: 'Onion (Kanda)',
    nameMr: 'कांदा (लाल/रांगडा)',
    nameHi: 'प्याज (लाल)',
    season: 'kharif',
    durationDays: 120,
    expectedYieldPerAcre: 90,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 1950,
    mspPrice: 1800,
    waterNeed: 'मध्यम (Medium)',
    profitScore: 88,
    recommendedDistricts: ['नाशिक (Nashik)', 'पुणे (Pune)', 'अहिल्यानगर (Ahmednagar)', 'सोलापूर (Solapur)', 'धुळे (Dhule)'],
    defaultCosts: {
      landPrep: 4500,
      seeds: 6500,
      fertilizer: 8500,
      pesticide: 6200,
      labour: 14000,
      irrigation: 3200,
      machinery: 3800,
      transport: 4200,
    },
    keyPests: ['थ्रिप्स (Thrips)', 'जांभळा करपा (Purple Blotch)', 'मुळकुज (Root Rot)'],
    intercropPair: 'गाजर किंवा धणे (Coriander border)',
  },
  {
    id: 'soybean',
    nameEn: 'Soybean',
    nameMr: 'सोयाबीन (JS-335 / फुले संगम)',
    nameHi: 'सोयाबीन',
    season: 'kharif',
    durationDays: 100,
    expectedYieldPerAcre: 10,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 4750,
    mspPrice: 4892,
    waterNeed: 'कमी (Low)',
    profitScore: 78,
    recommendedDistricts: ['अकोला (Akola)', 'लातूर (Latur)', 'नागपूर (Nagpur)', 'अमरावती (Amravati)', 'नांदेड (Nanded)', 'कोल्हापूर (Kolhapur)'],
    defaultCosts: {
      landPrep: 3000,
      seeds: 3800,
      fertilizer: 4200,
      pesticide: 3100,
      labour: 5500,
      irrigation: 1500,
      machinery: 2800,
      transport: 1800,
    },
    keyPests: ['खोडकिडा (Stem Fly)', 'उंटअळी (Semi-looper)', 'तांबेरा (Rust)'],
    intercropPair: 'तूर (Pigeon Pea 4:2 ratio)',
  },
  {
    id: 'cotton',
    nameEn: 'Cotton (Kapas)',
    nameMr: 'कापूस (बीटी)',
    nameHi: 'कपास (बीटी)',
    season: 'kharif',
    durationDays: 160,
    expectedYieldPerAcre: 11,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 7250,
    mspPrice: 7121,
    waterNeed: 'मध्यम (Medium)',
    profitScore: 82,
    recommendedDistricts: ['यवतमाळ (Yavatmal)', 'जळगाव (Jalgaon)', 'जालना (Jalna)', 'अमरावती (Amravati)', 'छ. संभाजीनगर (Aurangabad)'],
    defaultCosts: {
      landPrep: 4000,
      seeds: 2800,
      fertilizer: 6800,
      pesticide: 7500,
      labour: 12500,
      irrigation: 2800,
      machinery: 3200,
      transport: 2200,
    },
    keyPests: ['गुलाबी बोंडअळी (Pink Bollworm)', 'पांढरी माशी (Whitefly)', 'रसशोषक किडी'],
    intercropPair: 'उडीद किंवा मूग (Green gram strip)',
  },
  {
    id: 'sugarcane',
    nameEn: 'Sugarcane (Oos)',
    nameMr: 'ऊस (को-८६०३२)',
    nameHi: 'गन्ना',
    season: 'annual',
    durationDays: 365,
    expectedYieldPerAcre: 55, // tons
    yieldUnit: 'टन (Tons)',
    defaultMandiPrice: 3350, // per ton
    mspPrice: 3400, // FRP
    waterNeed: 'जास्त (High)',
    profitScore: 91,
    recommendedDistricts: ['कोल्हापूर (Kolhapur)', 'सांगली (Sangli)', 'पुणे (Pune)', 'सातारा (Satara)', 'सोलापूर (Solapur)'],
    defaultCosts: {
      landPrep: 8000,
      seeds: 14000,
      fertilizer: 18000,
      pesticide: 5000,
      labour: 19000,
      irrigation: 8500,
      machinery: 7000,
      transport: 6500,
    },
    keyPests: ['खोडकीड (Early Shoot Borer)', 'पांढरी माशी', 'तांबेरा रोग'],
    intercropPair: 'सोयाबीन किंवा बटाटा (Potato in furrow)',
  },
  {
    id: 'pomegranate',
    nameEn: 'Pomegranate (Dalimb)',
    nameMr: 'डाळिंब (भगवा जात)',
    nameHi: 'अनार (भगवा)',
    season: 'annual',
    durationDays: 180,
    expectedYieldPerAcre: 50,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 7800,
    mspPrice: 6500,
    waterNeed: 'कमी (Low)',
    profitScore: 94,
    recommendedDistricts: ['सोलापूर (Solapur)', 'नाशिक (Nashik)', 'अहिल्यानगर (Ahmednagar)', 'सांगली (Sangli)', 'जालना (Jalna)'],
    defaultCosts: {
      landPrep: 6000,
      seeds: 9000,
      fertilizer: 22000,
      pesticide: 26000,
      labour: 24000,
      irrigation: 6000,
      machinery: 8000,
      transport: 9000,
    },
    keyPests: ['तेल्या रोग (Bacterial Blight)', 'फळ पोखरणारी अळी', 'खोडकिडा'],
    intercropPair: 'झेंडू (Marigold for nematode trap)',
  },
  {
    id: 'chickpea',
    nameEn: 'Chickpea / Bengal Gram (Harbara)',
    nameMr: 'हरभरा (फुले विक्रम / दिग्विजय)',
    nameHi: 'चना (हरभरा)',
    season: 'rabi',
    durationDays: 95,
    expectedYieldPerAcre: 9,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 5650,
    mspPrice: 5440,
    waterNeed: 'कमी (Low)',
    profitScore: 76,
    recommendedDistricts: ['लातूर (Latur)', 'नांदेड (Nanded)', 'बीड (Beed)', 'अकोला (Akola)', 'पुणे (Pune)'],
    defaultCosts: {
      landPrep: 2800,
      seeds: 3200,
      fertilizer: 3600,
      pesticide: 2800,
      labour: 4800,
      irrigation: 1800,
      machinery: 2200,
      transport: 1500,
    },
    keyPests: ['घाटे अळी (Pod Borer)', 'मर रोग (Fusarium Wilt)'],
    intercropPair: 'मोहरी किंवा जवस (Mustard boundary)',
  },
  {
    id: 'grapes',
    nameEn: 'Grapes (Draksha)',
    nameMr: 'द्राक्षे (थॉमसन सीडलेस)',
    nameHi: 'अंगूर',
    season: 'annual',
    durationDays: 150,
    expectedYieldPerAcre: 90,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 5200,
    mspPrice: 4500,
    waterNeed: 'मध्यम (Medium)',
    profitScore: 92,
    recommendedDistricts: ['नाशिक (Nashik)', 'सांगली (Sangli)', 'सोलापूर (Solapur)', 'पुणे (Pune)'],
    defaultCosts: {
      landPrep: 8000,
      seeds: 12000,
      fertilizer: 28000,
      pesticide: 32000,
      labour: 35000,
      irrigation: 7500,
      machinery: 12000,
      transport: 10000,
    },
    keyPests: ['डाऊनी मिल्ड्यू (Downy Mildew)', 'भुरी (Powdery Mildew)', 'मिलीबग'],
    intercropPair: 'ताग / धैंचा (Green manure between rows)',
  },
  {
    id: 'banana',
    nameEn: 'Banana (Keli)',
    nameMr: 'केळी (ग्रँड नैन / जी-९)',
    nameHi: 'केला (जी-९)',
    season: 'annual',
    durationDays: 330,
    expectedYieldPerAcre: 300,
    yieldUnit: 'क्विंटल',
    defaultMandiPrice: 1650,
    mspPrice: 1400,
    waterNeed: 'जास्त (High)',
    profitScore: 89,
    recommendedDistricts: ['जळगाव (Jalgaon)', 'नांदेड (Nanded)', 'धुळे (Dhule)', 'सोलापूर (Solapur)'],
    defaultCosts: {
      landPrep: 6000,
      seeds: 18000,
      fertilizer: 24000,
      pesticide: 9000,
      labour: 22000,
      irrigation: 9000,
      machinery: 6000,
      transport: 8000,
    },
    keyPests: ['सिगाटोका करपा (Sigatoka Leaf Spot)', 'खोड भुंगा', 'सुत्रकृमी'],
    intercropPair: 'हिरवे मूग किंवा पालक सुरुवातीला',
  },
];

export interface MandiRate {
  id: string;
  marketNameMr: string;
  marketNameEn: string;
  district: string;
  commodityMr: string;
  commodityEn: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  mspPrice: number;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
  arrivalQty: string;
}

export const APMC_RATES: MandiRate[] = [
  {
    id: 'm1',
    marketNameMr: 'लासलगाव (Lasalgaon)',
    marketNameEn: 'Lasalgaon APMC',
    district: 'नाशिक (Nashik)',
    commodityMr: 'कांदा (उन्हाळी/लाल)',
    commodityEn: 'Onion (Red)',
    modalPrice: 2150,
    minPrice: 1200,
    maxPrice: 2650,
    mspPrice: 1800,
    trend: 'up',
    changeAmount: 110,
    arrivalQty: '१४,५०० क्विंटल',
  },
  {
    id: 'm2',
    marketNameMr: 'अकोला (Akola)',
    marketNameEn: 'Akola APMC',
    district: 'अकोला (Akola)',
    commodityMr: 'सोयाबीन (पिवळा)',
    commodityEn: 'Soybean (Yellow)',
    modalPrice: 4820,
    minPrice: 4400,
    maxPrice: 5050,
    mspPrice: 4892,
    trend: 'down',
    changeAmount: -40,
    arrivalQty: '८,२०० क्विंटल',
  },
  {
    id: 'm3',
    marketNameMr: 'यवतमाळ (Yavatmal)',
    marketNameEn: 'Yavatmal APMC',
    district: 'यवतमाळ (Yavatmal)',
    commodityMr: 'कापूस (मध्यम धागा)',
    commodityEn: 'Cotton (Kapas)',
    modalPrice: 7350,
    minPrice: 6900,
    maxPrice: 7550,
    mspPrice: 7121,
    trend: 'up',
    changeAmount: 180,
    arrivalQty: '५,४०० क्विंटल',
  },
  {
    id: 'm4',
    marketNameMr: 'पुणे गुलटेकडी (Gultekdi)',
    marketNameEn: 'Pune APMC',
    district: 'पुणे (Pune)',
    commodityMr: 'टोमॅटो / भाजीपाला',
    commodityEn: 'Tomato',
    modalPrice: 1850,
    minPrice: 1300,
    maxPrice: 2200,
    mspPrice: 1500,
    trend: 'stable',
    changeAmount: 15,
    arrivalQty: '९,८०० क्रेट्स',
  },
  {
    id: 'm5',
    marketNameMr: 'लातूर (Latur)',
    marketNameEn: 'Latur APMC',
    district: 'लातूर (Latur)',
    commodityMr: 'तूर (लाल/पांढरी)',
    commodityEn: 'Tur / Pigeon Pea',
    modalPrice: 7850,
    minPrice: 7200,
    maxPrice: 8300,
    mspPrice: 7550,
    trend: 'up',
    changeAmount: 220,
    arrivalQty: '६,१०० क्विंटल',
  },
  {
    id: 'm6',
    marketNameMr: 'जळगाव (Jalgaon)',
    marketNameEn: 'Jalgaon Market',
    district: 'जळगाव (Jalgaon)',
    commodityMr: 'केळी (प्रति क्विंटल)',
    commodityEn: 'Banana',
    modalPrice: 1720,
    minPrice: 1400,
    maxPrice: 1950,
    mspPrice: 1400,
    trend: 'up',
    changeAmount: 60,
    arrivalQty: '१२,००० क्विंटल',
  },
];

export const MAHARASHTRA_DISTRICTS = [
  'नाशिक (Nashik)',
  'पुणे (Pune)',
  'अहिल्यानगर (Ahmednagar)',
  'कोल्हापूर (Kolhapur)',
  'सांगली (Sangli)',
  'सातारा (Satara)',
  'सोलापूर (Solapur)',
  'जळगाव (Jalgaon)',
  'धुळे (Dhule)',
  'छ. संभाजीनगर (Aurangabad)',
  'जालना (Jalna)',
  'लातूर (Latur)',
  'नांदेड (Nanded)',
  'बीड (Beed)',
  'अकोला (Akola)',
  'अमरावती (Amravati)',
  'यवतमाळ (Yavatmal)',
  'नागपूर (Nagpur)',
  'बुलढाणा (Buldhana)',
  'रत्नागिरी (Ratnagiri)',
];

export const SOIL_TYPES = [
  { id: 'black_heavy', nameMr: 'भारी काळी रेगुर जमीन (Deep Black Soil)', nameEn: 'Deep Black Cotton Soil' },
  { id: 'black_medium', nameMr: 'मध्यम काळी सुपीक जमीन (Medium Black)', nameEn: 'Medium Black Loam' },
  { id: 'red_loam', nameMr: 'तांबडी पाण्याचा निचरा होणारी जमीन (Red Loam)', nameEn: 'Red Sandy Loam' },
  { id: 'shallow_murrum', nameMr: 'हलकी मुरमाड जमीन (Shallow Murrum)', nameEn: 'Shallow Rocky Soil' },
];

export const GOV_SCHEMES = [
  {
    id: 'mahadbt_drip',
    titleMr: 'महाडीबीटी सूक्ष्म सिंचन योजना (ठिबक व तुषार)',
    titleEn: 'MahaDBT Micro-Irrigation Subsidy',
    subsidyMr: 'अल्प व अत्यल्प भूधारक: ८०%, इतर शेतकरी: ७५%',
    subsidyEn: 'Small/Marginal: 80%, Others: 75% Subsidy',
    eligibilityMr: '७/१२, ८-अ, आधार लिंक बँक खाते, अधिकृत कंपनी जीएसटी बिल.',
    link: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'namo_shetkari',
    titleMr: 'नमो शेतकरी महासन्मान निधी योजना',
    titleEn: 'Namo Shetkari Mahasanman Nidhi',
    subsidyMr: 'वार्षिक ₹६,००० (पीएम किसानचे ₹६,००० मिळून एकूण ₹१२,०००)',
    subsidyEn: '₹6,000/year (Combined with PM-Kisan total ₹12,000/yr)',
    eligibilityMr: 'सर्व पात्र पीएम-किसान नोंदणीकृत शेतकरी.',
    link: 'https://krishi.maharashtra.gov.in',
  },
  {
    id: 'magel_tyala_shet_tale',
    titleMr: 'मागेल त्याला शेततळे योजना (शेततळे अस्तरीकरण)',
    titleEn: 'Magel Tyala Shet-Tale (Farm Pond Subsidy)',
    subsidyMr: 'शेततळे खोदकाम व प्लास्टिक अस्तरीकरणासाठी ₹७५,००० पर्यंत अनुदान',
    subsidyEn: 'Up to ₹75,000 subsidy for farm pond excavation & HDPE liner',
    eligibilityMr: 'किमान ०.६० हेक्टर जमीन, पाणीटंचाई क्षेत्र प्राधान्य.',
    link: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'pmfby_pik_vima',
    titleMr: 'प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)',
    titleEn: 'PMFBY Crop Insurance (₹1 Token Premium)',
    subsidyMr: 'शेतकऱ्यांसाठी नाममात्र ₹१ हप्ता, उर्वरित अनुदान शासन देते',
    subsidyEn: 'Farmers pay only ₹1 premium; balance paid by Maha Govt',
    eligibilityMr: 'अधिसूचित पिके व अधिसूचित महसूल मंडळ.',
    link: 'https://pmfby.gov.in',
  },
];

export const DEMO_FARM_DATA = {
  farmerName: 'रमेश पाटील (Ramesh Patil)',
  district: 'नाशिक (Nashik)',
  taluka: 'दिंडोरी (Dindori)',
  village: 'पिंपळनेर (Pimpalner)',
  totalAcres: 4.5,
  soilType: 'black_medium',
  irrigationSource: 'well',
  irrigationMethod: 'drip',
  activeCropId: 'onion',
  cropAcres: 2.5,
  secondaryCropId: 'soybean',
  secondaryCropAcres: 2.0,
  powerShift: 'Day (07:00 AM - 03:00 PM)',
  waterLevelPct: 78,
  expectedYield: 95,
  expectedPrice: 2100,
  costs: {
    landPrep: 4500,
    seeds: 6500,
    fertilizer: 8500,
    pesticide: 6200,
    labour: 14000,
    irrigation: 3200,
    machinery: 3800,
    transport: 4200,
  },
};
