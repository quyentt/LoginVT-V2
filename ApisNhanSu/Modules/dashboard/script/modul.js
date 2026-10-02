/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function Modul() { };
Modul.prototype = {
    dtDashBoard: [],
    strDashBoard_Id: '',
    dtTinTuc: [],
    objTinTuc: null,
    dtCauHinhTuKhoa: [],

    init: function () {
        var me = this;
        if (edu.system.dtChucNang && edu.system.dtChucNang.length > 0) me.genTable_UngDung(); else me.getList_UngDung();
        $("#sidebar-menu").delegate('.forreign-links', 'click', function (e) {
            edu.system.appId = this.id;
            $("#sidebar-menu").hide();
            var objUngDung = edu.system.dtUngDung.find(e => e.ID == edu.system.appId);
            edu.system.appCode = objUngDung.MAUNGDUNG;
            var arrChucNang = edu.system.dtChucNang.filter(ele => ele.CHUNG_UNGDUNG_ID == edu.system.appId && ele.CHUCNANGCHA_ID == null);
            var html = '';
            if (edu.system.dtUngDung.length > 1) {

                html += '<div class="dropdown modul-dropdown">';
                html += '<div class="menu-dropdown-select " data-bs-toggle="dropdown" aria-expanded="true">';
                if (objUngDung.TENANH.indexOf(".svg") != -1)
                    html += '<img src="' + objUngDung.TENANH + '">';
                else
                    html += '<i class="' + objUngDung.TENANH + ' modul-icon"></i>';
                html += '<span>' + objUngDung.TENUNGDUNG + '</span>';
                html += '<i class="fas fa-caret-down dropdown-icon"></i>';
                html += '</div>';
                html += '</div>';
            }
            html += '<div class="action-group">';

            arrChucNang.forEach(ele => {
                html += '<div class="item">';
                if(!ele.YEUTHICH){
                    html += '<div class="pinned btnAddLove" id="' + ele.ID + '" href="#" style="cursor: pointer">';
                    html += '<i class="fa-light fa-heart"></i>';
                    html += '<div class="alert">Thêm yêu thích</div>';
                    html += '</div>';
                } else
                {
                    html += '<div class="pinned btnDelete" id="' + ele.ID + '"  style="cursor: pointer">';
                    html += '<i class="fa-solid fa-heart"></i>';
                    html += '<div class="alert">Bỏ yêu thích</div>';
                    html += '</div>';
                }
                
                html += '<a class="action-box feature-box" id="' + ele.ID + '" href="' + ele.DUONGDANHIENTHI + '">';
                html += '<div class="icon">';
                if (ele.TENANH.indexOf(".svg") != -1)
                    html += '<img src="' + ele.TENANH + '">';
                else
                    html += '<i class="' + ele.TENANH + '"></i>';
                html += '</div>';
                html += '<div class="modul-name">';
                html += ele.TENCHUCNANG;
                html += '</div>';
                html += '</a>';
                html += '</div>';
            })
            html += '</div>';
            $("#sidebar-chucnang").html(html)
            //Tự động thay đổi màu sắc box chức năng-------------------------------------
            const featureEle = document.querySelectorAll(" .feature-box");

            for (let i = 0; i < featureEle.length; i++) {
                let randomNum = Math.floor(Math.random() * 10 + 1);

                featureEle[i].setAttribute("data-bg", randomNum);
            }
        });
        $("#sidebar-chucnang").delegate('.btnAddLove', 'click', function (e) {
            var id = this.id;
            me.save_ChucNangYeuThich(id);
        });
        $("#sidebar-chucnang").delegate('.btnDelete', 'click', function (e) {
            var id = this.id;
            me.delete_ChucNangYeuThich(id);
        });
        $("#main-content-wrapper").delegate('.feature-box', 'click', function (e) {
            var id = this.id;
            var objChucNang = edu.system.dtChucNang.find(e => e.ID == id);
            console.log(objChucNang);
            if (!objChucNang.DUONGDANFILE) {
                objChucNang = edu.system.dtChucNang.find(e => e.CHUCNANGCHA_ID == objChucNang.ID);
            }
            edu.system.initMain(objChucNang.DUONGDANHIENTHI, objChucNang.DUONGDANFILE, objChucNang.ID);
        });
    },

    getList_UngDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_Quyen/LayDSUngDungTheoNguoiDung_Id',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
            'strVeVaoCua': 'APP_AURORA',
            'strNgonNgu_Id': edu.util.getValById('dropAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length == 0) edu.system.alert("Bạn chưa có chức năng nào? Hãy liên hệ admin!")
                    edu.system["dtUngDung"] = dtReRult;
                    me.getList_ChucNang(dtReRult, data.Pager);
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
    getList_ChucNang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
            'strUngDung_Id': '',
            'strNgonNgu_Id': edu.util.getValById('dropAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    edu.system["dtChucNang"] = dtReRult;
                    me.genTable_UngDung(dtReRult, data.Pager);
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
    genTable_UngDung: function (data) {
        var me = this;
        var html = '';
        edu.system.dtUngDung.forEach(e => {
            html += '<div class="modul-item" style="display: block">';
            html += '<div class="item-box">';
            html += '<div class="feature-list">';

            var arrChucNang = edu.system.dtChucNang.filter(ele => ele.CHUNG_UNGDUNG_ID == e.ID && ele.CHUCNANGCHA_ID == null);
            arrChucNang.forEach((ele, index) => {
                if (index > 3) return;
                html += '<div class="feature-item">';
                html += '<a class=" feature-box" title="' + ele.TENCHUCNANG + '" data-position="0" onclick="edu.system.initMain(' + "\'" + ele.DUONGDANHIENTHI + "\'" + ',' + "\'" + ele.DUONGDANFILE + "\'" + ',' + "\'" + ele.ID + "\'" + ')" href="' + ele.DUONGDANHIENTHI + '">';
                html += '<div class="icon">';
                html += '<i class="' + ele.TENANH +'"></i>';
                html += '</div>';
                html += '</a>';
                html += '</div>';
            })
                    html += '</div>';
            html += '<div class="forreign-links" id="' + e.ID + '">';
                        html += '<a href="#" class="favorite-link">';
                            html += '<i class="fa-solid fa-heart-circle-check"></i>';
                            html += '<span>Yêu thích</span>';
                        html += '</a>';
                        html += '<a href="#" class="feature-all-link">';
                            html += '<span>All</span>';
                            html += '<i class="fa-solid fa-grid-2"></i>';
                        html += '</a>';
                    html += '</div>';
            html += '</div>';
            html += '<div class="modul-name" style="text-align:center"><i class="' + e.TENANH + ' modul-icon"></i> ' + e.TENUNGDUNG + '</div>';
            html += '</div>';
        })
        $("#sidebar-menu").html(html);
        //Tự động thay đổi màu sắc box chức năng-------------------------------------
        const featureEle = document.querySelectorAll(" .feature-box");

        for (let i = 0; i < featureEle.length; i++) {
            let randomNum = Math.floor(Math.random() * 10 + 1);

            featureEle[i].setAttribute("data-bg", randomNum);
        }
        if (edu.system.dtUngDung.length == 1) {
            console.log($("#sidebar-menu #" + edu.system.dtUngDung[0].ID));
            setTimeout(function () {

                $("#sidebar-menu #" + edu.system.dtUngDung[0].ID).trigger("click");
            }, 200);
        }
    },

    save_ChucNangYeuThich: function (strChucNang_Id) {
        var me = this;

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_NguoiDung/Them_ChucNang_ThuongDung',
            'type': 'POST',
            'strChucNang_Id': strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ChucNang();
                    //me.getList_DaDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_ChucNangYeuThich: function (strChucNang_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_NguoiDung/Xoa_ChucNang_ThuongDung',
            'type': 'POST',
            'strChucNang_Id': strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj_notify = {
                    //    type: "s",
                    //    content: "Xóa thành công!",
                    //}
                    //edu.system.alertOnModal(obj_notify);
                    me.getList_ChucNangTheoPhanLoai();
                    //me.getList_DaDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}