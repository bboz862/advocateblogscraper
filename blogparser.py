from bs4 import BeautifulSoup
# -*- coding: utf-8 -*-
import urllib2, csv, urllib, unicodecsv, re, json, calendar, os

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
    #hardcoding in authors
    if "http://theadvocateblog.net/2013/03/03/brood/" in url:
        author = 'Oliver Luo \'13'
    if "http://theadvocateblog.net/2012/11/05/the-lyric-essay-glass/" in url:    
        author = 'Stephanie Newman \’13'
    if "http://theadvocateblog.net/2012/11/28/envoy-cape-trib/" in url or "http://theadvocateblog.net/2012/11/15/this-months-theme-fever/" in url:
        author = 'Patrick Lauppe \’13'
    if "http://theadvocateblog.net/2013/06/22/antique-and-medieval-southern-france/" in url or "http://theadvocateblog.net/2013/09/13/horizonless-landscapes-of-yellowstone/" in url or "http://theadvocateblog.net/2013/07/21/moonshine-culvert/" in url:
        author = 'Isaac Dayno \’15'
    if "http://theadvocateblog.net/2013/03/05/origin-editors-note/" in url or "http://theadvocateblog.net/2013/03/07/a-conversation-with-john-hughes-part-i/" in url or "http://theadvocateblog.net/2013/03/14/a-conversation-with-john-hughes-part-ii/" in url:
        author = 'Alexander Wells \’13, President Emeritus'
    if "http://theadvocateblog.net/2012/11/23/stallone-in-one-take/" in url:
        author = 'Alexander Traub \’13'
    if "http://theadvocateblog.net/2014/02/17/trial-aniseed-in-sand/" in url:
        author = 'Moeko Fujii \’15 and Michelle Long \’17'
    if "http://theadvocateblog.net/2012/10/24/kaylas-day-in/" in url or "http://theadvocateblog.net/2012/10/09/its-almost-midnight/" in url or "http://theadvocateblog.net/2013/03/25/habit-kayla-escobedo/" in url or "http://theadvocateblog.net/2013/04/09/habit-kayla-escobedo-ii/" in url:    
        author = 'Kayla Escobedo \’13'
    if "http://theadvocateblog.net/2012/10/07/down-the-rabbit-hole/" in url:    
        author = 'Julian Lucas \’15'
    if "http://theadvocateblog.net/2014/04/27/trial-heroines-part-1/" in url or "http://theadvocateblog.net/2014/05/11/trial-heroines-part-2/" in url:    
        author = 'Indiana Seresin \’15 and Liza Batkin \’15'
    if "http://theadvocateblog.net/2013/10/17/psychedelicious-a-conversation-with-l-a-jeff/" in url or "http://theadvocateblog.net/2013/02/01/envoy-introducing-harbor/" in url or "http://theadvocateblog.net/2013/01/21/cabinet-9/" in url or "http://theadvocateblog.net/2012/12/30/cabinet-6/" in url or "http://theadvocateblog.net/2012/11/07/taking-turns-dan-chiasson-and-david-ferry-at-the-harvard-advocate/" in url or "http://theadvocateblog.net/2013/03/04/cabinet-16/" in url:    
        author = 'Kevin Hong \’15'
    if "http://theadvocateblog.net/2012/10/17/from-the-archives-ee-cummings/" in url:
        author = 'Sarah Hopkinson \’13'
    if "http://theadvocateblog.net/2014/03/28/a-conversation-with-elise-adibi/" in url:
        author = 'Harry Choi \’16'
    if "http://theadvocateblog.net/2012/11/06/from-the-archives-a-reading-of-love-poems/" in url or "http://theadvocateblog.net/2013/03/12/introduction-habit/" in url:    
        author = 'Liza Batkin \’15'
    if "http://theadvocateblog.net/2013/02/19/sounds-birches/" in url:    
        author = 'Hana Bajramovic \’13'
    if "http://theadvocateblog.net/2012/10/07/return/" in url:    
        author = "Victoria Baena \’14"
    if "http://theadvocateblog.net/2013/04/26/sounds-meditations-in-an-emergency-2/" in url:    
        author = 'Julian Gewirtz \’13'
    if "http://theadvocateblog.net/2012/10/07/to-the-harbormaster/" in url:    
        author = 'Hana Bajramovic \’13'
    if "http://theadvocateblog.net/2014/03/15/trial-panel/" in url:    
        author = 'Advocate Staff'
    if "http://theadvocateblog.net/2012/11/16/aeschylus-and-the-election/" in url:    
        author = 'Reina Gattuso \’15'
    if "http://theadvocateblog.net/2012/11/04/cabinet/" in url or "http://theadvocateblog.net/2013/03/24/cabinet-18/" in url:    
        author = 'Julian Lucas \'15'
    if "http://theadvocateblog.net/2012/10/07/envoy-winning/" in url:
        author = 'Warner James Wood \’14'
    if "http://theadvocateblog.net/2013/02/04/envoy-in-izmir/" in url:    
        author = 'Reina Gattuso \’15'
    if "http://theadvocateblog.net/2014/04/15/a-conversation-with-charlotte-lieberman/" in url: 
        author = 'Kiara Barrow \’16'    
    if "http://theadvocateblog.net/2013/12/29/told-by-an-idiot-signifying-nothing/" in url:    
        author = 'Sarah Rosenthal \’15'
    if "http://theadvocateblog.net/2013/05/05/introduction-compass/" in url:    
        author = 'James Wood \’14'
    if "http://theadvocateblog.net/2012/10/07/envoy-morocco/" in url:    
        author = 'Molly Dektar \’12'
    if "http://theadvocateblog.net/2014/02/25/trial-eulogy-for-a-cosmonaut/" in url:    
        author = 'Noah Pisner \’14 and Michelle Long \’17'
    if "http://theadvocateblog.net/2014/05/27/spring-2014-a-conversation-with-jacob-moscana-skolnik/" in url:    
        author = 'Jacob Moscona-Skolnik \’16 and Colton Valentine \’16'
    if "http://theadvocateblog.net/2013/12/17/marginalia-faye-zhang/" in url:    
        author = 'Faye Zhang \'17'
    # adding all data to metadata
    if not categories == []:
        metadata.append([title, categories, theme, author, block, text_block, image_array, audio_array, date,url,tags])


#creating image csv
image_set = set()
for x in metadata:
    for y in x[6]:
        ammended_url = re.search("(http(s?):/)(/[^/]+)+\.(?:jpg|gif|png|jpeg|JPG)", y)
        if ammended_url is None:
             image_set.add("http://www.trbimg.com/img-516f1b55/turbine/sc-mov-0416-to-the-wonder-20130418-001")
        else:
            image_set.add(ammended_url.group(0))
image_list = list(image_set)
new_image_list = []
image_dict ={}
for x in xrange(0,len(image_list)):
    a = re.search("(?:jpg|gif|png|jpeg|JPG)", image_list[x])
    image_dict[ str(image_list[x])] = x + 1
    if a is None:
        urllib.urlretrieve(image_list[x], "AdvocateImages/"+str(x+1)+".jpeg")
        new_image_list.append([x+1, os.getcwd() + "AdvocateImages/"+str(x+1)+".jpeg", ""])
    else:
        urllib.urlretrieve(image_list[x], "AdvocateImages/" + str(x+1) +"." + re.search("(?:jpg|gif|png|jpeg|JPG)", image_list[x]).group(0))
        new_image_list.append([x+1, os.getcwd() + "/AdvocateImages/" + str(x+1) +"." + re.search("(?:jpg|gif|png|jpeg|JPG)", image_list[x]).group(0), ""])


for post in xrange(0,len(metadata)):
    body_text = metadata[post][4]
    a = BeautifulSoup(body_text)
    p_list = a.findAll('p')
    div_p_list = a.findAll(['div','p'])

    div_list = a.findAll('div')
    for x in div_list:
        z = x.findAll('img')
        caption = ""
        if x.has_attr('class') and "wp-caption" in str(x['class'][0]):
            caption =  div_p_list[div_p_list.index(x)].text
        for q in z:
            search_str = re.search("(http(s?):/)(/[^/]+)+\.(?:jpg|gif|png|jpeg|JPG)", q['src'])
            if search_str is None:
                x.replace_with('{{89 width: 610px}}')
            elif search_str.group(0) in image_dict:
                search_str = search_str.group(0)
                if q.has_attr('class'):
                    new_str = '{{' + str(image_dict[search_str]) + ' ' + q['class'][0] + '}}'
                else:
                    new_str = '{{' + str(image_dict[search_str]) + '}}'
                if x.parent is not None:
                    x.replace_with(unicode(new_str))
                new_image_list[image_dict[search_str] - 1][2] = caption
            else:
                x.replace_with("")
    for x in p_list:
        z = x.findAll('img')
        for q in z:
            search_str = re.search("(http(s?):/)(/[^/]+)+\.(?:jpg|gif|png|jpeg|JPG)", q['src'])
            if search_str is None:
                print q
                x.replace_with('{{ 89 }}')
            elif search_str.group(0) in image_dict:
                search_str = search_str.group(0)
                new_str = '{{' + str(image_dict[search_str]) 
                if q.has_attr('class'):
                    for blarg in q['class']:
                        if 'wp-image' not in blarg:
                            new_str += " " + blarg
                new_str += '}}'
                if x.parent is not None:
                    x.replace_with(unicode(new_str))
            else:
                x.replace_with( "")
        if x.has_attr('class') and "wp-caption" in str(x['class'][0]):
            x.replace_with("")
    metadata[post][4] = unicode(a)

myfile2 = open("imageinfo.csv", 'wb')
wr = unicodecsv.writer(myfile2, quoting=csv.QUOTE_ALL)
for x in new_image_list:
    wr.writerow(x)
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


myfile6 = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile5, quoting=csv.QUOTE_ALL)


# writing metadata to csv
myfile = open("blogmetadata.csv", 'wb')
wr = unicodecsv.writer(myfile, quoting=csv.QUOTE_ALL)
for l in metadata:
    if l[2] != "":
        wr.writerow([l[0],json.dumps([category_dict[str(x)] for x in l[1]]),theme_dict[str(l[2])],l[3],l[4],str(l[8]).split()[2] + '-' + str(cal_dict[str(l[8]).split()[0]]) + '-' + str(l[8]).split()[1].strip(','),json.dumps([tag_dict[x] for x in l[10]])])
    else:
        wr.writerow([l[0],json.dumps([category_dict[str(x)] for x in l[1]]),max_theme,l[3],l[4],str(l[8]).split()[2] + '-' + str(cal_dict[str(l[8]).split()[0]]) + '-' + str(l[8]).split()[1].strip(','),json.dumps([tag_dict[x] for x in l[10]])])
myfile.close()


myfile6 = open("blogpost_category_relation.csv", 'wb')
wr = unicodecsv.writer(myfile6, quoting=csv.QUOTE_ALL)
for l in xrange(0,len(metadata)):
    for y in [category_dict[str(x)] for x in metadata[l][1]]:
        wr.writerow([l+1,y])
myfile6.close()

myfile7 = open("blogpost_tag_relation.csv", 'wb')
wr = unicodecsv.writer(myfile7, quoting=csv.QUOTE_ALL)
for l in xrange(0,len(metadata)):
    for y in [tag_dict[x] for x in metadata[l][10]]:
        wr.writerow([l+1,y])
myfile7.close()


    
    
