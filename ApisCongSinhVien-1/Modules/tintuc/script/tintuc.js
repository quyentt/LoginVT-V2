function TinTuc() { };
TinTuc.prototype = {
    strDaoTao_CoCauToChuc_Id: '',
    init: function () {
        var me = this;
        me.getList_NguonTin();
        me.getList_TinTuc();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            $("#zonetintuc").html("");
            me.getList_TinTuc();
        });
        $("#zonetintuc").delegate('.bantin', 'click', function () {
            var strLink = $(this).attr("href");
            if (strLink) window.open(strLink);
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/

    getList_NguonTin: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TT_DonViCungCapNguon/LayDanhSach',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NguonTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NguonTin: function (data, iPager) {
        data.forEach(e => {
            $("#zoneDonVi").append('<li><a href="#"><i class="fa fa-file-text-o"></i> '+ edu.util.returnEmpty(e.TEN) +' <span class="label label-warning pull-right"></span></a></li>');
        });
    },

    
    getList_TinTuc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TT_BangTin_NguoiDung/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChuyenMuc_Id': '',
            'strChung_UngDung_Id': edu.util.getValById('dropAAAA'),
            'dTinQuanTrong': -1,
            'strDaoTao_CoCauToChuc_Id': me.strDaoTao_CoCauToChuc_Id,
            'dHieuLuc': 1,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TinTuc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TinTuc: function (data) {
        var html = '';
        data.forEach(e => {
            var strLink = edu.system.apiUrlTemp + '/login/Pages/thread.aspx?id=' + e.ID + '&name=' + edu.system.change_alias(e.TIEUDE);
            html += '<div class="box box-solid poiter bantin"  href="' + strLink +'">';
            html += '<div class="box-body">';
            html += '<div class="col-sm-3">';
            html += '<img src="' + edu.system.getRootPathImg(e.DUONGDANANHHIENTHI) + '" alt="' + e.TIEUDE +'" style="border-radius: 8px; width: 100%; max-height: 191px;overflow: hidden">';

            html += '</div>';

            html += '<div class="col-sm-8" style="padding-left: 20px;max-height: 200px;overflow: hidden">';
            html += '<div style="font-weight: bold; font-size: 24px">';
            html += e.TIEUDE;
            html += '</div>';
            html += '<div style=";max-height: 111px;overflow: hidden">';
            html += e.NOIDUNG;
            html += '</div>';
            html += '<div style="padding-top: 10px">';
            html += '<p style="display: table;">';
            html += '<img class="user-image" alt="User Image" src="http://14.232.210.131/upload/congcanbo/avatar/kadarahazz.png">';
            html += '<span class="hidden-xs" style="font-size: 18px;display: table-cell; vertical-align: middle;">' + e.NGUOITAO_TENDAYDU +'</span>';
            html += '<img class="user-image" alt="User Image" src="http://14.232.210.131/upload/Core/images/no-avatar.png" style="margin-left: 15px">';
            html += '<span class="hidden-xs" style="font-size: 18px;display: table-cell;; vertical-align: middle;">' + e.DAOTAO_COCAUTOCHUC_TEN +'</span>';
            html += '</p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        $("#zonetintuc").append(html);
    }
}