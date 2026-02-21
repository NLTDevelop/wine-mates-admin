// export interface LinkItem {
//   titleKey: string
//   title: string
//   url: string
// }

// export interface GeneratedLinks {
//   root: LinkItem
//   list?: LinkItem
//   events?: LinkItem
//   places?: LinkItem
//   map?: LinkItem
//   create?: LinkItem
//   detailUrl?: (id: string | number) => string
// }

// interface GeneratorOptions {
//   hasList?: boolean
//   hasEvent?: boolean
//   hasCreate?: boolean
//   hasDetail?: boolean
//   hasPlace?: boolean
//   hasMap?: boolean
// }

// export const generateLinks = (entityName: string, options: GeneratorOptions = {}): GeneratedLinks => {
//   const { hasList, hasCreate, hasDetail, hasEvent, hasMap, hasPlace } = options
//   const baseUrl = `/${entityName}`

//   const links: GeneratedLinks = {
//     root: {
//       titleKey: entityName,
//       title: entityName.charAt(0).toUpperCase() + entityName.slice(1),
//       url: baseUrl,
//     },
//   }

//   if (hasList) {
//     links.list = {
//       titleKey: 'list',
//       title: 'list',
//       url: baseUrl,
//     } as LinkItem
//   }

//   if (hasCreate) {
//     links.create = {
//       titleKey: 'create',
//       title: 'create',
//       url: `${baseUrl}/create`,
//     } as LinkItem
//   }

//   if (hasEvent) {
//     links.events = {
//       titleKey: 'event',
//       title: 'event',
//       url: `${baseUrl}/event`,
//     } as LinkItem
//   }

//   if (hasPlace) {
//     links.events = {
//       titleKey: 'places',
//       title: 'places',
//       url: `${baseUrl}/places`,
//     } as LinkItem
//   }
//   if (hasMap) {
//     links.events = {
//       titleKey: 'map',
//       title: 'map',
//       url: `${baseUrl}/map`,
//     } as LinkItem
//   }

//   if (hasDetail) {
//     links.detailUrl = (id: string | number) => `${baseUrl}/${id}`
//   }

//   return links
// }

export interface LinkItem {
  titleKey: string
  title: string
  url: string
}

export interface GeneratedLinks {
  root: LinkItem
  list?: LinkItem
  events?: LinkItem
  places?: LinkItem
  map?: LinkItem
  create?: LinkItem
  detailUrl?: (id: string | number) => string
}

interface GeneratorOptions {
  hasList?: boolean
  hasEvent?: boolean
  hasCreate?: boolean
  hasDetail?: boolean
  hasPlace?: boolean
  hasMap?: boolean
}

export const generateLinks = (entityName: string, options: GeneratorOptions = {}): GeneratedLinks => {
  const { hasList, hasCreate, hasDetail, hasEvent, hasMap, hasPlace } = options
  const baseUrl = `/${entityName}`

  const links: GeneratedLinks = {
    root: {
      titleKey: entityName,
      title: entityName.charAt(0).toUpperCase() + entityName.slice(1),
      url: baseUrl,
    },
  }

  if (hasList) {
    links.list = { titleKey: 'list', title: 'list', url: baseUrl }
  }

  if (hasCreate) {
    links.create = { titleKey: 'create', title: 'create', url: `${baseUrl}/create` }
  }

  if (hasEvent) {
    links.events = { titleKey: 'event', title: 'event', url: `${baseUrl}` }
  }

  if (hasPlace) {
    links.places = { titleKey: 'places', title: 'places', url: `${baseUrl}/places` }
  }

  if (hasMap) {
    links.map = { titleKey: 'map', title: 'map', url: `${baseUrl}/map` }
  }

  if (hasDetail) {
    links.detailUrl = (id: string | number) => `${baseUrl}/${id}`
  }

  return links
}
