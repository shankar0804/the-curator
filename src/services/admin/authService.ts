// Simple authentication service for admin dashboard
// Username: shankar, Password: 12345678

const ADMIN_CREDENTIALS = {
    username: 'shankar',
    password: '12345678'
};

const SESSION_KEY = 'admin_session';

export const authService = {
    login(username: string, password: string): boolean {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Store session in localStorage
            const session = {
                username,
                loginTime: new Date().toISOString(),
                isAuthenticated: true
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            return true;
        }
        return false;
    },

    logout(): void {
        localStorage.removeItem(SESSION_KEY);
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;

        const session = localStorage.getItem(SESSION_KEY);
        if (!session) return false;

        try {
            const parsed = JSON.parse(session);
            return parsed.isAuthenticated === true;
        } catch {
            return false;
        }
    },

    getSession() {
        if (typeof window === 'undefined') return null;

        const session = localStorage.getItem(SESSION_KEY);
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    }
};
