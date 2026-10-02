/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function NhapDiemRenLuyen() { };
NhapDiemRenLuyen.prototype = {
    strNhapDiemRenLuyen_Id: '',
    dtNhapDiemRenLuyen: [],
    dtDMNhapDiemRenLuyen: [],
    dtSinhVien: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        me.getList_TieuChi();
        me.getList_DMTieuChi();
        me.getList_TrangThaiSV();
        //me.getList_NhapDiemRenLuyen();

        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSearch_DoiTuong");
        $("#btnSave_TieuChi").click(function () {
            var strTable_Id = "tblTieuChi";
            var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
            var arrSave = [];
            var arrXoa = [];
            for (var i = 0; i < arrElement.length; i++) {
                //var temp = $(arrElement[i]).attr("title");
                //if (temp == undefined) temp = "";
                //if (temp != arrElement[i].value) {
                    
                //}
                if ((arrElement[i].value == "x" || arrElement[i].value == ""))
                    arrXoa.push(arrElement[i]);
                else {
                    arrSave.push(arrElement[i]);
                }
            }
            if ((arrSave.length + arrXoa.length) == 0) {
                edu.system.alert("Không có dữ liệu mới cần lưu");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn lưu " + arrSave.length + " và xóa " + arrXoa.length + " dữ liệu ?");
            $("#btnYes").click(function (e) {
                edu.system.alert("<div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length + arrXoa.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_NhapDiemRenLuyen(arrSave[i]);
                }
                for (var i = 0; i < arrXoa.length; i++) {
                    me.delete_NhapDiemRenLuyen(arrXoa[i]);
                }
            });
        });
        $("#btnSave_TongHop").click(function () {
            me.TongHop_NhapDiemRenLuyen();
        });

        $("#btnSearch").click(function () {
            me.getList_NhapDiemRenLuyen();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiXepLoai();
            }
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_ChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
        });
        $("#dropSearch_TieuChi_Cha").on("select2:select", function () {
            me.getList_DMTieuChi();
        });
        $("#dropSearch_NamHoc").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_NhapDiemRL");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NhapDiemRenLuyen: function (point) {
        var me = this;
        var strId = point.id;
        var arrId = strId.split("_");
        var strQLSV_NguoiHoc_Id = arrId[0].substring(5);
        var objSinhVien = edu.util.objGetOneDataInData(strQLSV_NguoiHoc_Id, me.dtSinhVien, "ID");
        console.log(objSinhVien);
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_XuLy/Them_DRL_TongHopKetQua_TieuChi',

            'strId': $(point).attr("name"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': objSinhVien.CHUONGTRINH_ID,
            'dDiemQuyDoi': edu.util.getValById('txtAAAA'),
            'dDiem': point.value,
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strDRL_TieuChiDanhGia_Id': arrId[1],
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strDaoTao_LopQuanLy_Id': objSinhVien.LOP_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSinhVien.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'RL_TieuChuanXepLoai_AD/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endLuuDiem: function () {
        var me = main_doc.NhapDiemRenLuyen;
        edu.system.alert("Thực hiện thành công");
        me.getList_NhapDiemRenLuyen();
    },
    getList_NhapDiemRenLuyen: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_ThongTinChung/LayDSDRLTheoLop',
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropSearch_TrangThai'),
            'strDRL_TieuChiDanhGia_Cha_Id': edu.util.getValById('dropSearch_TieuChi_Cha'),//"E422AB596D5B43E188C1D297193D3474",//edu.util.getValById('dropSearch_TieuChi_Cha'),
            'strDRL_TieuChiDanhGia_Id': edu.util.getValById('dropSearch_TieuChi'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult.rsSV;
                    me.genTable_TieuChiXepLoai(dtReRult, data.Pager);
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
    delete_NhapDiemRenLuyen: function (point) {
        var me = this;
        //--Edit
        var strId = point.id;
        var arrId = strId.split("_");
        var strQLSV_NguoiHoc_Id = arrId[0].substring(5);
        var objSinhVien = edu.util.objGetOneDataInData(strQLSV_NguoiHoc_Id, me.dtSinhVien, "ID");
        console.log(objSinhVien);
        var obj_notify = {};
        //--Edit
        var obj_delete = {
            'action': 'RL_XuLy/Xoa_DRL_TongHopKetQua_TieuChi',

            'strId': $(point).attr("name"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': objSinhVien.CHUONGTRINH_ID,
            'dDiemQuyDoi': edu.util.getValById('txtAAAA'),
            'dDiem': point.value,
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strDRL_TieuChiDanhGia_Id': arrId[1],
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strDaoTao_LopQuanLy_Id': objSinhVien.LOP_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSinhVien.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strDiem': point.value,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    TongHop_NhapDiemRenLuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_XuLy/TongHopDRLTheoCacTieuChi',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tổng hợp thành công");
                    me.getList_NhapDiemRenLuyen();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TieuChiXepLoai: function (data, iPager) {
        $("#lblNhapDiemRenLuyen_Tong").html(iPager);
        var html = '';

        html += '<tr>';
        html += '<th class="td-fixed td-center"> Stt</th>';
        html += '<th class="td-center">Mã số</th>';
        html += '<th class="td-center">Họ tên</th>';
        html += '<th class="td-center">Ngày sinh</th>';
        for (var i = 0; i < data.rsTieuChi.length; i++) {
            html += '<th class="td-center">' + data.rsTieuChi[i].TEN + ' (' + data.rsTieuChi[i].MUCDIEMQUYDINH +')</th>';
        }
        html += '<th class="td-center">Tổng điểm - tiêu chí cha</th>';
        html += '<th class="td-center">Xếp loại tiêu chí cha</th>';
        html += '<tr/>';
        $("#tblTieuChi thead").html(html);

        var row = ''; 
        for (var i = 0; i < data.rsSV.length; i++) {
            var strSinhVien_Id = data.rsSV[i].ID;
            row += '<tr>';
            row += '<td style="text-align:center">' + (i + 1) + '</td>';
            row += '<td>' + data.rsSV[i].MASO + '</td>';
            row += '<td>' + edu.util.returnEmpty(data.rsSV[i].HODEM) + " " + edu.util.returnEmpty(data.rsSV[i].TEN) + '</td>';
            row += '<td>' + data.rsSV[i].QLSV_NGUOIHOC_NGAYSINH + '</td>';
            for (var j = 0; j < data.rsTieuChi.length; j++) {
                row += '<td><input id="input' + strSinhVien_Id + '_' + data.rsTieuChi[j].ID +'" style="width: 100%" /></td>';
            }
            row += '<td id="TongDiem_' + strSinhVien_Id + '"></td>';
            row += '<td id="XepLoai_' + strSinhVien_Id + '"></td>';
            row += '</tr>';
        }
        $("#tblTieuChi tbody").html(row);

        for (var i = 0; i < data.rsDuLieuDrl_TieuChiCon.length; i++) {
            var json = data.rsDuLieuDrl_TieuChiCon[i];
            var x = $("#input" + json.QLSV_NGUOIHOC_ID + "_" + json.DRL_TIEUCHIDANHGIA_ID);
            x.val(json.DIEM);
            x.attr("title", json.DIEM);
            x.attr("name", json.DIEM);
        }
        for (var i = 0; i < data.rsDuLieuDrl_TieuChiCha.length; i++) {
            var json = data.rsDuLieuDrl_TieuChiCha[i];
            $("#TongDiem_" + json.QLSV_NGUOIHOC_ID).html(edu.util.returnEmpty(json.DIEM));
            $("#XepLoai_" + json.QLSV_NGUOIHOC_ID).html(edu.util.returnEmpty(json.XEPLOAI_TEN));
        }

        var arrSum = [];
        for (var i = 0; i <= data.rsTieuChi.length; i++) {
            arrSum.push(i + 4);
        }
        edu.system.insertSumAfterTable("tblTieuChi", arrSum);
        edu.system.move_ThroughInTable("tblTieuChi");
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TieuChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDRL_TieuChiDanhGia_Cha_id': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNhomTieuChi_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_TieuChi(dtReRult);
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
    genCombo_TieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TieuChi_Cha"],
            title: "Chọn danh mục tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DMTieuChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_ThongTinChung/LayDSTieuChiRenLuyenTheoKhoa',
            'strDRL_TieuChiDanhGia_Cha_Id': edu.util.getValById('dropSearch_TieuChi_Cha'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropThoiGianDaoTao")) ? edu.util.getValById('dropThoiGianDaoTao') : edu.util.getValById('dropNamHoc'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDMNhapDiemRenLuyen = dtReRult;
                    me.genCombo_LoaiTieuChi(dtReRult);
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
    genCombo_LoaiTieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TieuChi"],
            title: "Chọn tiêu chí nhập điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: edu.util.getValById('dropSearch_NamHoc'),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
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
                    me.cbGenBo_TrangThai(data.Data);
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
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
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
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_TrangThai"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}