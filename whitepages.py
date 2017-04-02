from bs4 import BeautifulSoup
import time
import re
from pymongo import MongoClient
import os
import dryscrape

#note this is 100% synchronous, but works. Would need to be modified to be more efficient

def search_whitepages(first_name, last_name, zip_code):
    url = 'http://www.whitepages.com/name/{}-{}/{}'.format(first_name, last_name, zip_code)
    dryscrape.start_xvfb()
    session = dryscrape.Session()

    session.visit(url)
    source = session.body()
    print source

    soup = BeautifulSoup(source, 'html.parser')
    button = soup.find(text='View Free Details')
    if button is None:
        return
    parent = button.parent.parent
    link = 'http://www.whitepages.com' + parent['href']

    session.visit(link)

    phone_source = session.body()
    pattern = 'dfpSetTargetingParams\["rpn"] = "([0-9*]*)"'
    phone_numbers = re.findall(pattern, phone_source)

    phone_list = []
    for p in phone_numbers:
        phone_list.append(p)

    return phone_list



def add_phone_number_to_collection():
    items = db.casas.find()
    for obj in items:
        first_name = obj[u'first_name']
        last_name = obj[u'last_name']
        #all addresses appear to have an extra space at the end. Zip code is last 5 digitrs
        zip_code = obj[u'address'][-6:-1]
        numbers = search_whitepages(first_name, last_name, zip_code)
        print numbers
        obj['numbers'] = numbers
        mongo_id = obj[u'_id']
        db.casas.update({u'_id': mongo_id}, obj, upsert=False)



uri = os.environ['MONGODB_URI']
client = MongoClient(uri)
db = client.hill

add_phone_number_to_collection()






