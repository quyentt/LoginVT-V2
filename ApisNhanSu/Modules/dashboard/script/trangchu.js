/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TrangChu() { };
TrangChu.prototype = {
    dtDashBoard: [],
    strDashBoard_Id: '',
    dtTinTuc: [],
    objTinTuc: null,
    dtChucNang: [],

    init: function () {
        var me = this;
        me.getList_ChucNangTheoPhanLoai();
        $("#action-group").delegate('.btnDelete', 'click', function (e) {
            var id = this.id;
            me.delete_ChucNangYeuThich(id);
        });
        $("#action-group").delegate('.actionChucNang', 'click', function (e) {
            var id = this.id;
            var objChucNang = me.dtChucNang.find(e => e.ID == id);
            console.log(objChucNang);
            edu.system.appId = objChucNang.CHUNG_UNGDUNG_ID;
            edu.system.appCode = objChucNang.CHUNG_UNGDUNG_MA;
            edu.system.initMain(objChucNang.DUONGDANHIENTHI, objChucNang.DUONGDANFILE, objChucNang.ID);
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
            'strChung_UngDung_Id': edu.system.appId,
            'dTinQuanTrong': -1,
            'strDaoTao_CoCauToChuc_Id': '',
            'dHieuLuc': 1,
            'pageIndex': 1,
            'pageSize': 30,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTinTuc = dtReRult;
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
        var me = this;
        var html = '';
        $("#zonetintuc").html('');
        data.forEach(e => {
            //var strLink = edu.system.apiUrlTemp + '/congsinhvien/Pages/thread.aspx?id=' + e.ID + '&name=' + edu.system.change_alias(e.TIEUDE);

            html += '<div class="slider-item bantin2" id="' + e.ID + '"  style="cursor: pointer">';
            html += '<div class="card-news ">';
            html += '<a class="image-z news-img">';
            html += '<img src="' + edu.system.getRootPathImg(e.DUONGDANANHHIENTHI) + '" alt="' + e.TIEUDE + '">';
            html += '</a>';
            html += '<a class="card-news-title">';
            html += edu.util.returnEmpty(e.TIEUDE);
            html += '</a>';
            //html += '<p class="cart-news-short-text">';
            //html += edu.util.returnEmpty(e.NOIDUNG);
            //html += '</p>';
            html += '</div>';
            html += '</div>';
        });
        $("#zonetintuc").append(html);
        $(".news-slider").slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
            nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
            responsive: [{
                breakpoint: 1300,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    adaptiveHeight: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            ],
        });
    },
    getList_ChucNangTheoPhanLoai: function () {
        var me = this;

        var obj_list = {
            'action': 'CMS_NguoiDung/LayDSChucNangThuongDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strChung_UngDung_Id': edu.util.getValById('dropAAAA'),
            'strChung_ChucNang_Cha_Id': edu.util.getValById('dropAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data = data.Data;
                    if (data.length == 0) $("#menuChucNang").trigger("click");
                    me.dtChucNang = data;
                    var html = '';
                    data.forEach((ele, index) => {
                        html += '<div class="item">';
                        html += '<div class="pinned btnDelete" id="' + ele.ID +'"  style="cursor: pointer">';
                        html += '<i class="fa-solid fa-heart"></i>';
                        html += '<div class="alert">Bỏ yêu thích</div>';
                        html += '</div>';
                        html += '<a class="action-box feature-box actionChucNang pointer" id="' + ele.ID +'">';
                        html += '<div class="icon">';
                        html += '<i class="' + ele.TENANH + '"></i>';
                        html += '</div>';
                        html += '<div class="modul-name">';
                        html += ele.TENCHUCNANG;
                        html += '</div>';
                        html += '</a>';
                        html += '</div>';
                    });
                    $("#action-group").html(html);
                    const featureEle = document.querySelectorAll(" .feature-box");

                    for (let i = 0; i < featureEle.length; i++) {
                        let randomNum = Math.floor(Math.random() * 10 + 1);

                        featureEle[i].setAttribute("data-bg", randomNum);
                    }
                }
                else {
                    $("#action-group").html("");
                    edu.system.alert(obj_list.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_CauHinhTuKhoa: function (strLoaiCauHinh) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_CauHinh_TuKhoa/LayDanhSach',
            'type': 'GET',
            'strLoaiCauHinh': strLoaiCauHinh,
            'strDinhDanh': edu.util.getValById('txtAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCauHinhTuKhoa = dtReRult;
                    me.genTable_CauHinhTuKhoa(dtReRult, data.Pager);
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
    genTable_CauHinhTuKhoa: function (data, iPager) {
        /*III. Callback*/
        var html = "";
        var objCauHinhTuKhoa = {};
        data.forEach(e => {
            objCauHinhTuKhoa[e.DINHDANH] = e.DULIEU;
        })
        var strLogo = objCauHinhTuKhoa.APP_LOGO_WEB;
        if (strLogo) {
            $("#dashboad_about").show();
            $("#dashboad_about .image-z").html('<img src="' + strLogo + '" alt="">');
            $("#dashboad_about .lage-title").html(objCauHinhTuKhoa.APP_TENTRUONG);
            $("#dashboad_about .about-short-text p").html(objCauHinhTuKhoa.APP_NDGT);
        }
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