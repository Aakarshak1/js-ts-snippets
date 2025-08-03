// @link https://www.youtube.com/watch?v=SCHK40yvIdM

const STATES = {
  PENDING: "PENDING",
  FULLFILLED: "FULLFILLED",
  REJECTED: "REJECTED",
};

class CustomPromise {
  // Private internal values
  #value = undefined;
  #state = STATES.PENDING;
  #resolutionHandlers = [];
  #rejectionHandlers = [];
  #isHandled = false; // Flag to track whether rejection is handled

  constructor(executorFn) {
    this.resolve = this.#_resolve.bind(this);
    this.reject = this.#_reject.bind(this);
    try {
      executorFn(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  #_resolve(value) {
    queueMicrotask(() => {
      if (this.#state !== STATES.PENDING) return;

      // If resolved with another CustomPromise, wait for it
      if (value instanceof CustomPromise) {
        return value.then(this.resolve, this.reject);
      }

      this.#value = value;
      this.#state = STATES.FULLFILLED;
      this.#runResolutionHandlers();
    });
  }

  #_reject(value) {
    queueMicrotask(() => {
      if (this.#state !== STATES.PENDING) {
        return;
      }

      this.#value = reason;
      this.#state = STATES.REJECTED;
      // Check for unhandled rejection in the next event loop tick
      setTimeout(() => {
        if (!this.#isHandled && this.#rejectionHandlers.length === 0) {
          console.warn("UnhandledPromiseRejectionWarning:", reason);
        }
      }, 0);

      this.#runRejectionHandlers();
    });
  }

  #runResolutionHandlers() {
    if (this.#resolutionHandlers.length) {
      this.#resolutionHandlers.forEach((handler) => handler(this.#value));
      this.#resolutionHandlers = [];
    }
  }

  #runRejectionHandlers() {
    if (this.#rejectionHandlers.length) {
      this.#rejectionHandlers.forEach((handler) => handler(this.#value));
      this.#rejectionHandlers = [];
    }
  }

  then(onFulfilled, onRejection) {
    return new CustomPromise((resolve, reject) => {
      const thenHandler = (result) => {
        if (!onFulfilled) return resolve(result);

        try {
          const next = onFulfilled(result);
          // Handle any thenable (not just CustomPromise)
          if (next && typeof next.then === "function") {
            next.then(resolve, reject);
          } else {
            resolve(next);
          }
        } catch (err) {
          reject(err);
        }
      };

      const catchHandler = (result) => {
        if (!onRejection) return reject(result);
        try {
          const next = onRejection(result);
          // Handle any thenable (not just CustomPromise)
          if (next && typeof next.then === "function") {
            next.then(resolve, reject);
          } else {
            resolve(next);
          }
        } catch (err) {
          reject(err);
        }
      };

      this.#resolutionHandlers.push(thenHandler);
      this.#rejectionHandlers.push(catchHandler);

      if (this.#state === STATES.FULLFILLED) {
        this.#runResolutionHandlers();
      } else if (this.#state === STATES.REJECTED) {
        this.#runRejectionHandlers();
      }
    });
  }

  catch(onRejection) {
    return this.then(undefined, onRejection);
  }

  finally(callback) {
    return this.then(
      (value) => CustomPromise.resolve(callback()).then(() => value),
      (reason) =>
        CustomPromise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  }

  static all(promises) {
    return new CustomPromise((resolve, reject) => {
      const results = [];
      let completed = 0;

      if (promises.length === 0) return resolve(results);

      promises.forEach((promise, index) => {
        CustomPromise.resolve(promise).then((value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        }, reject);
      });
    });
  }

  static race(promises) {
    return new CustomPromise((resolve, reject) => {
      promises.forEach((promise) => {
        CustomPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}

function init() {
  return new CustomPromise((r) => r(10));
}
