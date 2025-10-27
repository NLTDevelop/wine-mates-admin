import { WineOption } from "../types";

export interface CreateFlavorParams {
  value: string;
  label: string;
  items?: string[];
  colorLabel?: string;
  tones?: {
    pale?: string;
    medium?: string;
    deep?: string;
  };
}

export interface UpdateFlavorParams {
  oldValue: string;
  newFlavor: WineOption;
}

export interface DeleteFlavorParams {
  flavorValue: string;
}

export interface WineFlavorStateMap {
  [value: string]: boolean;
}