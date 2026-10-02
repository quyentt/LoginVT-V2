/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThucHienXet() { };
ThucHienXet.prototype = {
    dtThucHienXet: [],
    strThucHienXet_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    objHangDoi: {},
    strHeadDat: '',
    strHeadKhongDat: '',
    dtDat_ChiTiet: {},
    dtKhongDat_ChiTiet: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_ThoiGianDaoTao();
        me.getList_ThucHienXet();
        //me.getList_PhanLoai();
        me.getList_QuyHocBong();
        me.strHeadDat = $("#tblDat thead").html();
        me.strHeadKhongDat = $("#tblKhongDat thead").html();

        $("#btnSearch").click(function (e) {
            me.getList_ThucHienXet();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ThucHienXet();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnThucHienCongNhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng xét?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xét không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXet"></div>');
                edu.system.genHTML_Progress("zoneprocessXet", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThucHienXet(arrChecked_Id[i]);
                }
            });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThucHienXet" });
        });
        $("#btnXoaThucHienXet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXet"></div>');
                edu.system.genHTML_Progress("zoneprocessXet", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThucHienXet(arrChecked_Id[i]);
                }
            });
        });
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtThucHienXet_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblThucHienXet").delegate('.btnDSDoiTuong', 'click', function (e) {
            $('#myModal').modal('show');
            me["strHB_KeHoach_Id"] = this.id;
            me.getList_DoiTuong(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSDat', 'click', function (e) {
            $('#myModalDat').modal('show');
            me["strHB_KeHoach_Id"] = this.id;
            me.getList_Dat_ChiTiet(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSKhongDat', 'click', function (e) {
            $('#myModalKhongDat').modal('show');
            me["strHB_KeHoach_Id"] = this.id;
            me.getList_KhongDat_ChiTiet(this.id);
        });
        $("#tblKhongDat").delegate('.btnDSHocPhan', 'click', function (e) {
            $('#myModalKhongDat').modal('show');
            me["strHB_KeHoach_Id"] = this.id;
            me.getList_KhongDat_HocPhan(this.id);
        });
        $("#tblQuanSoLop, #tblDat, #tblKhongDat").delegate('.btnView_HocTap', 'click', function (e) {
            $('#modalHTSinhVien').modal('show');
            me["strSinhVien_Id"] = this.id;
            window._embeddedSinhVien_Id = this.id;
            edu.system.loadPage($("#zoneHTSinhVien"), '/modules/hoctap/html/diemhoc.html', null, null, 'ApisCongSinhVien');
        });
        me.objHangDoi = {
            strLoaiNhiemVu: "XET_HB",
            strName: "ThucHienXet",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        $("#btnTaoHangDoi").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Thực hiện xét</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi();
            });

        });
        $("#btnXetHocBong").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng xét?");
                return;
            }
            //$("#myModal").modal("hide")
            edu.system.alert('<div id="zoneprocessXet"></div>');
            edu.system.genHTML_Progress("zoneprocessXet", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XetHocBong(arrChecked_Id[i]);
            }
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThucHienXet_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_ThucHienXet();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThucHienXet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_ThongTin/LayDSHB_KeHoach',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            
            'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
            'dHieuLuc': 1,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThucHienXet = dtReRult;
                    me.genTable_ThucHienXet(dtReRult, data.Pager);
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
    save_ThucHienXet: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_KetQua/Them_HB_KetQua_CongNhan',

            'strId':"",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThucHienXet_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    me.getList_ThucHienXet();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThucHienXet: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'HB_KetQua/Xoa',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    content: " " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    me.getList_ThucHienXet();
                });
            },
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Lop: function (strHB_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_KeHoach_PhamVi/Them_HB_KeHoach_PhamViLop',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strHB_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_KeHoach_PhamVi/Them_HB_KeHoach_PhamViCT',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert(": " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strHB_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_KeHoach_PhamVi/Them_HB_KeHoach_PhamViKhoa',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert(": " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ThucHienXet: function (data, iPager) {
        var me = this;
        $("#lblThucHienXet_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThucHienXet",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_ThucHienXet()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 10, 11, 12],
            },
            aoColumns: [
                //{
                //    "mDataProp": "TN_KEHOACH_MA"
                //},
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default " id="DSPhanCong' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "DIEUKIENXET"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDat" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSKhongDat" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
                ,
                {
                    "mData": "KETQUACHINHTHUC",
                    "mRender": function (nRow, aData) {
                        return (aData.KETQUACHINHTHUC  == 1) ? "Chính thức": "";
                    }
                },{
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.getList_PhanCong(data[i].ID);
        }
    },
    viewEdit_ThucHienXet: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropKetQua", data.KETQUACHINHTHUC);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        me.strThucHienXet_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/

    getList_PhanCong: function (strHB_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arrNhanSu = [];
                    data.Data.forEach(e => {
                        if (!arrNhanSu.includes(e.NGUOICUOI_TENDAYDU)) arrNhanSu.push(e.NGUOICUOI_TENDAYDU);
                    });
                    $("#DSPhanCong" + strHB_KeHoach_Id).html(arrNhanSu.toString());
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

    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function (strHB_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('tblQuanSoLop_input'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': me.strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //var strDoiTuong = "";
                    //for (var i = 0; i < data.Data.length; i++) {
                    //    strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    //}
                    //if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    //$("#DSDoiTuong").html(strDoiTuong);
                    me["dtQuanSoXet"] = data.Data;
                    me.genTable_QuanSoTheoLop(data.Data, data.Pager);
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
    genTable_QuanSoTheoLop: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_DoiTuong('" + strHB_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }, {
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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult);
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        //--Edit
        var obj_save = {
            'action': 'HB_KeHoach_PhamVi/ThemMoi',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strQLSV_KeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': strNhanSu_Id,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'HB_KeHoach_PhamVi/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_MASO) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_HOTEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.ThucHienXet;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.ThucHienXet;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVien: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienMD("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.extend.getList_HeDaoTao();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMD("SEARCH");
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            me.getList_SinhVienMD();
        });
    },
    getList_SinhVienMD: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVien(dtResult, iPager);
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
    cbGetListModal_SinhVien: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_SinhVienMD('SEARCH')",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ThucHienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropKeHoachXuLy_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.ThucHienXet.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strKeHoachXuLy_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'HB_KeHoach_NhanSu/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': strKeHoachXuLy_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'HB_KeHoach_NhanSu/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strHB_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'HB_KeHoach_NhanSu/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NGUOIDUNG_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TAIKHOAN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TENDAYDU) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID");
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html); edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    getList_Dat_ChiTiet: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_KetQua/LayChiTiet',
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDat_ChiTiet = data.Data;
                    me.getList_Dat(strHB_KeHoach_Id);
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
    getList_Dat: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_KetQua/LayDanhSach',
            'strTuKhoa': edu.util.getValById('tblDat_input'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': me.strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_Dat(dtReRult, data.Pager, strHB_KeHoach_Id);
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
    genTable_Dat: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        $("#tblDat thead").html(me.strHeadDat);
        for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
            $("#tblDat thead tr:eq(0)").append('<th class="td-center">' + me.dtDat_ChiTiet.rsCot[j].TEN + '</th>');
        }
        var jsonForm = {
            strTable_Id: "tblDat",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_Dat('" + strHB_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_THAYDOI_TEN"
                }
            ]
        };
        for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="zone_' + aData.ID + '_' + main_doc.ThucHienXet.dtDat_ChiTiet.rsCot[iThuTu].ID + '" ></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < me.dtDat_ChiTiet.rsDuLieu.length; i++) {
            var aData = me.dtDat_ChiTiet.rsDuLieu[i];
            $("#zone_" + aData.HB_KETQUA_ID + "_" + aData.ID).html(edu.util.returnEmpty(aData.GIATRI));
        }
        /*III. Callback*/
    },

    getList_KhongDat_ChiTiet: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_KetQua/LayDSHB_KetQua_Loi_ChiTiet',
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhongDat_ChiTiet = data.Data;
                    me.getList_KhongDat(strHB_KeHoach_Id);
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
    getList_KhongDat: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_KetQua/LayDSHB_KetQua_Loi',
            'strTuKhoa': edu.util.getValById('tblKhongDat_input'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KhongDat(dtReRult, data.Pager, strHB_KeHoach_Id);
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
    genTable_KhongDat: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        me["dtKhongDat"] = data;
        $("#tblKhongDat thead").html(me.strHeadKhongDat);
        for (var j = 0; j < me.dtKhongDat_ChiTiet.rsCot.length; j++) {
            $("#tblKhongDat thead tr:eq(0)").append('<th class="td-center">' + me.dtKhongDat_ChiTiet.rsCot[j].TEN + '</th>');
        }
        var jsonForm = {
            strTable_Id: "tblKhongDat",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_KhongDat('" + strHB_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSHocPhan" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
            ]
        };
        for (var j = 0; j < me.dtKhongDat_ChiTiet.rsCot.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="zone_' + aData.ID + '_' + main_doc.ThucHienXet.dtKhongDat_ChiTiet.rsCot[iThuTu].ID + '" ></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < me.dtKhongDat_ChiTiet.rsDuLieu.length; i++) {
            var aData = me.dtKhongDat_ChiTiet.rsDuLieu[i];
            $("#zone_" + aData.HB_KETQUA_ID + "_" + aData.ID).html(edu.util.returnEmpty(aData.GIATRI));
        }
        /*III. Callback*/
    },


    getList_KhongDat_HocPhan: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var html = "";
        var aData = edu.util.objGetOneDataInData(strQLSV_NguoiHoc_Id, me.dtKhongDat, "QLSV_NGUOIHOC_ID");
        if (aData.length != 0) {
            html = "Chi tiết học phần không đạt " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HOTEN) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
        }
        $("#nameHocPhan").html(html);
        $("#tblHocPhan").show();
        //--Edit
        var obj_list = {
            'action': 'TN_KetQuaHocPhan/LayDanhSach',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strHB_KeHoach_Id': aData.TN_KEHOACH_ID,
            'strPhanLoai_Id': aData.PHANLOAI_ID,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KhongDat_HocPhan(dtReRult, data.Pager);
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
    genTable_KhongDat_HocPhan: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mData": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                    }
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "MOTA"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi: function () {
        var me = this;
        var obj_notify = {};
        var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng?");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'HB_HangDoi/TaoHangDoi_HB_TuDong',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHB_KeHoach_Id': arrChecked_Id.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "" + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: " " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
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
    endHangDoi: function () {
        var me = main_doc.ThucHienXet;
    },


    getList_QuyHocBong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_QuyHocBong/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_QuyHocBong(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_QuyHocBong: function (data) {
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
            renderPlace: ["dropSearch_QuyHocBong", "dropQuyHocBong"],
            type: "",
            title: "Chọn quỹ học bổng",
        }
        edu.system.loadToCombo_data(obj);
    },

    save_XetHocBong: function (strId) {
        var me = this;
        var aData = me.dtQuanSoXet.find(e => e.ID == strId)
        //--Edit
        var obj_save = {
            'action': 'XLHV_HB_TinhToan_MH/GSQ1CS4iAy4vJgPP',
            'func': 'pkg_hocbong_tinhtoan.XetHocBong',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID ,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID ,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strHB_KeHoach_Id': aData.HB_KEHOACH_ID,
            'strHB_QuyHocBong_Id': aData.HB_QUYHOCBONG_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThucHienXet_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");

                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    //me.getList_ThucHienXet();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}