// import { UseFormReturn } from 'react-hook-form'
// import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
// import { Input } from '@/UIKit/shadcn/ui/input'
// import { Textarea } from '@/UIKit/shadcn/ui/textarea'
// import { useTranslation } from 'react-i18next'
// import { NLTFormFilesDropZone } from '@/UIKit/components/NLTFormFilesDropZone'
// import { WineFormData } from '../../../entities/types/types'
// import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/UIKit/shadcn/ui/select'

// interface BasicInfoSectionProps {
//   form: UseFormReturn<WineFormData> 
//   wineTypes: WineType[]
// }

// export const BasicInfoSection = ({ form, wineTypes }: BasicInfoSectionProps) => {
//   const { t } = useTranslation('wines')
//   const currentYear = new Date().getFullYear()

//   return (
//     <Card className="rounded-t-none bg-input/50">
//       <CardContent className="space-y-4 pt-6">
//           <Card className="mt-2 p-4 bg-background">
//             <div className="grid grid-cols-1 mt-2">
//               <NLTFormFilesDropZone form={form} name="media" />
//             </div>
//           </Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="displayName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('display_name') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('display_name_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="producerTitle"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('producer_title') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('producer_title_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="producerName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('producer_name') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('producer_name_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="wine"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('wine_name') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('wine_name_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Страна, Регион, Суб-регион */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormField
//             control={form.control}
//             name="country"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('country') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('country_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="region"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('region')}</FormLabel>
//                 <FormControl>
//                   <Input 
//                     {...field} 
//                     placeholder={t('region_placeholder')}
//                     disabled={!form.watch('country')}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subRegion"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('sub_region')}</FormLabel>
//                 <FormControl>
//                   <Input 
//                     {...field} 
//                     placeholder={t('sub_region_placeholder')}
//                     disabled={!form.watch('region')}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Тип вина с селектом */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('wine_type') + '*'}</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={t('wine_type_placeholder')} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {wineTypes?.map((wineType) => (
//                       <SelectItem key={wineType?.id} value={wineType?.id}>
//                         {wineType?.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subType"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('sub_type')}</FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder={t('sub_type_placeholder')} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Винтаж */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormField
//             control={form.control}
//             name="vintageConfig"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('vintage_config') + '*'}</FormLabel>
//                 <FormControl>
//                   <Input 
//                     type="number" 
//                     {...field} 
//                     onChange={e => field.onChange(parseInt(e.target.value))} 
//                     min={1900} 
//                     max={currentYear}
//                     value={field.value}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="firstVintage"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('first_vintage')}</FormLabel>
//                 <FormControl>
//                   <Input 
//                     type="number" 
//                     {...field} 
//                     onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
//                     min={1900} 
//                     max={currentYear}
//                     value={field.value || ''}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="finalVintage"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{t('final_vintage')}</FormLabel>
//                 <FormControl>
//                   <Input 
//                     type="number" 
//                     {...field} 
//                     onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
//                     min={1900} 
//                     max={currentYear + 50}
//                     value={field.value || ''}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Описание */}
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>{t('description')}</FormLabel>
//               <FormControl>
//                 <Textarea 
//                   {...field} 
//                   placeholder={t('description_placeholder')} 
//                   className="min-h-[100px] bg-background" 
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

       
//       </CardContent>
//     </Card>
//   )
// }

// components/forms/basic-info-section/index.tsx
import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { WineFormData } from '../../../entities/types/types'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { ProducerInfoSection } from './producer-info-section'
import { LocationSection } from './location-section'
import { WineTypeSection } from './wine-type-section'
import { VintageSection } from './vintage-section'
import { DescriptionSection } from './description-section'
import { MediaSection } from './media-section'


interface BasicInfoSectionProps {
  form: UseFormReturn<WineFormData> 
  wineTypes: WineType[]
}

export const BasicInfoSection = ({ form, wineTypes }: BasicInfoSectionProps) => {
   const countryValue = form.watch('country')
  const regionValue = form.watch('region')

  return (
    <Card className="rounded-t-none bg-input/50">
      <CardContent className="space-y-6 pt-6">
        <MediaSection form={form as any} />
        <ProducerInfoSection form={form as any} />
        <LocationSection form={form as any}  countryValue={countryValue}
          regionValue={regionValue}/>
        <WineTypeSection form={form as any} wineTypes={wineTypes} />
        <VintageSection form={form as any} />
        <DescriptionSection form={form as any} />
      </CardContent>
    </Card>
  )
}