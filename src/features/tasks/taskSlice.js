import { createSlice } from "@reduxjs/toolkit";
import { loadTasks } from "../../utils/storage";

const localTasks = loadTasks();

const initialState = {
  tasks:
    localTasks ??
    [
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
    ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },

    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.tasks.findIndex((t) => t.id === id);
      if (idx === -1) return;
      state.tasks[idx] = { ...state.tasks[idx], ...updates };
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    moveTask: (state, action) => {
  const { activeId, overId, overStatus } = action.payload;

  const activeIndex = state.tasks.findIndex((t) => t.id === activeId);
  if (activeIndex === -1) return;

  // 1) status update
  state.tasks[activeIndex].status = overStatus;

  // 2) əgər column-un özünə drop olunsa (overId = "todo/doing/done")
  // onda sadəcə status dəyişmək kifayətdir
  const isColumn = ["todo", "doing", "done"].includes(overId);
  if (isColumn) return;

  // 3) task-ın üstünə drop olunsa, reorder et
  const overIndex = state.tasks.findIndex((t) => t.id === overId);
  if (overIndex === -1) return;

  const [moved] = state.tasks.splice(activeIndex, 1);

  const newIndex = state.tasks.findIndex((t) => t.id === overId);
  state.tasks.splice(newIndex, 0, moved);
},

  },
});

export const { addTask, updateTask, deleteTask, moveTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
