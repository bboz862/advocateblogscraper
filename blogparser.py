from bs4 import BeautifulSoup
import urllib2, csv
import unicodecsv
import re

arr = []
urlset = set()
soup = BeautifulSoup(open("/Users/brendan/Projects/advocateblogscraper/Notes from 21 South Street   The Harvard Advocate Blog.html"))
for link in soup.findAll('a'):
    post = link.get('href')
    if "http://theadvocateblog.net/2" in post:
        post = re.sub("#(.*)", "", post)
        urlset.add(post)


metadata = []
  
       
for url in urlset:
    soup = BeautifulSoup(urllib2.urlopen(url).read())
    title =  soup.find("h1", class_ = "entry-title").text
    categories = soup.find("footer", class_ = "entry-meta").findAll(rel = "category tag")
    for x in xrange(0,len(categories)):
        categories[x] = categories[x].text
    image_array = []
    for image in soup.findAll('img'):
        if "gravatar" not in str(image):
            image_array.append(image['src'])
    audio_array = []
    for audio in soup.findAll(type = 'audio/mpeg'):
        audio_array.append(audio['src'])
    author = ""
    block = ""
    body = soup.find("div", class_ = "entry-content").findAll(['p','li','ul'])
    author_tag = 0
    date = soup.find("div", class_="entry-meta").find(class_ = "entry-date").text
    for x in body:
        if (len(x.findAll(['p','li','ul'])) > 1):
            1 + 1
        elif ("<p><em>By" in unicode(x) or "<p><em>-" in unicode(x)):
            author = x.text.strip("By").strip("-")
            author_tag = 1
        elif ".jpg" not in unicode(x) and author_tag == 0:
            block = block + unicode(x)
    metadata.append([title, categories, author, block, image_array, audio_array, date,url])


            
myfile = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile, quoting=csv.QUOTE_ALL)
for line in metadata:
    wr.writerow(line)
    