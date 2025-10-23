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
}

interface GeneratorOptions {
  hasList?: boolean
  hasCreate?: boolean
  hasDetail?: boolean
}

export const generateLinks = (
  entityName: string,
  options: GeneratorOptions = {}
): GeneratedLinks => {
  const { hasList, hasCreate, hasDetail } = options
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
      title: 'list',
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

  return links
}
