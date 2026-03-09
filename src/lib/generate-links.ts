export interface LinkItem {
  titleKey: string
  title: string
  url: string
}

export interface GeneratedLinks {
  root: LinkItem
  list?: LinkItem
  create?: LinkItem
  detailUrl?: (id: string | number) => string
  additional?: Record<string, LinkItem>
}

interface GeneratorOptions {
  hasList?: boolean
  hasCreate?: boolean
  hasDetail?: boolean
  title?:string
  additionalLinks?: Array<{
    titleKey: string
    title: string
    url: string
  }>
}

export const generateLinks = (entityName: string, options: GeneratorOptions = {}): GeneratedLinks => {
  const { hasList, hasCreate, hasDetail, additionalLinks, title } = options
  const baseUrl = `/${entityName}`

  const links: GeneratedLinks = {
    root: {
      titleKey: entityName,
      title: entityName.charAt(0).toUpperCase() + entityName.slice(1),
      url: baseUrl,
    },
  }

  if (hasList) {
    links.list = {
      titleKey: 'list',
      title: title || 'list',
      url: baseUrl,
    } as LinkItem
  }

  if (hasCreate) {
    links.create = {
      titleKey: 'create',
      title: 'create',
      url: `${baseUrl}/create`,
    } as LinkItem
  }

  if (hasDetail) {
    links.detailUrl = (id: string | number) => `${baseUrl}/${id}`
  }

  if (additionalLinks && additionalLinks.length > 0) {
    links.additional = {}
    additionalLinks.forEach(linkItem => {
      links.additional![linkItem.titleKey] = {
        titleKey: linkItem.titleKey,
        title: linkItem.title,
        url: linkItem.url,
      }
    })
  }

  return links
}
