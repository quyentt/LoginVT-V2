/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TinhTrangQuanSo() { };
TinhTrangQuanSo.prototype = {
    dtTrangThai: [],
    arrHead_Id: [],
    iMaxLength: 0,
    arrTrangThai_Id: [],
    arrTrangThai_Ten: [],
    dtTrangThaiMoRong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.QUANSO.MORONG", "", "", function (data) {
            me.dtTrangThaiMoRong = data;
        });
        $(".btnClose").click(function (e) {
            $("#zone_quanso").slideUp();
        });
        $("#btnPrintQuanSo").click(function (e) {
            edu.util.printHTML_Table("tblQuanSoLop");
        });
        $("#MainContent").delegate("#zonetabkhoanthu", "click", function (e) {
            e.preventDefault();
            me.activeTabFun();
        });
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        $("#btnSearch").click(function (e) {
            $("#zone_quanso").slideDown();
            me.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            me.genHeader_CauTrucQuanSo();
            me.getList_CauTrucQuanSo();
        });
        $("#btnSearchChuyenCan").click(function (e) {
            $("#zone_quanso").slideDown();
            me.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            me.getHeader_CauTrucQuanSoTheoKy();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                
                me.activeTabFun();
            }
        });
        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbLKT_IHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblViewCauTrucQuanSo").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this);
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_TTQS", function (addKeyValue) {
            main_doc.TinhTrangQuanSo.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            main_doc.TinhTrangQuanSo.genHeader_CauTrucQuanSo(false);
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
            addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"));
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao_IHD"));
            addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"));
            addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"));
            addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop_IHD"));
            addKeyValue("strNamNhapHoc", edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"));
            addKeyValue("strTrangThaiNguoiHoc_Id", main_doc.TinhTrangQuanSo.arrTrangThai_Id.toString());
            addKeyValue("strTrangThaiNguoiHoc_Ten", main_doc.TinhTrangQuanSo.arrTrangThai_Ten.toString());
            addKeyValue("strTinhDenNgay", edu.util.getValById("txtSearch_DenNgay_IHD"));
            addKeyValue("strNgayBatDau", edu.util.getValById("txtSearch_TuNgay_IHD"));
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },    
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
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
            
            'strNguoiThucHien_Id' : '',
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
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_Import_PhanQuyen/LayDanhSach',            

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.strApp_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
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
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_LHD" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_LHD").html(row);
    },
    getList_CauTrucQuanSo: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_CauTrucQuanSo/LayDanhSach',
            'strTuKhoa': edu.util.getValById("txtSearch_DT").trim(),
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': me.arrTrangThai_Id.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrHead_Id = me.insertHeaderTable("tblViewCauTrucQuanSo", dtReRult, null);
                    me.dtCauTrucQuanSo = dtReRult;
                    me.genTable_CauTrucQuanSo();
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
    getData_CauTrucQuanSo: function (strDaoTao_LopQuanLy_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_CauTrucQuanSo/LayDSQuanSoTheoTinhTrang',
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strTinhDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strNgayBatDau': edu.util.getValById('txtSearch_TuNgay_IHD'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        $("#lblQuanSo" + strDaoTao_LopQuanLy_Id + "_" + dtReRult[i].ID).html(dtReRult[i].SOLUONG);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }                
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            error: function (er) {                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            type: 'GET',
            action: obj_list.action,            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getData_QuanSoTheoTieuChiMoRong: function (strDaoTao_LopQuanLy_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_CauTrucQuanSo/LayDSQuanSoTheoTieuChiMoRong',
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strTinhDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strNgayBatDau': edu.util.getValById('txtSearch_TuNgay_IHD'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        $("#lblQuanSo" + strDaoTao_LopQuanLy_Id + "_" + dtReRult[i].ID).html(dtReRult[i].SOLUONG);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        document.getElementById("lblThongTinBang").colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && x[i].cells[j].colSpan != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.THANHPHAN_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].THANHPHAN_ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }
        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                $("#" + strTable_Id + " tbody").append('<tr><td colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" >' + objHead.THANHPHAN_TEN + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THANHPHAN_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    getList_QuanSoTheoLop: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var strDaoTao_LopQuanLy_Id = arrId[0].substring(9);
        var strTinhTrangSinhVien_Id = arrId[1];
        var obj_list = {
            'action': 'SV_CauTrucQuanSo/LayDSQuanSoTheoLop',
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strTinhTrangSinhVien_Id': strTinhTrangSinhVien_Id,
            'strNgayBatDau': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strTinhDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult);
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
    genHeader_CauTrucQuanSo: function (strcheck) {
        var me = this;
        var strNgay = "";
        if (edu.util.getValById("txtSearch_TuNgay_IHD") != "") strNgay = "từ ngày " + edu.util.getValById("txtSearch_TuNgay_IHD") + " ";
        if (edu.util.getValById("txtSearch_DenNgay_IHD") != "") strNgay += "tính đến ngày " + edu.util.getValById("txtSearch_DenNgay_IHD");
        if (strNgay == "") strNgay = "hiện tại";
        var html = '<tr><th id="lblThongTinBang" class="td-center">Thông tin quân số ' + strNgay + '</th>';
        me.arrTrangThai_Ten = [];
        for (var i = 0; i < me.arrTrangThai_Id.length; i++) {
            var data = edu.util.objGetOneDataInData(me.arrTrangThai_Id[i], me.dtTrangThai, "ID");
            me.arrTrangThai_Ten.push(data.TEN);
            html += '<th class="td-center">' + data.TEN + '</th>';
        }
        me.dtTrangThaiMoRong.forEach(e => {
            html += '<th class="td-center">' + e.TEN + '</th>';
        });
        html += '<th class="td-center"><b>Tổng số</b></th>';
        html += '</tr>';
        if (strcheck != false) $("#tblViewCauTrucQuanSo thead").html(html);
    },
    genTable_CauTrucQuanSo: function (data, iPager) {
        var me = this;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var x = $("#tblViewCauTrucQuanSo tbody tr");
            for (var j = 0; j < me.arrTrangThai_Id.length; j++) {
                $(x[i]).append('<td style="text-align: center" class="count' + me.arrTrangThai_Id[j] + ' btnDetail poiter" title="Xem chi tiết quân số trong lớp" id="lblQuanSo' + me.arrHead_Id[i] + '_' + me.arrTrangThai_Id[j] + '"></td>');
            }
            me.dtTrangThaiMoRong.forEach(e => {
                $(x[i]).append('<td style="text-align: center" class="count' + e.ID + ' btnDetail poiter" title="Xem chi tiết quân số trong lớp" id="lblQuanSo' + me.arrHead_Id[i] + '_' + e.ID + '"></td>');
            });
            $(x[i]).append('<td style="text-align: center; font-weight: bold" class="lblTongCongDong" id="lblTongCong_' + me.arrHead_Id[i] + '"></td>');
        }
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            me.getData_CauTrucQuanSo(me.arrHead_Id[i]);
            me.getData_QuanSoTheoTieuChiMoRong(me.arrHead_Id[i]);
        }
        edu.system.genHTML_Progress("divprogessquanso", (me.arrHead_Id.length*2));
    },
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",
            aaData: data,
            colPos: {
                center: [0, 1,3,4,5,6,7,8,9],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
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
                    "mDataProp": "HOKHAUTHUONGTRU"
                },
                {
                    "mDataProp": "TTLL_KHICANBAOTINCHOAI_ODAU"
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_SOQD"
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_NGAYQD"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    endGetQuanSo: function () {
        var me = main_doc.TinhTrangQuanSo;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var iTongDong = 0;
            for (var j = 0; j < me.arrTrangThai_Id.length; j++) {
                var iValue = parseInt($("#lblQuanSo" + me.arrHead_Id[i] + "_" + me.arrTrangThai_Id[j]).html());
                if (!isNaN(iValue)) iTongDong += iValue;
            }
            me.dtTrangThaiMoRong.forEach(e => {
                var iValue = parseInt($("#lblQuanSo" + me.arrHead_Id[i] + "_" + e.ID).html());
                if (!isNaN(iValue)) iTongDong += iValue;
            });
            $("#lblTongCong_" + me.arrHead_Id[i]).html(iTongDong);
        }
        $("#tblViewCauTrucQuanSo tfoot").html('<tr><th style="text-align: center" colspan="' + (me.iMaxLength + 1) + '">Tổng số</th></tr>');
        var iTongToanBang = 0;
        for (var i = 0; i < me.arrTrangThai_Id.length; i++) {
            var idemSoLuong = 0;
            var arrClass = $("#tblViewCauTrucQuanSo tbody").find(".count" + me.arrTrangThai_Id[i]);
            for (var j = 0; j < arrClass.length; j++) {
                var iValue = parseInt(arrClass[j].innerHTML);
                if (!isNaN(iValue)) idemSoLuong += iValue;
            }
            iTongToanBang += idemSoLuong;
            $("#tblViewCauTrucQuanSo tfoot tr").append('<th style="text-align: center">' + idemSoLuong + '</th>');
        }
        me.dtTrangThaiMoRong.forEach(e => {
            var idemSoLuong = 0;
            var arrClass = $("#tblViewCauTrucQuanSo tbody").find(".count" + e.ID);
            for (var j = 0; j < arrClass.length; j++) {
                var iValue = parseInt(arrClass[j].innerHTML);
                if (!isNaN(iValue)) idemSoLuong += iValue;
            }
            iTongToanBang += idemSoLuong;
            $("#tblViewCauTrucQuanSo tfoot tr").append('<th style="text-align: center">' + idemSoLuong + '</th>');
        });
        $("#tblViewCauTrucQuanSo tfoot tr").append('<th style="text-align: center">' + iTongToanBang + '</th>');
    },
    report: function (strLoaiBaoCao) {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
        addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"));
        addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao_IHD"));
        addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"));
        addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"));
        addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop_IHD"));
        addKeyValue("strNamNhapHoc", edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"));
        addKeyValue("strTrangThaiNguoiHoc_Id", me.arrTrangThai_Id.toString());
        addKeyValue("strTrangThaiNguoiHoc_Ten", me.arrTrangThai_Ten.toString());
        addKeyValue("strTinhDenNgay", edu.util.getValById("txtSearch_DenNgay_IHD"));
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiThucHien_Id", edu.system.userId);
        var obj_save = {
            'arrTuKhoa': arrTuKhoa,
            'arrDuLieu': arrDuLieu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    reportAllTable: function (strTable_Id) {
        var objReportTable = {
            strTable: strTable_Id,
            lTable: []
        };
        var i = 0;
        i += addValue("#" + strTable_Id + " thead", "HEAD", i, 0);
        i += addValue("#" + strTable_Id + " tbody", "BODY", i, 0);
        i += addValue("#" + strTable_Id + " tfoot", "HEAD", i, 0);
        report();
        function addValue(strZone, strType, iBatDauDong, iBatDauCot) {
            var head = $(strZone)[0].rows;
            var arrTangSen = [];
            for (i = 0; i < head.length; i++) {
                var iTangSen = 0;//Vị trí lệch cột, sẽ được cộng dồn 
                var iThuTuTangSen = 0;
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (i == 0) {//Tạo 1 mảng tương ứng với cột của bảng trong đó phần tử tương ứng với số rowspan
                        arrTangSen.push(cell.rowSpan - 1);//Thêm 1 phần tử vào mảng check tăng xích
                        for (var k = 1; k < cell.colSpan; k++) {//Đối với col span sẽ thêm cộng dồn
                            arrTangSen.push(0);
                        }
                    } else {
                        //So sánh với mảng tăng xích, bằng vòng lặp while đến khi xích hết trùng
                        //iThuTuTangSen tăng lần lượt đến khi hết các cột và reset khi bắt đầu dòng mới
                        if (j > iThuTuTangSen) iThuTuTangSen = j;
                        while (iThuTuTangSen < arrTangSen.length && iThuTuTangSen >= 0) {
                            if (arrTangSen[iThuTuTangSen] > 0) {
                                arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] - 1;
                                iTangSen++;
                            } else {
                                if (cell.rowSpan > 1) {
                                    arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] + cell.rowSpan - 1;
                                }
                                iThuTuTangSen++;
                                break;
                            }                            
                            iThuTuTangSen++;
                        }
                    }
                    objReportTable.lTable.push({
                        iRow: i + iBatDauDong,
                        iCol: j + iTangSen + iBatDauCot,
                        iRowSpan: cell.rowSpan,
                        iColSpan: cell.colSpan,
                        strData_Cell: $(cell).text(),
                        strData_Align: strType
                    });
                    iTangSen += cell.colSpan - 1;                    
                }
            }
            return i;
        }
        function report() {
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var strBaoCao_Id = data.Id;
                        if (!edu.util.checkValue(strBaoCao_Id)) {
                            edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                            return false;
                        }
                        else {
                            var url_report = "http://localhost:6368/Modules/Common/BaoCao.aspx?id=" + strBaoCao_Id;
                            window.open(url_report, "_blank")
                        }
                    }
                    else {
                        me.alert("Có lỗi xảy ra vui lòng thử lại!");
                    }
                },
                type: "POST",
                action: 'SYS_Report/AllTable',
                contentType: true,
                data: objReportTable,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    
    getHeader_CauTrucQuanSoTheoKy: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_QuanSo/LayDSKyTheoCauTruc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_IHD'),
            'strTrangThaiNguoiHoc_Id': me.arrTrangThai_Id.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKy"] = dtReRult;
                    me.genHeader_CauTrucQuanSoTheoKy(dtReRult);
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
    genHeader_CauTrucQuanSoTheoKy: function (dtReRult) {
        var me = this;
        var strNgay = "";
        if (strNgay == "") strNgay = "hiện tại";
        var html = '<tr><th id="lblThongTinBang" class="td-center">Thông tin quân số ' + strNgay + '</th>';
        dtReRult.forEach(e => {
            html += '<th class="td-center">' + e.THOIGIAN + '</th>';
        })
        html += '</tr>';
        $("#tblViewCauTrucQuanSo thead").html(html);
        me.getList_CauTrucQuanSoTheoKy();
    },
    
    getList_CauTrucQuanSoTheoKy: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_CauTrucQuanSo/LayDanhSach',
            'strTuKhoa': edu.util.getValById("txtSearch_DT").trim(),
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': me.arrTrangThai_Id.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrHead_Id = me.insertHeaderTable("tblViewCauTrucQuanSo", dtReRult, null);
                    me.dtCauTrucQuanSo = dtReRult;
                    me.genTable_CauTrucQuanSoTheoKy();
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
    genTable_CauTrucQuanSoTheoKy: function (data, iPager) {
        var me = this;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var x = $("#tblViewCauTrucQuanSo tbody tr");
            var html = '';
            me.dtKy.forEach(e => html += '<td style="text-align: center" class="count' + e.ID + ' poiter" title="Xem chi tiết quân số trong lớp" id="lblQuanSo' + me.arrHead_Id[i] + '_' + e.ID + '"></td>');
            console.log(html);
            console.log(me.dtKy.length); 
            $(x[i]).append(html)
        }
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            me.dtKy.forEach(e => me.getData_CauTrucQuanSoTheoKy(me.arrHead_Id[i], e.ID));
        }
        edu.system.genHTML_Progress("divprogessquanso", (me.arrHead_Id.length * me.dtKy.length));
    },

    getData_CauTrucQuanSoTheoKy: function (strDaoTao_LopQuanLy_Id, strDaoTao_ThoiGianDaoTao_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_QuanSo/LayDSQuanSoTheoKy',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        $("#lblQuanSo" + strDaoTao_LopQuanLy_Id + "_" + dtReRult[i].ID).html(dtReRult[i].SOLUONG);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSoTheoKy);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetQuanSoTheoKy);
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    endGetQuanSoTheoKy: function () {
        var me = main_doc.TinhTrangQuanSo;
        $("#tblViewCauTrucQuanSo tfoot").html('<tr><th style="text-align: center" colspan="' + (me.iMaxLength + 1) + '">Tổng số</th></tr>');
        setTimeout(function () {
            me.dtKy.forEach(e => {
                var idemSoLuong = 0;
                var arrClass = $("#tblViewCauTrucQuanSo tbody").find(".count" + e.ID);
                for (var j = 0; j < arrClass.length; j++) {
                    var temp = arrClass[j].innerHTML;
                    if (temp != '' && parseInt(temp) != NaN)
                        idemSoLuong += parseInt(temp);
                }
                $("#tblViewCauTrucQuanSo tfoot tr").append('<th style="text-align: center">' + idemSoLuong + '</th>');
            })

        },500)
        
    },

}