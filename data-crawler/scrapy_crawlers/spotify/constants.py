import itertools
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

REGION_SELECT_VALUES = ["global", "us", "gb", "ad", "ae", "ar", "at", "au", "be", "bg", "bo", "br", "ca", "ch", "cl",
                        "co", "cr", "cy", "cz", "de", "dk", "do", "ec", "ee", "eg", "es", "fi", "fr", "gr", "gt", "hk",
                        "hn", "hu", "id", "ie", "il", "in", "is", "it", "jp", "kr", "lt", "lu", "lv", "ma", "mx", "my",
                        "ni", "nl", "no", "nz", "pa", "pe", "ph", "pl", "pt", "py", "ro", "ru", "sa", "se", "sg", "sk",
                        "sv", "th", "tr", "tw", "ua", "uy", "vn", "za"]

START_DATE = datetime(2020, 1, 1)
DAYS_LENGTH = 366
DATE_FORMATTER = "%Y-%m-%d"
SELECT_TOP = 10

CHART_URL_PREFIX = "https://spotifycharts.com/regional"
CHART_URLS = [f"{CHART_URL_PREFIX}/{region}/daily/{date}" for region, date in
              itertools.product(REGION_SELECT_VALUES, [datetime.strftime(START_DATE, DATE_FORMATTER)])]

AUDIO_FEATURE_URL_PREFIX = "https://api.spotify.com/v1/audio-features"

SPOTIFY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID", None)
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET", None)
