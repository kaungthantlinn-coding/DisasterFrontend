/**
 * Global request manager to prevent duplicate API calls
 * This helps avoid multiple components making the same API call simultaneously
 */
class RequestManager {
  private static instance: RequestManager;
  private ongoingRequests: Map<string, Promise<any>> = new Map();

  static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  /**
   * Execute a request, reusing ongoing requests if they exist
   */
  async executeRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if there's already an ongoing request
    const ongoingRequest = this.ongoingRequests.get(key);
    if (ongoingRequest) {
      console.log(`🔄 Reusing ongoing request: ${key}`);
      return ongoingRequest;
    }

    // Create and store the request
    const requestPromise = requestFn();
    this.ongoingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the ongoing request
      this.ongoingRequests.delete(key);
    }
  }

  /**
   * Clear all ongoing requests (useful for cleanup)
   */
  clearAll(): void {
    this.ongoingRequests.clear();
  }

  /**
   * Get the number of ongoing requests
   */
  getOngoingRequestCount(): number {
    return this.ongoingRequests.size;
  }
}

export const requestManager = RequestManager.getInstance();