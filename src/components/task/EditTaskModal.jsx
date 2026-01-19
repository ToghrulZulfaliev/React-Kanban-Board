import Modal from "../ui/Modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateTask } from "../../features/tasks/taskSlice";

const schema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string(),
  dueDate: Yup.string(),
  assigneeId: Yup.string(),
});

export default function EditTaskModal({ isOpen, onClose, task }) {
  const dispatch = useDispatch();
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Formik
        enableReinitialize
        initialValues={{
          title: task.title,
          description: task.description,
          dueDate: task.dueDate || "",
          assigneeId: task.assigneeId || "",
          status: task.status,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          dispatch(updateTask({ id: task.id, updates: values }));
          onClose();
        }}
      >
        <Form className="space-y-3">
          <Field name="title" className="w-full border p-2" />
          <Field name="description" as="textarea" className="w-full border p-2" />
          <Field name="dueDate" type="date" className="w-full border p-2" />
          <Field name="status" as="select" className="w-full border p-2">
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </Field>

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Save
          </button>
        </Form>
      </Formik>
    </Modal>
  );
}
