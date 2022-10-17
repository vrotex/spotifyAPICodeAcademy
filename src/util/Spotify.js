let accessToken;
const clientId = "320568daf07f4dba9e7970da50715035";
const redirectUri = "http://vrotex.surge.sh";


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        //check for an accessToken
        const accessTokenMatch = window.location.href.match(/accessToken=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //Use the following code to help you wipe the access token and URL parameters
            window.setTimeout(() => accessToken = "", expiresIn * 1000)
            window.history.pushState("Access Token", null, '/')
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => { return response.json }).then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return []
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                }))
            }
            )
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        }
        let userId;
        return fetch("https://api.spotify.com/v1/me",
            { headers: headers }
        ).then(response => response.json()).then(responseJSON => {
            userId = responseJSON.id;
            return fetch(`/v1/users/${userId}/playlists`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                    })
                }).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`/v1/users/${userId}/playlists/${playlistId}/tracks`,
                        {
                            headers: headers, method: 'POST', body: JSON.stringify({
                                uris: trackUris,
                            })
                        })
                })
        })
    }
}
export default Spotify;