from bs4 import BeautifulSoup
import urllib2, csv
import unicodecsv
import re

# creating a set object to store urls
urlset = set()
# opening a saved version of the homepage that was scrolled down all the way so it has all links
soup = BeautifulSoup(open("/Users/brendan/Projects/advocateblogscraper/Notes from 21 South Street   The Harvard Advocate Blog.html"))
# extracting all links
for link in soup.findAll('a'):
    post = link.get('href')
    # if in form of blog post
    if "http://theadvocateblog.net/2" in post:
        #stripping comments form url link
        post = re.sub("#(.*)", "", post)
        urlset.add(post)

metadata = []  

#iterating through urlset       
for url in urlset:
    #opening blog post
    soup = BeautifulSoup(urllib2.urlopen(url).read())
    # extracting title
    title =  soup.find("h1", class_ = "entry-title").text
    # extracting categories
    categories = soup.find("footer", class_ = "entry-meta").findAll(rel = "category tag")
    for x in xrange(0,len(categories)):
        categories[x] = categories[x].text
    # extracting image urls
    image_array = []
    for image in soup.findAll('img'):
        if "gravatar" not in str(image):
            image_array.append(image['src'])
    # extracting audio urls
    audio_array = []
    for audio in soup.findAll(type = 'audio/mpeg'):
        audio_array.append(audio['src'])  
    # extracting date  
    date = soup.find("div", class_="entry-meta").find(class_ = "entry-date").text
    # getting body of text
    body = soup.find("div", class_ = "entry-content").findAll(['p','li','ul','div'])
    author = []
    block = ""
    end_tag = 0
    text_block = ""
    for x in body:
        if x:
            if (len(x.findAll(['p','li','ul','div'])) > 1):
                1+1
            # stop reading if it gets to this point
            elif unicode("""<div class="wpcnt">""") in unicode(x):
                end_tag = 1
            elif unicode("""li class="share-twitter">""") in unicode(x):
                end_tag = 1
            # adding author
            elif "<p><em>By" in unicode(x) or "<p><em>-" in unicode(x) or ("<p><em>Posted by" in unicode(x)) or ("<p>By" in unicode(x) and re.search("'1(.*</p>)",unicode(x)) is not None):
                author.append(x.text.strip("By").strip("-").strip("Posted by"))
            # if not at end, add to text
            elif end_tag == 0:
                text_block += " " + x.text
                block += unicode(x)
    # adding all data to metadata
    metadata.append([title, categories, author, block, text_block, image_array, audio_array, date,url])

# writing metadata to csv
myfile = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile, quoting=csv.QUOTE_ALL)
for line in metadata:
    wr.writerow(line)