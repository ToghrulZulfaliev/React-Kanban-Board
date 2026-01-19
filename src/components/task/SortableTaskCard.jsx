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
    data: { type: "task", status: task.status }, // ✅ FIX: hover üçün vacibdir
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
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing select-none"
      >
        <div className="font-semibold text-gray-800">{task.title}</div>

        {!!task.description && (
          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
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
      </div>

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
  );
}
