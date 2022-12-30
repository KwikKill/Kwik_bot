

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

loadMore = function () {
  var table = document.getElementById("matchsList");
  var rowCount = table.rows.length;
  var id = table.rows[rowCount - 2].id;

  table.deleteRow(rowCount - 1);

  httpGetAsync("http://albert.blaisot.org:8080/lol/matchs?last=" + id, function (response) {
    var table = document.getElementById("matchsListbody");
    table.innerHTML += response;
    if (occurrences(response, "<tr") == 10) {
      table.innerHTML += "<tr class=\"see_more_ajax_button_row\"><td colspan=\"10\" class=\"text-center\"><button type=\"button\" class=\"see_more\" onclick=\"loadMore()\">See more</button></td></tr>";
    }
  });
}

initial_load = function () {
  httpGetAsync("http://albert.blaisot.org:8080/lol/matchs", function (response) {
    var table = document.getElementById("matchsListbody");
    table.innerHTML += response;
    if (occurrences(response, "<tr") == 10) {
      table.innerHTML += "<tr class=\"see_more_ajax_button_row\"><td colspan=\"10\" class=\"text-center\"><button type=\"button\" class=\"see_more\" onclick=\"loadMore()\">See more</button></td></tr>";
    }
  });
}

remove_account = function (pseudo) {
  console.log(pseudo);
}

function occurrences(string, subString, allowOverlapping) {

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}