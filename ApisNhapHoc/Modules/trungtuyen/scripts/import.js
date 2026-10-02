/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 20/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ImportTrungTuyen() { };
ImportTrungTuyen.prototype = {
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
        $("#btnAddnew_KHNH").click(function () {
            me.popup();
        });
        $("#btnImport_TT").click(function (e) {
            var urlfile = $("#txtThongTinDinhKem_TT").val();
            console.log("urlfile: " + urlfile);
            if (urlfile == "" || urlfile == null || urlfile == undefined) {
                edu.system.alert("Vui lòng chọn file trước khi thực hiện import dữ liệu!");
                return false;
            }
            me.import_TrungTuyen();
            //var url = "Import.aspx?strNguoiThucHien_Id=" + edu.system.userId + "&urlfile=" + urlfile;
            //window.open(url, "_blank");
        });
        $("#btnDelete_TT").click(function () {
            if (edu.util.checkValue(edu.util.getValById("dropKeHoachNhapHoc_XoaTT")) && edu.util.checkValue(edu.util.getValById("txtSoLuongCanhBao")) <= 100) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu Người học không?");
                $("#myModalAlert").delegate("#btnYes", "click", function (e) {
                    me.Xoa_QLSV_NGUOIHOC_TTTS_KeHoach();
                });
            }
            else {
                edu.system.alert("Dữ liệu không hợp lệ", "w");
            }
        });
        /*------------------------------------------
        --Discription: Loadfile
        -------------------------------------------*/
        edu.system.uploadImport(["txtThongTinDinhKem_TT"], "");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    popup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModal_KHNH").modal("show");
    },
    import_TrungTuyen: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/Import',
            'versionAPI': 'v1.0',

            'urlfile'               : edu.util.getValById("txtThongTinDinhKem_TT"),
            'strKeHoachNhapHoc_Id'  : edu.util.getValById("dropKeHoachNhapHoc_TT"),
            'strNguoiThucHien_Id'   : edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (data.Success) {
                    //get
                    var count = data.Pager;
                    var list_detail = data.Message;
                    var arrDetail = edu.util.convertStrToArr(list_detail, "@");
                    var arrCount = edu.util.convertStrToArr(count, "@");
                    var countSuccess = arrCount[0];
                    var countTotal = arrCount[1];
                    var tbody = "";
                    $("#tblError_Import tbody").html("");
                    $("#lblTinhTrang_Import").html("");
                    //gen
                    $("#lblTinhTrang_Import").html("(" + countSuccess + "/" + countTotal + ")");
                    for (var i = 0; i < arrDetail.length; i++) {
                        tbody += '<tr>';
                        tbody += '<td class="td-center">' + (i + 1) + '</td>';
                        tbody += '<td>' + arrDetail[i] + '</td>';
                        tbody += '</tr>';
                    }
                    $("#tblError_Import tbody").html(tbody);
                    $('#zoneNotify_Import').slimScroll({
                        position: 'right',
                        height: "500px",
                        railVisible: true,
                        alwaysVisible: false
                    });
                }
                else {
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.Import: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                obj_notify = {
                    type: "w",
                    content: "er_ " + JSON.stringify(er),
                }
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.Import (er): " + JSON.stringify(er), "w");
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
	--Discription: [1] ACESS DB ==> NguoiHoc_TTTS
	--Author:  
	-------------------------------------------*/
    Xoa_QLSV_NGUOIHOC_TTTS_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa_QLSV_NGUOIHOC_TTTS_KeHoach',
            'versionAPI': 'v1.0',

            'strTAICHINH_KeHoach_Id': edu.util.getValById("dropKeHoachNhapHoc_XoaTT"),
            'dGioiHanSoLuongCanhBao': edu.util.getValById("txtSoLuongCanhBao"),
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: "s"
                    }
                    edu.system.afterComfirm(obj);
                }
                else {
                    var obj = {
                        content: "NH_NguoiHoc_ThongTinTuyenSinh.Xoa_QLSV_NGUOIHOC_TTTS_KeHoach: " + data.Message,
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
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.Xoa_QLSV_NGUOIHOC_TTTS_KeHoach (er): " + JSON.stringify(er), "w");
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
            renderPlace: ["dropKeHoachNhapHoc_TT", "dropKeHoachNhapHoc_XoaTT"],
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