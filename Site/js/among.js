loadPlayer = function (id) {
    var table = document.getElementById("PlayersListbody");
    var roles = document.getElementById("roles");
    const source = new EventSource("/lol/among/data?game=" + id);

    source.onmessage = (event) => {
        jsondata = JSON.parse(event.data);
        if (jsondata.status == "404") {
            window.location.href = "/lol/among/";
        } else {
            if (jsondata.started == "false") {
                if (jsondata.roles == "true") {
                    roles.innerHTML = "Les rôles ont été attribué, regardez discord pour en prendre connaissance";
                }
            } else {
                roles.innerHTML = "La partie a commencé, n'oubliez pas de vérifier discord pour certains rôles";
                var buttonA = document.getElementById("buttonA");
                if (buttonA != null) {
                    var buttonB = document.getElementById("buttonB");
                    var submitB = document.getElementById("submitB");
                    var buttonC = document.getElementById("buttonC");

                    buttonA.disabled = true;
                    buttonB.style = "margin-right: auto; margin-left: auto;";
                    submitB.value = "End game";
                    submitB.onclick = "httpGetAsync('/lol/among/roles?game=" + id + "', () => {})";
                    buttonC.disabled = true;
                }
            }
            table.innerHTML = jsondata.players;
        }
    };
    //httpGetAsync("http://albert.blaisot.org:8080/lol/among/players?game=" + id, function (response) {
    //    var table = document.getElementById("PlayersListbody");
    //    if (response == "404") {
    //        window.location.href = "http://albert.blaisot.org:8080/lol/among/";
    //    }
    //    table.innerHTML = response;
    /*if (occurrences(response, "<tr") == 10) {
        table.innerHTML += "<tr class=\"see_more_ajax_button_row\"><td colspan=\"10\" class=\"text-center\"><button type=\"button\" class=\"see_more\" onclick=\"loadMore()\">See more</button></td></tr>";
    }*/
    //});
}