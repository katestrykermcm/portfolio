// Update these variables if changes are made to stylesheet
var HEADER_HEIGHT = 180;
var FOOTER_HEIGHT = 50;
var DESCRIPTIONS_HEIGHT = 200;
var PROJECT_PADDING = 50;

$(document).ready(function(){




    // HOME PAGE


    // HOME PAGE: ADJUST PROJECT IMAGE HEIGHTS

    // Fit project images
    fitProjectImagesToScreen();
    window.onresize = function() {
        fitProjectImagesToScreen();
    }


    // HOME PAGE: ARROWS 

    // Motion for next and previous arrows
    $('#nextHome').click(function () {
        // Move the width of one project
        var projWidth = $('.projects').width();
        var position = $('#home').scrollLeft();
        var scrollLeftTo = position + PROJECT_PADDING + projWidth + 2;
        // doesn't seem to include margin? so include PROJECT_PADDING
        var maxScrollLeft = (document.getElementById('projectsContainer').scrollWidth - document.getElementById('projectsContainer').clientWidth) + PROJECT_PADDING;
        // If nearing the rightmost (last) project picture
        if ((maxScrollLeft - position) < ((PROJECT_PADDING + projWidth) * 2)){
            // Move fully to the end of the page
            // This avoids having the first project picture cropped (and so user is never
            // suggested to click the previous-arrow, creating a partial left scroll on next click)
            $("body").animate({ scrollLeft: maxScrollLeft}, "slow");
        }
        else{
            // Move the width of one project
            $("body").animate({ scrollLeft: scrollLeftTo}, "slow");
        }
        // Show other home arrow button if hidden to allow movement in opposite direction
        $("#prevHome").removeClass("hidden");
    });
    $('#prevHome').click(function () {
        var projWidth = $('.projects').width();
        var position = $('#home').scrollLeft();
        // If nearing the leftmost (first) project picture
        if (position < ((PROJECT_PADDING + projWidth) * 2)){
            // Move fully to the end of the page
            // This avoids having the first project picture cropped (and so user is never
            // suggested to click the previous-arrow, creating a partial left scroll on next click)
            $("body").animate({ scrollLeft: 0}, "slow");
        }
        else{
            // Move the width of one project
            $("body").animate({ scrollLeft: position - (PROJECT_PADDING + projWidth + 2)}, "slow");
        }
        // Show other home arrow button if hidden to allow movement in opposite direction
        $("#nextHome").removeClass("hidden");
    });

    // Hide home arrow buttons if on that end of the page, show in every other case
    $(window).scroll(function(){
        // if end of page 
        if(($(window).scrollLeft() + $(window).width() + PROJECT_PADDING) >= $(document).width()){
            // hide next button
            $("#nextHome").addClass("hidden");
        }
        else{
            $("#nextHome").removeClass("hidden");
        }
        if($(window).scrollLeft() < PROJECT_PADDING){
            $("#prevHome").addClass("hidden");
        }
        else{
            $("#prevHome").removeClass("hidden");
        }
    });


    // removed: bringing users to new pages instead to avoid bugs w/ mixing this w/ vertical scroll
    // // HOME PAGE: OPENING PROJECT ICONS

    // $(".projectImgs").click(function() {
    //     $("body").animate({ scrollLeft: 0 }, "slow");
    //     return false;
    // });

    // $("#rijksImg").click(function() {
    //     $("#rijksPage").animate({
    //         'marginTop': '0'
    //     }, 650);
    // });
    // $("#nytImg").click(function() {
    //     $("#nytPage").animate({
    //         'marginTop': '0'
    //     }, 650);
    // });
    // $("#infoImg").click(function() {
    //     $("#infoPage").animate({
    //         'marginTop': '0'
    //     }, 650);
    // });
    // // CLOSE PROJECT PAGES: PRESS X IN TOP RIGHT CORNER
    // $(".cross").click(function() {
    //     $(".dropdownPage").animate({
    //         'marginTop': '-100%'
    //     }, 650);
    //     showChallengeContent();
    // });

    // // Close project pages
    // $(".backToTop").click(function() { 
    //     // $('body, html, #containerDiv').scrollTop(0);
    //     $(".contentContainer").animate({ scrollTop: 0 }, "slow");
    //     return false;
    // });




    // PROJECT PAGES


    // PROJECT PAGES: MANUVERING BETWEEN CONTENT PAGES

    // Next Arrows
    $(".nextContainer1").click(function() {
        showProcessContent();
    });
    $(".nextContainer2").click(function() {
        showResultsContent();
    });

    // Previous Arrows
    $(".prevContainer2").click(function() {
        showChallengeContent();
    });
    $(".prevContainer3").click(function() {
        showProcessContent();
    });

    // Click header text for different content stages
    $(".challengesText").click(function() {
        showChallengeContent();
    });
    $(".processesText").click(function() {
        showProcessContent();
    });
    $(".resultsText").click(function() {
        showResultsContent();
    });
});




// PROJECT PAGES: MANUVERING BETWEEN CONTENT PAGES

function showChallengeContent(){
    $(".processDiv").fadeOut(function () {
        $(".resultsDiv").fadeOut(function () {
            $(".challengeDiv").removeClass("hidden").fadeIn('fast');
            $(".processesText").removeClass("currentContentText");
            $(".resultsText").removeClass("currentContentText");
            $(".challengesText").addClass("currentContentText");
        });
    });
}
function showProcessContent(){
    $(".challengeDiv").fadeOut(function () {
        $(".resultsDiv").fadeOut(function () {
            $(".processDiv").removeClass("hidden").fadeIn('fast');
            $(".challengesText").removeClass("currentContentText");
            $(".resultsText").removeClass("currentContentText");
            $(".processesText").addClass("currentContentText");
        });
    });
}
function showResultsContent(){
    $(".challengeDiv").fadeOut(function () {
        $(".processDiv").fadeOut(function () {
            $(".resultsDiv").removeClass("hidden").fadeIn('fast');
            $(".challengesText").removeClass("currentContentText");
            $(".processesText").removeClass("currentContentText");
            $(".resultsText").addClass("currentContentText");
        });
    });
}




// HOME PAGE: ADJUST PROJECT IMAGE HEIGHTS BASED ON CURRENT WINDOW HEIGHT

function fitProjectImagesToScreen(){
    var windowHeight = $(window).height();
    // Add 25 for additional buffer and to accommodate additional padding above description text
    var leftoverHeight = windowHeight - (HEADER_HEIGHT + FOOTER_HEIGHT + DESCRIPTIONS_HEIGHT + 25);
    if (leftoverHeight > 100){
        $('.projectImgs').height(leftoverHeight);
    }
    else{
        // Do NOT go smaller than this
        $('.projectImgs').height(100);
    }
    var containerWidth = $('.projectImgs').width();
    if (leftoverHeight > 250){
        $('.projects').width(containerWidth);
    }
    else{
        // Do NOT go smaller than this
        $('.projects').width(250);
    }
}


