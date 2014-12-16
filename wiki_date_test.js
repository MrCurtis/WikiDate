var wiki_date_random_date = ( function (seed){
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
})(56113);

var wikiDateIsWikiInfo = function (object){
    try{
        object.hasClass('wiki_date_info');
    }
    catch (e) {
        return false;
    }
    if ( !(object.hasClass('wiki_date_info')) ){
        return false;
    }
    if ( !(object.children().eq(0).hasClass('wiki_date_date')) ){
        return false;
    }
    if ( !(object.children().eq(1).hasClass('wiki_date_content')) ){
        return false;
    }
    if ( !(object.children().eq(2).hasClass('wiki_date_references')) ){
        return false;
    }
    return true;
};

QUnit.test( "wikiDateIsWikiInfo test", function ( assert) {
    var is_wiki_info = [
        $('<div class="wiki_date_info"><div class="wiki_date_date"></div><div class="wiki_date_content"></div><div class="wiki_date_references"></div></div>'),
        $('<div class="wiki_date_info"><div class="wiki_date_date"><p>A date</p></div><div class="wiki_date_content"></div><div class="wiki_date_references"></div></div>'),
        $('<div class="wiki_date_info"><div class="wiki_date_date"><p>A date</p></div><div class="wiki_date_content"><p>Some content</p></div><div class="wiki_date_references"><a href="blah.com">Some refs</a></div></div>'),
    ];
    var not_wiki_info = [
        $('<div><div class="wiki_date_date"></div><div class="wiki_date_content"></div><div class="wiki_date_references"></div></div>'),
        $('<div class="wiki_date_info"><div></div><div class="wiki_date_content"></div><div class="wiki_date_references"></div></div>'),
        $('<div class="wiki_date_info"><div class="wiki_date_date"></div><div></div><div class="wiki_date_references"></div></div>'),
        $('<div class="wiki_date_info"><div class="wiki_date_date"></div><div class="wiki_date_content"></div><div></div></div>'),
        $('<div class="wiki_date_info"><div class="wiki_date_content"></div><div class="wiki_date_references"></div></div><div class="wiki_date_date"></div>'),
    ];
    for (var i = 0; i < is_wiki_info.length; i++){
        assert.ok( wikiDateIsWikiInfo (is_wiki_info[i]) === true );
    }
    for (var i = 0; i < not_wiki_info.length; i++){
        assert.ok( wikiDateIsWikiInfo (not_wiki_info[i]) === false );
    }
});
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
    var remove_links_test_objects = [
        {
            object: $('<div><div><a href="blah.com/blah"><p>Blahh</p></a><a><p>deBlahh</p></a></div></div>'),
            expected: '<div><p>Blahh</p><p>deBlahh</p></div>',
        },
        {
            object: $('<div><div><p>Blahh</p><p>deBlahh</p><sup id="cite_ref-60" class="reference"><a href="#cite_note-60"></sup></div></div>'),
            expected: '<div><p>Blahh</p><p>deBlahh</p></div>',
        },
        {
            object: $('<div><div><p>Blahh</p><p>deBlahh</p><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a title="Edit section: January 2, 1960 (Saturday)" href="/w/index.php?title=January_1960&action=edit&section=2">edit</a><span class="mw-editsection-bracket">]</span></span></div></div>'),
            expected: '<div><p>Blahh</p><p>deBlahh</p></div>',
        },
        {
            object: $('<div><div><a class="wiki_date_link" href="blah.com/blah"><p>Blahh</p></a><a><p>deBlahh</p></a></div></div>'),
            expected: '<div><a class="wiki_date_link" href="blah.com/blah"><p>Blahh</p></a><p>deBlahh</p></div>',
        },
    ];

    assert.throws(function() {wikiDate.removeLinks(1);}, new wikiDate.Error('WrongArgumentTypeError', 'First argument must be a jQuery object'));
    assert.throws(function() {wikiDate.removeLinks();}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'removeLinks takes exactly one argument'));
    assert.throws(function() {wikiDate.removeLinks(remove_links_test_objects[0].object, remove_links_test_objects[1].object);}, new wikiDate.Error('IncorrectNumberOfArgumentsException', 'removeLinks takes exactly one argument'));
    assert.ok(wikiDate.removeLinks(remove_links_test_objects[0].object) instanceof jQuery, 'Return value of removeLinks should be a jQuery object');
    for (var i = 0; i < remove_links_test_objects.length; i++){
        assert.equal(wikiDate.removeLinks(remove_links_test_objects[i].object).html(), remove_links_test_objects[i].expected);
    }
});

/**
 * Test that the html returned by getWiki info always conforms to 
 * the wiki_info object pattern. This is done by testing against 
 * actual examples.
 */
QUnit.asyncTest( "returns wiki_info object test", function ( assert ) {
    var number_of_cases = 20;
    QUnit.expect(number_of_cases);
    QUnit.stop(number_of_cases-1);
    
    function checkWikiInfo (content, successful, year, month, day) {
        assert.ok( wikiDateIsWikiInfo (content) === true );
        QUnit.start();
    }
    
    for (var i = 0; i < number_of_cases; i++) {
        var date = wiki_date_random_date();
        wikiDate.getWikiInfo(checkWikiInfo, date.year, date.month, date.day);
    }
});

QUnit.asyncTest( "wiki_date coverage", function( assert ){ 
    var number_of_cases = 20;
    QUnit.expect(number_of_cases);
    QUnit.stop(number_of_cases-1);
    function addContent (content, successful, year, month, day) {
        var date_details = year+'_'+month+'_'+day;
        var date_p = $('<p></p>').html(date_details);
        var date_info = $('<div></div>').html(content);
        var date_info_no_links = wikiDate.removeLinks(date_info);
        if (successful){
            date_p.css('color', 'green');
            $('#successful_content_div').append(date_p);
            $('#successful_content_div').append(date_info);
            $('#successful_content_div').append(date_info_no_links);
        }else{
            date_p.css('color', 'red');
            $('#failed_content_div').append(date_p);
            $('#failed_content_div').append(date_info);
        }
    }
    function theCallback (response, year, month, day) {
        var content = response.find('.wiki_date_content').first().html();
        console.log('content: ', content);
        var successful = !(content == 'No info for this date.' );
        addContent(response, successful, year, month, day);
        assert.notEqual(content, 'No info for this date.');
        QUnit.start();
    }

    for (var i = 0; i < number_of_cases; i++) {
        var date = wiki_date_random_date();
        wikiDate.getWikiInfo(theCallback, date.year, date.month, date.day);
    }

});
