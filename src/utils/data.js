export function isOverdue(dueDate) {
  if (!dueDate) return false;

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

export function formatDue(dueDate) {
  if (!dueDate) return "";
  return new Date(dueDate).toLocaleDateString();
}
