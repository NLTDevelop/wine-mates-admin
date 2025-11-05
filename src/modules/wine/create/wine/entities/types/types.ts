

export interface WineFormData {
  // Basic Information
  displayName: string;
  producerTitle: string;
  producerName: string;
  wine: string;
  country: string[];
  region?: string[];
  subRegion?: string[];
  site?: string;
  
  // Classification
  type: string; // ID выбранного WineType
  subType?: string;
  designation?: string;
  classification?: string;
  
  // Vintage Information
  vintageConfig?: number;
  firstVintage?: number;
  finalVintage?: number;
  
  // Additional Information
  reference?: string;
  description?: string;
  images: File[];
}

export type CountryOption = {
  value: string;
  label: string;
  regions: RegionOption[];
}

export type RegionOption = {
  value: string;
  label: string;
  subRegions: SubRegionOption[];
}

export type SubRegionOption = {
  value: string;
  label: string;
}
