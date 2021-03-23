import scrapy


class ChartItem(scrapy.Item):
    track_id = scrapy.Field()
    track_name = scrapy.Field()
    artists = scrapy.Field()
    position = scrapy.Field()
    streams_count = scrapy.Field()
    region_key = scrapy.Field()
    date = scrapy.Field()
    audio_features = scrapy.Field()
