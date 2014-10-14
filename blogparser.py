from bs4 import BeautifulSoup
import urllib2, csv, urllib, unicodecsv, re, json, calendar

# creating a set object to store urls
urlset = set()
# opening a saved version of the homepage that was scrolled down all the way so it has all links
soup = BeautifulSoup(open("Notes from 21 South Street   The Harvard Advocate Blog.html"))
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
    # extracting themes
    given_themes = [u'Moonshine', u'Compass', u'Habit', u'Harbor', u'Showtime', u'Fever', u'Envoy', u'Marginalia', u'Hat Trick']
    #theme.append(category_theme.intersection(given_themes))
    theme = [val for val in categories if val in given_themes]
    if theme != []:
        theme = theme[0]
    else:
        theme = ""
    # extracting image urls
    image_array = []
    for image in soup.findAll('img'):
        if "gravatar" not in str(image) and ".wp.com" not in str(image):
            image_array.append(image['src'])
    # extracting audio urls
    audio_array = []
    for audio in soup.findAll(type = 'audio/mpeg'):
        audio_array.append(audio['src'])  
    # extracting date  
    date = soup.find("div", class_="entry-meta").find(class_ = "entry-date").text
    # getting body of text
    body = soup.find("div", class_ = "entry-content").findAll(['p','li','ul','div'])
    author = ""
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
                if author == "":
                    author = x.text.strip("By").strip("-").strip("Posted by")
                else:
                    author +=" and " + (x.text.strip("By").strip("-").strip("Posted by"))
            # if not at end, add to text
            elif end_tag == 0:
                text_block += " " + x.text
                block += unicode(x)
    # getting tags
    tags = soup.find("footer", class_ = "entry-meta").findAll(rel = "tag")
    for x in xrange(0,len(tags)):
        tags[x] = tags[x].text
    # adding all data to metadata
    if not categories == []:
        metadata.append([title, categories, theme, author, block, text_block, image_array, audio_array, date,url,tags])


#creating image csv
myfile2 = open("imageinfo.csv", 'wb')
wr = unicodecsv.writer(myfile2, quoting=csv.QUOTE_ALL)
image_set = set()
for x in metadata:
    for y in x[6]:
        ammended_url = re.search("(http(s?):/)(/[^/]+)+\.(?:jpg|gif|png|jpeg|JPG)", y)
        if ammended_url is None:
             image_set.add("http://www.trbimg.com/img-516f1b55/turbine/sc-mov-0416-to-the-wonder-20130418-001")
        else:
            image_set.add(ammended_url.group(0))
image_list = list(image_set)
image_dict ={}
for x in xrange(0,len(image_list)):
    wr.writerow([x, str(image_list[x])])
    a = re.search("(?:jpg|gif|png|jpeg|JPG)", image_list[x])
    image_dict[ str(image_list[x])] = x + 1
    # if a is None:
    #     urllib.urlretrieve(image_list[x], "AdvocateImages/"+str(x+1)+".jpeg")
    # else:
    #     urllib.urlretrieve(image_list[x], "AdvocateImages/" + str(x+1) +"." + re.search("(?:jpg|gif|png|jpeg|JPG)", image_list[x]).group(0))
myfile2.close()



myfile3 = open("categories.csv", 'wb')
wr = unicodecsv.writer(myfile3, quoting=csv.QUOTE_ALL)
category_set = set()
category_dict = {}
for x in metadata:
    for y in x[1]:
        category_set.add(y)
category_list = list(category_set)
for x in xrange(0,len(category_list)):
    wr.writerow([x+1,str(category_list[x])])
    category_dict[category_list[x]] = x + 1
myfile3.close()


myfile4 = open("themes.csv", 'wb')
wr = unicodecsv.writer(myfile4, quoting=csv.QUOTE_ALL)
theme_set = set()
theme_dict = {}
for x in metadata:
    theme_set.add(x[2])
theme_list = list(theme_set)
for x in xrange(0,len(theme_list)):
    wr.writerow([x+1,str(theme_list[x])])
    theme_dict[theme_list[x]] = x + 1
theme_list.append([x + 2, "unthemed"])
wr.writerow([x+2,"unthemed"])
max_theme = x + 2
myfile4.close()

myfile5 = open("tags.csv", 'wb')
wr = unicodecsv.writer(myfile5, quoting=csv.QUOTE_ALL)
tag_set = set()
tag_dict = {}
for x in metadata:
    for y in x[10]:
        tag_set.add(y)
tag_list = list(tag_set)
for x in xrange(0,len(tag_list)):
    wr.writerow([x+1,tag_list[x]])
    tag_dict[tag_list[x]] = x + 1
myfile5.close()


cal_dict = dict((v,k) for k,v in enumerate(calendar.month_name))

# writing metadata to csv
myfile = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile, quoting=csv.QUOTE_ALL)
for l in metadata:
    if l[2] != "":
        wr.writerow([l[0],json.dumps([category_dict[str(x)] for x in l[1]]),theme_dict[str(l[2])],l[3],l[4],str(l[8]).split()[2] + '-' + str(cal_dict[str(l[8]).split()[0]]) + '-' + str(l[8]).split()[1].strip(','),json.dumps([tag_dict[x] for x in l[10]])])
    else:
        wr.writerow([l[0],json.dumps([category_dict[str(x)] for x in l[1]]),max_theme,l[3],l[4],str(l[8]).split()[2] + '-' + str(cal_dict[str(l[8]).split()[0]]) + '-' + str(l[8]).split()[1].strip(','),json.dumps([tag_dict[x] for x in l[10]])])
myfile.close()


    
    