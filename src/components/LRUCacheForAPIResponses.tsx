import { useState } from "react";

class CacheNode {
  key: string;
  value: string;
  prev: CacheNode | null = null;
  next: CacheNode | null = null;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

class SimpleHashMap {
  private buckets: Array<Array<[string, CacheNode]>>;
  private bucketCount = 16;

  constructor() {
    this.buckets = new Array(this.bucketCount);
    for (let i = 0; i < this.bucketCount; i++) {
      this.buckets[i] = [];
    }
  }

  // turns a key into a bucket index
  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.bucketCount;
    }
    return hash;
  }

  // add or update a key in the map
  set(key: string, node: CacheNode): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = node;
        return;
      }
    }
    bucket.push([key, node]);
  }

  // find a node by key
  get(key: string): CacheNode | null {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1];
      }
    }
    return null;
  }

  // remove a key from the map
  delete(key: string): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return;
      }
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

class LRUCache {
  private map: SimpleHashMap;
  private capacity: number;
  private count = 0;
  private head: CacheNode;
  private tail: CacheNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new SimpleHashMap();
    this.head = new CacheNode("", "");
    this.tail = new CacheNode("", "");
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // unlink a node from wherever it is in the list
  private removeNode(node: CacheNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // put a node right after head (marks it as most recently used)
  private insertAtFront(node: CacheNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  // get a value by key, and mark it as recently used
  get(key: string): string | null {
    const node = this.map.get(key);
    if (!node) return null;

    this.removeNode(node);
    this.insertAtFront(node);
    return node.value;
  }

  // add or update a key/value, evict oldest if cache is full
  put(key: string, value: string): void {
    const existing = this.map.get(key);

    if (existing) {
      existing.value = value;
      this.removeNode(existing);
      this.insertAtFront(existing);
      return;
    }

    if (this.count >= this.capacity) {
      const lru = this.tail.prev!;
      this.removeNode(lru);
      this.map.delete(lru.key);
      this.count--;
    }

    const newNode = new CacheNode(key, value);
    this.insertAtFront(newNode);
    this.map.set(key, newNode);
    this.count++;
  }

  // how many items are currently in the cache
  size(): number {
    return this.count;
  }
}

// UI to test the LRU cache
const LRUCacheForAPIResponses = () => {
  const CAPACITY = 3;
  const [cache] = useState(() => new LRUCache(CAPACITY));
  const [log, setLog] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);

  const addEntry = () => {
    const key = `key${counter}`;
    const value = `response-${counter}`;
    cache.put(key, value);
    setCounter(counter + 1);
    setLog((prev) => [`PUT ${key} = ${value} (size: ${cache.size()})`, ...prev]);
  };

  const getEntry = () => {
    if (counter === 0) return;
    const keyToGet = `key${Math.floor(Math.random() * counter)}`;
    const result = cache.get(keyToGet);
    setLog((prev) => [
      `GET ${keyToGet} -> ${result ?? "null (not found / evicted)"}`,
      ...prev,
    ]);
  };

  return (
    <div className="p-4 border rounded shadow-lg w-96">
      <h2 className="text-xl font-bold">🗂️ LRU Cache for API Responses</h2>
      <p className="text-sm text-gray-500 mt-1">Capacity: {CAPACITY}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={addEntry}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Put New Entry
        </button>
        <button
          onClick={getEntry}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Get Random Key
        </button>
      </div>

      <div className="mt-4 max-h-48 overflow-y-auto text-sm">
        {log.map((entry, i) => (
          <p key={i} className="text-gray-600">
            {entry}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LRUCacheForAPIResponses;