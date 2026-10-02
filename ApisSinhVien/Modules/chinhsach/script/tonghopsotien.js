/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TongHopSoTien() { };
TongHopSoTien.prototype = {
    dtDoiTuong: [],
    dtDoiTuong_View: [],
    dtSinhVien: [],
    strHead: '',

    init: function () {
        var me = this;
        me.strHead = $("#tblKetQua thead").html();
        me.getList_NguoiThu();
        me.getList_TrangThaiSV();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_DMLKT();
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropSearch_KieuHoc");
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.CDCS", "dropSearch_CheDo");
        $("#btnSearch").click(function (e) {            
            me.getList_TongHop();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TongHop();
            }
        });
        $(".btnClose").click(function (e) {
            $("#zone_nhap").slideUp();
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy();
        });
        $('#dropSearch_HocKy').on('select2:select', function (e) {
            var strValue = $('#dropSearch_HocKy').val();
            if (!(strValue.length > 1 || strValue[0] != "")) {
                $("#dropSearch_KyThucHien").parent().hide();
            } else {
                $("#dropSearch_KyThucHien").parent().show();
            }
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_CheDo').on('select2:select', function () {
            me.getList_DoiTuong_CheDo(this);
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbLKT").each(function () {
                this.checked = checked_status;
            });
        });
        $("#btnSaveChinhSach_PhanTram").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblKetQua tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                var arrId = x[i].id.split("_");
                var point_PT = $("#txtPhanTram_" + arrId[1] + "_" + arrId[2]);
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("title")) || point_PT.val() != edu.util.returnEmpty(point_PT.attr("title"))) {
                    if ($(x[i]).val() == "" && point_PT.val() == "") {
                        if (edu.util.checkValue($(x[i]).attr("name"))) arrXoa.push($(x[i]).attr("name"));
                    }
                    else {
                        arrThem.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>');
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_KetQua(arrXoa[i]);
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_KetQua(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        edu.system.getList_MauImport("zonebtnBaoCao_THST", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
            addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy"));
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao"));
            addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao"));
            addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_HocKy"));
            addKeyValue("strTaiChinh_CacKhoanThu_Id", edu.util.getValCombo("dropSearch_KhoanThu"));
            addKeyValue("strDoiTuong_Id", edu.util.getValCombo("dropSearch_DoiTuong"));
            addKeyValue("strCheDoChinhSach_Id", edu.util.getValCombo("dropSearch_CheDo"));
        });
        $("#btnAdd_KeThua").click(function () {
            $("#myModalKeThua").modal("show");
        });
        $("#btnSave_KeThua").click(function () {
            $('#myModalKeThua').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa không?");
            $("#btnYes").click(function (e) {
                me.KeThua_TheoThang();
            });
        });
        $("#btnSave_KeThua_Nam").click(function () {
            $('#myModalKeThua').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa không?");
            $("#btnYes").click(function (e) {
                me.KeThua_TheoNam();
            });
        });
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
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
    getList_NguoiThu: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_NguoiDungDaThuTien/LayDanhSach',
            'versionAPI': 'v1.0',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiThu(json);
                } else {
                    console.log(data.Message);
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            'versionAPI': 'v1.0',

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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
            renderPlace: ["dropSearch_HocKy"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy").val("").trigger("change");
    },
    cbGenCombo_NguoiThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NguoiThu"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-2 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-2 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
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
    },
    getList_DMLKT: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',

            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': "",
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genList_DMLKT(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genList_DMLKT: function (data) {
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
            renderPlace: ["dropSearch_KhoanThu"],
            type: "",
            title: "Tất cả khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_DoiTuong_CheDo: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_ChinhSach/LayDS_DoiTuong_CheDo',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDoiTuong = data.Data;
                    me.genList_DoiTuong_CheDo(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genList_DoiTuong_CheDo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOITUONG_TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DoiTuong"],
            type: "",
            title: "Chọn đối tượng chính sách",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_TongHop: function (strTuKhoa) {
        var me = this;
        if ((edu.util.getValById("dropSearch_HocKy") == "") || edu.util.getValById("dropSearch_KieuHoc") == "" || edu.util.getValById("dropSearch_CheDo") == "" || edu.util.getValById("dropSearch_KhoanThu") == "") {
            edu.system.alert("Bạn cần chọn đủ học kỳ, kiểu học, khoản thu và chế độ!", "w");
            return;
        }
        $("#zone_nhap").slideDown();
        var obj_list = {
            'action': 'SV_ChinhSach/LayDSSV_TongHop_SoTien',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtSinhVien = data.Data;
                    me.genTable_TongHop(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
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
    genTable_TongHop: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQua";
        $("#tblKetQua thead").html(me.strHead);
        var arrDoiTuong = me.dtDoiTuong;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_DoiTuong");        
        if (strDoiTuong_Id != "") {
            arrDoiTuong = edu.util.objGetDataInData(strDoiTuong_Id, arrDoiTuong, "ID");
        }
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Số tháng hưởng</th>');
            $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Số tiền</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th colspan="2" class="td-center">' + arrDoiTuong[j].DOITUONG_TEN + '</th>');
        }
        $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="' + (arrDoiTuong.length * 2) + '" class="td-center">' + $("#dropSearch_CheDo option:selected").text() + '</th>');
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TongHopSoTien.getList_TongHop()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "KHOAQUANLY_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<input id="txtSoThang_' + aData.ID + '_' + main_doc.TongHopSoTien.dtDoiTuong_View[iThuTu].DOITUONG_ID + '" class="doituongcheck form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<input id="txtPhanTram_' + aData.ID + '_' + main_doc.TongHopSoTien.dtDoiTuong_View[iThuTu].DOITUONG_ID + '" class="form-control" />';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua(data[i].ID, arrDoiTuong[j].DOITUONG_ID, data[i].DAOTAO_TOCHUCCHUONGTRINH_ID, data[i].QLSV_NGUOIHOC_ID);
            }
        }
        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
    },
    getList_KetQua: function (strId, strDoiTuong_Id, strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ChinhSach/LayKQChinhSach_SoTien',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strDoiTuong_Id': strDoiTuong_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        $("#txtSoThang_" + strId + "_" + strDoiTuong_Id).val(json.SOTHANG);
                        $("#txtSoThang_" + strId + "_" + strDoiTuong_Id).attr("title", json.SOTHANG);
                        $("#txtSoThang_" + strId + "_" + strDoiTuong_Id).attr("name", json.ID);
                        $("#txtPhanTram_" + strId + "_" + strDoiTuong_Id).val(json.SOTIEN);
                        $("#txtPhanTram_" + strId + "_" + strDoiTuong_Id).attr("title", json.SOTIEN);
                    }
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_KetQua: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var objSV = edu.util.objGetOneDataInData(arrId[1], me.dtSinhVien, "ID");
        var obj_save = {
            'action': 'TC_SoTienMien/ThemMoi',

            'strId': $(point).attr("name"),
            'strDaoTao_LopQuanLy_Id': objSV.DAOTAO_LOPQUANLY_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDaoTao_ToChucCT_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strQLSV_DoiTuong_Id': arrId[2],
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'dSoTien': $("#txtPhanTram_" + arrId[1] + "_" + arrId[2]).val(),
            'dSoThang': $(point).val(),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyetDinh_Id = "";                    
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KetQua: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'TC_SoTienMien/Xoa',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + JSON.stringify(er));
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        var me = main_doc.TongHopSoTien;
        edu.system.alert("Thực hiện thành công", 'w');
        setTimeout(function () {
            me.getList_TongHop();
        }, 1000);
    },


    KeThua_TheoThang: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_ChinhSach/KeThua_DoiTuong_SoTien_Thang',
            'type': 'POST',

            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'dNamHoc': edu.util.getValById('txtNam'),
            'dThang': edu.util.getValById('txtThang'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công", "w");
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    KeThua_TheoNam: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_ChinhSach/KeThua_DoiTuong_SoTien_Ky',
            'type': 'POST',

            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strNguoiDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'dNamHoc': edu.util.getValById('txtNam_Nam'),
            'dHocKy': edu.util.getValById('txtThang_Nam'),
            'dDotHoc': edu.util.getValById('txtDotHoc_Nam'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công", "w");
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}