async function getArtistBox () {// Get the name of the artist from the input text box
    var boxText = document.getElementById("artist-text");
    var textValue = boxText.value
    return textValue;
}

async function getArtistID() {// GET ARTIST ID
    const accessToken = await getAccessToken();
    const artistName = await getArtistBox();

    if (!artistName) {
        console.error('Artist name is empty.');
        return null;
    }

    const artistSearchUrl = `https://api.spotify.com/v1/search?q=${artistName}&type=artist&locale=en-US%2Cen%3Bq%3D0.9&offset=0&limit=20`;

    try {
        const response = await fetch(artistSearchUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
         for (i = 0; i < data.artists.items.length; ++i) {
             if (data.artists.items[i].name == artistName) {
                 return data.artists.items[i].id;
             }
         }
    } catch (error) {
        console.error('Error getting artist ID:', error);
        throw error;
    }
}


async function getTopTracks() {//GET TOP TRACKS
    try {
        const artistId = await getArtistID();
        if (!artistId) {
            console.error('No artist ID available.');
            return;
        }

        const accessToken = await getAccessToken();
        const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;

        const response = await fetch(topTracksUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const topTracks = [];
        console.log('Top Tracks:');
        for (i = 0; i < data.tracks.length; ++i) {
            topTracks.push(data.tracks[i].name);
        }
        return topTracks;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
    }
}
async function getTopAlbums() {//GET TOP ALBUMS
    try {
        const artistId = await getArtistID();
        const accessToken = await getAccessToken();
        const topAlbumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;
        const response = await fetch(topAlbumsUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        const topAlbums = [];

        for (let i = 0; i < 10; ++i) {
            topAlbums.push(data.items[i].name);
        }
        return topAlbums;
    } catch (error) {
        console.error("Error happened:", error);
    }
}

//COLLECT ALL INFO

async function showInfo() {
    const artistName = await getArtistBox();
    document.getElementById('artist-result').innerHTML = artistName;

    //tracks -------------------------------------------
    const topTracks = await getTopTracks();
    document.getElementById('tracks-title').innerHTML = "Top Tracks";
    topTracksList = document.getElementById("top-tracks");
    clearList("tracks");

    for (let i = 0; i < topTracks.length; ++i) {
        const tracklistItem = document.createElement('li');
        tracklistItem.textContent = topTracks[i];
        topTracksList.appendChild(tracklistItem);
    }


    //albums ------------------------------------------
    const topAlbums = await getTopAlbums();
    document.getElementById('albums-title').innerHTML = "Top Albums";
    topAlbumsList = document.getElementById("top-albums");
    clearList("albums");

    for (let i = 0; i < topAlbums.length; ++i) {
        const albumlistItem = document.createElement('li');
        albumlistItem.textContent = topAlbums[i];
        topAlbumsList.appendChild(albumlistItem);
    }

}

//ERASE OLD LIST
function clearList(listType) {
    const listU = document.getElementById(`top-${listType}`);
    while (listU.firstChild) {
        listU.removeChild(listU.firstChild);
    }
}
//GET DATA FROM TEXTBOX ON WELCOME PAGE
document.getElementById("get-artist-button").addEventListener("click", async () => {
    
     const artistName = await getArtistBox();
     

     if (artistName) {
         const artistInfo = await showInfo();
     }
     else {
         console.error("no name");
     }
 });


 //Artist name animation
document.addEventListener('DOMContentLoaded', function () {
    const artistResult = document.getElementById('artist-result');
    const getArtistButton = document.getElementById('get-artist-button');

    getArtistButton.addEventListener('click', function () {
        artistResult.classList.add('fade-in');
        artistResult.addEventListener('animationend', function () {
            artistResult.classList.remove('fade-in');
        });
    });
});
