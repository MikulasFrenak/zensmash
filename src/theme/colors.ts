/**
 * ZenSmash palette — calm green/white base, rainbow only as reward.
 * (Ice-blue experiment reverted — green felt better. Materials like ice
 * can return later as unlockable themes.)
 */
export const colors = {
  // Calm base
  background: '#F6FBF7', // soft off-white with a hint of green
  surface: '#FFFFFF',
  sage: '#A7D7B8',
  mint: '#CDEBD8',
  forest: '#4E8A6A',
  textPrimary: '#2E4B3C',
  textSecondary: '#7BA08C',

  // Block face shades (green family) + gradient tops and 3D sides
  blockFaces: ['#B9E4C9', '#A7D7B8', '#93C9A6', '#CDEBD8'],
  blockFaceTops: ['#D3F0DE', '#C4E7D0', '#B0DBBF', '#E0F5E9'],
  blockSides: ['#8FBFA3', '#7FB394', '#6FA483', '#A3CDB4'],
  blockCrack: '#4E8A6A',

  // Rainbow — reserved for progress arcs, shatter bursts, charge sparks
  rainbow: [
    '#FF6B6B',
    '#FFA94D',
    '#FFE066',
    '#8CE99A',
    '#66D9E8',
    '#748FFC',
    '#DA77F2',
  ],
} as const;

export type BlockFaceColor = (typeof colors.blockFaces)[number];
