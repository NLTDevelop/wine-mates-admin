import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IWineProfileDetail, IWineProfile, IWineProfileFormData, ImageItem } from './types/types'

export const defaultImages: ImageItem[] = [
  { id: 1, src: '/assets/bottles/my_wine.png', alt: 'my_wine.png' },
  { id: 2, src: '/assets/bottles/orange.png', alt: 'orange.png' },
  { id: 3, src: '/assets/bottles/pink.png', alt: 'pink.png' },
  { id: 4, src: '/assets/bottles/red.png', alt: 'red.png' },
  { id: 5, src: '/assets/bottles/sparkling_pink.png', alt: 'sparkling_pink.png' },
  { id: 6, src: '/assets/bottles/sparkling_red.png', alt: 'sparkling_red.png' },
  { id: 7, src: '/assets/bottles/sparkling_white.png', alt: 'sparkling_white.png' },
  { id: 8, src: '/assets/bottles/white.png', alt: 'white.png' },
]

interface ProfileState {
  profiles: IWineProfile[]
  formData: IWineProfileFormData | null
  currentProfile: IWineProfileDetail | null
  setProfiles: (profiles: IWineProfile[]) => void
  setFormData: (formData: IWineProfileFormData) => void
  setCurrentProfile: (profile: IWineProfileDetail | null) => void
  updateProfile: (profileId: string, newProfile: IWineProfileDetail) => void
  deleteProfile: (id: string) => void
  selectedImage: ImageItem
  setSelectedImage: (img: ImageItem) => void
  resetSelectedImage: () => void
}

export const useProfileStore = createStoreDevToolsWrapper<ProfileState>(
  set => ({
    profiles: [],
    formData: null,
    currentProfile: null,
    selectedImage: defaultImages[0],

    setProfiles: (profiles: IWineProfile[]) => set({ profiles }, false, 'wineProfile/setProfiles'),
    setFormData: (formData: IWineProfileFormData) => set({ formData }, false, 'wineProfile/setFormData'),

    setCurrentProfile: (profile: IWineProfileDetail | null) => set({ currentProfile: profile }, false, 'wineProfile/setCurrentProfile'),

    updateProfile: (profileId: string, newProfile: IWineProfileDetail) =>
      set(
        (state: ProfileState) => ({
          profiles: state.profiles.map(p => (p.id === profileId ? newProfile : p)),
          currentProfile: state.currentProfile?.id === profileId ? newProfile : state.currentProfile,
        }),
        false,
        'wineProfile/updateProfile'
      ),

    deleteProfile: profileId =>
      set(
        (state: ProfileState) => ({
          profiles: state.profiles.filter(p => p.id !== profileId),
          currentProfile: state.currentProfile?.id === profileId ? null : state.currentProfile,
        }),
        false,
        'wineProfile/deleteProfile'
      ),

    setSelectedImage: img => set({ selectedImage: img }),

    resetSelectedImage: () => set({ selectedImage: defaultImages[0] }),
  }),

  'ProfileStore'
)
