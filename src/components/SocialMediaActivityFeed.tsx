import { useState } from "react";

// One item in the linked list (one activity post)
class ActivityNode {
  activity: string;
  prev: ActivityNode | null = null;
  next: ActivityNode | null = null;

  constructor(activity: string) {
    this.activity = activity;
  }
}

class ActivityFeed {
  private head: ActivityNode | null = null;
  private tail: ActivityNode | null = null;
  private count = 0;

  // Add a new activity to the top of the feed
  addActivity(activity: string): void {
    const newNode = new ActivityNode(activity);

    if (!this.head) {
      // first activity ever added
      this.head = newNode;
      this.tail = newNode;
    } else {
      // put new activity at the front
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.count++;
  }

  deleteActivity(index: number): void {
    if (index < 0 || index >= this.count) return;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    if (!current) return;

    if (current.prev) {
      current.prev.next = current.next;
    } else {

      this.head = current.next;
    }

    if (current.next) {
      current.next.prev = current.prev;
    } else {

      this.tail = current.prev;
    }

    this.count--;
  }

  showActivities(): string[] {
    const result: string[] = [];
    let current = this.head;
    while (current) {
      result.push(current.activity);
      current = current.next;
    }
    return result;
  }
}

// UI to test the activity feed
const SocialMediaActivityFeed = () => {
  const [feed] = useState(() => new ActivityFeed());
  const [activities, setActivities] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);

  const addActivity = () => {
    const newActivity = `User posted update #${counter}`;
    feed.addActivity(newActivity);
    setCounter(counter + 1);
    setActivities(feed.showActivities());
  };

  const deleteActivity = (index: number) => {
    feed.deleteActivity(index);
    setActivities(feed.showActivities());
  };

  return (
    <div className="p-4 border rounded shadow-lg w-96">
      <h2 className="text-xl font-bold">📢 Social Media Activity Feed</h2>

      <div className="mt-4">
        <button
          onClick={addActivity}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Activity
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {activities.length === 0 && (
          <p className="text-sm text-gray-500">No activities yet</p>
        )}
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-1"
          >
            <span className="text-sm">{activity}</span>
            <button
              onClick={() => deleteActivity(index)}
              className="px-2 py-1 bg-red-400 text-white rounded text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaActivityFeed;