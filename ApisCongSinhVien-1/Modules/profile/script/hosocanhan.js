/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function HoSoCaNhan() { };
HoSoCaNhan.prototype = {
    
    init: function () {
        var me = this;
        me.getDetail_HS();
    },
    /*------------------------------------------
	--Discription: [2] Access db DuLieuDanhMuc(Sinh vien thuoc tinh)
	--ULR:  Modules
	-------------------------------------------*/
    getDetail_HS: function () {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'SV_HoSo/LayChiTiet',
            
            'strId': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
                
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    viewForm_HS: function (data) {
        //Thong tin co ban
        edu.util.viewValById("uploadPicture_SV", data.ANH);
        var strAnh = edu.system.getRootPathImg(data.ANH);
        edu.util.viewValById("txtSV_HoDem", data.HODEM);
        edu.util.viewValById("txtSV_Ten", data.TEN);
        edu.util.viewValById("txtSV_NgaySinh", data.NGAYSINH_NGAY);
        edu.util.viewValById("txtSV_ThangSinh", data.NGAYSINH_THANG);
        edu.util.viewValById("txtSV_NamSinh", data.NGAYSINH_NAM);
        //edu.util.viewValById("dropSV_GioiTinh", data.GIOITINH_ID);
        //edu.util.viewValById("dropSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_ID);
        //edu.util.viewValById("dropSV_DanToc", data.DANTOC_ID);
        //edu.util.viewValById("dropSV_TonGiao", data.TONGIAO_ID);
        //edu.util.viewValById("dropSV_QuocTich", data.QUOCTICH_ID);
        //edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_ID);
        edu.util.viewValById("txtSV_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("txtSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_TEN);
        edu.util.viewValById("txtSV_DanToc", data.DANTOC_TEN);
        edu.util.viewValById("txtSV_TonGiao", data.TONGIAO_TEN);
        edu.util.viewValById("txtSV_QuocTich", data.QUOCTICH_TEN);
        edu.util.viewValById("txtSV_HoanCanhXuatThan", data.THANHPHANGIADINH_TEN);///////
        //Thong tin sinh vien
        edu.util.viewValById("txt_NgayVaoTruong", data.NGAYVAOTRUONG);
        edu.util.viewValById("txtNgayRaTruong", data.NGAYRATRUONG);
        edu.util.viewValById("txt_MaSoSV", data.MASO);
        edu.util.viewValById("txtSV_TrangThaiSV", data.QLSV_NGUOIHOC_TRANGTHAI_TEN);//////
        edu.util.viewValById("txtSV_HeDaoTao", data.HEDAOTAO);
        edu.util.viewValById("txtSV_KhoaDaoTao", data.KHOADAOTAO);
        edu.util.viewValById("txtSV_KhoaQuanLy", data.KHOAQUANLY);
        edu.util.viewValById("txtSV_NganhHoc", data.NGANH);
        edu.util.viewValById("txtSV_Lop", data.LOP);
        edu.util.viewValById("txtSV_TruongTHPT", data.DAOTAO_COCAUTOCHUC_ID);//////
        edu.util.viewValById("txtSV_TaiKhoanNganHang", data.NGANHANG_SOTAIKHOAN);
        edu.util.viewValById("txtSV_NganHang", data.NGANHANG_THUOCNGANHANG_TEN);
        edu.util.viewValById("txtSV_ChiNhanhNganHang", data.NGANHANG_THONGTINCHINHANH);

        //Que quan
        edu.util.viewValById("txtSV_NoiSinh", edu.util.returnEmpty(data.NOISINH_TINHTHANH_TEN) + ", " + edu.util.returnEmpty(data.NOISINH_QUANHUYEN_TEN) + ", " + edu.util.returnEmpty(data.NOISINH_XA_TEN) + ", " + edu.util.returnEmpty(data.NOISINH_PHUONGXAKHOIXOM));
        edu.util.viewValById("txtSV_QueQuan", edu.util.returnEmpty(data.QUEQUAN_TINHTHANH_TEN) + ", " + edu.util.returnEmpty(data.QUEQUAN_QUANHUYEN_TEN) + ", " + edu.util.returnEmpty(data.QUEQUAN_XA_TEN) + ", " + edu.util.returnEmpty(data.QUEQUAN_PHUONGXAKHOIXOM));
        edu.util.viewValById("txtSV_HoKhauThuongTru", edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN) + ", " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + ", " + edu.util.returnEmpty(data.HOKHAU_XA_TEN) + ", " + edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM));
        //edu.extend.viewTinhThanhById("txtSV_NoiOHienNay", data.NOHN_TINH_ID, data.NOHN_HUYEN_ID, data.NOHN_XA_ID, data.NOHN_DIACHI);
        edu.util.viewValById("txtSV_NoiOHienNay", data.NOIOHIENNAY);
        edu.util.viewValById("txtSV_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        //Thong tin lien lac
        edu.util.viewValById("txtSV_Email", data.TTLL_EMAILCANHAN);
        edu.util.viewValById("txtSV_DienThoaiCaNhan", data.TTLL_DIENTHOAICANHAN);
        edu.util.viewValById("txtSV_LinkFB", data.DANG_NGAYVAO);/////
        //CMND/CCCD
        edu.util.viewValById("txtSV_SCC_So", data.CMTND_SO);
        edu.util.viewValById("txtSV_SCC_NgayCap", data.CMTND_NGAYCAP);
        edu.util.viewValById("txtSV_SCC_NoiCap", data.CMTND_NOICAP);
        //Doan
        edu.util.viewValById("txtSV_NgayVaoDoan", data.DANGDOAN_NGAYVAODOAN);
        //Dang
        edu.util.viewValById("txtSV_NgayVaoDang", data.DANGDOAN_NGAYVAODANG);
        edu.util.viewValById("txtSV_NgayVaoDangChinhThuc", data.DANGDOAN_NGAYCHINHTHUCVAODANG);

        edu.util.viewValById("txtCoQuanCongTac", data.COQUANCONGTAC);
        edu.util.viewValById("txtMaSoThue", data.MASOTHUECANHAN);
    },
}