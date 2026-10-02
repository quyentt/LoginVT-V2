/*----------------------------------------------
--Updated by: 
--Date of created: 
----------------------------------------------*/
function Dashboard() { };
Dashboard.prototype = {
    Id: '',

    init: function () {
        var me = this;
        me.page_load();
    },
    page_load: function () {
        var me = this;
        //me.building_Type1(5, 12);
        me.building_Type2("building_type1", 5, 12)
        me.building_Type2("building_type2", 5, 12);
        me.building_Type2("building_type3", 5, 12);
    },
    /*----------------------------------------------
    --Date of created: 08/01/2019
    --Discription: 
    ----------------------------------------------*/
    building_Type1: function (iFloor, iRoom) {
        var me = this;
        var html = '';
        $("#building_type1").html(html);
        //gen
        html += '<table class="table table-stripped table-bordered">';
        html += '<tbody>';
        for (var f = 0; f < iFloor; f++) {// number of floor
            html += '<tr>';
            for (var r = 0; r < iRoom; r++) {// number of room on a floor
                html += '<td>R' + r + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        //bind
        $("#building_type1").html(html);
    },
    building_Type2: function (placeRender, iFloor, iRoom) {
        var me = this;
        var html = '';
        $("#" + placeRender).html(html);
        //gen
        for (var f = 0; f < iFloor; f++) {
            html += '<div class="pull-left box-room">';
            html += '<a class="poiter" >';
            html += '<div class="room floor">';
            html += '<span>F' + f + '</span>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            for (var r = 0; r < iRoom; r++) {
                html += '<div class="pull-left box-room">';
                html += '<a class="poiter">';
                if (r % 2 == 0) {
                    html += '<div class="room bg-origin">';
                }
                else {
                    html += '<div class="room bg-default">';
                }
                html += '<span>R' + r + '</span>';
                html += '</div>';
                html += '</a>';
                html += '</div>';
            }
            html += '<div class="clear"></div>';
        }
        //bind
        $("#" + placeRender).html(html);
    },
};