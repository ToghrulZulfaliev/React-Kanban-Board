export default function Avatar({ initials = "?", size = 28 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center text-xs font-semibold"
    >
      {initials}
    </div>
  );
}
