// sdk/src/types.ts - Enhanced Types for Phase 5.1

export type Framework = 'langchain' | 'superagi' | 'crewai' | 'mcp' | 'http' | 'custom';
export type Status = 'success' | 'fail';
export type FailReason = 
  | 'NETWORK_ERROR' 
  | 'CLIENT_ERROR' 
  | 'FRAMEWORK_EXCEPTION' 
  | 'POLICY_DENY' 
  | 'TASK_UNFULFILLED' 
  | 'COUNTERPARTY_SPAM';

// NEW: Task complexity levels
export type TaskComplexity = 'simple' | 'moderate' | 'complex';

// NEW: Task categories for specialization
export type TaskCategory = 
  | 'data_processing'
  | 'creative_generation'
  | 'real_time_interaction'
  | 'financial_transactions'
  | 'api_integration'
  | 'general';

// Enhanced AgentEvent interface with Phase 5.1 fields
export interface AgentEvent {
  event_id: string;
  agent_id: string;
  task_id: string;
  framework: Framework;
  status: Status;
  latency_ms: number;
  timestamp?: string;
  
  // Optional existing fields
  fail_reason?: FailReason;
  detail_code?: string;
  policy_violation?: boolean;
  metadata?: Record<string, any>;
  
  // NEW: Performance Metrics
  response_time_ms?: number;
  queue_time_ms?: number;
  execution_time_ms?: number;
  p50_latency_ms?: number;
  p95_latency_ms?: number;
  
  // NEW: Quality Indicators
  output_size?: number;
  validation_passed?: boolean;
  requirements_met?: string[];
  task_completion_score?: number;
  
  // NEW: Interaction Context
  requester_agent_id?: string;
  task_category?: TaskCategory;
  task_complexity?: TaskComplexity;
  
  // NEW: Feedback
  quality_rating?: number;
  would_use_again?: boolean;
  dispute_filed?: boolean;
  peer_endorsement?: boolean;
  
  // NEW: Consumer behavior (for bidirectional scoring)
  task_clarity_score?: number;
  payment_confirmed?: boolean;
  response_time_to_provider?: number;
  
  // Phase 6: Hybrid Quality Inference fields
  interaction_context?: {
    consumer_agent_id?: string;
    tool_used?: string;
    interaction_type?: string;
    repeat_interaction?: boolean;
  };
  behavioral_tags?: string[];
  repeat_interaction_count?: number;
  constraint_verification?: {
    constraints_defined?: boolean;
    constraints_met?: string[];
    constraints_failed?: string[];
    compliance_score?: number;
  };
  commitment_compliance_score?: number;
}

export interface EventBatch {
  events: AgentEvent[];
  batch_id?: string;
}

export interface IdentroConfig {
  apiKey: string;
  endpoint?: string;
  baseUrl?: string;          // NEW: Base URL for API (Phase 6)
  
  // Batching configuration
  batchSize?: number;        // Max events per batch (default: 100)
  flushInterval?: number;    // Ms between flushes (default: 1000)
  
  // Retry configuration
  maxRetries?: number;       // Max retry attempts (default: 3)
  retryDelay?: number;       // Initial retry delay in ms (default: 1000)
  
  // Behavior options
  throwOnError?: boolean;    // Throw errors or handle silently (default: false)
  debug?: boolean;           // Enable debug logging (default: false)
  
  // Agent identification
  agentId?: string;          // Default agent ID for all events
  framework?: Framework;     // Default framework
}

// Enhanced RecordEventOptions with Phase 5.1 fields
export interface RecordEventOptions {
  // Override defaults
  agent_id?: string;
  framework?: Framework;
  
  // Required fields
  task_id: string;
  status: Status;
  latency_ms: number;
  
  // Optional existing fields
  fail_reason?: FailReason;
  detail_code?: string;
  policy_violation?: boolean;
  metadata?: Record<string, any>;
  
  // NEW: Performance metrics
  responseTime?: number;
  queueTime?: number;
  executionTime?: number;
  p50Latency?: number;
  p95Latency?: number;
  
  // NEW: Quality indicators
  outputSize?: number;
  validationPassed?: boolean;
  requirementsMet?: string[];
  taskCompletionScore?: number;
  
  // NEW: Interaction context
  requesterAgentId?: string;
  taskCategory?: TaskCategory;
  taskComplexity?: TaskComplexity;
  
  // NEW: Feedback
  qualityRating?: number;
  wouldUseAgain?: boolean;
  disputeFiled?: boolean;
  peerEndorsement?: boolean;
  
  // NEW: Consumer metrics (for bidirectional scoring)
  taskClarityScore?: number;
  paymentConfirmed?: boolean;
  responseTimeToProvider?: number;
  
  // Phase 6: Hybrid Quality Inference fields
  interaction_context?: {
    consumer_agent_id?: string;
    tool_used?: string;
    interaction_type?: string;
    repeat_interaction?: boolean;
  };
  behavioral_tags?: string[];
  repeat_interaction_count?: number;
  constraint_verification?: {
    constraints_defined?: boolean;
    constraints_met?: string[];
    constraints_failed?: string[];
    compliance_score?: number;
  };
  commitment_compliance_score?: number;
}

// Simplified recording options for common use cases
export interface SimpleRecordOptions {
  // Existing simple interface
  taskId?: string;
  metadata?: Record<string, any>;
  
  // NEW: Most common enhanced fields
  responseTime?: number;
  qualityRating?: number;
  taskCategory?: TaskCategory;
  taskComplexity?: TaskComplexity;
  requesterAgentId?: string;
  
  // Phase 6: Additional fields
  outputSize?: number;
  validationPassed?: boolean;
  taskCompletionScore?: number;
  wouldUseAgain?: boolean;
  peerEndorsement?: boolean;
  
  // Phase 6: Behavioral context
  interactionContext?: {
    consumer_agent_id?: string;
    tool_used?: string;
    interaction_type?: string;
    repeat_interaction?: boolean;
  };
  behavioralTags?: string[];
  repeatInteractionCount?: number;
  constraintVerification?: {
    constraints_defined?: boolean;
    constraints_met?: string[];
    constraints_failed?: string[];
    compliance_score?: number;
  };
  commitmentComplianceScore?: number;
}

export interface BatchResult {
  accepted: number;
  rejected: number;
  errors?: Array<{
    event_id: string;
    error: string;
  }>;
}

export interface ScoreResponse {
  agent_id: string;
  score: number;
  tier: 'exceptional' | 'very_good' | 'good' | 'fair' | 'poor';
  total_events: number;
  updated_at: string;
}

// Storage interface for queue persistence
export interface QueueStorage {
  push(event: AgentEvent): Promise<void>;
  shift(): Promise<AgentEvent | undefined>;
  peek(count: number): Promise<AgentEvent[]>;
  remove(eventIds: string[]): Promise<void>;
  size(): Promise<number>;
  clear(): Promise<void>;
}

// Logger interface
export interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: any): void;
}

// NEW: Enhanced scoring types for Phase 5.1+
export interface EnhancedScoreResponse {
  agent_id: string;
  total: number;
  tier: 'exceptional' | 'very_good' | 'good' | 'fair' | 'poor';
  breakdown: {
    technical: { score: number; weighted: number };
    quality: { score: number; weighted: number };
    trust: { score: number; weighted: number };
    modifiers: { total: number; breakdown: Record<string, number> };
  };
  metadata: {
    profile: TaskCategory;
    role: 'provider' | 'consumer';
    confidence: number;
    events_analyzed: number;
    time_window_days: number;
    calculated_at: string;
  };
}

// NEW: Interaction recording for bidirectional scoring
export interface InteractionOptions {
  requesterAgentId: string;
  providerAgentId: string;
  taskCategory?: TaskCategory;
  taskComplexity?: TaskComplexity;
  
  // Provider metrics
  providerResponseTime?: number;
  providerQuality?: number;
  taskCompletionScore?: number;
  
  // Consumer metrics
  taskClarityScore?: number;
  paymentConfirmed?: boolean;
  responseTimeToProvider?: number;
  
  // Mutual feedback
  wouldUseAgain?: boolean;
  peerEndorsement?: boolean;
}
