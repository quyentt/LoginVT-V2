/*----------------------------------------------
--Author: nnThuong
--Phone: 
--Date of created: 25/12/2018
----------------------------------------------*/
function DiemNCKH() { };
DiemNCKH.prototype = {
    Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Author: nnThuong
        --Discription: Export data 
        ------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_TinhDiem();
        });
        $("#btnCalculate").click(function () {
            me.Calcul_DiemNCKH();
        });
        /*------------------------------------------
        --Author: nnThuong
        --Discription: Export data 
        ------------------------------------------*/
        $("#btnPrint").click(function () {
            me.report_InHoSo();
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Business
        -------------------------------------------*/
        me.getList_TinhDiem();
    },
    getList_TinhDiem: function () {
        var me = this;
        var strKLGD_HoatDong_Id = "";
        var strKLGD_ThoiGian_Id = "";
        var strKLGD_Donvitinh_Id = "";
        var strPhanLoaiSanPham_Id = $("#dropNhomSanPham").val();//nhóm sản phẩm (Hoi nghi hoi thao, tap chi quoc te, tap chi quoc gia...)
        var strSanPham_Id = "";
        var strThanhVien_Id = "";//Lấy sản phẩm theo từng cán bộ giảng viên đăng nhập vào hệ thống
        var strCanBoNhap_Id = "";
        var strViTriTacGia_Id = "";
        var strKLGD_TongHopHoatDong_Id = "";
        var iTrangThai = 1;
        var strTuKhoa = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;
        //search for TCQT
        var strPhanLoaiTapChi_QT_Id = "";
        var strVaiTro_QT_Id = "";
        var strThuocLinhVucNao_QT_Id = "";
        //search for TCQG 
        var strThuocLinhVucNao_QG_Id = "";
        var strPhanLoaiTapChi_QG_Id = "";
        var strVaiTro_QG_Id = "";
        //search for SACH
        var strThuocLinhVucNao_S_Id = "";
        var strPhanloaisach_S_Id = "";
        var strVaiTro_S_Id = "";
        //Search for HNHT
        var strPhamViHoiNghiHoiThao_Id = "";
        var strThuocLinhVucNao_HNHT_Id = "";
        var strVaiTro_HNHT_Id = "";
        //search for DECUONG
        var strTinhTrangDeCuong_Id = "";
        //search for DETAI
        var strCapQuanLy_Id = "";
        var strLinhVucNghienCuu_Id = "";
        var iTinhtrangDeTai = "-1";
        //[-1] lay toan bo, [1] da xac nhan, [0] - chua xac nhan
        var iTinhTrangXacNhan = -1;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genTable_Diem(data.Data, data.Pager);
                    }
                    else {
                        me.genTable_Diem([], 0);
                    }
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: 'GET',
            action: 'NCKH_PhanBo/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strKLGD_HoatDong_Id': strKLGD_HoatDong_Id,
                'strKLGD_ThoiGian_Id': strKLGD_ThoiGian_Id,
                'strKLGD_Donvitinh_Id': strKLGD_Donvitinh_Id,
                'strPhanLoaiSanPham_Id': strPhanLoaiSanPham_Id,
                'strSanPham_Id': strSanPham_Id,
                'strThanhVien_Id': strThanhVien_Id,
                'strCanBoNhap_Id': strCanBoNhap_Id,
                'strViTriTacGia_Id': strViTriTacGia_Id,
                'strKLGD_TongHopHoatDong_Id': strKLGD_TongHopHoatDong_Id,
                'iTrangThai': iTrangThai,
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'strPhanLoaiTapChi_QT_Id': strPhanLoaiTapChi_QT_Id,
                'strVaiTro_QT_Id': strVaiTro_QT_Id,
                'strThuocLinhVucNao_QT_Id': strThuocLinhVucNao_QT_Id,
                'strThuocLinhVucNao_QG_Id': strThuocLinhVucNao_QG_Id,
                'strPhanLoaiTapChi_QG_Id': strPhanLoaiTapChi_QG_Id,
                'strVaiTro_QG_Id': strVaiTro_QG_Id,
                'strThuocLinhVucNao_S_Id': strThuocLinhVucNao_S_Id,
                'strPhanloaisach_S_Id': strPhanloaisach_S_Id,
                'strVaiTro_S_Id': strVaiTro_S_Id,
                'strPhamViHoiNghiHoiThao_Id': strPhamViHoiNghiHoiThao_Id,
                'strThuocLinhVucNao_HNHT_Id': strThuocLinhVucNao_HNHT_Id,
                'strVaiTro_HNHT_Id': strVaiTro_HNHT_Id,
                'strTinhTrangDeCuong_Id': strTinhTrangDeCuong_Id,
                'strCapQuanLy_Id': strCapQuanLy_Id,
                'strLinhVucNghienCuu_Id': strLinhVucNghienCuu_Id,
                'iTinhtrangDeTai': iTinhtrangDeTai,
                'iTinhTrangXacNhan': iTinhTrangXacNhan
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Diem: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblDiemNCKH",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DiemNCKH.getList_TinhDiem()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false,
            },
            colPos: {
                center: [0],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "THONGTINSANPHAM"
                }
                , {
                    "mDataProp": "PHANLOAISANPHAM_ID"
                }
                , {
                    "mDataProp": "VITRITACGIA_TEN"
                }
                , {
                    "mDataProp": "SOTACGIA_N"
                }
                , {
                    "mDataProp": "SODONGCHUBIEN_N"
                }
                , {
                    "mDataProp": "SONGUOIHUONGDAN_N"
                }
                , {
                    "mDataProp": "TYLEDONGGOPDECUONG_N"
                }
                , {
                    "mDataProp": "TYLETHAMGIA"
                }
                , {
                    "mDataProp": "SOTRANGTHAMGIAVIET_N"
                }
                , {
                    "mDataProp": "SOHOIDONGDAODUC_N"
                }
                , {
                    "mDataProp": "HESOIF_N"
                }
                , {
                    "mDataProp": "DIEM"
                }
                , {
                    "mDataProp": "TINHTRANGXACNHAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [Last] Tinh diem
    --ULR:  Modules
    -------------------------------------------*/
    Calcul_DiemNCKH: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_TinhDiem/TongHop',
            

            'strThoiGian_Id': "",
            'strDonViBoPhan_GiangVien_Id': "",
            'strCanBoNhap_Id': "",
            'iCoTinhLaiHayKhong': 1
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tính điểm thành công!");
                    me.getList_TinhDiem();
                }
                else {
                    edu.system.alert("NCKH_TinhDiem/TongHop: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_TinhDiem/TongHop (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    }
};