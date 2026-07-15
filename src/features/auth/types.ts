export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: "pending" | "approved" | "suspended" | "deleted";
  image?: string | null;
};

export type Session = {
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  image?: string;
};
