import apiFetch from "./apiFetch";

type AuthResponse = {
  success: boolean;
  data: { id: string; name: string; email: string; role: "admin" | "member"; token: string };
};

export async function userLogIn(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function userRegister(input: RegisterInput) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function userLogOut(token: string) {
  return apiFetch<{ success: boolean }>("/auth/logout", { method: "GET", token });
}

export async function getUserProfile(token: string) {
  return apiFetch<{ success: boolean; data: AppointmentUser & { createdAt: string } }>("/auth/me", { token });
}
