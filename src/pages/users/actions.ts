import { createUser, deleteUser } from "../../shared/api";

type CreateActionState = {
  error?: string;
  email: string;
};

export function createUserAction({
  refetchUsers,
}: {
  refetchUsers: () => void;
}) {
  return async (
    _: CreateActionState,
    formData: FormData
  ): Promise<CreateActionState> => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return {
        error: "Admin account is not allowed",
        email,
      };
    }

    try {
      await createUser({
        email,
        id: crypto.randomUUID(),
      });

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

export function deleteUserAction({
  id,
  refetchUsers,
}: {
  refetchUsers: () => void;
  id: string;
}) {
  return async (): Promise<DeleteUserActionState> => {
    try {
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
