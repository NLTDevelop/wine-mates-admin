import { api } from "@/services";
import { WineOption } from "../../entities/types";

export const wineOptionsService = {
  getColors: (search?: string): Promise<WineOption[]> => 
    api.get('/wine-colors', { params: { search } }).then(response => response.data),

  getAromas: (search?: string): Promise<WineOption[]> => 
    api.get('/wine-aromas', { params: { search } }).then(response => response.data),

  getFlavorNotes: (search?: string): Promise<WineOption[]> => 
    api.get('/wine-flavor-notes', { params: { search } }).then(response => response.data),

  getFlavorCharacteristics: (search?: string): Promise<WineOption[]> => 
    api.get('/wine-flavor-characteristics', { params: { search } }).then(response => response.data),
}