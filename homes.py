from urlparse import urlparse
from threading import Thread
import httplib, sys
from Queue import Queue
import requests
import json


concurrent = 50

ZILLOW_SEARCH_URL= 'https://www.zillow.com/search/GetResults.htm'
ZILLOW_SEARCH_STANDARD_PARAMS = {
    "spt": "homes",
    "status": "110011",
    "lt": "111101",
    "ht": "111111",
    "pr": ",",
    "mp": ",",
    "bd": "0%2C",
    "ba": "0%2C",
    "sf": ",",
    "lot": "0%2C",
    "yr": ",",
    "singlestory": "0",
    "hoa": "0%2C",
    "pho": "0",
    "pets": "0",
    "parking": "0",
    "laundry": "0",
    "income-restricted": "0",
    "pnd": "0",
    "red": "0",
    "zso": "0",
    "days": "any",
    "ds":"all",
    "pmf":"1","pf":"1",
    "sch":"100111",
    "zoom":"9",
    "rect":"-122204361,36678331,-121207352,37699034", #for hackathon just hard-code santa clara county b/c country records.
    "search":"list",
    "rid":"3136",
    "rt":"4",
    "listright":"true",
    "isMapSearch":"false",
    "sort":"days"
}

ZILLOW_PAGE_PARAM_NAME = 'p'

class QueuedRequest():
    def __init__(self, url, params):
        self.url = url
        self.params = params


def make_zillow_request():
    while True:
        next_request = q.get()
        r = requests.get(url=next_request.url, params=next_request.params)
        print r.content
        apn = get_apn(r.content)
        owner = find_owner(apn)
        q.task_done()


def get_apn(response):
    pass

def find_owner(apn):
    pass



def get_homes():
    global q
    r = requests.get(url=ZILLOW_SEARCH_URL, params=ZILLOW_SEARCH_STANDARD_PARAMS)
    response_dictionary = json.loads(r.content)
    num_pages = response_dictionary['list']['numPages']
    for i in xrange(concurrent):
        t = Thread(target=make_zillow_request)
        t.daemon = True
        t.start()
    print num_pages

    for i in xrange(1, num_pages):
        params = ZILLOW_SEARCH_STANDARD_PARAMS
        params[ZILLOW_PAGE_PARAM_NAME] = i
        new_request = QueuedRequest(url=ZILLOW_SEARCH_URL, params=params)
        q.put(new_request)
    q.join()



q = Queue()
get_homes()

