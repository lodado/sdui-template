/* eslint-disable no-useless-constructor */
/**
 * VariablesManager
 *
 * Handles global variable management.
 */

import { cloneDeep } from 'lodash-es'

import type { LayoutStateRepository } from './LayoutStateRepository'
import type { SubscriptionManager } from './SubscriptionManager'

/**
 * VariablesManager
 *
 * Handles global variable management.
 */
export class VariablesManager {
  constructor(
    private repository: LayoutStateRepository,
    private subscriptionManager: SubscriptionManager,
  ) // eslint-disable-next-line no-empty-function
  {}

  /**
   * Update global variables.
   * Increase the version by creating a new object via deep copy.
   *
   * @param variables - New global variables object
   */
  updateVariables(variables: Record<string, unknown>): void {
    // Create a new object via deep copy → increment version → full re-render
    this.repository.updateVariables(cloneDeep(variables))
    this.repository.setEdited(true)
    this.repository.incrementVersion()
    this.subscriptionManager.notifyVersion()
  }

  /**
   * Update an individual global variable.
   * Increase the version by creating a new object via deep copy.
   *
   * @param key - Variable key
   * @param value - Variable value
   */
  updateVariable(key: string, value: unknown): void {
    // Create a new object via deep copy → increment version → full re-render
    const current = this.repository.state.variables
    this.repository.updateVariables({
      ...cloneDeep(current),
      [key]: cloneDeep(value),
    })
    this.repository.setEdited(true)
    this.repository.incrementVersion()
    this.subscriptionManager.notifyVersion()
  }

  /**
   * Delete a global variable.
   *
   * @param key - Variable key to delete
   */
  deleteVariable(key: string): void {
    const newVariables = cloneDeep(this.repository.state.variables)
    delete newVariables[key]
    this.repository.updateVariables(newVariables)
    this.repository.setEdited(true)
    this.repository.incrementVersion()
    this.subscriptionManager.notifyVersion()
  }
}



