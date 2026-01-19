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

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks) || [];

  // ✅ Search panel (yalnız search)
  const [query, setQuery] = useState("");

  const lastMovedToStatusRef = useRef(null);

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
      const tags = Array.isArray(t.tags) ? t.tags.join(" ").toLowerCase() : "";
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/45">
        {/* glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative">
          {/* Top bar: Title + Search */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Kanban Board
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Drag & drop • Premium UI
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-[360px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
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
  );
}
