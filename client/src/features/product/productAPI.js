const API_URL = process.env.REACT_APP_API_URL;

function buildProductFormData(product) {
  const formData = new FormData();
  const payload = { ...product };
  const thumbnailFile = payload.thumbnailFile;
  const imageFiles = payload.imageFiles || [];

  delete payload.thumbnailFile;
  delete payload.imageFiles;

  formData.append("productData", JSON.stringify(payload));

  if (thumbnailFile) {
    formData.append("thumbnail", thumbnailFile);
  }

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    resolve({ data });
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/products/`, {
      method: "POST",
      body: buildProductFormData(product),
      credentials: "include",
    });
    const data = await parseResponse(response);
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/products/${update.id}`, {
      method: "PATCH",
      body: buildProductFormData(update),
      credentials: "include",
    });
    const data = await parseResponse(response);
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  let queryString = "";

  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += `${key}=${categoryValues}&`;
    }
  }

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  if (admin) {
    queryString += `admin=true`;
  }

  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/products?${queryString}`);
    const data = await response.json();
    const totalItems = response.headers.get("X-Total-Count");

    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_URL}/brands`);
    const data = await response.json();
    resolve({ data });
  });
}
