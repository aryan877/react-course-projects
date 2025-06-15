export const NODE_TYPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  DIAMOND: 'diamond'
};

export const NODE_CONFIGS = {
  [NODE_TYPES.RECTANGLE]: {
    width: 120,
    height: 80,
    label: 'Process',
    color: 'bg-blue-500'
  },
  [NODE_TYPES.CIRCLE]: {
    width: 100,
    height: 100,
    label: 'Start/End',
    color: 'bg-emerald-500'
  },
  [NODE_TYPES.DIAMOND]: {
    width: 120,
    height: 120,
    label: 'Decision',
    color: 'bg-amber-500'
  }
};

export const CONNECTION_STYLES = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted'
};