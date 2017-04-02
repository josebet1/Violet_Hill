from selenium import webdriver
from bs4 import BeautifulSoup
import time
import re

def search_whitepages(first_name, last_name, zip_code):
    url = 'http://www.whitepages.com/name/{}-{}/{}'.format(first_name, last_name, zip_code)

    browser.get(url)
    time.sleep(4)
    source = browser.page_source

    soup = BeautifulSoup(source, 'html.parser')
    button = soup.find(text='View Free Details')
    if button is None:
        return
    parent = button.parent.parent
    link = 'http://www.whitepages.com' + parent['href']

    browser.get(link)
    time.sleep(2)

    phone_source = browser.page_source
    pattern = 'dfpSetTargetingParams\["rpn"] = "([0-9*]*)"'
    phone_numbers = re.findall(pattern, phone_source)

    phone_list = []
    for p in phone_numbers:
        phone_list.append(p)

    print phone_list


#create once so there aren't a huge number of firefox things.
browser = webdriver.Firefox()

search_whitepages('first', 'last', 'zip')




