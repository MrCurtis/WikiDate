wiki_date
=========

###A small javascript library for obtaining and formatting date specific information from Wikipedia

wiki_date allows you to retrieve information for what happened on either a specific day or a specific month. It does this by making use of an ajax call to the wikipedia API. As there is no uniform format for the markup over different dates the data is then uniformized and encapsulated in what we refer to as a *wiki_info* object, basically a jQuery object encapsulating the following structure 
>		<div class="wiki_date_info">
>			<div class="wiki_date_date">...</div>
>			<div class="wiki_date_content">...</div>
>			<div class="wiki_date_reference">...</div>
>		<\div> 

where the *wiki_date_date* div contains the date information, the *wiki_date_content* div contains the actual data about what happened on tht day/month, and the *wiki_date_reference* div contains a link to the original Wikipedia page, or pages, from which the information is taken.  

Reference
---------

##wikiDate.getWikiInfo(callback, year, month[, day])

###Description:
Passed a given date, *getWikiInfo* makes one or more requests via the wikipedia API to obtian information about historical events which occurered on that date. This information is than encapsulated in a *wiki_info* object and passed to the callback function given as an argument. If the optional day argument is given the *wiki_info* object contains only information for that particular day, else it contains information for the whole specified month.

###Arguments:
+  callback: see below for specification of the callback function.
+  year: must be of the form yyyy, e.g. 1923.
+  month: must be a full english month name, with first letter capitalised, e.g. 'June'.
+  day: (optional) integer representing the day of the month.

###Returns: 
No return value.

##wikiDate.removeLinks(wiki_info)
###Description:
Removes links, references, and other extraneous additions from the wiki_info content. This is usually added to the body of the callback function above.

###Arguments:
+ wiki_info: The jQuery object passed to the callback function above.

###Returns:
+ wiki_data object: as specified above.

##Callback specification

callback(wiki_data, successful, year, month, day)

###Description: 
The function passed as first argument to getWikiInfo. 

+ wiki_data: jQuery object representing the date information as a html object. The basic structure of the object is:  
>		<div class="wiki_date_info">
>			<div class="wiki_date_date">...</div>
>			<div class="wiki_date_content">...</div>
>			<div class="wiki_date_reference">...</div>
>		<\div>
where 
+ successful: boolean representing whether the request retrieved any information for the given date. Note, this is not the same as whether the AJAX request was successful.
+  year, month, day: date variables in same format as those passed into *getWikiInfo*.