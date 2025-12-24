/**
 * @lodado/sdui-template
 *
 * Server-Driven UI Template Library for React
 *
 * A flexible and powerful template system for building server-driven user interfaces
 * with dynamic layouts and components.
 *
 * @example
 * ```tsx
 * import { SduiLayoutRenderer } from '@lodado/sdui-template';
 *
 * function App() {
 *   const document = {
 *     version: "1.0.0",
 *     root: {
 *       id: "root",
 *       type: "Container",
 *       state: {
 *         layout: { x: 0, y: 0, w: 12, h: 1 }
 *       }
 *     }
 *   };
 *
 *   return <SduiLayoutRenderer document={document} />;
 * }
 * ```
 */

// React Components
export { SduiLayoutRenderer } from './react-wrapper/components/SduiLayoutRenderer'
export { SduiLayoutProvider } from './react-wrapper/context/SduiLayoutContext'

// React Hooks
export { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from './react-wrapper/hooks'
export type { UseSduiNodeSubscriptionParams } from './react-wrapper/hooks/useSduiNodeSubscription'

// Store
export { SduiLayoutStore } from './store/SduiLayoutStore'
export type { SduiLayoutStoreOptions, SduiLayoutStoreState } from './store/types'

// Schema Types
export type {
  BaseLayoutState,
  LayoutPosition,
  SduiDocument,
  SduiLayoutDocument,
  SduiLayoutNode,
  SduiNode,
} from './schema'

// Component System Types
export type { ComponentFactory, RenderNodeFn } from './components/types'

// Normalization Utilities (optional, for advanced usage)
export { denormalizeSduiLayout, denormalizeSduiNode, normalizeSduiLayout, normalizeSduiNode } from './utils/normalize'
export type { NormalizedSduiEntities } from './utils/normalize/types'

