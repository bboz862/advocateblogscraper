from bs4 import BeautifulSoup
import urllib2, csv
import unicodecsv


arr = []
urlset = set()
soup = BeautifulSoup(open("/Users/brendan/Projects/advocateblogscraper/Notes from 21 South Street   The Harvard Advocate Blog.html"))
for link in soup.findAll('a'):
    post = link.get('href')
    if "http://theadvocateblog.net/2" in post:
        urlset.add(post)


metadata=   [[u'Notes from 21 South Street:\xa0KaylaTV',
  [u'Art', u'Event'],
  '',
  u'<p style="text-align:left;"><em>On Monday, March 11, Kayla Escobedo held a solo show of her own work</em>,\xa0KaylaTV<em>, at\xa0</em>The Harvard Monday Gallery.\xa0<em>The show was curated by Escobedo alongside Danny Bredar.\xa0</em>Notes from 21 South Street<em> is pleased and proud to present a record of this event with thoughts from the artist.\xa0</em>The Harvard Monday Gallery<em>\xa0is Harvard University\u2019s first and only student-run gallery space, founded in 2012.</em></p><p><b></b><b>How was\xa0<i>KaylaTV\xa0</i>conceived?\xa0</b></p><p>The video work is a part of my VES thesis, and the timing was really perfect because <i>The Harvard Monday Gallery</i> was looking to put on more experimental, focused exhibitions, and I really needed a place to experiment with my video work and see how it worked as projections.</p><p><span id="more-846"></span></p><p><b>As a body of work, what kind of problems are being addressed?\xa0</b></p><p>The refractions and reflections that occur with the projections work on many different levels. In terms of the overarching themes within the <i>KaylaTV</i> project (which actually extends into the realms of drawing, painting, and photography), the refractions are in dialogue with the multiple iterations of this characterization of the self, <i>Kayla. </i>The different lenses through which you can view this work, including the changes in scale, color saturation, and the disjointing that occurs through projections on objects (such as the projection on the chair), are, for me, a part of the project\u2019s handling of the complex relationship one has with oneself. And on another level, I think that the refractions and reflections\xa0and the relationships that are ignited as a result of projections occurring across from each other\xa0work in purely a visual and aesthetic sense.</p><p><b>What was it like to curate your work?</b></p><p>It was really enjoyable. The great thing about these video GIFs is that there\u2019s an almost limitless number of ways to arrange and display them. We had a whole world of possibilities to work with, and through hours and hours of experimenting and playing around with the space and materials, we achieved a very interesting investigation of the work. I was delighted to see so many of the visitors interacting with the work in unexpected ways. I think that was a really successful aspect of the show.</p><p><b>What freedoms/limitations did you encounter/discover?</b></p><p>Well, the previous question addressed much of the freedom I felt while undertaking the project. And sure, there were a few limitations with regard to the size of the space, the time we were\xa0allotted\xa0to prepare, the technology, the lighting, and the amount of hands on deck, but curating the show became more about working with those limitations and discovering what came out of them, and I\u2019m tremendously happy with what did come out of it. For this show especially, I wasn\u2019t interested in just taking videos and projecting them. As I began to install the work, I really started to investigate the space, and I wanted to make things more integrated, meaningful, and intentional with respect to the time, place, and materials, and I feel like everything came together with this show. In the beginning, I just saw this space as the only place available to experiment with, but as it started to take form, the space began to be very important to the work, and I\u2019m very glad that ended up happening.</p>',
  [u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/2013-03-11-07-36-14.jpg?w=504&h=336',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8475.jpg?w=448&h=672',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8420.jpg?w=504&h=756',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8419.jpg?w=504&h=336',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8424.jpg?w=504&h=336',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_84521.jpg?w=504&h=336',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/s1000035.jpg?w=504&h=284',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8425.jpg?w=448&h=672',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/s1000022.jpg?w=504&h=284',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/s1000018.jpg?w=504&h=284',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8542.jpg?w=448&h=672',
   u'http://theadvocateblogdotnet.files.wordpress.com/2013/04/img_8479.jpg?w=448&h=672',
   u'http://s2.wp.com/wp-content/mu-plugins/highlander-comments/images/wplogo.png?m=1391188133g',
   u'http://pixel.wp.com/b.gif?v=noscript'],
  [],
  u'April 12, 2013'],
 [u'Brood',
  [u'Art'],
  '',
  u'<p><em>The Harvard Advocate\u2019s winter issue,\xa0</em>Origin<em>, has officially been launched. Now,</em>\xa0<em>Notes from 21 South Street is thrilled to bring you the entirety of \u201cBrood\u201d by Oliver Luo \u201913. Stills from this multimedia piece are printed in\xa0</em>Origin<em>; subscribe at\xa0<a href="http://www.theharvardadvocate.com/content/subscribe-0" target="_blank">www.theharvardadvocate.com</a>.</em><em><br/>\n</em></p>',
  [u'http://s2.wp.com/wp-content/mu-plugins/highlander-comments/images/wplogo.png?m=1391188133g',
   u'http://pixel.wp.com/b.gif?v=noscript'],
  [],
  u'March 3, 2013']]
  
       
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
    body = soup.find("div", class_ = "entry-content").findAll('p')
    author_tag = 0
    date = soup.find("div", class_="entry-meta").find(class_ = "entry-date").text
    for x in body:
        if ("<p><em>By" in unicode(x) or "<p><em>-" in unicode(x)):
            author = x.text.strip("By").strip("-")
            author_tag = 1
        if ".jpg" not in unicode(x) and author_tag == 0:
            block = block + unicode(x)
    metadata.append([title, categories, author, block, image_array, audio_array, date,url])


            
myfile = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile, quoting=csv.QUOTE_ALL)
for line in metadata:
    wr.writerow(line)
    