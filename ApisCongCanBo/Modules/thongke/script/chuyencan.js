/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChuyenCan() { };
ChuyenCan.prototype = {
    dtChuyenCan: [],
    dtKieuChuyenCan: [],
    strTail: '',
    init: function () {
        var me = this;
        
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_HeDaoTao();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGian();
        $('.dropSearch_HeDaoTao').on('select2:select', function (e) {
            var strId = this.id;
            strId = strId.substring(strId.lastIndexOf('_'));
            me.strTail = strId;
            edu.system["strTail"] = strId;
            me.getList_KhoaDaoTao();
        });
        $('.dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });


        $('#dropSearch_ThoiGian_HP').on('select2:select', function (e) {
            var strId = this.id;
            me.getList_HocPhan("");
            me.getList_LopHocPhan();
        });
        $('#dropSearch_HocPhan_HP').on('select2:select', function (e) {
            var strId = this.id;
            me.getList_LopHocPhan();
        });
        $('#dropSearch_ThoiGian_HP2').on('select2:select', function (e) {
            var strId = this.id;
            me.getList_HocPhan("2");
        });

        $("#btnSearch_NguoiHoc").click(function (e) {
            me.getList_NguoiHoc();
        });
        $("#btnSearch_Lop").click(function (e) {
            me.getList_Lop();
        });
        $("#btnSearch_Nganh").click(function (e) {
            me.getList_Nganh();
        });
        $("#btnSearch_KhoaQuanLy").click(function (e) {
            me.getList_KQL();
        });
        $("#btnSearch_KhoaDaoTao").click(function (e) {
            me.getList_KDT();
        });
        $("#btnSearch_HocPhan").click(function (e) {
            me.getList_HocPhan_NH();
        });
        $("#btnSearch_HocPhan2").click(function (e) {
            me.getList_HocPhan2_NH();
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "", "", data => {
            me.dtKieuChuyenCan = data;
            var row = '';
            data.forEach(e => {
                row += '<th class="td-center border-left">' + e.TEN + '</th>';
            });

            $("#tblChuyenCan thead tr:eq(1)").append(row);
            document.getElementById("lblTongHop").colSpan = data.length
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.CHUYENCAN.LOAITHONGKE", "dropSearch_LoaiThongKe");

        edu.system.getList_MauImport("zonebtnBaoCao_ChuyenCan", function (addKeyValue) {
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao"));
            addKeyValue("strNganh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            addKeyValue("strNam_Id", edu.util.getValCombo("dropSearch_NamNhapHoc"));
            //addKeyValue("strDanhSachThi_Id", main_doc.NhapDiemHocPhan.strTuiBai_Id);
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });

    },
    getList_NguoiHoc: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachHoSoNhieuNganh',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtTuKhoa'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_NH'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_NH'),
            'strChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_NH'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_Lop: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachLopQuanLy',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_Lop'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_Lop'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_Nganh: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachLopChuongTrinh',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_Nganh'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_Nganh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_KQL: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachKhoaQuanLy',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_KQL'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_KQL'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_KDT: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachKhoaDaoTao',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_Khoa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_HocPhan_NH: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachLopHocPhan',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_HP'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan_HP'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById('dropSearch_LopHocPhan_HP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    getList_HocPhan2_NH: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongKe/LayDanhSachHocPhan',
            'type': 'GET',
            'dPhanLoaiKieuXem': edu.util.getValCheckBoxByDiv("divDenHan"),
            'strLoaiThongKe_Id': edu.util.getValById('dropSearch_LoaiThongKe'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_HP2'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan_HP2'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChuyenCan = dtReRult;
                    me.genTable_ChuyenCan(dtReRult);
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
    genTable_ChuyenCan: function (data, iPager) {
        var me = this;
        $(".addcot").remove();
        data.rsNgayDiemDanh.forEach(e => {
            $("#tblChuyenCan thead tr:eq(0)").append('<th class="td-center addcot border-left" colspan="' + me.dtKieuChuyenCan.length + '">' + edu.util.returnEmpty(e.NGAYGHINHAN) + " " + edu.util.returnEmpty(e.GIO) + "h" + edu.util.returnEmpty(e.PHUT) + "→" + edu.util.returnEmpty(e.GIOKETTHUC) + "h" + edu.util.returnEmpty(e.PHUTKETTHUC) + '</th>');
            var row = '';
            me.dtKieuChuyenCan.forEach(e => {
                row += '<th class="td-center addcot border-left">' + e.TEN + '</th>';
            });
            $("#tblChuyenCan thead tr:eq(1)").append(row);
        })
        var jsonForm = {
            strTable_Id: "tblChuyenCan",

            aaData: data.rs,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                }
            ]
        };
        for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="lbl' + aData.ID + '_' + main_doc.ChuyenCan.dtKieuChuyenCan[iThuTu].ID +'"></span>';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        data.rsNgayDiemDanh.forEach(e => {
            for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
                jsonForm.aoColumns.push({
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        
                        iThuTu = iThuTu % main_doc.ChuyenCan.dtKieuChuyenCan.length;
                        //if (iThuTu == (main_doc.ChuyenCan.dtKieuChuyenCan.length -1)) edu.system.icolumn = 0;
                        return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.ID + ' checkNgay' + main_doc.ChuyenCan.dtKieuChuyenCan[iThuTu].ID + '" id="chkSelect' + aData.ID + '_' + main_doc.ChuyenCan.dtKieuChuyenCan[iThuTu].ID + '_' + e.ID + '"  />'
                            + '<span style="width: calc(100% - 40px); float: right" class="inputChuyenCan" id="input_' + aData.ID + '_' + main_doc.ChuyenCan.dtKieuChuyenCan[iThuTu].ID + '_' + e.ID + '" ></span>';
                    }
                });
                jsonForm.colPos.center.push(jsonForm.aoColumns.length);
            }
        })
        
        edu.system.loadToTable_data(jsonForm);
        data.rs.forEach(e => me.dtKieuChuyenCan.forEach(ele => me.getData_TongHop(e.ID, ele.ID)));
        data.rs.forEach(e => me.dtKieuChuyenCan.forEach(ele => data.rsNgayDiemDanh.forEach(ili => me.getData_NgayChuyenCan(e.ID, ele.ID, ili.ID))));
        /*III. Callback*/
    },
    getData_TongHop: function (strQLSV_NguoiHoc_Id, strKieuChuyenCan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CC_ThongKe/LayKQTongHopChuyenCanTheoNgay',
            'type': 'GET',
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strKieuChuyenCan_Id': strKieuChuyenCan_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => $("#lbl" + strQLSV_NguoiHoc_Id + "_" + strKieuChuyenCan_Id).html(edu.util.returnEmpty(e.SOLUONG)))
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getData_NgayChuyenCan: function (strQLSV_NguoiHoc_Id, strKieuChuyenCan_Id, strNgay_Gio_Phut_Giay_Id) {
        var me = this;
        console.log(strQLSV_NguoiHoc_Id);
        //var objLich = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id);
        //--Edit
        var obj_list = {
            'action': 'CC_ThongKe/LayKQCaNhanChuyenCanTheoNgay',
            'type': 'GET',
            'strNgay_Gio_Phut_Giay_Id': strNgay_Gio_Phut_Giay_Id,
            'strKieuChuyenCan_Id': strKieuChuyenCan_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + strQLSV_NguoiHoc_Id + "_" + strKieuChuyenCan_Id + "_" + strNgay_Gio_Phut_Giay_Id);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);
                            var inputCheck = $("#input_" + strQLSV_NguoiHoc_Id + "_" + strKieuChuyenCan_Id + "_" + strNgay_Gio_Phut_Giay_Id);
                            if (dtReRult[i].SOLUONG != 0) {
                                inputCheck.html(dtReRult[i].SOLUONG);
                                inputCheck.attr("name", dtReRult[i].SOLUONG);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },


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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao" + me.strTail),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
        console.log(me.strTail);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao" + me.strTail),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao" + me.strTail),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao" + me.strTail),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh" + me.strTail),
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
            renderPlace: ["dropSearch_HeDaoTao_NH", "dropSearch_HeDaoTao_Lop", "dropSearch_HeDaoTao_Nganh", "dropSearch_HeDaoTao_KQL", "dropSearch_HeDaoTao_Khoa"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.ChuyenCan;
        console.log(me.strTail);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao" + me.strTail],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao" + me.strTail).val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.ChuyenCan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh" + me.strTail],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh" + me.strTail).val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.ChuyenCan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Lop" + me.strTail],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop" + me.strTail).val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ChuyenCan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_KQL"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_KQL").val("").trigger("change");
    },


    getList_ThoiGian: function () {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongTin/LayDSThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
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
            renderPlace: ["dropSearch_ThoiGian_HP", "dropSearch_ThoiGian_HP2"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function (strId) {
        if (strId == undefined) strId = "";
        var me = this;
        var obj_list = {
            'action': 'CC_ThongTin/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_HP' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HocPhan(json, strId);
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
    cbGenCombo_HocPhan: function (data, strId) {
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
            renderPlace: ["dropSearch_HocPhan_HP" + strId],
            type: "",
            title: "Tất cả học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_LopHocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'CC_ThongTin/LayDSLopHocPhan',
            'type': 'GET',
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan_HP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_HP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LopHocPhan(json);
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
    cbGenCombo_LopHocPhan: function (data) {
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
            renderPlace: ["dropSearch_LopHocPhan_HP"],
            type: "",
            title: "Tất cả lớp học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
}