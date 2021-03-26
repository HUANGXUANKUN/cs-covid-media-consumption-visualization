import scrapy


class ChartItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    artists = scrapy.Field()
    position = scrapy.Field()
    streams_count = scrapy.Field()
    region_key = scrapy.Field()
    date = scrapy.Field()
    audio_features = scrapy.Field()
    duration = scrapy.Field()
    release_date = scrapy.Field()
