/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DashBoard() { };
DashBoard.prototype = {
    dtDashBoard: [],
    strDashBoard_Id: '',
    dtTinTuc: [],
    objTinTuc: null,
    dtCauHinhTuKhoa: [],

    init: function () {
        var me = this;
        console.log('[DashBoard] init v1.0.0.2');
        me.genTable_TinTuc_Home([]);
        me.getList_ChucNangTheoPhanLoai();
        me.getList_TinTuc();
        me.getList_CauHinhTuKhoa("_HOME");
        $(".goChucNang").click(function () {
            var strName = $(this).attr("name");
            edu.system.triggerChucNang_MaHienThi(strName);
        });
        $(".hello-user").click(function () {
            $(".menu-icon-mobi").trigger("click");
        });

        $("#zonetintuc, #zoneTinTucHome").delegate('.bantin2', 'click', function () {
            var strId = this.id;
            me.objTinTuc = me.dtTinTuc.find(e => e.ID == strId);
            edu.system.triggerChucNang_MaHienThi("#tintuc");
        });
        $("#zoneTinTucHome").delegate('.news-group-more', 'click', function (e) {
            e.preventDefault();
            edu.system.triggerChucNang_MaHienThi("#tintuc");
        });
        $(document).on('click', '#dbQuickAccess .db-quick-card', function (e) {
            e.preventDefault();
            var strMa = $(this).data('goto');
            if (strMa && edu.system.triggerChucNang_MaHienThi) {
                edu.system.triggerChucNang_MaHienThi(strMa);
            }
        });

        $(".friend-slider").slick({

            dots: false,
            infinite: true,
            slidesToShow: 9,
            slidesToScroll: 9,
            prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
            nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
            responsive: [{
                breakpoint: 1300,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                },
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 9,
                    slidesToScroll: 9,
                },
            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    adaptiveHeight: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },


            ],
        });

        $(".brand-slider").slick({
            dots: false,
            infinite: true,
            slidesToShow: 9,
            slidesToScroll: 9,
            prevArrow: "<i class='fal fa-chevron-left swiper-prev'></i>",
            nextArrow: "<i class='fal fa-chevron-right swiper-next'></i>",
            responsive: [{
                breakpoint: 1300,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                },
            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    adaptiveHeight: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            ],
        });
    },

    getList_TinTuc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP',
            'func': 'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung',
            'iM': edu.system.iM,
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
                    me.genTable_TinTuc_Home(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    classify_TinTuc: function (item) {
        var donvi = (item.DAOTAO_COCAUTOCHUC_TEN || '').toLowerCase();
        var donviAlias = (typeof edu.system.change_alias === 'function')
            ? edu.system.change_alias(donvi) : donvi;
        if (/cthssv|cong tac (hoc sinh )?sinh vien|doan thanh nien|hoi sinh vien|sinh vien/.test(donviAlias)) {
            return 'hoatdongsv';
        }
        if (/dao tao|khao thi/.test(donviAlias)) {
            return 'daotao';
        }
        return 'nhatruong';
    },

    genTable_TinTuc_Home: function (data) {
        var me = this;
        var $host = $("#zoneTinTucHome");
        if (!$host.length) return;
        $host.html('');
        var CATEGORIES = [
            { key: 'nhatruong', ten: 'Tin nhà trường' },
            { key: 'daotao', ten: 'Tin đào tạo' },
            { key: 'hoatdongsv', ten: 'Hoạt động sinh viên' }
        ];
        var groups = { nhatruong: [], daotao: [], hoatdongsv: [] };
        (data || []).forEach(function (e) {
            groups[me.classify_TinTuc(e)].push(e);
        });

        var PREVIEW = 3;
        var html = '';
        CATEGORIES.forEach(function (cat) {
            var items = groups[cat.key];
            var shown = items.slice(0, PREVIEW);
            html += '<div class="news-group">';
            html += '<div class="news-group-header">';
            html += '<span class="news-group-title">' + cat.ten + '</span>';
            if (items.length > 0) {
                html += '<a href="#" class="news-group-more">Xem tất cả</a>';
            }
            html += '</div>';
            html += '<div class="news-group-body">';
            if (!shown.length) {
                html += '<div class="news-group-empty"><i class="fal fa-inbox"></i><span>Chưa có tin nào</span></div>';
            } else {
                shown.forEach(function (e) {
                    var strNgay = (e.NGAYBATDAU || e.NGAYTAO_DD_MM_YYYY || '').toString().trim();
                    html += '<div class="news-group-item bantin2" id="' + e.ID + '">';
                    html += '<div class="news-group-item-icon"><i class="fas fa-thumbtack"></i></div>';
                    html += '<div class="news-group-item-content">';
                    html += '<div class="news-group-item-title">' + edu.util.returnEmpty(e.TIEUDE) + '</div>';
                    if (strNgay) {
                        html += '<div class="news-group-item-meta">';
                        html += '<span><i class="fal fa-calendar-alt"></i>' + strNgay + '</span>';
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                });
            }
            html += '</div>';
            html += '</div>';
        });
        $host.append(html);
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
            var strDuongDan = e.DUONGDANANHHIENTHI ? e.DUONGDANANHHIENTHI : '/Core/images/thongbao.jpg'
            html += '<img src="' + edu.system.getRootPathImg(strDuongDan) + '" alt="' + e.TIEUDE + '">';
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

        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BRICKTQiDyAvJhUpJC4RKSAvDS4gKAPP',
            'func': 'pkg_chung_quanlynguoidung.LayDSChucNangTheoPhanLoai',
            'iM': edu.system.iM,
            'strNguoiDung_Id': edu.system.userId,
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data = data.Data;
                    var html = '';
                    var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
                    data.forEach((e, index) => {
                        html += '<div class="dashboad-item chucnang" id="' + e.CHUCNANG_ID + '">';
                        html += '<a href="#" class="dashboad-item-box " style="border-color:' + arrMau[index % 8] + '">';
                        html += '<img src="' + e.CHUCNANG_TENANH + '" alt="' + e.CHUCNANG_TENANH + '">';
                        html += '<div class="dashboad-title ">';
                        html += edu.util.returnEmpty(e.CHUCNANG_TEN);
                        html += '</div>';
                        html += '</a>';
                        html += '</div>';
                    });
                    $("#zonedashbroad").html(html);
                }
                else {
                    $("#zonedashbroad").html("");
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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

    getList_CauHinhTuKhoa: function (strLoaiCauHinh) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_Chung_MH/DSA4BRICIDQJKC8p',
            'func': 'pkg_chung.LayDSCauHinh',
            'iM': edu.system.iM,
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
                    edu.system.alert( " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
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
}