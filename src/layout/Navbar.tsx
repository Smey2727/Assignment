type Page = "history" | "carousel" | "cache" | "feed";

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const navItems: { key: Page; label: string }[] = [
  { key: "history", label: "Browser History" },
  { key: "carousel", label: "Image Carousel" },
  { key: "cache", label: "LRU Cache" },
  { key: "feed", label: "Activity Feed" },
];

const Navbar = ({ activePage, setActivePage }: NavbarProps) => {
  return (
    <nav className="flex gap-2 p-4 bg-gray-800 shadow-md">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActivePage(item.key)}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            activePage === item.key
              ? "bg-blue-500 text-white"
              : "bg-gray-600 text-gray-200 hover:bg-gray-500"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;