var wiki_date_random_date = ( function (seed){
    var seed = seed;
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
    var rng = function (n) {
        //returns an integer in the range 0,1,...,n-2,n-1
        var x = (1 + Math.sin(seed))*10000;
        seed = seed + 1;
        x = x - (x%1);
        x = x % n;
        return x;
    };
    var rnd_month = function () {
        var x = rng(12);
        return array_of_months[x];
    };
    var rnd_date = function () {
        var year = rng(115) + 1900;
        var month = rnd_month();
        var day = rng(28) + 1;
        return{
            year: year,
            month: month,
            day: day,
        }
    }
    return rnd_date;
})(22);

QUnit.test( "getWikiInfo inputs", function( assert ){ 
    assert.throws(function() {wikiDate.getWikiInfo(1,2,3,4,5);}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'getWikiInfo has three required arguments and one optional argument, but 5 arguments given.'));
    assert.throws(function() {wikiDate.getWikiInfo(1,2);}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'getWikiInfo has three required arguments and one optional argument, but 2 arguments given.'));
    assert.throws(function() {wikiDate.getWikiInfo(1,2,3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'First argument (callback) must be a function'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,NaN,3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'Second argument (year) must be an integer'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,0.2,3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'Second argument (year) must be an integer'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,'First',3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'Second argument (year) must be an integer'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,'2001a',3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'Second argument (year) must be an integer'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,2014,3,4);}, new wikiDate.Error('WrongArgumentTypeError', 'Third argument (month) must be a full month name, begining with capital letter, e.g. \'January\'.'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,2014,'Jan',4);}, new wikiDate.Error('WrongArgumentTypeError', 'Third argument (month) must be a full month name, begining with capital letter, e.g. \'January\'.'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,2014,'january',4);}, new wikiDate.Error('WrongArgumentTypeError', 'Third argument (month) must be a full month name, begining with capital letter, e.g. \'January\'.'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,2014,'January','1st');}, new wikiDate.Error('WrongArgumentTypeError', 'Fourth argument (day) must be an integer'));
    assert.throws(function() {wikiDate.getWikiInfo(wikiDate.getWikiInfo,'2001','January','23a');}, new wikiDate.Error('WrongArgumentTypeError', 'Fourth argument (day) must be an integer'));
});

QUnit.test( "removeLinks inputs", function( assert ){ 
    var jquery_test_object = $('<div><a><p></p></a></div>');
    assert.throws(function() {wikiDate.removeLinks(1);}, new wikiDate.Error('WrongArgumentTypeError', 'First argument must be a jQuery object'));
    assert.throws(function() {wikiDate.removeLinks();}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'removeLinks takes exactly one argument'));
    assert.throws(function() {wikiDate.removeLinks(jquery_test_object, jquery_test_object);}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'removeLinks takes exactly one argument'));
});


QUnit.asyncTest( "wiki_date coverage", function( assert ){ 
    QUnit.expect(100);
    QUnit.stop(99);
    function addContent (content, successful, year, month, day) {
        var date_details = year+'_'+month+'_'+day;
        var date_p = $('<p></p>').html(date_details);
        var date_info = $('<div></div>').html(content);
        if (successful){
            date_p.css('color', 'green');
            $('#successful_content_div').append(date_p);
            $('#successful_content_div').append(date_info);
        }else{
            date_p.css('color', 'red');
            $('#failed_content_div').append(date_p);
            $('#failed_content_div').append(date_info);
        }
    }
    function theCallback (response, year, month, day) {
        var successful = !(response == 'No info for this date.' );
        addContent(response, successful, year, month, day);
        assert.notEqual(response, 'No info for this date.');
        QUnit.start();
    }

    for (var i = 0; i < 100; i++) {
        var date = wiki_date_random_date();
        wikiDate.getWikiInfo(theCallback, date.year, date.month, date.day);
    }

});
