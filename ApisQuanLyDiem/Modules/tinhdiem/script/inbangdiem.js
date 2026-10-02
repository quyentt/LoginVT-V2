/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function InBangDiem() { };
InBangDiem.prototype = {
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
        me.objHangDoi = {
            strLoaiNhiemVu: "TONGHOPKETQUA",
            strName: "TongHopKetQua",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: 
        --Discription: main action  
        -------------------------------------------*/
        $("#btnTongHopKetQua").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Tổng hợp kết quả</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi_TongHopKetQua_TuDong();
            });
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
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
        $("#btnRefresh").click(function () {
            me.getList_KetQua();
        });
        $("#tblTaskBar_TongHopKetQua").delegate("#btnXemDanhSach", "click", function () {
            me.getList_KetQua();
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
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
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    /*----------------------------------------------
    --Author:
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_TongHopKetQua_TuDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_HangDoi/TaoHangDoi_TinhDiem_TuDong',
            
            'strTrangThaiNguoiHoc_Id': edu.util.getValCombo('dropTinhTrangSinhVien'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'strPhamViTongHopDiem_Id': edu.util.getValById('dropPhanViTongHop'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropPhanViTongHop_' + me.strPhamViMa),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, !",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "TC_HangDoi.TaoHangDoi_TongHopKetQua_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                var obj = {
                    content: "TC_HangDoi.TaoHangDoi_TongHopKetQua_TuDong (er): " + JSON.stringify(er),
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
        var me = main_doc.TongHopKetQua;
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
            strKhoaDaoTao_Id: edu.util.getValById("dropKhoaDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValById("dropKhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
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
            'action': 'D_TinhDiem/TinhDiem_TuDong_KetQua',
            'strTuKhoa': "",


            'strTrangThaiNguoiHoc_Id': edu.util.getValCombo('dropTinhTrangSinhVien'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'strPhamViTongHopDiem_Id': edu.util.getValById('dropPhanViTongHop'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropPhanViTongHop_' + me.strPhamViMa),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
            'dThuocTinhLanTinh': edu.util.getValById('dropSearch_LanHoc'),
            'strLoaiDiemTrungBinh_Id': edu.util.getValById('dropSearch_LoaiDiemTrungBinh'),
            'pageIndex': 1,
            'pageSize': 100000,
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
                center: [3, 4, 8, 9, 10],
                fix: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btnChiTiet" id="' + aData.QLSV_NGUOIHOC_ID + '" href="#">' + aData.MASONGUOIHOC + '</a>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN;
                    }
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "GIOITINH_TEN"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "NGANH"
                },
                {
                    "mDataProp": "KHOADAOTAO"
                },
                {
                    "mDataProp": "KHOAQUANLY"
                },
                {
                    "mDataProp": "TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "TONGSOTINCHI"
                },
                {
                    "mDataProp": "DIEMTRUNGBINH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}
