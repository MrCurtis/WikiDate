/**
 * @file WikiDate a javascript library to include a bit of historical info
 * on your site.
 */

var wikiDate = ( function () {

    var array_of_months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    var year_and_month_page = {
        url: function (year, month, day){
            return 'http://en.wikipedia.org/w/api.php?action=parse&format=json&page='+month+'_'+year;
        },

        parseData: function  (data, year, month, day){
            var parsedData = null;
            try{
                parsedData = data.parse.text['*'];
            }
            catch (error) {
                if (error.name === 'TypeError'){
                    console.log('TypeError: It looks like your request to wikipedia is not returning the required text.')
                }else{
                    console.log('Error in wikipedia date request.');
                }
            }
            var $data_html = $('<div></div>').html(parsedData);
            var date_string = "[id*='"+month+"_"+day+"\\.2C_"+year+"']";
            var filtered = $data_html.find(date_string).first();
            if (filtered.length){
                var title = filtered.parent();
                var content = title.next();
                title = $('<div class="wiki_date_date"></div>').append(title);
                content = $('<div class="wiki_date_content"></div>').append(content);
                var reference = $('<div class="wiki_date_references"></div>');
                var ref_url = 'http://en.wikipedia.org/wiki/'+month+'_'+year;
                reference.html('Ref: <a class="wiki_date_link" href="'+ref_url+'">'+ref_url+'</a>');
                parsedData = $('<div class="wiki_date_info"></div>');
                parsedData.append(title).append(content).append(reference);
                return parsedData;
            }
            date_string = "#"+day+"_"+month+"_"+year;
            filtered = $data_html.find(date_string).first();
            if (filtered.length){
                var title = $('<div class="wiki_date_date"></div>').append(filtered.next('h2'));
                var content = $('<div class="wiki_date_content"></div>').append(title.next('ul'));
                var reference = $('<div class="wiki_date_references"></div>');
                var ref_url = 'http://en.wikipedia.org/wiki/'+month+'_'+year;
                reference.html('Ref: <a class="wiki_date_link" href="'+ref_url+'">'+ref_url+'</a>');
                //should the below be an &&?
                if (title.length || content.length){
                    parsedData = $('<div class="wiki_date_info"></div>');
                    parsedData.append(title).append(content).append(reference);
                    return parsedData;
                }
            }
            date_string = "#"+year+"_"+month+"_"+day;
            filtered = $data_html.find(date_string).first();
            if (filtered.length){
                console.log('date_string: ', date_string);
                var container = filtered.next('.vevent');
                if (container.length){
                    var title = container.find('span.summary').first();
                    var content = container.find('td.description').first();
                    if (content.length){
                        title = $('<div class="wiki_date_date"></div>').append(title);
                        content = $('<div class="wiki_date_content"></div>').append(content);
                        var ref_url = 'http://en.wikipedia.org/wiki/'+month+'_'+year;
                        var reference = $('<div class="wiki_date_references"></div>');
                        reference.html('Ref: <a class="wiki_date_link" href="'+ref_url+'">'+ref_url+'</a>');
                        parsedData = $('<div class="wiki_date_info"></div>');
                        parsedData.append(title).append(content).append(reference);
;
                        return parsedData;
                    }
                }
            }
            parsedData = null;
            return parsedData;
        },
    };

    var year_page = {
        url: function (year, month, day){
            return 'http://en.wikipedia.org/w/api.php?action=parse&format=json&page='+year;
        },
        parseData: function (data, year, month, day){
            var parsedData = null;
            try{
                parsedData = data.parse.text['*'];
            }
            catch (error) {
                if (error.name === 'TypeError'){
                    console.log('TypeError: It looks like your request to wikipedia is not returning the required text.')
                }else{
                    console.log('Error in wikipedia date request.');
                }
            }
            var $data_html = $('<div></div>').html(parsedData);
            var date_string = "[ title|=\""+month+" "+day+"\"]";
            filtered = $data_html.find("h2");
            if (filtered.length){
                var parsedData = $('<div class="wiki_date_info"></div>');
                var haveMatch = false;
                var eventType = ['Events', 'Births', 'Deaths'];
                filtered.each( function () {
                    for (var event_index = 0; event_index < eventType.length; event_index++){
                        if ($(this).children().filter("#"+eventType[event_index]).length){
                            var events = $(this).nextUntil("h2");
                            events = events.find(date_string);
                            if (events.length) {
                                var title = $('<div class="wiki_date_date"></div>').html(eventType[event_index]);
                                var content = events.first().parent();
                                content = $('<div class="wiki_date_content"></div>').append(content);
                                var ref_url = 'http://en.wikipedia.org/wiki/'+year;
                                var reference = $('<div class="wiki_date_references"></div>');
                                reference.html('Ref: <a class="wiki_date_link" href="'+ref_url+'">'+ref_url+'</a>');
                                parsedData.append(title).append(content).append(reference);
                                haveMatch = true;
                            }
                        }
                    }
                });
                if (haveMatch){
                    return parsedData;
                }
            }
            return null;
        },
    };

    //list of object representing pages to request and their associated parsing function. 
    //Note that that requests are made in reverse order i.e. array_of_pages[array_of_pages.length-1]
    //is used first.
    var array_of_pages = [
        year_page,   
        year_and_month_page,
    ];

    var checkArguments = function (args){

            var arg_len = args.length;
            if ( !(arg_len === 3 || arg_len === 4) ){
                    throw new Error('IncorrectNumberOfArgumentsException', 'getWikiInfo has three required arguments and one optional argument, but ' + arg_len + ' arguments given.');
            }
            if ( !(typeof args[0] === 'function')){
                throw new Error('WrongArgumentTypeError', 'First argument (callback) must be a function');
            }
            if ( !(typeof +args[1] === 'number' && isFinite(+args[1]) && +args[1]%1 === 0) ){
                throw new Error('WrongArgumentTypeError', 'Second argument (year) must be an integer');
            }
            if ( $.inArray(args[2], array_of_months) === -1 ){
                throw new Error('WrongArgumentTypeError', 'Third argument (month) must be a full month name, begining with capital letter, e.g. \'January\'.');
            }
            if ( arg_len === 4 && !(typeof +args[3] === 'number' && isFinite(+args[3]) && +args[3]%1 === 0)){
                throw new Error('WrongArgumentTypeError', 'Fourth argument (day) must be an integer');
            }

    };

    var makeAjax = function (url, parseFunction, callback, year, month, day, array_of_pages_copy){
        $.ajax({
            dataType: 'jsonp',
            url: url,
            success: function (data) {
                var wikiInfo = parseFunction(data, year, month, day);
                if (wikiInfo){
                    callback(wikiInfo, year, month, day);
                }else if (array_of_pages_copy.length) {
                    var page = array_of_pages_copy.pop();
                    makeAjax(page.url(year, month, day), page.parseData, callback, year, month, day, array_of_pages_copy);
                }else{
                    var wiki_no_info = $('<div class="wiki_date_info"></div>');
                    var title = $('<div class="wiki_date_date"></div>');
                    var content = $('<div class="wiki_date_content"></div>').html('No info for this date.');
                    var reference = $('<div class="wiki_date_references"></div>');
                    wiki_no_info.append(title).append(content).append(reference);
                    callback(wiki_no_info, year, month, day);
                }
            },
            error: function () {
                console.log('Not working');
            },
        });
    };

    var getWikiInfo = function (callback, year, month, day) {
        checkArguments(arguments);
        var array_of_pages_copy = array_of_pages.slice();
        var page = array_of_pages_copy.pop();
        makeAjax(page.url(year, month, day), page.parseData, callback, year, month, day, array_of_pages_copy);
    };

    Error: function Error (name, message) {
        this.name = name;
        this.message = message;
    }
           
    var removeLinks = function (content) {
        if ( !(arguments.length === 1) ){
            throw new wikiDate.Error('IncorrectNumberOfArgumentsException', 'removeLinks takes exactly one argument')
        }
        if ( !(content instanceof jQuery) ){
            throw new Error('WrongArgumentTypeError', 'First argument must be a jQuery object');
        }
        content.find('a').each(function (){
            if (!($(this).hasClass('wiki_date_link'))){
                $(this).contents().unwrap();
            }
        });
        content.find('.reference').remove();
        content.find('.mw-editsection').remove();
        return content;
    };

    return {
        getWikiInfo: getWikiInfo,
        removeLinks: removeLinks,
        Error: Error,
    }

})();
