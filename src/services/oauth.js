const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5173/callback";  
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const USER_INFO_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo";

export function redirectToGoogle() {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=email%20profile&include_granted_scopes=true`;
    window.location.href = authUrl;
}

export function getAuthToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

export async function getUserInfo() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(USER_INFO_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        const formattedUsername = data.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

        return {
            username: formattedUsername,
            email: data.email
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function signInWithGoogle() {
    redirectToGoogle();
}
