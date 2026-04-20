export async function fetchCount(amount = 1) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/count?amount=${amount}`
  );

  const data = await response.json();

  return { data: data.value }; 
}
