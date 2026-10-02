/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 23/08/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TinhPhi() { };
TinhPhi.prototype = {
    objHangDoi: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //edu.system.page_load();
        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao();
        //me.getList_ThoiGianDaoTao();
        //me.getList_LoaiKhoan();
        $("#txtNam").val(edu.util.thisYear());
        $("#txtThang").val(edu.util.thisMonth());
        edu.system.loadToCombo_DanhMucDuLieu("KTX.NVAP", "dropNghiepVu_TP");
        //$('#dropHeDaoTao_TP').on('select2:select', function () {
        //    var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_TP");
        //    me.getList_KhoaDaoTao(strHeHaoTao_Id);
        //});
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        me.objHangDoi = {
            strLoaiNhiemVu: "TINHPHIKTXTUDONG",
            strName: "TinhPhi",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnTinhPhi").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Tính phí</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi_TinhPhi_TuDong();
            });
        });
        
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_KetQua();
        });
        $("#tblTaskBar_TinhPhi").delegate("#btnXemDanhSach", "click", function () {
            me.getList_KetQua();
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });

        edu.system.getList_MauImport("zonebtnBaoCao_THP", function (addKeyValue) {
            addKeyValue("strNam", edu.util.getValById("txtNam"));
            addKeyValue("strThang", edu.util.getValById("txtThang"));
            addKeyValue("strNghiepVuApDung_Id", edu.util.getValById("dropNghiepVu_TP"));
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_TinhPhi_TuDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_HangDoi/TaoHangDoi_TinhPhi_TuDong',
			'strNam': edu.util.getValById('txtNam'),
            'strThang': edu.util.getValById('txtThang'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
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
                        content: "TC_HangDoi.TaoHangDoi_TinhPhi_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                var obj = {
                    content: "TC_HangDoi.TaoHangDoi_TinhPhi_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
        var me = main_doc.TinhPhi;
        me.getList_KetQua();
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018
    --Discription: genHTML HangDoi
    ----------------------------------------------*/
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
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);
        
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var strTuKhoa = "1";
        var strNhomCacKhoanThu_Id = "";
        var pageIndex = 1;
        var pageSize = 1000;
        var strNguoiTao_Id = "";
        var strCanBoQuanLy_Id = "";

        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            
            'strTuKhoa': strTuKhoa,
            'strNhomCacKhoanThu_Id': strNhomCacKhoanThu_Id,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strNguoiThucHien_Id': strNguoiTao_Id,
            'strCanBoQuanLy_Id': strCanBoQuanLy_Id
        }

        
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
                
            },
            error: function (er) {
                
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
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
            renderPlace: ["dropHeDaoTao_TP"],
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
            renderPlace: ["dropKhoaDaoTao_TP"],
            type: "",
            title: "Chọn khóa đào tạo",
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
            renderPlace: ["dropThoiGianDaoTao_TP"],
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
            renderPlace: ["dropKhoanThu_TP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_KetQua: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_TinhPhi/LayDanhSach',

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_TP'),
            'strNguoiThucHien_Id': "",
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strThang': edu.util.getValById('txtThang'),
            'strNam': edu.util.getValById('txtNam'),
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_KetQua(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {  },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KetQua: function (data, iPager) {
        var me = this;
        $("#tblKetQua_Tong").html(iPager);
        var strTable_Id = "tblKetQua";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2, 5, 6, 7],
                center: [0, 8,10],
                right: [9],
                fix: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btnChiTiet" id="' + aData.QLSV_NGUOIHOC_ID + '" href="#">' + aData.KTX_DOITUONGOKYTUCXA_MASO + '</a>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.KTX_DOITUONGOKYTUCXA_HODEM + " " + aData.KTX_DOITUONGOKYTUCXA_TEN;
                    }
                },
                {
                    "mDataProp": "KTX_DOITUONGOKYTUCXA_NGAYSINH"
                },
                {
                    "mDataProp": "KTX_DOITUONGOKYTUCXA_LOP"
                },
                {
                    "mDataProp": "KTX_DOITUONGOKYTUCXA_NGANH"
                },
                {
                    "mDataProp": "KTX_DOITUONGOKYTUCXA_KHOAHOC"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mData": "DAOTAO_THOIGIANDAOTAO_NAM",
                    "mRender": function (nRow, aData) {
                        return "" + aData.DAOTAO_THOIGIANDAOTAO_NAM + "," + aData.DAOTAO_THOIGIANDAOTAO_THANG;
                    }
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "NGAYTAO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [9]);
        /*III. Callback*/
    },
}
