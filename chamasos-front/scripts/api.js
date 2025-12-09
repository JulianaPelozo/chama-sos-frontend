const API_URL = "http://localhost:3000/api";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(err.message || "Erro na requisição");
    }

    return response.json();
}
