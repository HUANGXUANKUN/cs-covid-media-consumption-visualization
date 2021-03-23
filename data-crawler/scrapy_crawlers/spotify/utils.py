from datetime import datetime, timedelta
from spotify.constants import DATE_FORMATTER

def get_next_date_from(date_string):
    date = datetime.strptime(date_string, DATE_FORMATTER)
    return datetime.strftime(date + timedelta(days=1), DATE_FORMATTER)
