import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import Column from "./Column";
import { moveTask } from "../../features/tasks/taskSlice";

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const search = useSelector((state) => state.ui.search).toLowerCase().trim();

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      const tags = (t.tags || []).join(" ").toLowerCase();
      return title.includes(search) || desc.includes(search) || tags.includes(search);
    });
  }, [tasks, search]);

  const getTaskById = (id) => tasks.find((t) => String(t.id) === String(id));

  const lastMovedToStatusRef = useRef(null);

  // ✅ scroll container ref
  const boardRef = useRef(null);

  // ✅ drag state
  const [dragging, setDragging] = useState(false);

  // ✅ pointer X ref (barmağın/mouse-un X koordinatı)
  const pointerXRef = useRef(null);

  // ✅ sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

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
    setDragging(false);
    pointerXRef.current = null;
  }

  // ✅ 1) Drag zamanı pointer (touch/mouse) koordinatını oxu
  useEffect(() => {
    if (!dragging) return;

    const onTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      pointerXRef.current = e.touches[0].clientX;
    };

    const onMouseMove = (e) => {
      pointerXRef.current = e.clientX;
    };

    // passive true saxlayırıq ki, dnd qarışmasın (sadəcə oxuyuruq)
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [dragging]);

  // ✅ 2) RAF loop: pointer kənara yaxınlaşanda container-i scroll elə
  useEffect(() => {
    if (!dragging) return;

    let raf = 0;

    const tick = () => {
      const container = boardRef.current;
      const x = pointerXRef.current;

      if (container && typeof x === "number") {
        const rect = container.getBoundingClientRect();

        const EDGE = 70;   // kənar zonası
        const SPEED = 18;  // scroll sürəti

        const nearLeft = x < rect.left + EDGE;
        const nearRight = x > rect.right - EDGE;

        if (nearLeft) container.scrollLeft -= SPEED;
        if (nearRight) container.scrollLeft += SPEED;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* ✅ Mobile: horizontal scroll + snap | drag zamanı snap OFF */}
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
