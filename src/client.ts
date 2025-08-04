// sdk/src/client.ts

import type { 
    IdentroConfig, 
    RecordEventOptions, 
    AgentEvent, 
    ScoreResponse,
    SimpleRecordOptions,
    Logger 
  } from './types';
  import { EventBatcher } from './batcher';
  import { createQueueStorage } from './storage';
  import { ConsoleLogger, NoOpLogger } from './utils/logger';
  import { withRetry } from './utils/retry';
  
  export class IdentroClient {
    private config: Required<IdentroConfig>;
    private batcher: EventBatcher;
    private logger: Logger;
  
    constructor(config: IdentroConfig) {
      // Validate required fields
      if (!config.apiKey) {
        throw new Error('API key is required');
      }
  
      // Set defaults
      this.config = {
        apiKey: config.apiKey,
        endpoint: config.endpoint || config.baseUrl || 'https://api.identro.com',
        baseUrl: config.baseUrl || config.endpoint || 'https://api.identro.com',
        batchSize: config.batchSize || 100,
        flushInterval: config.flushInterval || 1000,
        maxRetries: config.maxRetries || 3,
        retryDelay: config.retryDelay || 1000,
        throwOnError: config.throwOnError || false,
        debug: config.debug || false,
        agentId: config.agentId || this.generateAgentId(),
        framework: config.framework || 'custom'
      };
  
      // Setup logger
      this.logger = this.config.debug 
        ? new ConsoleLogger(true) 
        : new NoOpLogger();
  
      // Create batcher
      this.batcher = new EventBatcher({
        endpoint: this.config.endpoint,
        apiKey: this.config.apiKey,
        batchSize: this.config.batchSize,
        flushInterval: this.config.flushInterval,
        maxRetries: this.config.maxRetries,
        retryDelay: this.config.retryDelay,
        logger: this.logger,
        storage: createQueueStorage(),
        onError: this.config.throwOnError ? undefined : (error) => {
          this.logger.error('Background error:', error);
        }
      });
  
      this.logger.info('Identro client initialized', {
        endpoint: this.config.endpoint,
        agentId: this.config.agentId
      });
    }
  
    /**
     * Record an event
     */
    async recordEvent(options: RecordEventOptions): Promise<void> {
      try {
        const event: AgentEvent = {
          event_id: crypto.randomUUID(),
          agent_id: options.agent_id || this.config.agentId,
          task_id: options.task_id,
          framework: options.framework || this.config.framework,
          status: options.status,
          latency_ms: options.latency_ms,
          timestamp: new Date().toISOString(),
          fail_reason: options.fail_reason,
          detail_code: options.detail_code,
          policy_violation: options.policy_violation,
          metadata: options.metadata,
          
          // NEW: Enhanced Phase 5.1 fields
          response_time_ms: options.responseTime,
          queue_time_ms: options.queueTime,
          execution_time_ms: options.executionTime,
          p50_latency_ms: options.p50Latency,
          p95_latency_ms: options.p95Latency,
          
          // Quality indicators
          output_size: options.outputSize,
          validation_passed: options.validationPassed,
          requirements_met: options.requirementsMet,
          task_completion_score: options.taskCompletionScore,
          
          // Interaction context
          requester_agent_id: options.requesterAgentId,
          task_category: options.taskCategory,
          task_complexity: options.taskComplexity,
          
          // Feedback
          quality_rating: options.qualityRating,
          would_use_again: options.wouldUseAgain,
          dispute_filed: options.disputeFiled,
          peer_endorsement: options.peerEndorsement,
          
          // Consumer behavior
          task_clarity_score: options.taskClarityScore,
          payment_confirmed: options.paymentConfirmed,
          response_time_to_provider: options.responseTimeToProvider,
          
          // Phase 6: Hybrid Quality Inference fields
          interaction_context: options.interaction_context,
          behavioral_tags: options.behavioral_tags,
          repeat_interaction_count: options.repeat_interaction_count,
          constraint_verification: options.constraint_verification,
          commitment_compliance_score: options.commitment_compliance_score
        };

        await this.batcher.add(event);
        this.logger.debug('Event recorded', { event_id: event.event_id, status: event.status });
      } catch (error) {
        this.logger.error('Failed to record event:', error);
        if (this.config.throwOnError) {
          throw error;
        }
      }
    }
  
    /**
     * Record a successful task (legacy method)
     */
    async recordSuccess(taskId: string, latencyMs: number, metadata?: Record<string, any>): Promise<void>;
    /**
     * Record a successful task (enhanced method)
     */
    async recordSuccess(options: RecordEventOptions): Promise<void>;
    /**
     * Record a successful task (simple method - Phase 6)
     */
    async recordSuccess(taskId: string, options: SimpleRecordOptions): Promise<void>;
    async recordSuccess(
      taskIdOrOptions: string | RecordEventOptions, 
      latencyMsOrOptions?: number | SimpleRecordOptions | Record<string, any>, 
      metadata?: Record<string, any>
    ): Promise<void> {
      if (typeof taskIdOrOptions === 'string') {
        if (typeof latencyMsOrOptions === 'number') {
          // Legacy method signature
          return this.recordEvent({
            task_id: taskIdOrOptions,
            status: 'success',
            latency_ms: latencyMsOrOptions,
            metadata
          });
        } else {
          // Simple method signature (Phase 6)
          const options = latencyMsOrOptions as SimpleRecordOptions;
          return this.recordEvent({
            task_id: options.taskId || taskIdOrOptions,
            status: 'success',
            latency_ms: options.responseTime || 100, // Default latency
            metadata: options.metadata,
            
            // Map simple options to full options
            responseTime: options.responseTime,
            outputSize: options.outputSize,
            validationPassed: options.validationPassed,
            taskCompletionScore: options.taskCompletionScore,
            qualityRating: options.qualityRating,
            wouldUseAgain: options.wouldUseAgain,
            peerEndorsement: options.peerEndorsement,
            requesterAgentId: options.requesterAgentId,
            taskCategory: options.taskCategory,
            taskComplexity: options.taskComplexity,
            
            // Phase 6 fields
            interaction_context: options.interactionContext,
            behavioral_tags: options.behavioralTags,
            repeat_interaction_count: options.repeatInteractionCount,
            constraint_verification: options.constraintVerification,
            commitment_compliance_score: options.commitmentComplianceScore
          });
        }
      } else {
        // Enhanced method signature
        return this.recordEvent({
          ...taskIdOrOptions,
          status: 'success'
        });
      }
    }

    /**
     * Record a failed task (legacy method)
     */
    async recordFailure(
      taskId: string, 
      latencyMs: number, 
      failReason?: RecordEventOptions['fail_reason'],
      detailCode?: string,
      metadata?: Record<string, any>
    ): Promise<void>;
    /**
     * Record a failed task (enhanced method)
     */
    async recordFailure(failReason: RecordEventOptions['fail_reason'], options: RecordEventOptions): Promise<void>;
    async recordFailure(
      taskIdOrFailReason: string | RecordEventOptions['fail_reason'], 
      latencyMsOrOptions?: number | RecordEventOptions, 
      failReason?: RecordEventOptions['fail_reason'],
      detailCode?: string,
      metadata?: Record<string, any>
    ): Promise<void> {
      if (typeof taskIdOrFailReason === 'string') {
        // Legacy method signature
        return this.recordEvent({
          task_id: taskIdOrFailReason,
          status: 'fail',
          latency_ms: latencyMsOrOptions as number,
          fail_reason: failReason,
          detail_code: detailCode,
          metadata
        });
      } else {
        // Enhanced method signature
        const options = latencyMsOrOptions as RecordEventOptions;
        return this.recordEvent({
          ...options,
          status: 'fail',
          fail_reason: taskIdOrFailReason
        });
      }
    }
  
    /**
     * Get score for an agent
     */
    async getScore(agentId?: string): Promise<ScoreResponse> {
      const id = agentId || this.config.agentId;
      
      return withRetry(
        async () => {
          const response = await fetch(`${this.config.endpoint}/v1/score/${id}`, {
            headers: {
              'X-Identro-Key': this.config.apiKey,
              'User-Agent': '@identro/sdk/0.1.0'
            }
          });
  
          if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            (error as any).status = response.status;
            throw error;
          }
  
          return response.json() as Promise<ScoreResponse>;
        },
        {
          maxRetries: this.config.maxRetries,
          retryDelay: this.config.retryDelay
        }
      );
    }
  
    /**
     * Force flush all pending events
     */
    async flush(): Promise<void> {
      await this.batcher.flush();
    }
  
    /**
     * Shutdown the client gracefully
     */
    async shutdown(): Promise<void> {
      this.logger.info('Shutting down Identro client');
      await this.batcher.stop();
    }
  
    /**
     * Get the current agent ID
     */
    getAgentId(): string {
      return this.config.agentId;
    }
  
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<IdentroConfig>): void {
      Object.assign(this.config, updates);
      this.logger.info('Configuration updated', updates);
    }
  
    private generateAgentId(): string {
      // Simple agent ID generation
      // In production, this could use machine ID or other stable identifier
      return `agent-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
  }
  
  // Convenience factory function
  export function createClient(config: IdentroConfig): IdentroClient {
    return new IdentroClient(config);
  }
