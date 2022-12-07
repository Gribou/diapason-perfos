# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.pipelines.files import FilesPipeline
import os


class AircraftFilePipeline(FilesPipeline):

    def file_path(self, request, response=None, info=None, item=None, *args, **kwargs):
        extension = request.url.split(".")[-1]
        return 'full/{}.{}'.format(item['icao_code'], extension)
