import api from "../lib/axios";

export async function getProducts({ limit, skip, search = "", signal }) {
  const params = { limit, skip };
  const url = search.trim()
    ? "/products/search"
    : "/products";

  if (search.trim()) params.q = search.trim();

  const response = await api.get(url, { params, signal });
  return response.data;
}

export async function getProduct(id, signal) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}

export async function getCategories(signal) {
  const response = await api.get("/products/categories", { signal });
  return response.data;
}

export async function addProduct(product, signal) {
  const response = await api.post("/products/add", product, { signal });
  return response.data;
}

export async function updateProduct(id, product, signal) {
  const response = await api.put(`/products/${id}`, product, { signal });
  return response.data;
}

export async function deleteProduct(id, signal) {
  const response = await api.delete(`/products/${id}`, { signal });
  return response.data;
}
