// Maps visibility string to UML prefix symbol
export const VISIBILITY_SYMBOLS = {
  private: '-',
  public: '+',
  protected: '#',
  package: '~',
}

// Maps UML prefix symbol to Java keyword
export const VISIBILITY_KEYWORDS = {
  '-': 'private',
  '+': 'public',
  '#': 'protected',
  '~': '',
  private: 'private',
  public: 'public',
  protected: 'protected',
  package: '',
}

export function getVisibilitySymbol(vis) {
  return VISIBILITY_SYMBOLS[vis] || (vis === '-' || vis === '+' || vis === '#' ? vis : '+')
}

export function getVisibilityKeyword(vis) {
  return VISIBILITY_KEYWORDS[vis] ?? 'public'
}

/**
 * Builds relationship metadata per class
 */
export function buildRelationshipMap(classes, relationships) {
  const map = {}
  classes.forEach((c) => {
    map[c.id] = {
      extends: null,
      implements: [],
      associations: [],
    }
  })

  relationships.forEach((rel) => {
    const sourceClass = classes.find((c) => c.id === rel.sourceId)
    const targetClass = classes.find((c) => c.id === rel.targetId)
    if (!sourceClass || !targetClass) return

    if (map[rel.sourceId]) {
      if (rel.type === 'extends' || rel.type === 'inheritance') {
        map[rel.sourceId].extends = targetClass.name
      } else if (rel.type === 'implements' || rel.type === 'realization') {
        map[rel.sourceId].implements.push(targetClass.name)
      } else {
        map[rel.sourceId].associations.push({
          targetName: targetClass.name,
          type: rel.type,
          label: rel.label || '',
        })
      }
    }
  })

  return map
}

/**
 * Generates Java code matching the assignment screenshot format:
 * public class Person {
 *     - String name;
 * 
 *     + String getName() {
 *         // TODO: implement getName()
 *     }
 * }
 */
export function generateUMLJavaCode(classes, relationships, includeExtends = false) {
  const relMap = buildRelationshipMap(classes, relationships)

  return classes
    .map((cls) => {
      const relInfo = relMap[cls.id] || { extends: null, implements: [] }
      let header = `public class ${cls.name}`
      if (includeExtends && relInfo.extends) {
        header += ` extends ${relInfo.extends}`
      }
      if (includeExtends && relInfo.implements.length > 0) {
        header += ` implements ${relInfo.implements.join(', ')}`
      }
      header += ' {'

      const lines = [header]

      // Attributes
      if (cls.attributes && cls.attributes.length > 0) {
        cls.attributes.forEach((attr) => {
          const sym = getVisibilitySymbol(attr.visibility)
          lines.push(`    ${sym} ${attr.type || 'Object'} ${attr.name || 'field'};`)
        })
        lines.push('')
      }

      // Methods
      if (cls.methods && cls.methods.length > 0) {
        cls.methods.forEach((m, idx) => {
          const sym = getVisibilitySymbol(m.visibility)
          const ret = m.returnType || 'void'
          lines.push(`    ${sym} ${ret} ${m.name || 'method'}() {`)
          lines.push(`        // TODO: implement ${m.name || 'method'}()`)
          lines.push('    }')
          if (idx < cls.methods.length - 1) {
            lines.push('')
          }
        })
      }

      lines.push('}')
      return lines.join('\n')
    })
    .join('\n\n')
}

/**
 * Generates fully standard compilable Java code
 */
export function generateStandardJavaCode(classes, relationships) {
  const relMap = buildRelationshipMap(classes, relationships)

  return classes
    .map((cls) => {
      const relInfo = relMap[cls.id] || { extends: null, implements: [] }
      let header = `public class ${cls.name}`
      if (relInfo.extends) {
        header += ` extends ${relInfo.extends}`
      }
      if (relInfo.implements.length > 0) {
        header += ` implements ${relInfo.implements.join(', ')}`
      }
      header += ' {'

      const lines = [header]

      // Attributes
      if (cls.attributes && cls.attributes.length > 0) {
        cls.attributes.forEach((attr) => {
          const kw = getVisibilityKeyword(attr.visibility)
          const kwPrefix = kw ? `${kw} ` : ''
          lines.push(`    ${kwPrefix}${attr.type || 'Object'} ${attr.name || 'field'};`)
        })
        lines.push('')
      }

      // Default Constructor
      lines.push(`    public ${cls.name}() {`)
      if (relInfo.extends) {
        lines.push('        super();')
      }
      lines.push('    }')
      lines.push('')

      // Methods
      if (cls.methods && cls.methods.length > 0) {
        cls.methods.forEach((m) => {
          const kw = getVisibilityKeyword(m.visibility)
          const kwPrefix = kw ? `${kw} ` : ''
          const ret = m.returnType || 'void'
          lines.push(`    ${kwPrefix}${ret} ${m.name || 'method'}() {`)
          lines.push(`        // TODO: implement ${m.name || 'method'}()`)
          if (ret === 'boolean') lines.push('        return false;')
          else if (ret === 'int' || ret === 'long' || ret === 'double' || ret === 'float') lines.push('        return 0;')
          else if (ret !== 'void') lines.push('        return null;')
          lines.push('    }')
          lines.push('')
        })
      }

      // Getters & Setters
      if (cls.attributes && cls.attributes.length > 0) {
        cls.attributes.forEach((attr) => {
          const cap = attr.name ? attr.name.charAt(0).toUpperCase() + attr.name.slice(1) : 'Field'
          const type = attr.type || 'Object'
          // getter
          lines.push(`    public ${type} get${cap}() {`)
          lines.push(`        return this.${attr.name};`)
          lines.push('    }')
          lines.push('')
          // setter
          lines.push(`    public void set${cap}(${type} ${attr.name}) {`)
          lines.push(`        this.${attr.name} = ${attr.name};`)
          lines.push('    }')
          lines.push('')
        })
      }

      // remove trailing empty line if any
      if (lines[lines.length - 1] === '') {
        lines.pop()
      }

      lines.push('}')
      return lines.join('\n')
    })
    .join('\n\n')
}
