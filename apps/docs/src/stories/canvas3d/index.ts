/**
 * Canvas3D Storybook: renderers and chart interpolation.
 * Re-export for consumers that need the strategy or chart helpers.
 */
export {
  CHART_MARGIN,
  createChartDataToPixel,
  storybookCanvas3DRenderStrategy,
} from './canvas3d-renderers'
export type { DataPoint } from './chart-interpolation'
