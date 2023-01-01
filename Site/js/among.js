loadPlayer = function (id) {
    httpGetAsync("http://albert.blaisot.org:8080/lol/among/players?game=" + id, function (response) {
        var table = document.getElementById("PlayersListbody");
        table.innerHTML = response;
        /*if (occurrences(response, "<tr") == 10) {
            table.innerHTML += "<tr class=\"see_more_ajax_button_row\"><td colspan=\"10\" class=\"text-center\"><button type=\"button\" class=\"see_more\" onclick=\"loadMore()\">See more</button></td></tr>";
        }*/
    });
}