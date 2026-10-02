/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DiemTrungBinh() { };
DiemTrungBinh.prototype = {
    objHangDoi: {},
    strPhamViMa: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        //me.objHangDoi = {
        //    strLoaiNhiemVu: "TINHDIEMTUDONG",
        //    strName: "DiemTrungBinh",
        //    callback: me.endHangDoi
        //}
        //edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: 
        --Discription: main action  
        -------------------------------------------*/
        //$("#btnDiemTrungBinh").click(function () {
        //    edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Tổng hợp kết quả</span> không?");
        //    $("#btnYes").click(function (e) {
        //        me.TaoHangDoi_DiemTrungBinh_TuDong();
        //    });
        //});
        $("#dropKhoaQuanLy").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropKhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
        });
        $("#dropPhanViTongHop").on("select2:select", function () {
            var strMa = $("#dropPhanViTongHop option:selected").attr("id");
            me.strPhamViMa = strMa;
            edu.util.toggle_overide("zonePhamVi", "zone_" + strMa);
        });
        /*------------------------------------------
        --Author:
        --Discription: main action  
        -------------------------------------------*/
        //$("#btnRefresh").click(function () {
        //    me.getList_KetQua();
        //});
        //$("#tblTaskBar_DiemTrungBinh").delegate("#btnXemDanhSach", "click", function () {
        //    me.getList_KetQua();
        //});
        //$(".btnClose").click(function () {
        //    edu.util.toggle_overide("zone-bus", "zone_main");
        //});
        edu.system.getList_MauImport("zonebtnBaoCao_DTB", function (addKeyValue) {
            addKeyValue("strTrangThaiNguoiHoc_Id", edu.util.getValCombo('dropTinhTrangSinhVien'));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValById('dropHeDaoTao'));
            addKeyValue("strDaoTao_KhoaDaoTao_Id", edu.util.getValCombo('dropKhoaDaoTao'));
            addKeyValue("strDaoTao_KhoaQuanLy_Id", edu.util.getValById('dropKhoaQuanLy'));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById('dropChuongTrinhDaoTao'));
            addKeyValue("strDaoTao_LopQuanLy_Id", edu.util.getValById('dropLopQuanLy'));
            addKeyValue("strPhamViTongHopDiem_Id", edu.util.getValById('dropPhanViTongHop'));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo('dropPhanViTongHop_' + edu.DiemTrungBinh.strPhamViMa));
            addKeyValue("strThangDiem_Id", edu.util.getValById('dropThangDiem'));
            addKeyValue("dTongHopLaiDiemThanhPhan", edu.util.getValById('dropCachTinh'));
            addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        });
        $("#btnTongHopKetQua").click(function () {
            me.save_TongHop();
        });
        $("#btnXemDanhSach").click(function () {
            me.getList_KetQua();
        });
        $("#btnDelete_DanhSach").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_TongHop();
            });
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_KhoaQuanLy();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHAMVITONGHOPDIEM", "", "", me.loadToCombo_PhamVi);
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropKhoaQuanLy");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.cbGenBo_TrangThai);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMTRUNGBINH", "dropSearch_LoaiDiemTrungBinh");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM", "dropThangDiem");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDANHSACH", "dropLoaiDanhSach");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    /*----------------------------------------------
    --Author:
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_DiemTrungBinh_TuDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_HangDoi/TaoHangDoi_TinhDiem_TuDong',
            
            'strTrangThaiNguoiHoc_Id': edu.util.getValCombo('dropTinhTrangSinhVien'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo('dropKhoaDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'strPhamViTongHopDiem_Id': edu.util.getValById('dropPhanViTongHop'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropPhanViTongHop_' + me.strPhamViMa),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'dTongHopLaiDiemThanhPhan': edu.util.getValById('dropCachTinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "TC_HangDoi.TaoHangDoi_DiemTrungBinh_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                var obj = {
                    content: "TC_HangDoi.TaoHangDoi_DiemTrungBinh_TuDong (er): " + JSON.stringify(er),
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
        var me = main_doc.DiemTrungBinh;
        me.getList_KetQua();
    },
    /*----------------------------------------------
    --Author:
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
            strHeDaoTao_Id: edu.util.getValById("dropHeDaoTao"),
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
            strNam_Id: "",
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        edu.system.getList_NamNhapHoc(null, "", "", me.loadToCombo_NamNhapHoc)
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
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
            renderPlace: ["dropHeDaoTao"],
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
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
            renderPlace: ["dropChuongTrinhDaoTao"],
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
            renderPlace: ["dropPhanViTongHop_HOCKY", "dropPhanViTongHop_NHIEUKY", "dropPhanViTongHop_DOTHOC"],
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
            renderPlace: ["dropLopQuanLy"],
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
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        $('#dropTinhTrangSinhVien option').prop('selected', true);
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
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "NAMNHAPHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropPhanViTongHop_NAMHOC"],
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
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_KetQua: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThongKe/LayDSDiem_ThongKe_DTB',
            'type': 'GET',
            'strBangDuLieu': edu.util.getValById('txtSearch_BangDuLieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_KetQua(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
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
                center: [3, 4, 8, 9, 10],
                fix: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btnChiTiet" id="' + aData.QLSV_NGUOIHOC_ID + '" href="#">' + aData.MASONGUOIHOC + '</a>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThanhPhanDiem: function () {
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
                    me.genCombo_ThanhPhanDiem(dtResult);
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("D_ThanhPhanDiem/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'D_ThanhPhanDiem/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strThangDiem_Id': "",
                'strQuyTacLamTron_Id': "",
                'dLaThanhPhanDiemCuoi': 0,
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThanhPhanDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                order: "unorder"
            },
            renderPlace: ["dropThanhPhanDiem"],
            title: "Chọn thành phần điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TongHop: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_TongHop_XuLy/ThucHien_ThongKe_DTB',
            'type': 'POST',
            'strPhamViTongHop_Id': edu.util.getValById('dropPhanViTongHop'),
            'strThoiGian_Id': edu.util.getValById('dropPhanViTongHop_' + me.strPhamViMa),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'strTrangThaiSinhVien_Id': edu.util.getValById('dropTinhTrangSinhVien'),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'strTinhChatLoc': edu.util.getValById('dropTinhChatLoc'),
            'dGiaTri_Tu': edu.util.getValById('txtSearch_TuGiaTri'),
            'dGiaTri_Den': edu.util.getValById('txtSearch_DenGiaTri'),
            'dThuocTinhDiem': edu.util.getValById('dropThuocTinhDiem'),
            'dSoLuongCanLay': edu.util.getValById('txtSearch_SoLuongCanLay'),
            'strCoTuDongTinhLaiDiem': edu.util.getValById('dropTinhTuDong'),
            'strTenBangDuLieu': edu.util.getValById('txtSearch_BangDuLieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_TangThem/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thực hiện thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TongHop: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThongKe/Xoa_Diem_ThongKe_DTB',
            'type': 'POST',
            'strBangDuLieu': edu.util.getValById('txtSearch_BangDuLieu'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TangThem();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}
