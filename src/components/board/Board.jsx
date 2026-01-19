import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useRef } from "react";
import Column from "./Column";
import { moveTask } from "../../features/tasks/taskSlice";

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const search = useSelector((state) => state.ui.search).toLowerCase().trim();

  const lastMovedToStatusRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  );

  const filteredTasks = !search
    ? tasks
    : tasks.filter((t) => {
        const title = (t.title || "").toLowerCase();
        const desc = (t.description || "").toLowerCase();
        const tags = (t.tags || []).join(" ").toLowerCase();
        return title.includes(search) || desc.includes(search) || tags.includes(search);
      });

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
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/40">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Kanban Board
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Drag & drop • Responsive • Smooth UI
              </p>
            </div>
          </div>

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
