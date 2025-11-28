export async function api(path: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API failed:", res.status, res.statusText);
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return res.json();
}
