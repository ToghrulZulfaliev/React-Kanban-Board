export default function Footer() {
  return (
    <footer className="mt-10 py-4 px-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 w-full min-w-0">
      © {new Date().getFullYear()} Toghrul Zulfaliyev — React Kanban Board
    </footer>
  );
}
