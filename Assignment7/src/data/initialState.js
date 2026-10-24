export const INITIAL_CLASSES = [
  {
    id: 'cls_person',
    name: 'Person',
    x: 80,
    y: 80,
    headerBg: '#e0f2fe',
    attributes: [
      { id: 'attr_1', visibility: 'private', name: 'name', type: 'String' },
    ],
    methods: [
      { id: 'meth_1', visibility: 'public', name: 'getName', returnType: 'String' },
    ],
  },
  {
    id: 'cls_student',
    name: 'Student',
    x: 380,
    y: 80,
    headerBg: '#ecfdf5',
    attributes: [
      { id: 'attr_2', visibility: 'private', name: 'rollNo', type: 'int' },
    ],
    methods: [
      { id: 'meth_2', visibility: 'public', name: 'study', returnType: 'void' },
    ],
  },
]

export const INITIAL_RELATIONSHIPS = [
  {
    id: 'rel_1',
    sourceId: 'cls_student',
    targetId: 'cls_person',
    type: 'extends',
    label: 'extends',
  },
]
