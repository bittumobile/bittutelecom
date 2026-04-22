const API_URL = process.env.REACT_APP_API_URL;

export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/orders/own/`, {
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/users/own`, {
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/users/${update.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    resolve({ data });
  });
}


