import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../features/tasks/taskSlice";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskCard from "../task/SortableTaskCard";
import EditTaskModal from "../task/EditTaskModal";

export default function Column({ title, status, tasks }) {
  const dispatch = useDispatch();

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  const filtered = tasks.filter((t) => t.status === status);
  const ids = filtered.map((t) => String(t.id));

  const [editTask, setEditTask] = useState(null);

  return (
    <>
      <div
        ref={setNodeRef}
        className={[
          "shrink-0 w-[calc(100vw-32px)] sm:w-[380px] md:w-full",
          "bg-white border border-gray-200 rounded-2xl flex flex-col",
          // ✅ Mobile-də column özü ekran boyu olsun, içi scroll etsin
          "h-[calc(100dvh-170px)] md:h-auto",
          "transition",
          isOver ? "ring-2 ring-blue-400" : "",
        ].join(" ")}
      >
        {/* ✅ BONUS 2: Sticky header */}
        <div
          className="
            sticky top-0 z-10
            p-4 border-b border-gray-100
            flex items-center justify-between
            bg-white/95 backdrop-blur
            rounded-t-2xl
          "
        >
          <h2 className="text-xs font-semibold text-gray-700 tracking-wider">
            {title}
          </h2>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
            {filtered.length}
          </span>
        </div>

        {/* Body: tasks scroll */}
        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden min-w-0">
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
            <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
              Drop here
            </div>
          )}
        </div>
      </div>

      <EditTaskModal
        isOpen={!!editTask}
        task={editTask}
        onClose={() => setEditTask(null)}
      />
    </>
  );
}
