from threading import Thread
from Queue import Queue
import requests
import json
from bs4 import BeautifulSoup
import re

MAX_CONNECTIONS = 50

ZILLOW_BASE_URL = 'https://www.zillow.com'
ZILLOW_SEARCH_URL = 'https://www.zillow.com/search/GetResults.htm'
ZILLOW_SEARCH_STANDARD_PARAMS = {
    "spt": "homes",
    "status": "100000",
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
    "ds": "all",
    "pmf": "1", "pf": "1",
    "sch": "100111",
    "zoom": "9",
    "rect": "-122204361,36678331,-121207352,37699034",
    # for hackathon just hard-code santa clara county b/c country records.
    "search": "list",
    "rid": "3136",
    "rt": "4",
    "listright": "true",
    "isMapSearch": "false",
    "sort": "days"
}

ZILLOW_PAGE_PARAM_NAME = 'p'

SC_COUNTY_URL = 'http://scccroselfservice.org/web/searchPost/DOCSEARCH400S5'


class QueuedRequest():
    def __init__(self, url, params):
        self.url = url
        self.params = params


def make_zillow_request():
    while True:
        next_request = q.get()
        r = requests.get(url=next_request.url, params=next_request.params)
        response_dict = json.loads(r.content)
        list = response_dict['list']['listHTML']
        get_detail_view(list)
        apn = get_apn(r.content)
        owner = find_owner(apn)
        q.task_done()


def make_zillow_detaiL_request():
    while True:
        r = requests.get(url=detail_queue.get())
        parse_detail_view(r.content)
        detail_queue.task_done()


def parse_detail_view(html):
    soup = BeautifulSoup(html, 'html.parser')

    base_string = '#home-facts-comparison-list",url:"'
    wildcard = '.[^"]*'
    regex_pattern = base_string + wildcard
    match = re.search(regex_pattern, html)
    if match is None:
        return

    apn_url = html[match.start() + len(base_string): match.end()]

    r = requests.get(ZILLOW_BASE_URL + apn_url)
    apn_html = json.loads(r.content)['html']

    apn_soup = BeautifulSoup(apn_html, 'html.parser')
    parcel_num_text = apn_soup.find(text=re.compile(".*Parcel #.*"))
    if parcel_num_text is None:
        return

    parcel_tag = parcel_num_text.parent.parent.find('td', {"class": "all-source"})
    parcel_number = parcel_tag.get_text()
    owner = find_owner(parcel_number)
    print owner
    print parcel_number


def get_detail_view(list):
    soup = BeautifulSoup(list, 'html.parser')
    links = soup.findAll('a', {'class': 'zsg-photo-card-overlay-link'})

    def populate_queue():
        global detail_queue

        for l in links:
            main_link = l['href']
            link = ZILLOW_BASE_URL + main_link
            detail_queue.put(link)

        detail_queue.join()

    threaded_query(make_zillow_detaiL_request, populate_queue)


def find_owner(apn):
    r = requests.post(url=SC_COUNTY_URL, data={'field_ParcelID': int(apn),
                                               'field_selfservice_documentTypes_shown': '',
                                               'field_selfservice_documentTypes': ''})

    soup = BeautifulSoup(r.content, 'html.parser')
    owner_tag_list = soup.findAll('td', {'class': 'ui-search-result-column'})
    if len(owner_tag_list) > 0:
        owner_tag = owner_tag_list[4:5][0]
        return owner_tag['title']


def get_homes():
    global q
    r = requests.get(url=ZILLOW_SEARCH_URL, params=ZILLOW_SEARCH_STANDARD_PARAMS)
    response_dictionary = json.loads(r.content)
    num_pages = response_dictionary['list']['numPages']

    num_pages = 2

    def populate_queue():
        for i in xrange(1, num_pages):
            params = ZILLOW_SEARCH_STANDARD_PARAMS
            params[ZILLOW_PAGE_PARAM_NAME] = i
            new_request = QueuedRequest(url=ZILLOW_SEARCH_URL, params=params)
            q.put(new_request)
        q.join()

    threaded_query(target=make_zillow_request, populate_queue=populate_queue)


def threaded_query(target, populate_queue):
    for i in xrange(MAX_CONNECTIONS):
        t = Thread(target=target)
        t.daemon = True
        t.start()
    populate_queue()


q = Queue()
detail_queue = Queue()
get_homes()
