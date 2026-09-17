import { useState } from "react";

class ImageNode {
  url: string;
  prev: ImageNode | null = null;
  next: ImageNode | null = null;

  constructor(url: string) {
    this.url = url;
  }
}

class ImageCarousel {
  private head: ImageNode | null = null;
  private current: ImageNode | null = null;

  // Add a new image to the end of the carousel
  addImage(url: string): void {
    const newNode = new ImageNode(url);

    if (!this.head) {
      newNode.next = newNode;
      newNode.prev = newNode;
      this.head = newNode;
      this.current = newNode;
    } else {
      const tail = this.head.prev!;
      tail.next = newNode;
      newNode.prev = tail;
      newNode.next = this.head;
      this.head.prev = newNode;
    }
  }

  // Move to the next image, loops back to the first if at the end
  nextImage(): string {
    if (!this.current) return "";
    this.current = this.current.next!;
    return this.current.url;
  }

  // Move to the previous image, loops back to the last if at the start
  prevImage(): string {
    if (!this.current) return "";
    this.current = this.current.prev!;
    return this.current.url;
  }

  // Get the image we're currently viewing
  getCurrentImage(): string | null {
    return this.current ? this.current.url : null;
  }
}

// UI to test the image carousel
const InfiniteImageCarousel = () => {
  const [carousel] = useState(() => new ImageCarousel());
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const addImage = () => {
    const newImage = `Image ${count + 1}`;
    carousel.addImage(newImage);
    setCount(count + 1);
    if (!currentImage) {
      setCurrentImage(carousel.getCurrentImage());
    }
  };

  const nextImage = () => {
    setCurrentImage(carousel.nextImage());
  };

  const prevImage = () => {
    setCurrentImage(carousel.prevImage());
  };

  return (
    <div className="p-4 border rounded shadow-lg w-96">
      <h2 className="text-xl font-bold">Infinite Image Carousel</h2>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Current Image:</p>
        <p className="text-lg font-semibold">{currentImage || "No Image Yet"}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={addImage}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Image
        </button>
        <button
          onClick={prevImage}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Prev
        </button>
        <button
          onClick={nextImage}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InfiniteImageCarousel;