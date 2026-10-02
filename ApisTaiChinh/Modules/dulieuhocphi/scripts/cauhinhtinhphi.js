/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CauHinhTinhPhi() { };
CauHinhTinhPhi.prototype = {
    strCauHinhTinhPhi_Id: '',
    dtCauHinhTinhPhi: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_CauHinhTinhPhi();
        me.getList_LopHoc();
        me.getList_CoCauToChuc();
        me.getList_KhoaDaoTao();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_KhoaDaoTao2();
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.NVAP", "dropNghiepVu_CHTP", "Chọn nghiệp vụ áp dụng");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAILOP", "dropLoaiLop, dropSearch_LoaiLop");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.NHOMLOP", "dropSearch_NhomLop");
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropKieuHoc_CHTP");
        $("#btnXoaCauHinhTinhPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHinhTinhPhi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessCHTP"></div>');
                edu.system.genHTML_Progress("zoneprocessCHTP", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CauHinhTinhPhi(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CauHinhTinhPhi();
        });
        $("#btnCauHinhTinhPhi").click(function () {
            if (!edu.util.checkValue(edu.util.getValById("dropThoiGianDaoTao_CHTP")) || !edu.util.checkValue(edu.util.getValById("dropKhoanThu_CHTP")) || !edu.util.checkValue(edu.util.getValById("dropNghiepVu_CHTP")) || !edu.util.checkValue(edu.util.getValById("dropKieuHoc_CHTP"))) {
                edu.system.alert("Bạn cần chọn học kỳ, kiểu học, khoản thu, nghiệp vụ");
            }
            me.toggle_hosoedit();
        });

        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CauHinhTinhPhi();
            }
        });
        $("#chkSelectAll_CHTP").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCauHinhTinhPhi" });
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHoc" });
        });

        $("#btnThemCauHinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessCHTP"></div>');
                edu.system.genHTML_Progress("zoneprocessCHTP", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CauHinhTinhPhi(arrChecked_Id[i]);
                }
            });
        });

        $('#dropKhoaDaoTao_CHTP').on('select2:select', function () {
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_CHTP");
            var strChuongTrinhDaoTao_Id = edu.util.getValById("dropChuongTrinhDaoTao_CHTP");
            me.getList_LopQuanLy(strKhoaDaoTao_Id, strChuongTrinhDaoTao_Id);
        });
        $('#dropHeDaoTao_CHTP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_CHTP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_LopQuanLy("", "");
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao2();
            me.getList_LopHoc();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_LopHoc();
        });
    },

    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_hosoedit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauHinhTinhPhi: function (strDaoTao_LopQuanLy_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_CauHinhTinhTuDong/ThemMoi',

            'strId': edu.util.getValById('txtAAAA'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CHTP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CHTP'),
            'strKieuHoc_Id': edu.util.getValById('dropKieuHoc_CHTP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CHTP'),
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TC_CauHinhTinhTuDong/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessCHTP", function () {
                    me.getList_CauHinhTinhPhi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauHinhTinhPhi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_CauHinhTinhTuDong/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CHTP'),
            'strDaTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CHTP'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy_CHTP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_CHTP'),
            'strKieuHoc_Id': edu.util.getValById('dropKieuHoc_CHTP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_CHTP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_CHTP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCauHinhTinhPhi = dtReRult;
                    me.genTable_CauHinhTinhPhi(dtReRult, data.Pager);
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

    delete_CauHinhTinhPhi: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_CauHinhTinhTuDong/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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

            complete: function () {
                edu.system.start_Progress("zoneprocessCHTP", function () {
                    me.getList_CauHinhTinhPhi();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CauHinhTinhPhi: function (data, iPager) {
        $("#lblCauHinhTinhPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCauHinhTinhPhi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CauHinhTinhPhi.getList_CauHinhTinhPhi()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGHIEPVUAPDUNG_TEN"
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
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
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
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
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
    getList_LoaiKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.dtLoaiKhoan = dtResult;
                    me.cbGenCombo_KhoanThu(dtResult);
                }
                else {
                    edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var obj_LopQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_LopQuanLy(obj_LopQL, "", "", me.cbGenCombo_LopQuanLy);
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
            renderPlace: ["dropHeDaoTao_CHTP", "dropSearch_HeDaoTao"],
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
            renderPlace: ["dropKhoaDaoTao_CHTP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao_CHTP"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoanThu: function (data) {
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
            renderPlace: ["dropKhoanThu_CHTP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropLopQuanLy_CHTP"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
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
            renderPlace: ["dropKhoaQuanLy", "dropSearch_BoMon"],
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao2: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaDaoTao", "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_LopHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LopQuanLy/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_CoSoDaoTao_Id': "",
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_Nganh_Id': edu.util.getValById("dropSearch_BoMon"),
            'strDaoTao_LoaiLop_Id': edu.util.getValById("dropSearch_LoaiLop"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
            'strNhomlop_Id': edu.util.getValById('dropSearch_NhomLop'),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_LopHoc(dtResult, iPager);
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
    genTable_LopHoc: function (data, iPager) {
        var me = this;

        $("#lblLopQuanLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLopHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CauHinhTinhPhi.getList_LopHoc()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4, 9],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONGTHUCTE) + "/" + edu.util.returnEmpty(aData.SOLUONGKEHOACH);
                    }
                },
                {
                    "mDataProp": "LOAILOP_TEN"
                },
                {
                    "mDataProp": "NHOMLOP_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },
}