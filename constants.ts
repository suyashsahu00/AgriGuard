import { TranslationDictionary, Language, Crop } from './types';

export const APP_NAME = "AgriGuard AI";

export const TRANSLATIONS: TranslationDictionary = {
  welcome: {
    [Language.ENGLISH]: "Welcome to AgriGuard AI",
    [Language.HINDI]: "एग्रीगार्ड एआई में आपका स्वागत है",
    [Language.SPANISH]: "Bienvenido a AgriGuard AI"
  },
  roleSelect: {
    [Language.ENGLISH]: "Select your role",
    [Language.HINDI]: "अपनी भूमिका चुनें",
    [Language.SPANISH]: "Seleccione su rol"
  },
  farmer: {
    [Language.ENGLISH]: "Farmer",
    [Language.HINDI]: "किसान",
    [Language.SPANISH]: "Agricultor"
  },
  gov: {
    [Language.ENGLISH]: "Government / NGO",
    [Language.HINDI]: "सरकार / गैर सरकारी संगठन",
    [Language.SPANISH]: "Gobierno / ONG"
  },
  dashboard: {
    [Language.ENGLISH]: "Dashboard",
    [Language.HINDI]: "डैशबोर्ड",
    [Language.SPANISH]: "Panel"
  },
  myCrops: {
    [Language.ENGLISH]: "My Crops",
    [Language.HINDI]: "मेरी फसलें",
    [Language.SPANISH]: "Mis Cultivos"
  },
  addCrop: {
    [Language.ENGLISH]: "Register Crop",
    [Language.HINDI]: "फसल पंजीकृत करें",
    [Language.SPANISH]: "Registrar Cultivo"
  },
  checkHealth: {
    [Language.ENGLISH]: "Check Crop Health",
    [Language.HINDI]: "फसल स्वास्थ्य की जाँच करें",
    [Language.SPANISH]: "Verificar Salud del Cultivo"
  },
  analyzing: {
    [Language.ENGLISH]: "Analyzing with Gemini AI...",
    [Language.HINDI]: "जेमिनी एआई के साथ विश्लेषण कर रहा है...",
    [Language.SPANISH]: "Analizando con Gemini AI..."
  }
};

export const MOCK_CROPS: Crop[] = [
  {
    id: '1',
    name: 'North Field Wheat',
    type: 'Wheat',
    sowingDate: '2023-11-15',
    areaSize: 2.5,
    location: 'Punjab, India',
    soilType: 'Loamy',
    healthStatus: 'Healthy',
    imageUrl: 'https://picsum.photos/seed/wheat/400/300'
  },
  {
    id: '2',
    name: 'River Bank Rice',
    type: 'Rice',
    sowingDate: '2024-01-10',
    areaSize: 4.0,
    location: 'West Bengal, India',
    soilType: 'Clay',
    healthStatus: 'At Risk',
    imageUrl: 'https://picsum.photos/seed/rice/400/300'
  }
];

export const GOV_STATS = [
  { name: 'Wheat', yield: 4000, disease: 12 },
  { name: 'Rice', yield: 3000, disease: 25 },
  { name: 'Corn', yield: 2000, disease: 8 },
  { name: 'Cotton', yield: 2780, disease: 35 },
  { name: 'Sugarcane', yield: 1890, disease: 5 },
];