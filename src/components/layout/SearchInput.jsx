export default function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="flex items-center gap-2 w-full min-w-0">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="
          w-full min-w-0
          sm:w-[320px]
          border border-gray-300
          bg-white text-gray-900
          dark:bg-gray-800 dark:text-white dark:border-gray-700
          rounded-md px-3 py-2 text-sm
          outline-none
          focus:ring-2 focus:ring-blue-200
        "
      />

      {value?.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="
            shrink-0
            text-sm px-3 py-2
            rounded-md
            border border-gray-300
            bg-white hover:bg-gray-50
            dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700
            whitespace-nowrap
          "
        >
          Clear
        </button>
      )}
    </div>
  );
}
