import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useRef, useState } from "react";
import Column from "./Column";
import { moveTask } from "../../features/tasks/taskSlice";

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const search = useSelector((state) => state.ui.search).toLowerCase().trim();

  const lastMovedToStatusRef = useRef(null);

  // ✅ board scroll container ref
  const boardRef = useRef(null);

  // ✅ drag zamanı snap söndürmək üçün
  const [dragging, setDragging] = useState(false);

  // ✅ Desktop: distance | Mobile: long press
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
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
    setDragging(true);
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

  // ✅ 100% işləyən horizontal edge auto-scroll
  function handleDragMove(event) {
    const container = boardRef.current;
    if (!container) return;

    const cRect = container.getBoundingClientRect();

    // active rect (viewport-a görə)
    const aRect =
      event.active?.rect?.current?.translated ||
      event.active?.rect?.current?.initial;

    if (!aRect) return;

    const EDGE = 70; // kənara nə qədər yaxınlaşanda scroll başlasın
    const SPEED = 18; // scroll sürəti

    // Drag elementinin sağ/solu container-in kənarına yaxınlaşanda scroll et
    const nearLeft = aRect.left < cRect.left + EDGE;
    const nearRight = aRect.right > cRect.right - EDGE;

    if (nearLeft) container.scrollLeft -= SPEED;
    if (nearRight) container.scrollLeft += SPEED;
  }

  function handleDragEnd() {
    lastMovedToStatusRef.current = null;
    setDragging(false);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {/* ✅ Mobile: horizontal scroll + snap | drag zamanı snap söndürülür */}
      <section
        ref={boardRef}
        className={`
          w-full min-w-0
          overflow-x-auto md:overflow-x-visible
          overflow-y-hidden
          pb-3 md:pb-0
          px-2 md:px-0
          [-webkit-overflow-scrolling:touch]
          scroll-smooth
          ${dragging ? "snap-none" : "snap-x snap-mandatory md:snap-none"}
          overscroll-x-contain
        `}
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
