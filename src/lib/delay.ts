export interface DelayOptions {
  /** Whether the delay can be cancelled */
  cancellable?: boolean;
  /** Callback function called on each progress update */
  onProgress?: (elapsed: number, remaining: number, progress: number) => void;
  /** Progress update interval in milliseconds */
  progressInterval?: number;
  /** Custom error to throw if cancelled */
  cancelError?: Error;
  /** Whether to use exponential backoff */
  exponentialBackoff?: boolean;
  /** Base multiplier for exponential backoff */
  backoffMultiplier?: number;
  /** Maximum delay cap for exponential backoff */
  maxDelay?: number;
}

export interface DelayController {
  cancel: (reason?: string) => void;
  isCancelled: () => boolean;
  getElapsed: () => number;
  getRemaining: () => number;
}

class DelayPromise<T> extends Promise<T> {
  private controller?: DelayController;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      controller: DelayController
    ) => void
  ) {
    let controllerInstance: DelayController | undefined;
    super((resolve, reject) => {
      controllerInstance = {
        cancel: () => {},
        isCancelled: () => false,
        getElapsed: () => 0,
        getRemaining: () => 0,
      };
      executor(resolve, reject, controllerInstance);
    });
    this.controller = controllerInstance;
  }

  getController(): DelayController | undefined {
    return this.controller;
  }
}

/**
 * Creates a delay with advanced features including cancellation, progress tracking,
 * and exponential backoff support.
 *
 * @param ms - Delay duration in milliseconds
 * @param options - Configuration options for the delay
 * @returns A promise that resolves after the delay, with optional controller for cancellation
 *
 * @example
 * ```ts
 * // Simple delay
 * await delay(1000);
 *
 * // Cancellable delay with progress
 * const delayPromise = delay(5000, {
 *   cancellable: true,
 *   onProgress: (elapsed, remaining, progress) => {
 *     console.log(`Progress: ${progress}%`);
 *   },
 *   progressInterval: 100
 * });
 *
 * const controller = delayPromise.getController();
 * // Later...
 * controller?.cancel('User cancelled');
 * ```
 */
export function delay(
  ms: number,
  options: DelayOptions = {}
): DelayPromise<void> {
  const {
    cancellable = false,
    onProgress,
    progressInterval = 100,
    cancelError = new Error('Delay was cancelled'),
    exponentialBackoff = false,
    backoffMultiplier = 2,
    maxDelay = Infinity,
  } = options;

  // Calculate actual delay with exponential backoff if enabled
  const calculateDelay = (baseMs: number, attempt: number = 0): number => {
    if (!exponentialBackoff) return baseMs;
    const calculated = baseMs * Math.pow(backoffMultiplier, attempt);
    return Math.min(calculated, maxDelay);
  };

  const actualDelay = calculateDelay(ms);

  return new DelayPromise<void>((resolve, reject, controller) => {
    let cancelled = false;
    let startTime = Date.now();
    let progressIntervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (progressIntervalId) {
        clearInterval(progressIntervalId);
        progressIntervalId = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const updateController = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, actualDelay - elapsed);
      const progress = Math.min(100, (elapsed / actualDelay) * 100);

      controller.cancel = (reason?: string) => {
        if (!cancellable) {
          throw new Error('Delay is not cancellable');
        }
        cancelled = true;
        cleanup();
        const error = reason
          ? new Error(`Delay was cancelled: ${reason}`)
          : cancelError;
        reject(error);
      };

      controller.isCancelled = () => cancelled;
      controller.getElapsed = () => Date.now() - startTime;
      controller.getRemaining = () => Math.max(0, actualDelay - remaining);
    };

    updateController();

    // Set up progress tracking if callback provided
    if (onProgress && progressInterval > 0) {
      progressIntervalId = setInterval(() => {
        if (cancelled) {
          cleanup();
          return;
        }
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, actualDelay - elapsed);
        const progress = Math.min(100, (elapsed / actualDelay) * 100);
        onProgress(elapsed, remaining, progress);
      }, progressInterval);
    }

    // Set up the main delay
    timeoutId = setTimeout(() => {
      if (cancelled) {
        return;
      }
      cleanup();
      resolve();
    }, actualDelay);
  });
}

/**
 * Creates a retryable delay that can be used with exponential backoff for retry logic.
 *
 * @param baseMs - Base delay duration in milliseconds
 * @param attempt - Current attempt number (0-indexed)
 * @param options - Configuration options
 * @returns A promise that resolves after the calculated delay
 *
 * @example
 * ```ts
 * for (let attempt = 0; attempt < 5; attempt++) {
 *   try {
 *     await someOperation();
 *     break;
 *   } catch (error) {
 *     await retryDelay(1000, attempt, {
 *       maxDelay: 10000,
 *       backoffMultiplier: 2
 *     });
 *   }
 * }
 * ```
 */
export function retryDelay(
  baseMs: number,
  attempt: number = 0,
  options: Omit<DelayOptions, 'exponentialBackoff'> & {
    backoffMultiplier?: number;
    maxDelay?: number;
  } = {}
): DelayPromise<void> {
  return delay(baseMs, {
    ...options,
    exponentialBackoff: true,
    backoffMultiplier: options.backoffMultiplier ?? 2,
    maxDelay: options.maxDelay ?? Infinity,
  });
}

/**
 * Creates a sequence of delays that execute one after another.
 *
 * @param delays - Array of delay durations in milliseconds
 * @param options - Configuration options applied to all delays
 * @returns A promise that resolves after all delays complete
 *
 * @example
 * ```ts
 * await delaySequence([100, 200, 300]);
 * // Total delay: 600ms
 * ```
 */
export async function delaySequence(
  delays: number[],
  options: DelayOptions = {}
): Promise<void> {
  for (const delayMs of delays) {
    await delay(delayMs, options);
  }
}

/**
 * Creates a delay that resolves after a random time within a range.
 *
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @param options - Configuration options
 * @returns A promise that resolves after a random delay
 *
 * @example
 * ```ts
 * await randomDelay(1000, 5000);
 * // Delays for a random time between 1-5 seconds
 * ```
 */
export function randomDelay(
  minMs: number,
  maxMs: number,
  options: DelayOptions = {}
): DelayPromise<void> {
  const randomMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(randomMs, options);
}
