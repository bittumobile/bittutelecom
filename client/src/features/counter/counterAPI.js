export async function fetchCount(amount = 1) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/count?amount=${amount}`,
    {
      credentials: "include",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch count");
  }

  return { data: data.value };
}