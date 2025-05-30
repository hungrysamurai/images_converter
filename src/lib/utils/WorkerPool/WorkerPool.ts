import heicWorker from './heicDecodeWorker?worker&url';

export default class WorkerPool {
  idleWorkers: Worker[];
  workQueue;
  workerMap;
  currentState: 'idle' | 'work' = 'idle';

  NUM_VORKERS = navigator.hardwareConcurrency - 1 || 1;

  constructor() {
    this.idleWorkers = [];
    this.workQueue = [];
    this.workerMap = new Map();

    for (let i = 0; i < this.NUM_VORKERS; i++) {
      const worker = new Worker(heicWorker, { type: 'module' });

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
    console.log(this.idleWorkers);

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

      error === null ? resolver(response as Blob) : rejector(error);
    }
  }

  addWork(work): Promise<Blob> {
    const { arrayBuffer } = work;

    return new Promise((resolve, reject) => {
      if (this.idleWorkers.length > 0) {
        const worker = this.idleWorkers.pop() as Worker;
        this.workerMap.set(worker, [resolve, reject]);
        console.log(worker);

        worker.postMessage({ arrayBuffer }, [arrayBuffer]);
      } else {
        this.workQueue.push([work, resolve, reject]);
      }
    });
  }
}
