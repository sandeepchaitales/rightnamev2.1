import axios from 'axios';

// In production (deployed), use relative URL so it works on any domain
// In development, use the environment variable for the backend URL
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? '/api' : `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api`;

// Create axios instance with extended timeout for LLM operations
const axiosInstance = axios.create({
    timeout: 300000, // 5 minutes timeout for comprehensive LLM operations
});

export const api = {
    evaluate: async (data) => {
        try {
            console.log('[API] Starting evaluation request to:', `${API_URL}/evaluate`);
            console.log('[API] Request data:', data);
            const response = await axiosInstance.post(`${API_URL}/evaluate`, data);
            console.log('[API] Evaluation successful, response:', response.data);
            return response.data;
        } catch (error) {
            console.error("[API] Evaluation API Error:", error);
            console.error("[API] Error response:", error.response?.data);
            console.error("[API] Error status:", error.response?.status);
            throw error;
        }
    },
    getReport: async (reportId) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/reports/${reportId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error("Get Report API Error:", error);
            throw error;
        }
    },
    status: async () => {
        return axiosInstance.get(`${API_URL}/`);
    }
};
