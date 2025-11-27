export async function api(path: string) {
  const res = await fetch(`http://127.0.0.1:8000${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API failed:", res.status, res.statusText);
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return res.json();
}
