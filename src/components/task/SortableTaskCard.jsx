import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: String(task.id),
      data: { type: "task", status: task.status },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group rounded-xl border p-3",
        "border-zinc-200/70 bg-white/80 backdrop-blur",
        "dark:border-zinc-800/70 dark:bg-zinc-950/50",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        isDragging ? "shadow-lg scale-[1.02] ring-2 ring-indigo-400/50" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={[
            "mt-0.5 shrink-0 select-none touch-none",
            "rounded-md border border-zinc-200/70 bg-zinc-50 px-2 py-1 text-xs",
            "text-zinc-600 hover:text-zinc-900",
            "dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:text-zinc-50",
            "cursor-grab active:cursor-grabbing transition",
          ].join(" ")}
          aria-label="Drag"
          title="Drag"
        >
          ⠿
        </button>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 break-words">
            {task.title}
          </h4>

          {!!task.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 break-words">
              {task.description}
            </p>
          )}

          {!!task.tags?.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] rounded-full border border-zinc-200/70 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2 opacity-90">
            <button
              onClick={() => onEdit?.(task)}
              className="text-xs px-2 py-1 rounded-md border border-zinc-200/70 hover:bg-zinc-50 transition dark:border-zinc-800/70 dark:hover:bg-zinc-900/40"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="text-xs px-2 py-1 rounded-md border border-zinc-200/70 hover:bg-zinc-50 transition dark:border-zinc-800/70 dark:hover:bg-zinc-900/40"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
