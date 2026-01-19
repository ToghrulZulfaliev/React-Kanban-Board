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

  // ✅ Desktop: az tərpənəndə başlayır
  // ✅ Mobile: long-press ilə başlayır (scroll ilə qarışmır)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    })
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

  // ✅ hover effekti: üstündən keçən kimi status dəyişir
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
      autoScroll={{
        // ✅ drag edəndə kənara yaxınlaşanda board özü scroll etsin
        threshold: { x: 0.25, y: 0.25 },
        acceleration: 12,
      }}
    >
      {/* ✅ Mobile: horizontal scroll + snap | md+: grid */}
      <section
        className="
          w-full min-w-0
          overflow-x-auto md:overflow-x-visible
          overflow-y-hidden
          pb-3 md:pb-0
          px-2 md:px-0
          [-webkit-overflow-scrolling:touch]
          scroll-smooth
          snap-x snap-mandatory md:snap-none
          overscroll-x-contain
        "
      >
        <div
          className="
            flex gap-4 w-max
            md:grid md:grid-cols-3 md:w-full
            md:gap-4
          "
        >
          <div className="snap-start">
            <Column title="TO DO" status="todo" tasks={filteredTasks} />
          </div>
          <div className="snap-start">
            <Column title="DOING" status="doing" tasks={filteredTasks} />
          </div>
          <div className="snap-start">
            <Column title="DONE" status="done" tasks={filteredTasks} />
          </div>
        </div>
      </section>
    </DndContext>
  );
}
