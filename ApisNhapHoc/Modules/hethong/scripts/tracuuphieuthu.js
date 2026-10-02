/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 20/08/2018
--API URL: NH_TraCuuPhieuThu
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function TraCuuPhieuThu() { };
TraCuuPhieuThu.prototype = {
    strKeHoach_Id: '',
    iLoaiPhieu: -1,
    dtKeHoachNhanSu:[],

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $('#dropKeHoachNhapHoc_TCPT').on('select2:select', function () {
            var id = $(this).find('option:selected').val();
            if (edu.util.checkValue(id)) {
                me.strKeHoach_Id = edu.util.getValCombo("dropKeHoachNhapHoc_TCPT");
                var arrKeHoachNhanSu = edu.util.convertStrToArr(me.strKeHoach_Id, ",");
                var index = 0;
                for (var i = 0; i < arrKeHoachNhanSu.length; i++) {
                    index ++;
                    me.getList_KeHoachNhanSu(arrKeHoachNhanSu[i], index, arrKeHoachNhanSu.length);
                }                
            }
        });
        $('.rdLoaiPhieu').on('change', function () {
            me.iLoaiPhieu = $('input[name="rdLoaiPhieu"]:checked').val();
            me.strKeHoach_Id = edu.util.getValCombo("dropKeHoachNhapHoc_TCPT");
            me.getList_PhieuThuTheoKeHoach();
        });
        $("#btnSearch_DMC").click(function () {
            me.strKeHoach_Id = edu.util.getValCombo("dropKeHoachNhapHoc_TCPT");
            me.getList_PhieuThuTheoKeHoach();
        });
        $("#txtKeyword_Search_TCPT").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.strKeHoach_Id = edu.util.getValCombo("dropKeHoachNhapHoc_TCPT");
                me.getList_PhieuThuTheoKeHoach();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        return new Promise(function (resolve, reject) {
            me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");
        }).then(function (data) {
            me.cbGenCombo_KeHoachNhapHoc(data);
            me.strKeHoach_Id = edu.util.getValCombo("dropKeHoachNhapHoc_TCPT");
            me.getList_PhieuThuTheoKeHoach();
            me.getList_KeHoachNhanSu(me.strKeHoach_Id, 1, 1);
        });        
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> PhieuThuTheoKeHoach
	--Author:  
	-------------------------------------------*/
    getList_PhieuThuTheoKeHoach: function () {
        var me = this;
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var obj_list = {
            'action': 'NH_ThongKe/LayDSPhieuThuTheoKeHoach',
            'versionAPI': 'v1.0',

            'strTaiChinh_KeHoach_Ids': me.strKeHoach_Id,
            'dLoaiPhieu': me.iLoaiPhieu,
            'strNguoiThucHien_Id': edu.util.getValById("dropKeHoachNhanSu_TCPT"),
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_TCPT"),
            'pageIndex': 1, //edu.system.pageIndex_default,
            'pageSize': 10000,//edu.system.pageSize_default
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genHTML_TCPT(data.Data, data.Pager);
                    }
                    else {
                        me.genHTML_TCPT([{}], 0);
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [3] ACESSS DB ==> KeHoachNhanSu
	--Author:  
	-------------------------------------------*/
    getList_KeHoachNhanSu: function (strKeHoach_Id, index, times) {
        var me = this;

        var obj_list = {
            'action': 'NH_KeHoachNhanSu/LayDanhSach',

            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNguoiDung_Id': "",
            'strTAICHINH_KeHoach_Id': strKeHoach_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    for (var i = 0; i < dtResult.length; i++) {
                        me.dtKeHoachNhanSu.push(dtResult[i]);
                    }
                    if (index == times) {
                        me.cbGenCombo_KeHoachNhanSu(me.dtKeHoachNhanSu);
                        me.dtKeHoachNhanSu = [];
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    cbGenCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_TCPT"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] ACTION HTML ==> PhieuThuTheoKeHoach
	--Author:  
	-------------------------------------------*/
    genHTML_TCPT: function (data, iPager) {
        var me = this;
        var html = '';
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var dTongPhieuThu       = data[0].TONGSODATHU;
        var dTongPhieuThu_Huy   = data[0].TONGSOHUY;
        var dTongPhieuThu_Sua   = data[0].TONGSOSUA;

        $("#zonePhieuThu_TCPT").html("");
        $("#lblTongPhieuThu").html("");
        $("#lblTongPhieuThu_Huy").html("");
        $("#lblTongPhieuThu_Sua").html("");

        for (var i = 0; i < data.length; i++) {
            iTinhTrang = data[i].TINHTRANG;

            switch (iTinhTrang) {
                case 1:
                    iLoaiPhieu = "color-active";
                    break;
                case -1:
                    iLoaiPhieu = "color-danger";
                    break;
                case 2:
                    iLoaiPhieu = "color-warning";
                    break;
                default:
                    break;
            }
            html += '<div class="col-sm-2">';
            html += '<div class="box-mini">';
            html += '<p>Số: <span class="' + iLoaiPhieu + ' pull-right underline">#' + edu.util.returnEmpty(data[i].SOPHIEUTHU) + '</span></p>';
            html += '<p>Người thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITAO_TAIKHOAN) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zonePhieuThu_TCPT").html(html);
        $("#lblTongPhieuThu").html(dTongPhieuThu);
        $("#lblTongPhieuThu_Huy").html(dTongPhieuThu_Huy);
        $("#lblTongPhieuThu_Sua").html(dTongPhieuThu_Sua);
    },
    /*------------------------------------------
	--Discription: [3] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    cbGenCombo_KeHoachNhanSu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NGUOIDUNG_ID",
                parentId: "",
                name: "NGUOIDUNG_TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhanSu_TCPT"],
            type: "",
            title: "Chọn nhân sự",
        }
        edu.system.loadToCombo_data(obj);
    },
    // Copy từ ruttiennew.js — dùng PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp).
    // Trước đó gọi qua edu.extend.getList_KeHoachNhapHoc_NhanSu, nhưng Core/systemextend.js bản cũ
    // vẫn trỏ về pkg_nhaphoc_thongtin (API cũ) — trang này ép dùng bản mới không phụ thuộc load thứ tự.
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (typeof resolve === "function") resolve(arr);
                    if (typeof callback === "function") callback(arr, data.Pager);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },
}