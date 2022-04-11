import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import { rdfs } from '@tpluscode/rdf-ns-builders/strict'
import { GraphPointer } from 'clownface'
import { meta } from './lib/ns'
import { getHierarchyPatterns } from './lib/patterns'
import { anyPath } from './lib/firstLevel'

export function properties(hierarchyLevel: GraphPointer): string {
  const patterns = getHierarchyPatterns(hierarchyLevel, {
    firstLevel: anyPath,
  })
  if (!patterns) {
    return ''
  }

  return CONSTRUCT`?property ${rdfs.label} ?label`
    .WHERE`
      {
        ${SELECT.DISTINCT`?property`.WHERE`
          ${patterns}
          filter(isiri(?this))
        `}
      }

      optional { ?property ${rdfs.label} ?rdfsLabel }

      bind(if(bound(?rdfsLabel), concat(?rdfsLabel, " (", str(?property), ")"), str(?property)) as ?label)
    `
    .build()
}

export function types(hierarchyLevel: GraphPointer): string {
  const patterns = getHierarchyPatterns(hierarchyLevel, {
    restrictTypes: false,
    firstLevel: anyPath,
  })
  if (!patterns) {
    return ''
  }

  return CONSTRUCT`?type ${rdfs.label} ?label`
    .WHERE`
      {
        ${SELECT.DISTINCT`?type`.WHERE`
          ${patterns}
          ?this a ?type
          filter(isiri(?this))
          minus {
            ?this a ${meta.Hierarchy}
          }
        `}
      }

      optional { ?type ${rdfs.label} ?rdfsLabel }

      bind(if(bound(?rdfsLabel), concat(?rdfsLabel, " (", str(?type), ")"), str(?type)) as ?label)
    `
    .build()
}
