//Spotify API credentials
const clientId = '3406be91c64d448fb6da8561cf1e3f3a';
const clientSecret = '0355df53660b47c09f11e68981b06280';

//encode the credentials
const base64Credentials = btoa(`${clientId}:${clientSecret}`);

// // Spotify API endpoints
const tokenUrl = 'https://accounts.spotify.com/api/token';


async function getAccessToken() {// use client id and client secret to get access token to be able to access spotify data
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}