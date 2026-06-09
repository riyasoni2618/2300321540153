import logger from 'logging-middleware';

const heapLogger = logger.child('MinHeap');

class MinHeap {
  constructor(compareFn) {
    this.heap = [];
    this.compare = compareFn;
  }

  insert(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);

    heapLogger.debug('Heap insert', { size: this.heap.length });
  }

  removeMin() {
    if (this.heap.length === 0) {
      return undefined;
    }

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    heapLogger.debug('Heap removeMin', { size: this.heap.length });

    return min;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  toArray() {
    return [...this.heap];
  }

  _parentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  _leftChildIndex(index) {
    return index * 2 + 1;
  }

  _rightChildIndex(index) {
    return index * 2 + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this._parentIndex(index);

      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }

      this._swap(index, parentIndex);
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;

    while (true) {
      const left = this._leftChildIndex(index);
      const right = this._rightChildIndex(index);
      let smallest = index;

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      this._swap(index, smallest);
      index = smallest;
    }
  }
}

export default MinHeap;
