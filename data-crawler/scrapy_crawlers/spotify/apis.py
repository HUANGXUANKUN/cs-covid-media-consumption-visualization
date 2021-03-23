import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotify.constants import SPOTIFY_CLIENT_ID, SPOTIPY_CLIENT_SECRET

auth_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)
