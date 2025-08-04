// sdk/src/batcher.ts

import type { AgentEvent, BatchResult, Logger, QueueStorage } from './types';
import { withRetry, isRetryableError } from './utils/retry';

export interface BatcherConfig {
  endpoint: string;
  apiKey: string;
  batchSize: number;
  flushInterval: number;
  maxRetries: number;
  retryDelay: number;
  logger: Logger;
  storage: QueueStorage;
  onError?: (error: Error, events: AgentEvent[]) => void;
}

export class EventBatcher {
  private flushTimer?: ReturnType<typeof setTimeout>;
  private isProcessing = false;
  private isStopped = false;

  constructor(private config: BatcherConfig) {
    this.startAutoFlush();
  }

  async add(event: AgentEvent): Promise<void> {
    if (this.isStopped) {
      throw new Error('Batcher has been stopped');
    }

    await this.config.storage.push(event);
    this.config.logger.debug(`Event queued: ${event.event_id}`);

    // Check if we should flush immediately
    const size = await this.config.storage.size();
    if (size >= this.config.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.isProcessing || this.isStopped) return;

    this.isProcessing = true;
    try {
      await this.processBatch();
    } finally {
      this.isProcessing = false;
    }
  }

  async stop(): Promise<void> {
    this.isStopped = true;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
    
    // Flush remaining events
    await this.flush();
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private async processBatch(): Promise<void> {
    const events = await this.config.storage.peek(this.config.batchSize);
    if (events.length === 0) return;

    try {
      const result = await this.sendBatch(events);
      
      // Remove successfully sent events
      const successfulIds = events
        .filter((_, index) => {
          const error = result.errors?.find(e => e.event_id === events[index].event_id);
          return !error;
        })
        .map(e => e.event_id);

      await this.config.storage.remove(successfulIds);

      this.config.logger.info(`Batch sent: ${result.accepted} accepted, ${result.rejected} rejected`);

      // Handle rejected events
      if (result.rejected > 0 && result.errors) {
        this.config.logger.warn('Some events were rejected:', result.errors);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.config.logger.error('Failed to send batch:', err);
      
      if (this.config.onError) {
        this.config.onError(err, events);
      } else {
        // If no error handler, propagate the error (throwOnError = true)
        throw err;
      }

      // If not retryable, remove events to prevent infinite loop
      if (!isRetryableError(error)) {
        await this.config.storage.remove(events.map(e => e.event_id));
      }
    }
  }

  private async sendBatch(events: AgentEvent[]): Promise<BatchResult> {
    const batch_id = crypto.randomUUID();
    
    return withRetry(
      async () => {
        const response = await fetch(`${this.config.endpoint}/v1/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Identro-Key': this.config.apiKey,
            'User-Agent': '@identro/sdk/0.1.0'
          },
          body: JSON.stringify({ events, batch_id })
        });

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          (error as any).status = response.status;
          throw error;
        }

        return response.json() as Promise<BatchResult>;
      },
      {
        maxRetries: this.config.maxRetries,
        retryDelay: this.config.retryDelay,
        onRetry: (error, attempt) => {
          this.config.logger.warn(`Retry attempt ${attempt} after error:`, error.message);
        }
      }
    );
  }
}
