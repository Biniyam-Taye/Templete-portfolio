const getApiUrl = () => {
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (isLocal) {
        return 'http://127.0.0.1:5050/api';
    }
    return `http://${window.location.hostname}:5050/api`;
};

const API_URL = getApiUrl();

const fetchWithAuth = async (url, options = {}) => {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    const adminKey = localStorage.getItem('admin_secret_key');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${adminKey}`,
        'Content-Type': 'application/json'
    };
    const res = await fetch(url, { ...options, headers });
    
    let data;
    try {
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON. Response text:', text.substring(0, 500));
            throw new Error(`Server returned a non-JSON response (${res.status}). Body starts with: ${text.substring(0, 100)}`);
        }
    } catch (err) {
        throw err;
    }

    if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
};

export const diaryApi = {
    getAll: async () => {
        return fetchWithAuth(`${API_URL}/diary`);
    },
    create: async (data) => {
        return fetchWithAuth(`${API_URL}/diary`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    update: async (id, data) => {
        return fetchWithAuth(`${API_URL}/diary/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return fetchWithAuth(`${API_URL}/diary/${id}`, {
            method: 'DELETE'
        });
    }
};

export const planApi = {
    getAll: async () => {
        return fetchWithAuth(`${API_URL}/plans`);
    },
    create: async (data) => {
        return fetchWithAuth(`${API_URL}/plans`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    update: async (id, data) => {
        return fetchWithAuth(`${API_URL}/plans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return fetchWithAuth(`${API_URL}/plans/${id}`, {
            method: 'DELETE'
        });
    },
    clearAll: async () => {
        return fetchWithAuth(`${API_URL}/plans/clear-all`, {
            method: 'POST'
        });
    }
};

export const plannerCategoryApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/planner-categories`),
    create: async (data) => fetchWithAuth(`${API_URL}/planner-categories`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/planner-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/planner-categories/${id}`, { method: 'DELETE' })
};

export const documentApi = {
    getAll: async () => {
        return fetchWithAuth(`${API_URL}/documents`);
    },
    create: async (data) => {
        return fetchWithAuth(`${API_URL}/documents`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return fetchWithAuth(`${API_URL}/documents/${id}`, {
            method: 'DELETE'
        });
    }
};

export const experimentApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/experiments`),
    create: async (data) => fetchWithAuth(`${API_URL}/experiments`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/experiments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/experiments/${id}`, { method: 'DELETE' })
};

export const movieApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/movies`),
    create: async (data) => fetchWithAuth(`${API_URL}/movies`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/movies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/movies/${id}`, { method: 'DELETE' })
};

export const recipeApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/recipes`),
    create: async (data) => fetchWithAuth(`${API_URL}/recipes`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/recipes/${id}`, { method: 'DELETE' })
};

export const courseApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/courses`),
    create: async (data) => fetchWithAuth(`${API_URL}/courses`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/courses/${id}`, { method: 'DELETE' })
};

export const travelApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/travel`),
    create: async (data) => fetchWithAuth(`${API_URL}/travel`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/travel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/travel/${id}`, { method: 'DELETE' })
};

export const strategyApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/strategy`),
    create: async (data) => fetchWithAuth(`${API_URL}/strategy`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/strategy/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/strategy/${id}`, { method: 'DELETE' })
};

export const libraryApi = {
    getAll: async () => fetchWithAuth(`${API_URL}/library`),
    create: async (data) => fetchWithAuth(`${API_URL}/library`, { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => fetchWithAuth(`${API_URL}/library/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => fetchWithAuth(`${API_URL}/library/${id}`, { method: 'DELETE' })
};

export const binApi = {
    getAll: async () => {
        return fetchWithAuth(`${API_URL}/bin`);
    },
    moveToBin: async (source, data) => {
        return fetchWithAuth(`${API_URL}/bin`, {
            method: 'POST',
            body: JSON.stringify({ source, data })
        });
    },
    restore: async (id) => {
        return fetchWithAuth(`${API_URL}/bin/restore/${id}`, {
            method: 'POST'
        });
    },
    delete: async (id) => {
        return fetchWithAuth(`${API_URL}/bin/${id}`, {
            method: 'DELETE'
        });
    },
    empty: async () => {
        return fetchWithAuth(`${API_URL}/bin/empty`, {
            method: 'POST'
        });
    }
};

export const settingsApi = {
    updatePassword: async (newPassword) => {
        return fetchWithAuth(`${API_URL}/settings/password`, {
            method: 'PUT',
            body: JSON.stringify({ newPassword })
        });
    },
    verify: async () => {
        return fetchWithAuth(`${API_URL}/auth/verify`);
    }
};

export const heroImageApi = {
    get: async (pageKey) => fetchWithAuth(`${API_URL}/hero-images/${pageKey}`),
    update: async (pageKey, imageData) => fetchWithAuth(`${API_URL}/hero-images`, { method: 'POST', body: JSON.stringify({ pageKey, imageData }) }),
    delete: async (pageKey) => fetchWithAuth(`${API_URL}/hero-images/${pageKey}`, { method: 'DELETE' })
};
