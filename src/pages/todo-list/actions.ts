import { createTask, deleteTask, Task } from "../../shared/api";

export type CreateActionState = {
  error?: string;
  title: string;
};

export type CreateTaskAction = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createTaskAction({
  refetchTasks,
  userId,
}: {
  userId: string;
  refetchTasks: () => void;
}): CreateTaskAction {
  return async (_, formData) => {
    const title = formData.get("title") as string;

    try {
      const task: Task = {
        createdAt: Date.now(),
        done: false,
        userId,
        title,
        id: crypto.randomUUID(),
      };
      await createTask(task);

      refetchTasks();

      return {
        title: "",
      };
    } catch {
      return {
        title,
        error: "Error while creating task",
      };
    }
  };
}

type DeleteTaskActionState = {
  error?: string;
};

export type DeleteTaskAction = (
  state: DeleteTaskActionState,
  formData: FormData
) => Promise<DeleteTaskActionState>;

export function deleteTaskAction({
  refetchTasks,
}: {
  refetchTasks: () => void;
}): DeleteTaskAction {
  return async (_, formData) => {
    const id = formData.get("id") as string;
    try {
      await deleteTask(id);
      refetchTasks();
      return {};
    } catch (e) {
      console.log(e);
      return {
        error: "Error while deleting task",
      };
    }
  };
}
