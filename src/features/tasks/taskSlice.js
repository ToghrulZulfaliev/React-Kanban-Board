import { createSlice } from "@reduxjs/toolkit";
import { loadTasks } from "../../utils/storage";

// loadTasks nə qaytarırsa qaytarsın, biz array edirik:
const localRaw = loadTasks();
const localTasks = Array.isArray(localRaw) ? localRaw : null;

const fallbackTasks = [
  {
    id: "1",
    title: "Design User Interface",
    description: "Create wireframes...",
    status: "todo",
    tags: ["Design"],
    subtasks: [],
    dueDate: "2025-12-30",
    assigneeId: "u1",
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Design a sign up page",
    description: "Create the sign up screen UI",
    status: "doing",
    tags: ["Design"],
    subtasks: [],
    dueDate: "2025-12-20",
    assigneeId: "u2",
    createdAt: Date.now(),
  },
  {
    id: "3",
    title: "Research Target Audience",
    description: "Gather insights about potential users",
    status: "done",
    tags: ["Research"],
    subtasks: [],
    dueDate: "2025-12-10",
    assigneeId: "u3",
    createdAt: Date.now(),
  },
];

const initialState = {
  tasks: localTasks ?? fallbackTasks,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      // guard
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks.push(action.payload);
    },

    updateTask: (state, action) => {
      const { id, updates } = action.payload || {};
      if (!Array.isArray(state.tasks)) state.tasks = [];

      const idx = state.tasks.findIndex((t) => String(t.id) === String(id));
      if (idx === -1) return;

      state.tasks[idx] = { ...state.tasks[idx], ...updates };
    },

    deleteTask: (state, action) => {
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks = state.tasks.filter((t) => String(t.id) !== String(action.payload));
    },

    moveTask: (state, action) => {
      if (!Array.isArray(state.tasks)) state.tasks = [];

      const { activeId, overId, overStatus } = action.payload || {};

      const activeIndex = state.tasks.findIndex((t) => String(t.id) === String(activeId));
      if (activeIndex === -1) return;

      // 1) status update
      state.tasks[activeIndex].status = overStatus;

      // 2) column drop olunsa reorder lazım deyil
      const isColumn = ["todo", "doing", "done"].includes(String(overId));
      if (isColumn) return;

      // 3) task üstünə drop olunsa reorder
      const overIndex = state.tasks.findIndex((t) => String(t.id) === String(overId));
      if (overIndex === -1) return;

      const [moved] = state.tasks.splice(activeIndex, 1);

      // yeni index tap (splice-dan sonra overId yeri dəyişə bilər)
      const newIndex = state.tasks.findIndex((t) => String(t.id) === String(overId));
      const insertIndex = newIndex === -1 ? state.tasks.length : newIndex;
      state.tasks.splice(insertIndex, 0, moved);
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask } = tasksSlice.actions;

export default tasksSlice.reducer;
