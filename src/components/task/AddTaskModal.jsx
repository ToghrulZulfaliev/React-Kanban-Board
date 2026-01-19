import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addTask } from "../../features/tasks/taskSlice";
import Modal from "../ui/Modal";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().min(5, "Min 5 characters"),
});

export default function AddTaskModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Add new task</h2>

      <Formik
        initialValues={{
          title: "",
          description: "",
          status: "todo",
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          dispatch(
            addTask({
              id: Date.now().toString(),
              ...values,
              tags: [],
              subtasks: [],
              createdAt: Date.now(),
            })
          );
          onClose();
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="title"
                placeholder="Task title"
                className="w-full border rounded-md p-2"
              />
              {errors.title && touched.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <Field
                name="description"
                as="textarea"
                placeholder="Description"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <Field
                name="status"
                as="select"
                className="w-full border rounded-md p-2"
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </Field>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Add task
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
