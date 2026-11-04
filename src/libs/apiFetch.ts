// On the server we call the backend directly; in the browser we go through the /backend rewrite (next.config.ts)
function apiBase() {
  if (typeof window !== "undefined") return "/backend";
  return `${(process.env.BACKEND_URL ?? "http://localhost:5050").replace(/\/$/, "")}/api/v1`;
}

// Backend error messages are in English; show the common ones in Thai
const THAI_ERRORS: [RegExp, string][] = [
  [/Invalid credentials/i, "อีเมลหรือรหัสผ่านไม่ถูกต้อง"],
  [/one appointment per vehicle per day/i, "รถคันนี้มีนัดในวันนี้แล้ว (จองได้ 1 ครั้งต่อรถ 1 คันต่อวัน)"],
  [/overlapping appointment/i, "รถคันนี้มีนัดในช่วงเวลาที่ทับซ้อนกันอยู่แล้ว"],
  [/at most 3 future appointments/i, "มีนัดล่วงหน้าได้สูงสุด 3 นัด"],
  [/cannot be in the past/i, "วันนัดต้องไม่เป็นวันที่ผ่านมาแล้ว"],
  [/Invalid appointment date|appointmentDate/i, "วันที่ไม่ถูกต้อง"],
  [/Start time must use/i, "เวลาไม่ถูกต้อง"],
  [/service ID is required/i, "กรุณาเลือกแพ็กเกจบริการ 1 รายการ"],
  [/not found or inactive/i, "ไม่พบแพ็กเกจบริการ หรือแพ็กเกจนี้ถูกยกเลิกแล้ว"],
  [/Service package not found/i, "ไม่พบแพ็กเกจบริการ"],
  [/Appointment not found/i, "ไม่พบนัดหมาย"],
  [/registration number is required/i, "กรุณากรอกทะเบียนรถ"],
  [/brand and model are required/i, "กรุณากรอกยี่ห้อและรุ่นรถ"],
  [/name and description are required/i, "กรุณากรอกชื่อและรายละเอียดบริการ"],
  [/Estimated duration must be/i, "ระยะเวลาต้องเป็นจำนวนเต็มนาที (อย่างน้อย 1 นาที)"],
  [/Service fee must be/i, "ค่าบริการต้องไม่ติดลบ"],
  [/Too many requests/i, "มีการใช้งานถี่เกินไป กรุณาลองใหม่ภายหลัง"],
  [/User role .* is not authorized|Not authorized to (view|edit|delete)/i, "คุณไม่มีสิทธิ์ทำรายการนี้"],
  [/Not authorized to access this route|User no longer exists/i, "กรุณาเข้าสู่ระบบอีกครั้ง"],
];

export function toThaiError(message: string) {
  return THAI_ERRORS.find(([re]) => re.test(message))?.[1] ?? message;
}

// Calls the backend and throws the backend's error message (in Thai when known) when the request fails
export default async function apiFetch<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      cache: "no-store",
      ...rest,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า backend ทำงานอยู่");
  }

  let json: { success?: boolean; error?: string } | null = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok || !json || json.success === false) {
    throw new Error(toThaiError(json?.error ?? `เกิดข้อผิดพลาด (${response.status})`));
  }
  return json as T;
}
