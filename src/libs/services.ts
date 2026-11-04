import apiFetch from "./apiFetch";

export async function getServices() {
  return apiFetch<ServiceJson>("/services");
}

export async function getService(id: string) {
  return apiFetch<{ success: boolean; data: ServiceItem }>(`/services/${id}`);
}

export async function createService(token: string, input: ServiceInput) {
  return apiFetch<{ success: boolean; data: ServiceItem }>("/services", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function updateService(token: string, id: string, input: Partial<ServiceInput>) {
  return apiFetch<{ success: boolean; data: ServiceItem }>(`/services/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteService(token: string, id: string) {
  return apiFetch<{ success: boolean }>(`/services/${id}`, { method: "DELETE", token });
}
