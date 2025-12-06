export enum UserRole {
  GUEST = 'GUEST',
  FARMER = 'FARMER',
  GOV_OFFICIAL = 'GOV_OFFICIAL'
}

export enum AppView {
  LANDING = 'LANDING',
  FARMER_DASHBOARD = 'FARMER_DASHBOARD',
  CROP_REGISTRY = 'CROP_REGISTRY',
  HEALTH_CHECK = 'HEALTH_CHECK',
  GOV_DASHBOARD = 'GOV_DASHBOARD',
  SETTINGS = 'SETTINGS'
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  SPANISH = 'es'
}

export interface Crop {
  id: string;
  name: string;
  type: string;
  sowingDate: string;
  areaSize: number; // in acres
  location: string;
  soilType: string;
  imageUrl?: string;
  healthStatus: 'Healthy' | 'At Risk' | 'Critical';
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
}

export interface HealthAnalysisResult {
  diagnosis: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  preventativeMeasures: string[];
  fertilizerRecommendation: string;
  irrigationAdvice: string;
}

export interface TranslationDictionary {
  [key: string]: {
    [Language.ENGLISH]: string;
    [Language.HINDI]: string;
    [Language.SPANISH]: string;
  };
}