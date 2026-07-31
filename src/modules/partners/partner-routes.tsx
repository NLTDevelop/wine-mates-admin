/* eslint-disable react/react-in-jsx-scope */
import { PATHS } from '@/navigation/paths'
import { CreatePartnerView, PartnerDetailView, PartnersView } from './ui'

export const partnerRoutes = [
  { path: PATHS.PARTNERS_LIST, element: <PartnersView /> },
  { path: PATHS.PARTNER_CREATE, element: <CreatePartnerView /> },
  { path: PATHS.PARTNER_DETAIL, element: <PartnerDetailView /> },
]
