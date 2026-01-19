import { useState } from "react";
import {
  LayoutGrid,
  FileText,
  MessageCircle,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const mainItems = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutGrid },
  { id: "docs", label: "Documents", Icon: FileText },
  { id: "chat", label: "Messages", Icon: MessageCircle },
  { id: "team", label: "Team", Icon: Users },
  { id: "settings", label: "Settings", Icon: Settings },
];

const bottomItems = [
  { id: "help", label: "Help", Icon: HelpCircle },
  { id: "logout", label: "Logout", Icon: LogOut },
];

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <aside
      className="
        hidden md:flex
        w-16 shrink-0
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        flex-col items-center py-4
        sticky top-0 h-screen
      "
    >
      <div className="w-10 h-10 rounded-md bg-green-500 text-white flex items-center justify-center font-bold">
        C
      </div>

      <nav className="mt-6 flex flex-col gap-5">
        {mainItems.map((item) => (
          <SidebarIcon
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto mb-4 flex flex-col gap-5">
        {bottomItems.map((item) => (
          <SidebarIcon
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}

function SidebarIcon({ item, active, onClick }) {
  const { Icon, label } = item;

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={[
          "w-10 h-10 flex items-center justify-center rounded-md transition",
          active
            ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-white"
            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white",
        ].join(" ")}
      >
        <Icon size={20} />
      </button>

      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden md:group-hover:block z-50">
        <div className="text-xs px-2 py-1 rounded-md bg-gray-900 text-white whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}
