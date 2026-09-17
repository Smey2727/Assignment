import { useState } from "react";

/**
 * Represents a node in the doubly linked list.
 */
class ListNode {
  url: string;
  prev: ListNode | null = null;
  next: ListNode | null = null;

  constructor(url: string) {
    this.url = url;
  }
}

/**
 * Manages browser history using a doubly linked list.
 */
class BrowserHistory {
  private current: ListNode | null = null;

  /**
   * Visits a new page and clears forward history.
   */
  visitPage(url: string): void {
    const newNode = new ListNode(url);

    if (this.current) {
      this.current.next = null; // Clear forward history
      newNode.prev = this.current;
      this.current.next = newNode;
    }

    this.current = newNode;
  }

  /**
   * Moves back in history.
   */
  goBack(): string | null {
    if (this.current?.prev) {
      this.current = this.current.prev;
      return this.current.url;
    }
    return null;
  }

  /**
   * Moves forward in history.
   */
  goForward(): string | null {
    if (this.current?.next) {
      this.current = this.current.next;
      return this.current.url;
    }
    return null;
  }

  /**
   * Returns the current page URL.
   */
  getCurrentPage(): string | null {
    return this.current ? this.current.url : null;
  }
}

/**
 * React component for managing browser history.
 */
const BrowserHistoryManager = () => {
  const [history] = useState(() => new BrowserHistory());
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  const visitPage = () => {
    const newPage = `Page ${Math.floor(Math.random() * 100)}`;
    history.visitPage(newPage);
    setCurrentPage(history.getCurrentPage());
  };

  const goBack = () => {
    setCurrentPage(history.goBack());
  };

  const goForward = () => {
    setCurrentPage(history.goForward());
  };

  return (
    <div className="p-4 border rounded shadow-lg w-96">
      <h2 className="text-xl font-bold">🔙 Custom Browser History</h2>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Current Page:</p>
        <p className="text-lg font-semibold">{currentPage || "No Page Yet"}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={visitPage}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Visit New Page
        </button>
        <button
          onClick={goBack}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          🔙 Back
        </button>
        <button
          onClick={goForward}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          🔜 Forward
        </button>
      </div>
    </div>
  );
};

export default BrowserHistoryManager;