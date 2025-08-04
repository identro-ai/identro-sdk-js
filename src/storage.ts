// sdk/src/storage.ts

import type { AgentEvent, QueueStorage } from './types';

/**
 * In-memory queue storage
 * In production, this could be replaced with IndexedDB for browsers
 * or file-based storage for Node.js
 */
export class MemoryQueueStorage implements QueueStorage {
  private queue: AgentEvent[] = [];
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  async push(event: AgentEvent): Promise<void> {
    if (this.queue.length >= this.maxSize) {
      // Remove oldest event if at capacity
      this.queue.shift();
    }
    this.queue.push(event);
  }

  async shift(): Promise<AgentEvent | undefined> {
    return this.queue.shift();
  }

  async peek(count: number): Promise<AgentEvent[]> {
    return this.queue.slice(0, count);
  }

  async remove(eventIds: string[]): Promise<void> {
    const idsSet = new Set(eventIds);
    this.queue = this.queue.filter(event => !idsSet.has(event.event_id));
  }

  async size(): Promise<number> {
    return this.queue.length;
  }

  async clear(): Promise<void> {
    this.queue = [];
  }
}

/**
 * Factory function to create appropriate storage based on environment
 */
export function createQueueStorage(): QueueStorage {
  // For now, always use memory storage
  // In future phases, we can detect environment and use:
  // - IndexedDB for browsers
  // - SQLite for Node.js/Bun
  // - Redis for distributed systems
  return new MemoryQueueStorage();
}