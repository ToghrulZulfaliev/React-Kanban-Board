import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useMemo, useRef, useState } from "react";
import Column from "./Column";
import { moveTask } from "../../features/tasks/taskSlice";

/** Sadə iconlar (extra library tələb etmir) */
function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mini Add Task Modal (portfolio üçün yetərincə clean) */
function AddTaskModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  if (!open) return null;

  const canCreate = title.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-xl dark:border-zinc-800/60 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Add Task
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Quick create for demo / portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200/70 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800/70 dark:text-zinc-200 dark:hover:bg-zinc-900/50"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Kanban UI"
              className="
                mt-1 w-full rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm
                outline-none transition
                focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50
                dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50
                dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500/30
              "
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
              rows={3}
              className="
                mt-1 w-full rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm
                outline-none transition
                focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50
                dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50
                dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500/30
              "
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                mt-1 w-full rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm
                outline-none transition
                focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50
                dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50
                dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500/30
              "
            >
              <option value="todo">TO DO</option>
              <option value="doing">DOING</option>
              <option value="done">DONE</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200/70 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800/70 dark:text-zinc-200 dark:hover:bg-zinc-900/50"
            >
              Cancel
            </button>
            <button
              disabled={!canCreate}
              onClick={() => {
                onCreate({ title, description, status });
                setTitle("");
                setDescription("");
                setStatus("todo");
                onClose();
              }}
              className="
                rounded-xl px-4 py-2 text-sm font-medium text-white
                bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500
                shadow-sm transition
                hover:opacity-95 active:scale-[0.99]
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                dark:focus:ring-indigo-500/30
              "
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  // Əgər sən search-i redux ui slice-dan idarə edirdinsə, saxla:
  // const reduxSearch = useSelector((state) => state.ui.search)
  // Mən burada portfolio üçün local search verdim:
  const [query, setQuery] = useState("");

  const lastMovedToStatusRef = useRef(null);

  const [addOpen, setAddOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  );

  const filteredTasks = useMemo(() => {
    const s = query.toLowerCase().trim();
    if (!s) return tasks;
    return tasks.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      const tags = (t.tags || []).join(" ").toLowerCase();
      return title.includes(s) || desc.includes(s) || tags.includes(s);
    });
  }, [tasks, query]);

  const getTaskById = (id) => tasks.find((t) => String(t.id) === String(id));

  function getOverStatus(over) {
    if (!over) return null;
    const type = over.data?.current?.type;
    if (type === "column") return over.data?.current?.status;
    if (type === "task") return over.data?.current?.status;

    const overId = String(over.id);
    if (["todo", "doing", "done"].includes(overId)) return overId;

    const overTask = getTaskById(overId);
    return overTask?.status ?? null;
  }

  function handleDragStart() {
    lastMovedToStatusRef.current = null;
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const activeTask = getTaskById(activeId);
    if (!activeTask) return;

    const targetStatus = getOverStatus(over);
    if (!targetStatus) return;

    if (activeTask.status === targetStatus) return;
    if (lastMovedToStatusRef.current === targetStatus) return;

    lastMovedToStatusRef.current = targetStatus;

    dispatch(
      moveTask({
        activeId,
        overId: String(over.id),
        overStatus: targetStatus,
      })
    );
  }

  function handleDragEnd() {
    lastMovedToStatusRef.current = null;
  }

  // ⚠️ Burada real add task üçün sənin slice-ına action lazımdır (addTask).
  // Mən indi demo üçün sadəcə alert qoyuram. Səndə addTask action varsa, mən deyəcəyəm necə çağırmaq.
  function handleCreateTask(payload) {
    // TODO: dispatch(addTask(payload))
    console.log("Create task:", payload);
    alert("AddTask: payload console.log olundu. (addTask action bağlansa real işləyəcək)");
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/40">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative">
            {/* Top bar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Kanban Board
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Drag & drop • Responsive • Premium UI
                </p>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 sm:w-[320px]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                    <SearchIcon />
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tasks (title, tags, description)…"
                    className="
                      w-full rounded-xl border border-zinc-200/70 bg-white/80
                      pl-10 pr-3 py-2 text-sm text-zinc-900
                      outline-none transition
                      focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50
                      dark:border-zinc-800/70 dark:bg-zinc-950/50 dark:text-zinc-50
                      dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500/30
                    "
                  />
                </div>

                {/* Add Task */}
                <button
                  onClick={() => setAddOpen(true)}
                  className="
                    inline-flex items-center gap-2
                    rounded-xl px-4 py-2 text-sm font-medium text-white
                    bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500
                    shadow-sm transition
                    hover:opacity-95 active:scale-[0.99]
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                    dark:focus:ring-indigo-500/30
                    whitespace-nowrap
                  "
                >
                  <PlusIcon />
                  Add Task
                </button>
              </div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Column title="TO DO" status="todo" tasks={filteredTasks} />
              <Column title="DOING" status="doing" tasks={filteredTasks} />
              <Column title="DONE" status="done" tasks={filteredTasks} />
            </div>
          </div>
        </section>
      </DndContext>

      <AddTaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreateTask}
      />
    </>
  );
}
