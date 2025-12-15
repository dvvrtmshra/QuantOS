const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function api(path: string) {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", url, err);
    throw err;
  }
}
