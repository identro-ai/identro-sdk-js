// sdk/src/utils/retry.ts

export interface RetryOptions {
    maxRetries: number;
    retryDelay: number;
    maxDelay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  }
  
  export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    const { maxRetries, retryDelay, maxDelay = 30000, onRetry } = options;
    
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(retryDelay * Math.pow(2, attempt), maxDelay);
        
        if (onRetry) {
          onRetry(lastError, attempt + 1);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
  
  // Check if error is retryable
  export function isRetryableError(error: any): boolean {
    // Network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // HTTP status codes that are retryable
    if (error.status === 429 || (error.status >= 500 && error.status < 600)) {
      return true;
    }
    
    // Fetch errors
    if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
      return true;
    }
    
    return false;
  }