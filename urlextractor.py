from bs4 import BeautifulSoup
import urllib2
import re

urlset = set()

soup = BeautifulSoup(open("Notes from 21 South Street   The Harvard Advocate Blog.html"))
for link in soup.findAll('a'):
    post = link.get('href')
    if "http://theadvocateblog.net/2" in post:
        urlset.add(post)

for url in urlset:
    BeautifulSoup(urllib2.urlopen(url).read())