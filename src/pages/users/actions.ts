import { createUser, deleteUser, User } from "../../shared/api";

export type CreateActionState = {
  error?: string;
  email: string;
};

export type CreateUserAction = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createUserAction({
  refetchUsers,
  optimisticCreate,
}: {
  refetchUsers: () => void;
  optimisticCreate: (user: User) => void;
}): CreateUserAction {
  return async (_, formData) => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return {
        error: "Admin account is not allowed",
        email,
      };
    }

    try {
      const user = {
        email,
        id: crypto.randomUUID(),
      };
      optimisticCreate(user);
      await createUser(user);

      refetchUsers();

      return {
        email: "",
      };
    } catch {
      return {
        email,
        error: "Error while creating user",
      };
    }
  };
}

type DeleteUserActionState = {
  error?: string;
};

export type DeleteUserAction = (
  state: DeleteUserActionState,
  formData: FormData
) => Promise<DeleteUserActionState>;

export function deleteUserAction({
  refetchUsers,
  optimisticDelete,
}: {
  refetchUsers: () => void;
  optimisticDelete: (id: string) => void;
}): DeleteUserAction {
  return async (_, formData) => {
    const id = formData.get("id") as string;
    try {
      optimisticDelete(id);
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch {
      return {
        error: "Error while deleting user",
      };
    }
  };
}
