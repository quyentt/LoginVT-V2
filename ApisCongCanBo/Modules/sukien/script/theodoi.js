/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TheoDoi() { };
TheoDoi.prototype = {
    strSinhVien_Id: '',
    strTheoDoi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSearch").click(function () {
            me.getList_KeHoach();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_TheoDoi();
        });

        $("#btnSave_SuKien").click(function () {
            var arrThem = [];
            var arrXoa = [];
            $("#tblXacNhanSuKien .checksukien").each(function () {
                var point = this;

                if ($(point).is(":checked") && !point.attr("name")) arrThem.push(this.id.replace(/checkX/g, ''));
                else {
                    if (point.attr("name")) arrXoa.push(this.id.replace(/checkX/g, ''))
                }
            });
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblTheoDoi", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            if (!(arrThem.length + arrXoa.length)) {
                edu.system.alert("Không có thay đổi");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (arrThem.length + arrXoa.length));
                arrThem.forEach(e => me.save_XacNhanSuKien(e));
                arrXoa.forEach(e => me.delete_XacNhanSuKien(e));
            });
        });
        $("#tblTheoDoi").delegate('.btnKetQua', 'click', function (e) {
            $('#danhsachdangky').modal('show');
            me["strQLSV_SuKien_HoatDong_Id"] = this.id;
            me.getList_QuanSoTheoLop();
        });
        $("#tblTheoDoi").delegate('.btnCheckIn', 'click', function (e) {
            var strId = this.id;
            me["strQLSV_SuKien_HoatDong_Id"] = strId;
            var aData = me.dtTheoDoi.find(e => e.ID == strId);
            $("#lblSuKien").html(aData.TEN);
            me.toggle_edit();
            me.getList_CheckIn();
        });
        $("#btnSearch").click(function () {
            me.getList_ThongTin();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThongTin();
            }
        });

        $("#btnCheckIn").click(function () {
            me.save_CheckIn();
        });
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_SuKien/LayDSQLSV_SuKien_KeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                selectFirst: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_TheoDoi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_SuKien/LayDSQLSV_SuKien_HoatDong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTheoDoi"] = dtReRult;
                    me.genTable_TheoDoi(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TheoDoi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTheoDoi",
            aaData: data,

            colPos: {
                center: [0, 4, 2, 3, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblThoiGian' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDienGia' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTuLieu' + aData.ID + '"></span>';
                    }
                },
                {
                    //"mDataProp": "HINHANHSUKIEN"
                    "mRender": function (nRow, aData) {
                        return '<img style="max-height: 100px" src="' + edu.system.getRootPathImg(aData.HINHANHSUKIEN) + '"></img>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnCheckIn" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.getList_ThoiGian(e.ID);
            me.getList_DienGia(e.ID);
            edu.system.viewFiles("lblTuLieu" + e.ID, e.ID, "SV_Files");
        });
        /*III. Callback*/
    },
    

    save_XacNhanSuKien: function (strId) {
        var me = this;
        var aData = me.dtQuanSo.find(e => e.ID == strId);
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien/Them_SuKien_KeHoach_ThamGia',
            'type': 'POST',
            'strQLSV_SuKien_KeHoach_Id': aData.QLSV_SUKIEN_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_SuKien_HoatDong_Id': aData.QLSV_SUKIEN_HOATDONG_ID,
            'strNgayThamGia': edu.util.getValById('txtAAAA'),
            //'dGioThamGia': edu.util.getValById('txtAAAA'),
            //'dPhutThamGia': edu.util.getValById('txtAAAA'),
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_XacNhanSuKien: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien/Xoa_SuKien_KeHoach_ThamGia',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Xóa thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_QuanSoTheoLop: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        //var aData = me.dtTheoDoi.find(e => e.ID == strQLSV_SuKien_HoatDong_Id)
        //--Edit
        var obj_list = {
            'action': 'SV_SuKien/LayDSSuKien_KeHoach_DangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_SuKien_HoatDong_Id': me.strQLSV_SuKien_HoatDong_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuanSo"] = dtReRult;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_QuanSoTheoLop: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblXacNhanSuKien",

            //bPaginate: {
            //    strFuntionName: "main_doc.VeThang.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAHOC_TEN"
                },
                {
                    //"mDataProp": "LOAIVE_TEN"
                    "mRender": function (nRow, aData) {
                        var bcheck = aData.DAXACNHANTHAMGIA ? 'checked="checked"' : '';
                        return '<input type="checkbox" class="checksukien" id="checkX' + aData.ID + '" ' + bcheck + ' name="' + edu.util.returnEmpty(aData.DAXACNHANTHAMGIA) + '" />';
                    }
                },
                {
                    "mDataProp": "THOIGIAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_LoaiVe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //    me.getList_NH_Phi(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //})
        /*III. Callback*/
    },

    getList_ThoiGian: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_SuKien/LayDSSuKien_HoatDong_ThoiGian',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_HoatDong_Id': strQLSV_SuKien_HoatDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        var html = "";
                        dtResult.forEach(aData => {
                            html += aData.DIADIEM + '(' + aData.TUNGAY + ' ' + aData.GIOBATDAU + "h" + aData.PHUTBATDAU + " - " + aData.DENNGAY + ' ' + aData.GIOKETTHUC + "h" + aData.PHUTKETTHUC + ")<br/>";
                        })
                        $("#lblThoiGian" + strQLSV_SuKien_HoatDong_Id).html(html);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DienGia: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_SuKien/LayDSSuKien_HoatDong_DienGia',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_HoatDong_Id': strQLSV_SuKien_HoatDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        var html = "";
                        dtResult.forEach(aData => {
                            html += '<b>'+ aData.DIENGIA + '</b> (' + aData.MOTA + ")<br/>";
                        })
                        $("#lblDienGia" + strQLSV_SuKien_HoatDong_Id).html(html);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_CheckIn: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        //var aData = me.dtTheoDoi.find(e => e.ID == strQLSV_SuKien_HoatDong_Id)
        //--Edit
        var obj_list = {
            'action': 'SV_SuKien/LayDSSuKien_KeHoach_ThamGia_CI',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_KeHoach_Id': me.strQLSV_SuKien_HoatDong_Id,
            'strQLSV_SuKien_HoatDong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCheckIn"] = dtReRult;
                    me.genTable_CheckIn(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_CheckIn: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCheckIn",

            //bPaginate: {
            //    strFuntionName: "main_doc.VeThang.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "DANGKYTHAMGIA"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_LoaiVe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //    me.getList_NH_Phi(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //})
        /*III. Callback*/
    },
    
    getList_ThongTin: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        //var aData = me.dtTheoDoi.find(e => e.ID == strQLSV_SuKien_HoatDong_Id)
        //--Edit
        var obj_list = {
            'action': 'SV_SuKien/LayTTKiemTraThamGia',
            'type': 'GET',
            'strMaSoNguoiHoc': edu.util.getValById('txtMaSinhVien'),
            'strMaSoDangKy': edu.util.getValById('txtMaDangKy'),
            'strQLSV_SuKien_HoatDong_Id': me.strQLSV_SuKien_HoatDong_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_CheckIn: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var aData = {};
        if (data.length > 0) {
            aData = data[0]
        };
        edu.util.viewHTMLById("lblHoTen", edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN));
        edu.util.viewHTMLById("lblHeDaoTao", aData.HEDAOTAO);
        edu.util.viewHTMLById("lblKhoaHoc", aData.KHOADAOTAO);
        edu.util.viewHTMLById("lblChuongTrinh", aData.NGANHDAOTAO);
        edu.util.viewHTMLById("lblLopQuanLy", aData.LOPQUANLY);
        edu.util.viewHTMLById("lblTinhTrang", aData.TINHTRANGSINHVIEN);
        edu.util.viewHTMLById("lblTinhTrangDangKy", aData.TINHTRANGDANGKY);
        edu.util.viewHTMLById("lblMaDangKy", aData.MASODANGKY);
        edu.util.viewHTMLById("lblMaSo", aData.MASO);
        var strAnh = edu.system.getRootPathImg(aData.ANHCANHAN);
        $("#lblHinhAnh").html('<img src="' + strAnh + '" alt="' + aData.MASO +'">')
        me["strThamGia_Id"] = aData.ID;
    },

    save_CheckIn: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien/Them_SuKien_KeHoach_ThamGia',
            'type': 'POST',
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strThamGia_Id,
            'strQLSV_SuKien_HoatDong_Id': me.strQLSV_SuKien_HoatDong_Id,
            //'strNgayThamGia': edu.util.getValById('txtAAAA'),
            //'dGioThamGia': edu.util.getValById('txtAAAA'),
            //'dPhutThamGia': edu.util.getValById('txtAAAA'),
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
                    me.getList_CheckIn();
                    me.getList_ThongTin();
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_QuanSoTheoLop();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}
