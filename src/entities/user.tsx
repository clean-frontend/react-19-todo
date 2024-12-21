import { createContext, startTransition, use, useState } from "react";
import { User, fetchUsers } from "../shared/api";

type UserContextType = {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
};

const UsersContext = createContext<UserContextType | null>(null);

const defaultUsersPromise = fetchUsers();

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <UsersContext value={{ usersPromise, refetchUsers }}>
      {children}
    </UsersContext>
  );
}

export function useUsersGlobal() {
  const context = use(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}
