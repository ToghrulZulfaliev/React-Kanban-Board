import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/taskSlice";
import uiReducer from "../components//ui/uiSlice";
import { saveTasks } from "../utils/storage";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
});

store.subscribe(() => {
  const tasks = store.getState().tasks.tasks;
  saveTasks(tasks);
});
