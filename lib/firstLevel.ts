import { Term } from 'rdf-js'
import { MultiPointer } from 'clownface'
import { sparql } from '@tpluscode/sparql-builder'
import { toSparql } from 'clownface-shacl-path'
import { parent } from './variable'

export function anyPath(subject: Term, path: MultiPointer, level: number) {
  const inverse = path.term?.termType === 'BlankNode'
  if (inverse) {
    return sparql`${subject} ?property ${parent(level)} .`
  }

  return sparql`${parent(level)} ?property ${subject} .`
}

export function requiredPath(subject: Term, path: MultiPointer, level: number) {
  return sparql`${parent(level)} ${toSparql(path)} ${subject} .`
}