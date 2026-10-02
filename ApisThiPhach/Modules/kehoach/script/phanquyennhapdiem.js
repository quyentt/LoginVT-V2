/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapDiem() { };
NhapDiem.prototype = {
    dtTuiBai: [],
    dtNhapDiem: [],
    strNhapDiem_Id: '',
    strTuiBai_Id: '',
    strLoaiXacNhan: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        me.getList_TuiBai();
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();


        $("#btnSearch").click(function (e) {
            me.getList_TuiBai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TuiBai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_NhapDiem").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_NhapDiem();
            }
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem" });
        });
        $("[id$=chkSelectAll_NhapDiem]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem" });
        });
        $("#tblNhapDiem").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strTuiBai_Id = strId;
            edu.util.setOne_BgRow(strId, "tblNhapDiem");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtTuiBai, "ID")[0];
                me.viewEdit_NhapDiem(data);
                me.getList_TuiThi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSave_TuiThi").click(function () {
            var arrChecked_Id = [];

            me.dtNhapDiem.forEach(e => {
                var pointDiem = $("#txtDiem" + e.ID);
                var pointSoPhach = $("#txtSoPhach" + e.ID);
                if (pointDiem.val() != pointDiem.attr("name") || pointSoPhach.val() != pointSoPhach.attr("name")) arrChecked_Id.push(e.ID);
            });
            if (arrChecked_Id.length > 0) {

                edu.system.confirm("Bạn có chắc chắn lưu " + arrChecked_Id.length + " dữ liệu không?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.save_NhapDiem(arrChecked_Id[i]);
                    }
                });
            }
        });


        $("#tblTuiBai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            edu.util.setOne_BgRow(strId, "tblNhapDiem");
            if (edu.util.checkValue(strId)) {
                me.getList_TuiThi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNhapDiem_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        
        $('#dropSearch_DSThi').on('select2:select', function (e) {
            me.getList_NhapDiem();
            me.getList_TuiBai();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            //me.getList_TuiBai();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            me.getList_TuiBai();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            me.getList_TuiBai();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            me.getList_TuiBai();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_TuiBai();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_TuiBai();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_Nhap", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.NhapDiem.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });

        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMTUIBAI";
            
            me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });

        $(".btnXacNhanTheoTui").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEM_TUIBAI";

            me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            me.getList_XacNhan(edu.util.getValById("dropSearch_DSThi"), "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            
            if (me.strLoaiXacNhan != "XACNHAN_HOANTHANH_DIEM_TUIBAI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
                arrChecked_Id.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
            }
            else {
                me.save_XacNhanSanPham(edu.util.getValById("dropSearch_DSThi"), strTinhTrang, strMoTa, me.strLoaiXacNhan)
            }
        });

        $(".btnXacNhanTungSinhVien").click(function () {
            $("#modal_XacNhanTungSinhVien").modal("show");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC";
            me.getList_BtnXacNhanSanPham("#zoneBtnXacNhanTungSinhVien", me.strLoaiXacNhan);
            me.actionCopyXacNhan("tblTuiThi", [1]);
            var point = document.getElementById("tblTuiThi").getElementsByTagName("tbody")[0].rows
            for (var i = 0; i < point.length; i++) {
                getXacNhan(point[i].id)
            }

            function getXacNhan(strZoneId) {
                var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === strZoneId);
                if (strNguoiHoc_Id) {
                    strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                    me.getList_XacNhan(edu.util.getValById("dropSearch_DSThi") + strNguoiHoc_Id, "", data => { 
                        if (data.length > 0) $("#lblTinhTrang" + strZoneId).html(data[0].TEN)
                    }, me.strLoaiXacNhan)
                }
                
            }
        });
        $("#zoneBtnXacNhanTungSinhVien").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanTungSinhVien");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_DanhSachXacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                //edu.system.alert("Vui lòng chọn đối tượng?");
                //return;
            } else {
                var strTuiBai_Id = edu.util.getValById("dropSearch_DSThi")
                arrChecked_Id.forEach(e => {
                    var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === e);
                    if (strNguoiHoc_Id) {
                        strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                        me.save_XacNhanSanPham(strTuiBai_Id + strNguoiHoc_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
                    }

                })

                $("#modal_XacNhanTungSinhVien").modal('hide');
            }

        });

        me.getList_CoCauToChuc();
        me.getList_HS();
        $('#dropDonViPhanQuyen').on('select2:select', function (e) {
            me.getList_HS();
        });
        $("#btnPhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.getList_SanPhamPhanQuyen(arrChecked_Id.toString());
            edu.util.toggle_overide("zone-bus", "zonePhanQuyen");

        });
        edu.system.loadToCombo_DanhMucDuLieu("CHUNG.HANHDONG", "dropHanhDongPhanQuyen");
        $("#btnSave_PhanQuyen").click(function () {
            var arrCheckedDuLieu_Id = edu.util.getArrCheckedIds("tblSanPhamPhanQuyen", "checkX");
            if (arrCheckedDuLieu_Id.length == 0) {
                edu.system.alert("Vui lòng chọn dữ liệu phân quyền?");
                return;
            }
            var arrCheckedNhanSu_Id = edu.util.getArrCheckedIds("tblNhanSuPhanQuyen", "checkX");
            if (arrCheckedNhanSu_Id.length == 0) {
                edu.system.alert("Vui lòng chọn người dùng phân quyền?");
                return;
            }
            var arrHanhDong = $("#dropHanhDongPhanQuyen").val();
            if (arrHanhDong.length == 0) {
                edu.system.alert("Vui lòng chọn hàng động phân quyền?");
                return;
            }
            arrCheckedDuLieu_Id.forEach(eDuLieu => arrCheckedNhanSu_Id.forEach(eNhanSu => arrHanhDong.forEach(eHanhDong => me.save_PhanQuyen(eDuLieu, eNhanSu, eHanhDong))));
        });

        $("#tblNhapDiem").delegate('.btnDSQuyen', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSPhanQuyen");
            me['strThi_DotPhach_Id'] = strId;
            me.getList_PhanQuyen();
        });
        $(".btnDeleteDuLieuPhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuLieuPhanQuyen", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanQuyen(arrChecked_Id[i]);
                }
            });
        });
    },
    
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_TuiBai();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiBai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDotTaoPhach',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuiBai = dtReRult;
                    me.genTable_TuiBai(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TuiBai: function (data, iPager) {
        var me = this;
        $("#lblTuiBai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhapDiem",

            bPaginate: {
                strFuntionName: "main_doc.NhapDiem.getList_TuiBai()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TEN) + '</a></span>';
                    }
                },

                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSQuyen" id="' + aData.ID + '" title="Chi tiết">Quyền nhập điểm</a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_NhapDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_XuLy/LayDSPhachTheoTui',
            'type': 'GET',
            'strThi_TuiBai_Id': edu.util.getValById('dropSearch_DSThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNhapDiem = dtReRult;
                    me.genTable_NhapDiem(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NhapDiem: function (strId) {
        var me = this;
        //--Edit
        var objNhapDiem = me.dtNhapDiem.find(e => e.ID == strId);

        var obj_list = {
            'action': 'TP_XuLy/CapNhat_DiemPhachTheoTuiBai', 
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strThi_TuiBai_NguoiHoc_Id': strId,
            'strSoPhach': objNhapDiem.SOPHACH,
            'strDiem': edu.util.getValById('txtDiem' + strId),
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhapDiem_Id = "";
                    edu.system.alert("Thực hiện thành công!");
                    //if (obj_list.strId == "") {
                    //    edu.system.alert("Thêm mới thành công!");
                    //    strNhapDiem_Id = data.Id;
                    //    var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaGan", "checkX");
                    //    for (var i = 0; i < arrChecked_Id.length; i++) {
                    //        me.save_Thi(strNhapDiem_Id, arrChecked_Id[i]);
                    //    }
                    //    me.toggle_form();
                    //}
                    //else {
                    //    edu.system.alert("Cập nhật thành công!");
                    //    strNhapDiem_Id = obj_list.strId;
                    //}
                    //me.save_QuyTacPhach(strNhapDiem_Id);

                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("XLHV_NhapDiem/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: obj_list.type,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NhapDiem();
                });
            },
            contentType: true,
            
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapDiem: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_list = {
            'action': 'TP_DotPhach/Xoa',
            'type': 'POST',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NhapDiem();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: obj_list.type,
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_NhapDiem: function (data, iPager) {
        var me = this;
        $("#lblNhapDiem_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTuiThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_NhapDiem()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "SOPHACH"
                },
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<input id="txtSoPhach' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.SOPHACH) + '" name="' + edu.util.returnEmpty(aData.SOPHACH) + '" />';
                //    }
                //},
                {
                    "mRender": function (nRow, aData) {

                        if (aData.CAMTHI_DUYETDKTHI == "1" || aData.CAMTHI_VIPHAMQUYCHE == "1") return '';
                        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" name="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" />';
                    }
                },
                {
                    "mDataProp": "THONGTINXULY"
                },
                {
                    "mDataProp": "NGUOISUA_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYSUA_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable("tblTuiThi")
    },
    viewEdit_NhapDiem: function (data) {
        var me = this;
        //View - Thong tin
        $("#lblTuiThi").html(edu.util.returnEmpty(data.QUYTACTAOTUI_TEN) + " - " + edu.util.returnEmpty(data.QUYTACTAOPHACH_TEN) + " - " + edu.util.returnEmpty(data.BUOCNHAY) + " - " + edu.util.returnEmpty(data.SOBATDAU));
        $("#lblTenDot").html(data.TEN);
        edu.util.viewValById("txtTen", data.TEN);
        $("#tblChuaGan tbody").html("");
        $("#tblDaGan tbody").html("");
        me.strNhapDiem_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSTuiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TuiThi(dtReRult, data.Pager);
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
    genTable_TuiThi: function (data, iPager, strThi_DotPhach_Id) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DSThi"],
            type: "",
            title: "Chọn danh sách thi",
        };
        edu.system.loadToCombo_data(obj);

        if (data.length > 0) {
            edu.util.viewValById("dropSearch_DSThi", data[0].ID);
            me.getList_NhapDiem();
        }
        
        /*III. Callback*/
    },

    getList_SanPhamPhanQuyen: function (strThi_DotPhach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSTuiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': strThi_DotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_SanPhamPhanQuyen(dtReRult, data.Pager);
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
    genTable_SanPhamPhanQuyen: function (data, iPager, strThi_DotPhach_Id) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblSanPhamPhanQuyen",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_NhapDiem()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THI_DOTPHACH_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_DotThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MonThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MonThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MonThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                }
            },
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayLoaiDiem',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDiem(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HinhThucThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HinhThucThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_HinhThucThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data, strZoneXacNhan) {
        main_doc.NhapDiem.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $(strZoneXacNhan).html(row);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_XacNhan/Them_Diem_XacNhan',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    actionCopyXacNhan: function (strTable_Id, arrCols) {
        var me = this;
        $("#modal_XacNhanTungSinhVien").modal("show")
        var pointHead = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows
        var html = '';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        arrCols.forEach(e => {
            html += '<th class="td-center">' + pointHead[0].cells[e].innerText;
            html += '</th>';
        })
        html += '<th class="td-center">Tình trạng';
        html += '</th>';
        html += '<th class="td-center td-fixed">';
        html += '</th>';
        html += '</tr>';
        $("#tblModal_DanhSachXacNhan thead").html(html);

        var point = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows
        var html = '';
        for (var i = 0; i < point.length; i++) {
            html += '<tr class="btnChiTiet poiter" id="' + point[i].id + '">';
            html += '<td class="td-fixed td-center">' + (i + 1) + '</td>';
            arrCols.forEach(e => {
                html += '<td class="td-center">' + point[i].cells[e].innerText;
                html += '</td>';
            })
            html += '<td class="td-center"><span type="checkbox" id="lblTinhTrang' + point[i].id + '" ></span></td>';
            html += '<td class="td-center td-fixed"><input type="checkbox" id="checkX' + point[i].id + '"/></td>';
            html += '</tr>';
        }
        $("#tblModal_DanhSachXacNhan tbody").html(html);
        $("#tblModal_DanhSachXacNhan").delegate('.btnChiTiet', 'click', function (e) {
            var strId = this.id;
            edu.util.setOne_BgRow(strId, "tblModal_DanhSachXacNhan");
            if (edu.util.checkValue(strId)) {
                var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === strId);
                if (strNguoiHoc_Id) {
                    strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                    me.getList_XacNhan(edu.util.getValById("dropSearch_DSThi") + strNguoiHoc_Id, "tblModal_XacNhanDSTungSinhVien", null, me.strLoaiXacNhan)
                }
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },


    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropDonViPhanQuyen"],
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropDonViPhanQuyen");
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchNhanSuPhanQuyen"),
            pageIndex: 1,
            pageSize: 100000,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: '',
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': -1
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);
        //var obj_list = {
        //    'action': 'CMS_NguoiDung/LayDanhSach',


        //    'strTuKhoa': edu.util.getValById("btnSearchNhanSuPhanQuyen"),
        //    'pageIndex': edu.system.pageIndex_default,
        //    'pageSize': edu.system.pageSize_default,
        //    'dTrangThai': -1,
        //    'strChung_DonVi_Id': edu.util.getValById("dropDonViPhanQuyen"),
        //    'strVaiTro_Id': "",
        //    'strPhanLoaiDoiTuong': "",
        //    'strCapXuLy_Id': "",
        //    'strTinhThanh_Id': ""
        //};
        ////
        //edu.system.makeRequest({
        //    success: function (data) {
        //        if (data.Success) {
        //            me.genTable_HS(data.Data, data.Pager)
        //        }
        //        else {
        //            edu.system.alert("CMS_NguoiDung/LayDanhSach: " + data.Message, "w");

        //        }
        //    },
        //    error: function (er) {

        //        edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
        //    },
        //    type: 'GET',
        //    action: obj_list.action,

        //    contentType: true,

        //    data: obj_list,
        //    fakedb: [

        //    ]
        //}, false, false, false, null);
    },
    genTable_HS: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhanSuPhanQuyen",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NhapDiem.getList_HS()",
                iDataRow: 1,
                bFilter: true,
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                }
                , {
                    "mDataProp": "COCAUTOCHUC_TEN"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    save_PhanQuyen: function (strDST_Tui_Id, strNguoiDung_Id, strHanhDong_Id) {
        var me = this;
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/Them_Thi_GiaoVien_NhapDiem',
            'type': 'POST',
            'strDST_Tui_Id': strDST_Tui_Id,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strHanhDong_Id': strHanhDong_Id,
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_PhanQuyen: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/Xoa_Thi_GiaoVien_NhapDiem',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_PhanQuyen();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: obj_list.type,
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanQuyen();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanQuyen: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSQuyenDotPhach_GV_NhapDiem',
            'type': 'GET',
            'strThi_DotPhach_Id': me.strThi_DotPhach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_PhanQuyen(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_PhanQuyen: function (data, iPager) {
        var me = this;
        $("#lblTuiBai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuLieuPhanQuyen",

            bPaginate: {
                strFuntionName: "main_doc.NhapDiem.getList_NhapDiem()",
                iDataRow: 1,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DST_TUI_TEN"
                },
                {
                    //"mDataProp": "MA",
                    "mRender": function (nRow, aData) {
                        return aData.NGUOIDUNG_TAIKHOAN + ' (' + aData.NGUOIDUNG_TENDAYDU + ')';
                    }
                },
                {
                    "mDataProp": "HANHDONG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}