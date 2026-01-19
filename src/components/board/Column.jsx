import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../features/tasks/taskSlice";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskCard from "../task/SortableTaskCard";
import EditTaskModal from "../task/EditTaskModal";

const styles = {
  todo: {
    pill: "bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-900/60",
    bar: "bg-gradient-to-r from-indigo-500 to-violet-500",
  },
  doing: {
    pill: "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-300 dark:border-amber-900/60",
    bar: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  done: {
    pill: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900/60",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
};

export default function Column({ title, status, tasks }) {
  const dispatch = useDispatch();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filtered = safeTasks.filter((t) => t.status === status);
  const ids = filtered.map((t) => String(t.id));

  const [editTask, setEditTask] = useState(null);

  const s = styles[status] ?? styles.todo;

  return (
    <>
      <div
        ref={setNodeRef}
        className={[
          "relative w-full overflow-hidden rounded-2xl border",
          "border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur",
          "dark:border-zinc-800/70 dark:bg-zinc-950/35",
          "transition-all duration-200",
          isOver ? "ring-2 ring-indigo-400/60 dark:ring-indigo-500/30" : "hover:shadow-md",
        ].join(" ")}
      >
        <div className={`h-1 w-full ${s.bar}`} />

        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-200/60 bg-white/80 p-4 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-700 dark:text-zinc-200">
            {title}
          </h3>

          <span className={["text-[11px] px-2 py-1 rounded-full border", s.pill].join(" ")}>
            {filtered.length}
          </span>
        </div>

        <div className="p-4 max-h-[calc(100dvh-260px)] md:max-h-none overflow-y-auto">
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filtered.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditTask}
                  onDelete={(id) => dispatch(deleteTask(id))}
                />
              ))}
            </div>
          </SortableContext>

          {filtered.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-200/70 p-6 text-center text-sm text-zinc-400 dark:border-zinc-800/70 dark:text-zinc-500">
              Drop here
            </div>
          )}
        </div>
      </div>

      <EditTaskModal isOpen={!!editTask} task={editTask} onClose={() => setEditTask(null)} />
    </>
  );
}
