// Created by KATESTRYKERMCM :)

// Update these variables if changes are made to stylesheet
var HEADER_HEIGHT = 180;
var FOOTER_HEIGHT = 50;
var DESCRIPTIONS_HEIGHT = 210;
var PROJECT_PADDING = 50;

$(document).ready(function(){




    // ALL PAGES ON RESIZE

    window.onresize = function() {
        fitProjectImagesToScreen(); // home page images
        adjustProjPageFooter();  // proj page footer
    }




    // HOME PAGE


    // HOME PAGE: ADJUST PROJECT IMAGE HEIGHTS

    // Fit project images for home page
    fitProjectImagesToScreen();

    // HOME PAGE: ARROWS 

    // Motion for next and previous arrows on page load
    for (var i=0; i<2; i++) {
        $('.circleRight').animate({right: 100}, 0); 
        $('.circleRight').animate({right: 60}, 900); 
    };
    $('.circleRight').fadeTo(500, 0.33);
    $('.circleRight').fadeTo(500, 1);
    


    // $('#nextHome').animate({right: 60}, 1000); 
    // if (!($("#nextHome").hasClass("hidden"))){
    //     console.log('heyo not hidden!');
    //     $('#nextHome').animate({right: 60}, 1000); 
    //     $("#nextHome").fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    // }

    $('#nextHome').click(function () {
        // Move the width of one project
        var projWidth = $('.projects').width();
        var position = $('#home').scrollLeft();
        var scrollLeftTo = position + PROJECT_PADDING + projWidth + 2;
        // doesn't seem to include margin? so include PROJECT_PADDING
        var maxScrollLeft = (document.getElementById('projectsContainer').scrollWidth - document.getElementById('projectsContainer').clientWidth) + PROJECT_PADDING;
        // If nearing the rightmost (last) project picture (if the amount that's left to move is less than twice the size of a project picture + margin area)
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
        // This function by default repeatedly gets called multiple times during one scroll,
        // so instead wait until the scroll is complete
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
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
        }, 50));

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






    // PROJECT PAGES


    // PROJECT PAGES: MANUVERING BETWEEN CONTENT PAGES

    // Set Footer
    adjustProjPageFooter();

    // Next Arrows
    $('.projectArrowNext').click(function() {
        if ($(".challengesText").hasClass('currentContentText')){
            showProcessContent();
        }
        else if ($(".processesText").hasClass('currentContentText')){
            showResultsContent();
        }
    });

    // Previous Arrows
    $('.projectArrowPrev').click(function() {
        if ($(".processesText").hasClass('currentContentText')){
            showChallengeContent();
        }
        else if ($(".resultsText").hasClass('currentContentText')){
            showProcessContent();
        }
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

    // Scroll to top
    $(".backToTopText").click(function() { 
        $('.projPage').animate({ scrollTop: 0 }, "slow");
        return false;
    });
});




// PROJECT PAGES: MANUVERING BETWEEN CONTENT PAGES

function showChallengeContent(){
    $("#process").fadeOut(function () {
        $("#results").fadeOut(function () {
            $(".challengesText").addClass("currentContentText");
            $(".processesText").removeClass("currentContentText");
            $(".resultsText").removeClass("currentContentText");
            $("#challenge").removeClass("hidden").fadeIn('fast');
            $(".projectArrowPrev").addClass("hidden");
            $(".projectArrowNext").removeClass("hidden");
            adjustProjPageFooter();
        });
    });
}
function showProcessContent(){
    $("#challenge").fadeOut(function () {
        $("#results").fadeOut(function () {
            $(".processesText").addClass("currentContentText");
            $(".challengesText").removeClass("currentContentText");
            $(".resultsText").removeClass("currentContentText");
            $("#process").removeClass("hidden").fadeIn('fast');
            $(".projectArrowPrev").removeClass("hidden");
            $(".projectArrowNext").removeClass("hidden");
            adjustProjPageFooter();
        });
    });
}
function showResultsContent(){
    $("#challenge").fadeOut(function () {
        $("#process").fadeOut(function () {
            $(".resultsText").addClass("currentContentText");
            $(".challengesText").removeClass("currentContentText");
            $(".processesText").removeClass("currentContentText");
            $("#results").removeClass("hidden").fadeIn('fast');
            $(".projectArrowPrev").removeClass("hidden");
            $(".projectArrowNext").addClass("hidden");
            adjustProjPageFooter();
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

    // ratio of images is 950x1060 (w x h)
    var containerWidth = (95*leftoverHeight)/106;

    if (leftoverHeight > 250){
        $('.projects').width(containerWidth);
    }
    else{
        // Do NOT go smaller than this
        $('.projects').width(250);
    }
}




// ADJUST PROJECT PAGE FOOTER

function adjustProjPageFooter(){
    $(".backToTopContainer").removeClass('hidden');
    // Check if body height is higher than window height (page scrolls)
    if ($("body").height() > $(window).height()) { 
        $("#projPageFooter").addClass('projPageFooter');
        $("#projPageFooter").removeClass('projPageNoScroll');
    }
    // Page does not scroll
    else{ 
        $("#projPageFooter").addClass('projPageNoScroll');
        $("#projPageFooter").removeClass('projPageFooter');
        $(".backToTopContainer").addClass('hidden');
    }
}





