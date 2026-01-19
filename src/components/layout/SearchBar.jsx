export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks..."
      className="
        w-full
        min-w-0
        sm:max-w-[320px]
        border
        rounded-md
        px-3 py-2
        bg-white
        dark:bg-gray-800
        dark:text-white
      "
    />
  );
}
