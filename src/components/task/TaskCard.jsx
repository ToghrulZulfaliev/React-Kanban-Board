import Avatar from "../ui/Avatar";
import { USERS } from "../../data/users";
import { isOverdue, formatDue } from "../../utils/data";

export default function TaskCard({ task, onEdit, onDelete, dragHandleProps }) {
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm transition
      ${overdue ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`}
    >
      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab text-gray-400 mt-1 select-none"
          >
            ⠿
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-300">
              {task.description}
            </p>

            {task.dueDate && (
              <p
                className={`text-xs mt-1 ${
                  overdue ? "text-red-600" : "text-gray-400"
                }`}
              >
                Due: {formatDue(task.dueDate)}
                {overdue && " • Overdue"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {assignee && <Avatar initials={assignee.initials} />}

          <button
            onClick={() => onEdit(task)}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs border px-2 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs border px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
