import { useEffect, useState } from "react";

export type Role = "Super Admin" | "Admin" | "Agent";

export type TeamUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  permissions: string[];
  createdAt: string;
};

const ALL_PERMS = [
  "executive-dashboard",
  "inbox",
  "crm",
  "pipeline",
  "ai-summary",
  "campaigns",
  "tickets",
  "automations",
  "settings",
];

const SEED: TeamUser[] = [
  {
    id: "u_owner",
    name: "Mohammed Alotaibi",
    email: "owner@leadflow.app",
    password: "demo1234",
    role: "Super Admin",
    permissions: ALL_PERMS,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "u_partner_braah",
    name: "Braah Aleissa",
    email: "braah45aleissa@gmail.com",
    password: "Bb12345",
    role: "Super Admin",
    permissions: ALL_PERMS,
    createdAt: "2026-06-08T00:00:00Z",
  },
];

const USERS_KEY = "lf_team_users_v1";
const SESSION_KEY = "lf_session_v1";

function readUsers(): TeamUser[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as TeamUser[];
    // Ensure partner exists (idempotent seed)
    if (!parsed.some((u) => u.email === "braah45aleissa@gmail.com")) {
      const merged = [...parsed, SEED[1]];
      localStorage.setItem(USERS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return SEED;
  }
}

function writeUsers(users: TeamUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("lf-auth-change"));
}

export function getUsers(): TeamUser[] {
  return readUsers();
}

export function getSession(): TeamUser | null {
  if (typeof window === "undefined") return null;
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return readUsers().find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): TeamUser | null {
  const users = readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return null;
  localStorage.setItem(SESSION_KEY, user.id);
  window.dispatchEvent(new Event("lf-auth-change"));
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("lf-auth-change"));
}

export function addUser(input: Omit<TeamUser, "id" | "createdAt">): TeamUser {
  const users = readUsers();
  const u: TeamUser = {
    ...input,
    id: `u_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, u]);
  return u;
}

export function useAuth() {
  const [user, setUser] = useState<TeamUser | null>(null);
  const [users, setUsersState] = useState<TeamUser[]>([]);

  useEffect(() => {
    const sync = () => {
      setUser(getSession());
      setUsersState(getUsers());
    };
    sync();
    window.addEventListener("lf-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lf-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, users };
}

export const ALL_PERMISSIONS = ALL_PERMS;
