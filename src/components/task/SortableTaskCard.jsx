import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: String(task.id),
      data: { type: "task", status: task.status }, // ✅ vacib
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border bg-white p-3">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing select-none">
        <div className="font-semibold">{task.title}</div>
        {task.description ? <div className="text-sm opacity-70 mt-1">{task.description}</div> : null}
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => onEdit?.(task)} className="text-xs px-2 py-1 border rounded">Edit</button>
        <button onClick={() => onDelete?.(task.id)} className="text-xs px-2 py-1 border rounded">Delete</button>
      </div>
    </div>
  );
}
