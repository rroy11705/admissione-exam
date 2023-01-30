from rest_framework.pagination import LimitOffsetPagination
import math


class CustomPagination(LimitOffsetPagination):
    def get_paginated_response(self, data):
        data["data"]["pagination"] = {
            'index': math.ceil(self.offset / self.limit),
            'next': self.offset + self.limit if self.count > self.offset + self.limit else None,
            'previous': self.offset - self.limit if self.offset >= self.limit else None,
            'limit': self.limit,
            'offset': self.offset,
            'count': self.count,
            'pages': math.ceil(self.count / self.limit)
        }
        return data


class SmallPagination(CustomPagination):
    default_limit = 10
    page_offset = 0
    offset_query_param = 'page_offset'
