import { useForm, UseFormReturn } from "react-hook-form"
import { WineFormData, wineFormSchema } from "./wine-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"


export const useWineForm = (defaultValues?: Partial<WineFormData>) => {
  return useForm<WineFormData>({
    resolver: zodResolver(wineFormSchema) as any,
    defaultValues: {
      displayName: '',
      producerTitle: '',
      producerName: '',
      wine: '',
      country: '',
      region: '',
      subRegion: '',
      site: '',
      type: '',
      subType: '',
      designation: '',
      classification: '',
      vintageConfig: new Date().getFullYear(), 
      firstVintage: undefined,
      finalVintage: undefined,
      reference: '',
      description: '',
      images: [],
      ...defaultValues,
    },
    mode: 'onChange',
  }) as UseFormReturn<WineFormData> 
}