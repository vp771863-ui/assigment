import api from "../lib/axios";

export async function login(username, password, signal) {
  const response = await api.post(
    "/auth/login",
    { username, password, expiresInMins: 30 },
    { signal }
  );
  return response.data;
}
