/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KetQua() { };
KetQua.prototype = {
    strHead: '',
    strKetQua_Id: '',
    dtKetQua: [],
    dtHocPhan: [],
    dtHocPhan_View: [],
    dtSinhVien: [],

    init: function () {
        var me = this;
        me.strHead = $("#tblKetQua thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //me.getList_KetQua();

        $("#btnSearch").click(function () {
            me.getList_TongHop();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TongHop();
            }
        });
        me.getList_KeHoachDangKy();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_HocPhan();
            me.cbGetList_KieuHoc();
        });
        $("#btnThongKeHocPhan").click(function () {
            var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
            if (!strKeHoach_Id) {
                edu.system.alert("Vui lòng chọn kế hoạch đăng ký!");
                return;
            }
            $("#modalThongKeHocPhan").modal("show");
            me.getList_ThongKeHocPhan();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_NguyenVong", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
                'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
                'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
                'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc')
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoachDangKyNV/LayDSHocPhanTheoKeHoach',
            'type': 'GET',
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHocPhan = data.Data;
                    me.genList_HocPhan(data.Data)
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
    genList_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_TongHop: function (strTuKhoa) {
        var me = this;
        
        var obj_list = {
            'action': 'DKH_NguyenVong/LayDSKetQuaDangKy_NguyenVong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
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
        var arrHocPhan = me.dtHocPhan;
        var strHocPhan_Id = edu.util.getValById("dropSearch_HocPhan");
        if (strHocPhan_Id != "") {
            arrHocPhan = edu.util.objGetDataInData(strHocPhan_Id, arrHocPhan, "ID");
        }
        me.dtHocPhan_View = arrHocPhan;
        for (var j = 0; j < arrHocPhan.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Kiểu học</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Đánh giá</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Điểm số</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Điểm quy đổi hệ chữ</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Ngày đăng ký</th>');
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="5" class="td-center">' + edu.util.returnEmpty(arrHocPhan[j].TEN) + ' - ' + edu.util.returnEmpty(arrHocPhan[j].MA) + ' - ' + edu.util.returnEmpty(arrHocPhan[j].HOCTRINH) + '</th>');
        }
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KetQua.getList_TongHop()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            "aoColumns": [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
                //, {
                //    "mDataProp": "KIEUHOC_TEN"
                //}
                //, {
                //    "mDataProp": "DANHGIA_TEN"
                //}
                //, {
                //    "mDataProp": "DIEM"
                //}
                //, {
                //    "mDataProp": "DIEMQUYDOI_TEN"
                //}
                //, {
                //    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                //}
            ]
        };
        for (var j = 0; j < arrHocPhan.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblKieuHoc_' + aData.ID + '_' + main_doc.KetQua.dtHocPhan_View[iThuTu].ID + '" ></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDanhGia_' + aData.ID + '_' + main_doc.KetQua.dtHocPhan_View[iThuTu].ID + '" ></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDiem_' + aData.ID + '_' + main_doc.KetQua.dtHocPhan_View[iThuTu].ID + '" ></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDiemQuyDoi_' + aData.ID + '_' + main_doc.KetQua.dtHocPhan_View[iThuTu].ID + '" ></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="lblNgayDangKy_' + aData.ID + '_' + main_doc.KetQua.dtHocPhan_View[iThuTu].ID + '" ></span>';
                    }
                }
            );
            //jsonForm.colPos.center.push(j + 9);
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < arrHocPhan.length; j++) {
                me.getList_KetQua(data[i].ID, arrHocPhan[j].ID, data[i].DAOTAO_TOCHUCCHUONGTRINH_ID);
            }
        }
    },
    getList_KetQua: function (strId, strDaoTao_HocPhan_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'DKH_NguyenVong/LayDSHocPhanDaDangKy',
            'type': 'GET',
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strQLSV_NguoiHoc_Id': strId,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        $("#lblKieuHoc_" + strId + "_" + strDaoTao_HocPhan_Id).html(edu.util.returnEmpty(json.KIEUHOC_TEN));
                        $("#lblDanhGia_" + strId + "_" + strDaoTao_HocPhan_Id).html(edu.util.returnEmpty(json.DANHGIA_TEN));
                        $("#lblDiem_" + strId + "_" + strDaoTao_HocPhan_Id).html(edu.util.returnEmpty(json.DIEM));
                        $("#lblDiemQuyDoi_" + strId + "_" + strDaoTao_HocPhan_Id).html(edu.util.returnEmpty(json.DIEMQUYDOI_TEN));
                        $("#lblNgayDangKy_" + strId + "_" + strDaoTao_HocPhan_Id).html(edu.util.returnEmpty(json.NGAYTAO_DD_MM_YYYY));
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
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: edu.util.getValById("dropSearch_HeDaoTao"),
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_HeDaoTao(obj, "", "", me.genComBo_HeDaoTao);
    },
    genComBo_HeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENHEDAOTAO",
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.genComBo_KhoaDaoTao);
    },
    genComBo_KhoaDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.genComBo_ChuongTrinhDaoTao);
    },
    genComBo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUONGTRINH",
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    cbGetList_KieuHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach',
            'type': 'GET',
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    me["dtKieuHoc"] = dtResult;
                    me.genList_KieuHoc(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    genList_KieuHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KieuHoc"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKyNV/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.dtKeHoachDangKy = dtResult;
                    me.cbGenCombo_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    cbGenCombo_KeHoach: function (data) {
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
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Thống kê theo học phần
    --Author: Custom
    -------------------------------------------*/
    getList_ThongKeHocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_NguyenVong_MH/DSA4BRIJLiIRKSAvFSkkLgokCS4gIikP',
            'func': 'PKG_DANGKY_NGUYENVONG.LayDSHocPhanTheoKeHoach',
            'iM': edu.system.iM,
            'strKeHoachNguyenVong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    // Lưu toàn bộ data (nếu sau này cần phân trang client-side)
                    me.dtThongKeHocPhan_Full = dtResult;
                    me.genTable_ThongKeHocPhan(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_ThongKeHocPhan: function (data) {
        var me = this;

        // Tính tổng số sinh viên (ưu tiên tổng từ toàn bộ data)
        var dataForTotal = (me.dtThongKeHocPhan_Full && me.dtThongKeHocPhan_Full.length)
            ? me.dtThongKeHocPhan_Full
            : data;
        var tongSoSV = 0;
        if (dataForTotal && dataForTotal.length > 0) {
            dataForTotal.forEach(function (item) {
                tongSoSV += parseInt(item.SOSV || 0, 10);
            });
        }
        
        // Hiển thị tổng số SV
        $("#lblTongSoSV").html(tongSoSV);
        
        // Tạo bảng với framework có sẵn
        var jsonForm = {
            strTable_Id: "tblThongKeHocPhan",
            aaData: data,
            bPaginate: {
                iDataRow: (data || []).length,
            },
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "SOSV",
                    "mRender": function (nRow, aData) {
                        return '<span class="badge bg-blue">' + edu.util.returnEmpty(aData.SOSV) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}