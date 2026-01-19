import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
    data: { type: "task", status: task.status }, // ✅ vacib
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-gray-200 bg-white p-3"
    >
      <div className="flex items-start gap-3">
        {/* ✅ DRAG HANDLE (mobile üçün ən stabil yol) */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="
            mt-1 shrink-0
            cursor-grab active:cursor-grabbing
            rounded-md border border-gray-200
            bg-gray-50
            px-2 py-1 text-xs
            select-none
            touch-none
          "
          aria-label="Drag task"
          title="Drag"
        >
          ⠿
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-800 break-words">
            {task.title}
          </div>

          {!!task.description && (
            <div className="text-sm text-gray-500 mt-1 break-words">
              {task.description}
            </div>
          )}

          {!!task.tags?.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-full border bg-gray-50 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit?.(task)}
              className="text-xs px-2 py-1 border rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="text-xs px-2 py-1 border rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
