import { Suspense, use, useActionState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createUserAction, deleteUserAction } from "./actions";
import { useUsers } from "./use-users";

type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  const [usersPromise, refetchUsers] = useUsers();
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong:{JSON.stringify(e)}{" "}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList usersPromise={usersPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [state, dispatch, isPending] = useActionState(
    createUserAction({ refetchUsers }),
    { email: "" }
  );

  return (
    <form className="flex gap-2" action={dispatch}>
      <input
        name="email"
        type="email"
        className="border p-2 rounded"
        defaultValue={state.email}
        disabled={isPending}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        disabled={isPending}
        type="submit"
      >
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </form>
  );
}

export function UsersList({
  usersPromise,
  refetchUsers,
}: {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(usersPromise);
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  user: User;
  refetchUsers: () => void;
}) {
  const [state, handleDelete, isPending] = useActionState(
    deleteUserAction({ id: user.id, refetchUsers }),
    {}
  );

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <form className="ml-auto">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400"
          disabled={isPending}
          formAction={handleDelete}
        >
          Delete
          {state.error && <div className="text-red-500">{state.error}</div>}
        </button>
      </form>
    </div>
  );
}
