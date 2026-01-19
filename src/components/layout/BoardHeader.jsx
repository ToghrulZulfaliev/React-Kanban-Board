import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTaskModal from "../task/AddTaskModal";
import useTheme from "../../hooks/useTheme";
import SearchInput from "./SearchInput";
import { setSearch, clearSearch } from "../../components/ui/uiSlice";

export default function BoardHeader() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const dispatch = useDispatch();
  const search = useSelector((state) => state.ui.search);

  return (
    <>
      <div className="mb-6 min-w-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Kanban Board</h1>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full min-w-0 sm:w-[320px]">
            <SearchInput
              value={search}
              onChange={(val) => dispatch(setSearch(val))}
              onClear={() => dispatch(clearSearch())}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white text-sm whitespace-nowrap"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm whitespace-nowrap"
            >
              Add a task
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-md border text-sm bg-white dark:bg-gray-800 dark:text-white whitespace-nowrap"
            >
              Invite
            </button>

            <div className="w-9 h-9 rounded-full bg-gray-300 shrink-0" />
          </div>
        </div>
      </div>

      <AddTaskModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
