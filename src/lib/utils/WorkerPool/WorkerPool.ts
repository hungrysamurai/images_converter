import mainWorker from './worker?worker&url';

export default class WorkerPool {
  idleWorkers: Worker[];
  workQueue;
  workerMap;

  NUM_VORKERS = navigator.hardwareConcurrency - 1 || 1;

  constructor() {
    this.idleWorkers = [];
    this.workQueue = [];
    this.workerMap = new Map();

    for (let i = 0; i < this.NUM_VORKERS; i++) {
      const worker = new Worker(mainWorker, { type: 'module' });

      worker.onmessage = (message) => {
        this._workerDone(worker, null, message.data);
      };

      worker.onerror = (error) => {
        this._workerDone(worker, error, null);
      };

      this.idleWorkers[i] = worker;
    }
  }

  _workerDone(worker: Worker, error: ErrorEvent | null, response: Blob | null) {
    const workerInMap = this.workerMap.get(worker);

    if (workerInMap) {
      const [resolver, rejector] = workerInMap;

      this.workerMap.delete(worker);

      if (this.workQueue.length === 0) {
        this.idleWorkers.push(worker);
      } else {
        const [work, resolver, rejector] = this.workQueue.shift();
        this.workerMap.set(worker, [resolver, rejector]);
        worker.postMessage(work);
      }

      if (error === null) {
        resolver(response);
      } else {
        rejector(error);
      }
    }
  }

  addWork(work): Promise<Blob | Blob[]> {
    const { type, outputSettings, targetFormatName, blobURL, transferable, inputSettings } = work;

    return new Promise((resolve, reject) => {
      if (this.idleWorkers.length > 0) {
        const worker = this.idleWorkers.pop() as Worker;
        this.workerMap.set(worker, [resolve, reject]);

        worker.postMessage(
          {
            blobURL,
            type,
            outputSettings,
            targetFormatName,
            inputSettings,
            transferable,
          },
          transferable ? [transferable] : [],
        );
      } else {
        this.workQueue.push([work, resolve, reject]);
      }
    });
  }

  public dispose() {
    for (const worker of [...this.idleWorkers, ...this.workerMap.keys()]) {
      worker.terminate();
    }
    this.idleWorkers = [];
    this.workerMap.clear();
    this.workQueue = [];
  }
}
