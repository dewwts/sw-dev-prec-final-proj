import apiFetch from "./apiFetch";

export async function getAppointments(token: string) {
  return apiFetch<AppointmentJson>("/appointments", { token });
}

export async function getAppointment(token: string, id: string) {
  return apiFetch<{ success: boolean; data: AppointmentItem }>(`/appointments/${id}`, { token });
}

export async function createAppointment(token: string, input: AppointmentInput) {
  return apiFetch<{ success: boolean; data: AppointmentItem }>("/appointments", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function updateAppointment(token: string, id: string, input: Partial<AppointmentInput>) {
  return apiFetch<{ success: boolean; data: AppointmentItem }>(`/appointments/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteAppointment(token: string, id: string) {
  return apiFetch<{ success: boolean }>(`/appointments/${id}`, { method: "DELETE", token });
}
