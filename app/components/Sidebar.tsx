import React from "react";

interface SidebarProps {
  items: string[];
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onItemClick }) => {
  return (
    <div className="h-[calc(100vh-0rem)] w-60 pt-16 bg-gray-900 overflow-y-auto scrollbar-custom">
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li
            key={item}
            className={`${
              index % 2 === 0 ? "bg-gray-900" : "bg-gray-700"
            } hover:bg-gray-600 text-gray-200 text-center cursor-pointer`}
          >
            <button
              className="w-full py-4 text-lg font-medium"
              onClick={() => onItemClick(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
