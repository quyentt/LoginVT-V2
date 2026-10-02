/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 21/08/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DongBoDuLieu() { };
DongBoDuLieu.prototype = {
    objParam_KH: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenCombo_KeHoachNhapHoc);
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        $("#btnChuyen_TT").click(function () {
            if (edu.util.checkValue(edu.util.getValById("dropKeHoachNhapHoc_ChuyenTT"))) {
                edu.system.confirm("Bạn có muốn thực hiện chuyển dữ liệu?");
                $("#myModalAlert").delegate("#btnYes", "click", function (e) {
                    me.ChuyenDuLieuNhapHoc();
                });
            }
            else {
                edu.system.alert("Dữ liệu không hợp lệ", "w");
            }
        });
    },
    /*------------------------------------------
	--Discription: [2] ACESS DB ==> ChuyenDuLieu
	--Author:  
	-------------------------------------------*/
    ChuyenDuLieuNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_ChuyenHoSo/ChuyenDuLieuNhapHoc',

            'versionAPI': 'v1.0',
            'strNHAPHOC_KeHoach_Id': edu.util.getValById("dropKeHoachNhapHoc_ChuyenTT"),
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (data.Success) {
                    var obj = {
                        content: "Chuyển dữ liệu thành công!",
                        code: "s"
                    }
                    edu.system.afterComfirm(obj);
                }
                else {
                    var obj = {
                        content: "NH_ChuyenHoSo.ChuyenDuLieuNhapHoc: " + data.Message,
                        code: "w"
                    }
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                edu.system.endLoading();
                obj_notify = {
                    type: "w",
                    content: "er_ " + JSON.stringify(er),
                }
                edu.system.alert("NH_ChuyenHoSo.ChuyenDuLieuNhapHoc (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
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
    cbGenCombo_KeHoachNhapHoc: function (data, iPager) {
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
            renderPlace: ["dropKeHoachNhapHoc_TT", "dropKeHoachNhapHoc_XoaTT", "dropKeHoachNhapHoc_ChuyenTT"],
            type: "",
            title: "Chọn kế hoạch nhập học",
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