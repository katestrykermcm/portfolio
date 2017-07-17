// started with code from: https://www.raymondcamden.com/2014/09/15/using-the-new-york-times-api-to-chart-occurrences-in-headlines

var $search;
var $progress;

var API = '66aa1037e1974e1eb4bfa27aac268146';
var YEAR = 2015;
var OCCURANCES = 1034;

// var INTERESTING_DATES = [1912, 1913, 1914, 1918, 1928, 1929, 1948, 1960, 1980, 2016]; // PROGRESSIVE
// var CORRELATED_FREQ = [2240, 1330, 1162, 332, 1079, 925, 1391, 548, 882, 1221];

var PER_SET = 1;

// used to get progress (not done yet)
var progressPercentage = 0;
var globalData;
var searchTerm;
var currentPage;
var totalPages;

$(document).ready(function() {
	$("#searchButton").on("click", search);
	$search = $("#search");
	$progress = $("#progress");
});

/*
	called once
*/
function search() {
	var term = $search.val();
	if(term === '') return;
	progressPercentage = 0;
	
	console.log("Searching for " + term);

	globalData = [];
	searchTerm = term;
	currentPage = 0;
    totalPages = Math.floor(OCCURANCES / 10);
    // check if there is a remainder 
    if ((OCCURANCES % 10) > 0){
        // must account for the last page with less than 10 entries
        totalPages++;
    }
    console.log("Start to go through " + totalPages + " pages");
	$progress.text("Beginning work...");
    processArticleData();
	//processSets();
}


/*
    Process 1 item async at a time. NYT allows 1 request per second.
    When done, see if I need to do more, and if so, I call it in
    Y miliseconds. The idea being I do chunks of aysnc requests with
    a 'pad' between them to slow down the requests.
    (If you need to make lots of calls, use the Archive API to create your own database locally and search that.)
*/
function processArticleData() {
    var promises = [];
    for(var i=0;i<PER_SET;i++) {
        if(currentPage < totalPages) {
            console.log("page: " + currentPage + " of " + totalPages + ", YEAR: " + YEAR + " OCCURANCES: " + OCCURANCES);
            promises.push(fetchForYear(YEAR, currentPage, searchTerm));
            // be save and safe a copy every 50 in case it crashes
            if ((currentPage % 30) === 0 && currentPage > 0){
                download(JSON.stringify(globalData), YEAR + '_' + currentPage + '.txt', 'text/plain');
            }
        }
    }
    $.when.apply($, promises).done(function() {     
        // update progress
        var percentage = Math.floor(currentPage/(totalPages)*100);
        $progress.text("Progress: " + percentage + "%");
        
        if(promises.length === 1) {
            var oneAPIcallData = arguments[0];
            var pageData = oneAPIcallData.response.docs;
            var percentResults = oneAPIcallData.response.meta.hits;
            //for(var i=0; i<1; i++) {
            for(var i=0; i<pageData.length; i++) {
                var articleHeadline = pageData[i].headline.main;
                var articleURL = pageData[i].web_url;
                var articleLeadParagraph = pageData[i].lead_paragraph;
                var articleID = pageData[i]._id;
                var articleWordCount = pageData[i].word_count;
                var articlePrintPage = pageData[i].print_page;
                var articleAbstract = pageData[i].abstract;
                var articlePublishedDate = pageData[i].pub_date;
                var articleKeywords = pageData[i].keywords;
                var articleMultimedia = pageData[i].multimedia;
                globalData.push({
                    year : YEAR,
                    headline : articleHeadline,
                    url : articleURL,
                    leadPara : articleLeadParagraph,
                    page : articlePrintPage,
                    artlID : articleID,
                    words : articleWordCount,
                    abstract : articleAbstract,
                    date : articlePublishedDate,
                    keywords : articleKeywords,
                    media : articleMultimedia
                });
            }      
        }
        currentPage += PER_SET;

        // done?
        if(currentPage < totalPages) {
            setTimeout(processArticleData, 1200);
        } else {
            $progress.text("");
            render(globalData); 
        }
    });
}



function fetchForYear(year, page, term) {
	// YYYYMMDD
	//var startYearStr = year + "0101"; // jan 1
    //var startYearStr = year + "0501"; // jan 1
    //var startYearStr = year + "0901"; // jan 1
    var startYearStr = year + "0531"; // jan 1
    //var endYearStr = year + "0801"; // dec 31
	//var endYearStr = year + "0501"; // may 1
    //var endYearStr = year + "0531"; // may 31
    //var endYearStr = year + "0901"; // sept 1
    var endYearStr = year + "1231"; // dec 31
	console.log('pulling from year: '+ year + ', for the term: ' + term + ', for page: ' + page);
	
	return $.get("http://api.nytimes.com/svc/search/v2/articlesearch.json", {
		"api-key":API,
		// search query term, search performed on body, headline, and byline
		'q': term,
		'sort':"oldest",
		// source limited to NYT - filtered search query using Lucene syntax
		'fq': "source:(\"The New York Times\")",
        'page': page,
		'begin_date':startYearStr,
		'end_date':endYearStr}, function(res) {
			//console.dir(res.response);
			progressPercentage++;
	}, "JSON");
}




function render(searchData) {
	console.log(JSON.stringify(globalData));
	//testmakegraph(globalData);
    download(JSON.stringify(globalData), YEAR + '.txt', 'text/plain');
}

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}




