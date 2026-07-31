import { WineOfWinery, WineryWineOffer } from './types'

export const getWineryWineOffer = (wine?: WineOfWinery | null): WineryWineOffer | null => {
  if (!wine) return null

  const nestedOffer = wine.offer || wine.wineOffer || wine.wineryWineOffer || wine.offers?.[0] || null
  const offerId = nestedOffer?.id ?? wine.offerId ?? wine.wineOfferId ?? wine.wineryWineOfferId ?? null
  const price = nestedOffer?.price ?? wine.price ?? null
  const currency = nestedOffer?.currency ?? wine.currency ?? null
  const quantity = nestedOffer?.quantity ?? wine.quantity ?? null
  const websiteUrl = nestedOffer?.websiteUrl ?? wine.websiteUrl ?? null

  if (!offerId && price === null && !currency && quantity === null && !websiteUrl) return null

  return {
    id: offerId,
    price,
    currency,
    quantity,
    websiteUrl,
  }
}
