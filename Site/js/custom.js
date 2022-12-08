

/*-------------------------------------------------------------------------------
  PRE LOADER
-------------------------------------------------------------------------------*/

$(window).load(function () {
  $('.preloader').fadeOut(1000); // set duration in brackets    
});

/*-------------------------------------------------------------------------------
  LOL
-------------------------------------------------------------------------------*/

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

$(document).ready(function () {
  $(".moreBox").slice(0, 3).show();
  if ($(".blogBox:hidden").length != 0) {
    $("#loadMore").show();
  }
  $("#loadMore").on('click', function (e) {
    e.preventDefault();
    $(".moreBox:hidden").slice(0, 6).slideDown();
    if ($(".moreBox:hidden").length == 0) {
      $("#loadMore").fadeOut('slow');
    }
  });
});