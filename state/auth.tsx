import { createContext, PropsWithChildren, use, useState } from "react";

export type Action = "signin" | "signup" | "signout" | "recovery";

type AuthContext = {
  action: Action | null;
};

const AuthContext = createContext<AuthContext>({
  action: null,
});

type AuthControlContext = {
  setAction: (action: Action | null) => unknown;
};

const AuthControlContext = createContext<AuthControlContext>({
  setAction: () => false,
});

export function Provider({ children }: PropsWithChildren) {
  const [action, setAction] = useState<Action | null>(null);

  const context = {
    action,
  };

  const controls = {
    setAction,
  };

  return (
    <AuthContext value={context}>
      <AuthControlContext value={controls}>{children}</AuthControlContext>
    </AuthContext>
  );
}

export function useAuth() {
  return use(AuthContext);
}

export function useAuthControls() {
  return use(AuthControlContext);
}
