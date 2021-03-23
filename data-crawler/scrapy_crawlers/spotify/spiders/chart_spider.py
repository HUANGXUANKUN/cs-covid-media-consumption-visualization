import scrapy
from itemloaders.processors import TakeFirst
from scrapy.loader import ItemLoader
from spotify.constants import CHART_URLS, DAYS_LENGTH, SELECT_TOP
from spotify.utils import get_next_date_from
from spotify.apis import sp as spotify
from spotify.items import ChartItem


class ChartSpider(scrapy.Spider):
    name = "chart"
    start_urls = CHART_URLS

    def parse(self, response, **kwargs):
        url_split = response.url.split("/")
        region = url_split[-3]
        date_string = url_split[-1]
        self.logger.info(f"Loading chart data for region {region} dated {date_string}: {response.url}")

        loaders = []
        track_ids = []
        for chart_selector in response.css(".chart-table > tbody > tr")[:SELECT_TOP]:
            loader = ItemLoader(item=ChartItem(), selector=chart_selector)
            loader.default_output_processor = TakeFirst()
            loader.add_value("region_key", url_split[-3])
            loader.add_value("date", url_split[-1])
            track_link = chart_selector.css(".chart-table-image a::attr(href)").get()
            track_id = track_link.split("/")[-1]
            loader.add_value("track_id", track_id)
            loader.add_css("track_name", ".chart-table-track strong::text", TakeFirst())
            loader.add_css("artists", ".chart-table-track span::text", TakeFirst(), re="by (.*)")
            loader.add_css("position", ".chart-table-position::text", TakeFirst(), lambda rank: int(rank))
            loader.add_css("streams_count", ".chart-table-streams::text", TakeFirst(),
                           lambda count: int(count.replace(",", "")))
            track_ids.append(track_id)
            loaders.append(loader)

        for loader, audio_feature in zip(loaders, spotify.audio_features(track_ids)):
            loader.add_value("audio_features", audio_feature)
            yield loader.load_item()

        days = response.meta.get("days", 0)
        if days < DAYS_LENGTH:
            yield scrapy.Request(
                url=f"{'/'.join(url_split[:-1])}/{get_next_date_from(date_string)}",
                meta=dict(days=days + 1)
            )
