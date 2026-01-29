import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IWineProfileDetail, IWineProfile, IWineProfileFormData } from './types/types'

interface ProfileState {
  profiles: IWineProfile[]
  formData: IWineProfileFormData | null
  currentProfile: IWineProfileDetail | null
  setProfiles: (profiles: IWineProfile[]) => void
  setFormData: (formData: IWineProfileFormData) => void
  setCurrentProfile: (profile: IWineProfileDetail | null) => void
  updateProfile: (profileId: string, newProfile: IWineProfileDetail) => void
  deleteProfile: (id: string) => void
}

export const useProfileStore = createStoreDevToolsWrapper<ProfileState>(
  set => ({
    profiles: [],
    formData: null,
    currentProfile: null,

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
  }),

  'ProfileStore'
)
