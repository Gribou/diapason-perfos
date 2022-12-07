import scrapy
import os
import csv

from ..items import AircraftItem

# pipenv run scrapy crawl wikipedia

WIKIPEDIA_ROOT = "https://en.wikipedia.org"
WIKIPEDIA_DESIGNATOR_LIST = WIKIPEDIA_ROOT + \
    '/wiki/List_of_aircraft_type_designators'


class WikipediaSpider(scrapy.Spider):
    name = "wikipedia"

    def start_requests(self):
        yield scrapy.Request(url=WIKIPEDIA_DESIGNATOR_LIST, callback=self.parse)

    def parse(self, response):
        filename = os.path.join("../data/icao_designators.csv")
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile, delimiter=';', escapechar='\\',
                                quoting=csv.QUOTE_NONE, quotechar="'")
            for row in response.css("tr"):
                icao_code = row.css("td:first-child::text").get()
                fullname = row.css("td a::text").get()
                url = row.css("td a::attr(href)").get()
                if icao_code:
                    writer.writerow(
                        [icao_code, fullname, WIKIPEDIA_ROOT + url if url else None])
                    if url:
                        yield response.follow(url, callback=self.parse_aircraft_page, cb_kwargs={'icao_code': icao_code})

    def parse_aircraft_page(self, response, icao_code):
        picture_page = response.css("table.infobox a.image::attr(href)").get()
        if picture_page and any([picture_page.endswith(extension) for extension in ['.jpg', '.png']]):
            yield response.follow(picture_page, callback=self.parse_picture_page, cb_kwargs={'icao_code': icao_code})

    def parse_picture_page(self, response, icao_code):
        picture_url = response.css("div#bodyContent img::attr(src)").get()
        yield AircraftItem(icao_code=icao_code, file_urls=["https:" + picture_url])
