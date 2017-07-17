// started with code from: https://www.raymondcamden.com/2014/09/15/using-the-new-york-times-api-to-chart-occurrences-in-headlines

var $search;
var $progress;

var API = '66aa1037e1974e1eb4bfa27aac268146';
var START_YEAR = 1958;
var END_YEAR = 1960;
var PER_SET = 1;

// used to get progress (not done yet)
var progressPercentage = 0;
var globalData;
var searchTerm;
var currentYear;

$(document).ready(function() {
	$("#searchButton").on("click", search);
	$search = $("#search");
	$progress = $("#progress");
});

/*
	
*/
function search() {
	var term = $search.val();
	if(term === '') return;
	progressPercentage = 0;
	
	console.log("Searching for "+term);

	globalData = [];
	searchTerm = term;
	currentYear = START_YEAR;

	$progress.text("Beginning work...");
	processSets();
}

/*
	Process 1 item async at a time. NYT allows 1 request per second.
	When done, see if I need to do more, and if so, I call it in
	Y miliseconds. The idea being I do chunks of aysnc requests with
	a 'pad' between them to slow down the requests.
	(If you need to make lots of calls, use the Archive API to create your own database locally and search that.)
*/
function processSets() {
	var promises = [];
	var totals = { 1851: 4547, 1852: 18670, 1853: 22495, 1854: 20400, 1855: 18336, 1856: 18162, 1857: 18168, 1858: 17388, 1859: 14595, 1860: 19288, 1861: 27009, 1862: 25180, 1863: 22563, 1864: 20458, 1865: 22727, 1866: 20555, 1867: 21310, 1868: 23705, 1869: 29660, 1870: 26553, 1871: 29860, 1872: 34046, 1873: 35416, 1874: 40519, 1875: 37590, 1876: 39010, 1877: 42742, 1878: 47106, 1879: 48729, 1880: 45118, 1881: 47627, 1882: 49116, 1883: 57869, 1884: 59113, 1885: 57848, 1886: 57656, 1887: 57085, 1888: 58706, 1889: 57418, 1890: 47820, 1891: 48887, 1892: 53545, 1893: 45467, 1894: 45699, 1895: 67228, 1896: 54732, 1897: 61912, 1898: 65543, 1899: 66607, 1900: 70431, 1901: 67227, 1902: 66877, 1903: 67926, 1904: 59485, 1905: 57257, 1906: 53401, 1907: 61579, 1908: 59545, 1909: 59021, 1910: 66868, 1911: 64042, 1912: 69781, 1913: 69252, 1914: 74115, 1915: 74522, 1916: 66156, 1917: 74818, 1918: 73112, 1919: 78237, 1920: 88737, 1921: 102368, 1922: 108491, 1923: 85605, 1924: 86946, 1925: 97885, 1926: 125079, 1927: 159533, 1928: 161908, 1929: 168450, 1930: 168479, 1931: 165250, 1932: 141142, 1933: 156989, 1934: 167997, 1935: 168728, 1936: 172951, 1937: 169257, 1938: 156456, 1939: 160434, 1940: 156446, 1941: 168549, 1942: 153506, 1943: 140127, 1944: 133762, 1945: 126247, 1946: 143369, 1947: 154971, 1948: 154174, 1949: 158579, 1950: 161337, 1951: 162389, 1952: 159337, 1953: 150914, 1954: 146799, 1955: 144163, 1956: 143920, 1957: 142145, 1958: 144109, 1959: 147561, 1960: 145355, 1961: 140899, 1962: 138690, 1963: 114966, 1964: 134086, 1965: 120525, 1966: 130449, 1967: 122222, 1968: 119768, 1969: 109146, 1970: 102665, 1971: 94470, 1972: 96540, 1973: 97773, 1974: 97442, 1975: 96332, 1976: 91948, 1977: 92230, 1978: 65120, 1979: 81143, 1980: 126925, 1981: 91019, 1982: 92574, 1983: 97203, 1984: 102273, 1985: 100928, 1986: 105059, 1987: 101515, 1988: 99949, 1989: 98046, 1990: 93116, 1991: 80780, 1992: 80519, 1993: 76811, 1994: 72997, 1995: 77706, 1996: 76079, 1997: 84885, 1998: 88659, 1999: 90746, 2000: 94015, 2001: 96046, 2002: 98313, 2003: 95416, 2004: 92771, 2005: 92137, 2006: 129376, 2007: 145478, 2008: 153883, 2009: 158740, 2010: 151800, 2011: 158946, 2012: 143997, 2013: 113621, 2014: 110861, 2015: 102154, 2016: 79615, 2017: 20357};
	for(var i=0;i<PER_SET;i++) {
		var yearToGet = currentYear + i;
		if(yearToGet <= END_YEAR) {
			promises.push(fetchForYear(yearToGet,searchTerm));
		}
	}
	$.when.apply($, promises).done(function() {		
		// update progress
		var percentage = Math.floor(progressPercentage/(END_YEAR-START_YEAR)*100);
		$progress.text("Progress: "+percentage +"%");
		
		// massage into something simpler
		// handle cases where promises array is 1
		if(promises.length === 1) {
			var toAddRaw = arguments[0];
			var percentResults = (toAddRaw.response.meta.hits/totals[yearToGet]) * 100;
			globalData.push({
				year:currentYear,
				results:percentResults
			});			
		} else {
			for(var i=0,len=arguments.length;i<len;i++) {
				var toAddRaw = arguments[i][0];
				var percentResults = (toAddRaw.response.meta.hits/totals[yearToGet]) * 100;
				var year = currentYear+i;
				globalData.push({
					year:year,
					results:percentResults
				});
			}
		}
		currentYear += PER_SET;

		// done?
		if(currentYear <= END_YEAR) {
			setTimeout(processSets, 1200);
		} else {
			$progress.text("");
			render(globalData);	
		}
	});
}

function fetchForYear(year, term) {
	// YYYYMMDD
	var startYearStr = year + "0101"; // jan 1
	var endYearStr = year + "1231"; // dec 31
	console.log('pulling from year: '+ year + ' for the term: ' + term);
	console.log(JSON.stringify(globalData));
	
	return $.get("http://api.nytimes.com/svc/search/v2/articlesearch.json", {
		"api-key":API,
		// search query term, search performed on body, headline, and byline
		'q': term,
		'sort':"oldest",
		// source limited to NYT - filtered search query using Lucene syntax
		'fq': "source:(\"The New York Times\")",
		'begin_date':startYearStr,
		'end_date':endYearStr}, function(res) {
			//console.dir(res.response);
			progressPercentage++;
	}, "JSON");
}

function render(searchData) {
	console.log(globalData);
	console.log(JSON.stringify(globalData));
	testmakegraph(globalData);
}

function testmakegraph(data) {
    // copied from: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var line = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.results); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // set scale for both axes based on data max
    // extent returns min/max value in the given array using natural order
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.results; })]);

    // add line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    // add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.format("d")));

    // add y axis
    svg.append("g")
        .call(d3.axisLeft(y));
}






