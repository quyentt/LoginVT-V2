function ChatLuongNhanLuc() { };
ChatLuongNhanLuc.prototype = {
    Id: '',
    init: function () {
        var me = this;
        me.page_load();
        $("#btnSearch").click(function () {
            if ($("#tblRow")) {
                $("#tblRow").remove();
            }
            me.loadData();
        });
        $('#dropLoaiCanBo').on('select2:select', function () {
            if ($("#tblRow")) {
                $("#tblRow").remove();
            }
            me.loadData();
        });
        $("#btnPrint").click(function () {
            edu.system.report("ChatLuongNhanLuc", "", function (addKeyValue) {
                addKeyValue("NS_LoaiCanBo", edu.util.getValById("dropLoaiCanBo"));
            });
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LHD0, 'dropLoaiCanBo');
    },
    loadData: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 1000;
        var iTrangThai = 1;
        var strChung_DonVi_Id = "";
        var strNhanSu_Id = "";
        var strHocVi_Id = "";
        var strChucDanh_Id = "";
        var strLoaiCanBo_Id = edu.util.getValById("dropLoaiCanBo");
        var strGioiTinh_Id = "";
        var strDanToc_Id = "";
        var strTonGiao_Id = "";
        var strTinhTrangHonNhan_Id = "";
        var strChucVu_Id = "";
        var strTrinhDoChuyenMonCN_Id = "";
        var iDoTuoiBatDau = 0;
        var iDoTuoiKetThuc = 1000;
        var strLoaiDoiTuong_Id = "";// giảng viên or cán bộ nhân viên
        var iTimKiemLaDangVien = -1; // 1-là đảng viên, 0-k là đảng viên, -1 lấy hết
        var strNoiSinh_TinhThanh_Id = "";//
        var strQueQuan_TinhThanh_Id = "";//
        var strGiaDinhThuocDienUuTien_Id = "";
        var strCoQuanTiepNhanLamViec = "";
        var strTrinhDoLyLuanChinhTri_Id = "";
        var strTrinhDoQuanLyNhaNuoc_Id = "";
        var strTrinhDoTinHoc_Id = "";
        var strTrinhDoNgoaiNgu_Id = "";
        var strDanhHieuDuocCaoNhat_Id = "";
        var strNgachCongChuc_Id = "";
        var strLoaiCoCauToChuc_Id = "";
        var strThoiGian_Id = "";
        var iTinhTrang = 1;
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    //Khai bao bien
                    var iTongSoNhanSu = 0;
                    var iGioiTinh_Nu = 0;
                    var iDangVien = 0;
                    var iDanToc_ThieuSo = 0;
                    var iTonGiao = 0;
                    var iTrinhDoCM_TienSy = 0;
                    var iTrinhDoCM_ThacSy = 0;
                    var iTrinhDoCM_DaiHoc = 0;
                    var iTrinhDoCM_CaoDang = 0;
                    var iTrinhDoCM_TrungHoc = 0;
                    var iTrinhDoCM_SoCap = 0;
                    var iTrinhDoCT_CuNhan = 0;
                    var iTrinhDoCT_CaoCap = 0;
                    var iTrinhDoCT_TrungCap = 0;
                    var iTrinhDoCT_SoCap = 0;
                    var iTrinhDoTH_TrungCap = 0;
                    var iTrinhDoTH_ChungChi = 0;
                    var iNgoaiNgu_Anh_DaiHoc = 0;
                    var iNgoaiNgu_Anh_ChungChi = 0;
                    var iNgoaiNgu_Khac_DaiHoc = 0;
                    var iNgoaiNgu_Khac_ChungChi = 0;
                    var iDoTuoi_30_TroXuong = 0;
                    var iDoTuoi_31_40 = 0;
                    var iDoTuoi_41_50 = 0;
                    var iDoTuoi_51_60 = 0;
                    var iDoTuoi_51_55_Nu = 0;
                    var iDoTuoi_56_60_Nam = 0;
                    var iDoTuoi_60_TroLen = 0;
                    var tblRow = '';
                    //--------------------------------------------------Xử lý
                    for (var i = 0; i < mlen; i++) {
                        //Check Loại cán bộ
                        iTongSoNhanSu++;
                        //Check Giới tính
                        if (json[i].GIOITINH_MA == "0") {
                            iGioiTinh_Nu++;
                        }
                        //Check Đảng Viên
                        if (json[i].NGAYCHINHTHUCVAODANGCSVN == "" || json[i].NGAYCHINHTHUCVAODANGCSVN == null) {
                            //Không lấy những người chưa vào Đảng
                        }
                        else {
                            iDangVien++;
                        }
                        //Check Dân tộc
                        if (json[i].DANTOC_MA == "1") {
                            //Không lấy dân tộc Kinh
                        }
                        else {
                            iDanToc_ThieuSo++;
                        }
                        //Check Tôn giáo
                        if (json[i].TONGIAO_MA == "KTG") {
                            //Lấy người có tôn giáo
                        }
                        else {
                            iTonGiao++;
                        }
                        //Check Trình độ chuyên môn 
                        if (json[i].LOAIHOCVI_MA == "TS") {
                            iTrinhDoCM_TienSy++;
                        }
                        else if (json[i].LOAIHOCVI_MA == "ThS") {
                            iTrinhDoCM_ThacSy++;
                        }
                        else {
                            if (json[i].TRINHDOCHUYENMONCAONHAT_MA == "CN") {
                                iTrinhDoCM_DaiHoc++;
                            }
                            else if (json[i].TRINHDOCHUYENMONCAONHAT_MA == "CD") {
                                iTrinhDoCM_CaoDang++;
                            }
                            else if (json[i].TRINHDOCHUYENMONCAONHAT_MA == "THPT")//trung hoc pho thong
                            {
                                iTrinhDoCM_TrungHoc++;
                            }
                            else if (json[i].TRINHDOCHUYENMONCAONHAT_MA == "SC") {
                                iTrinhDoCM_SoCap++;
                            }
                        }
                        //Check Trình độ chính trị
                        if (json[i].TRINHDOLYLUANCHINHTRI_MA == "4")//CN
                        {
                            iTrinhDoCT_CuNhan++;
                        }
                        else if (json[i].TRINHDOLYLUANCHINHTRI_MA == "3")//CAOCAP
                        {
                            iTrinhDoCT_CaoCap++;
                        }
                        else if (json[i].TRINHDOLYLUANCHINHTRI_MA == "2")//TC
                        {
                            iTrinhDoCT_TrungCap++;
                        }
                        else if (json[i].TRINHDOLYLUANCHINHTRI_MA == "1")//SC
                        {
                            iTrinhDoCT_SoCap++;
                        }
                        //Check Trình độ Tin học
                        if (json[i].TRINHDOTINHOC_MA == "9")//TC
                        {
                            iTrinhDoTH_TrungCap++;
                        }
                        else if (json[i].TRINHDOTINHOC_MA == "4" ||
                            json[i].TRINHDOTINHOC_MA == "4" || json[i].TRINHDOTINHOC_MA == "6")//ChungChi
                        {
                            iTrinhDoTH_ChungChi++;
                        }
                        //Check Trình độ Ngoại Ngữ
                        if (json[i].TRINHDONGOAINGU_MA != "")//CC
                        {
                            iNgoaiNgu_Anh_ChungChi++;
                        }
                        //Check TUỔI
                        var tuoi = json[i].TUOI;

                        if (parseInt(tuoi) <= 30) {
                            iDoTuoi_30_TroXuong++;
                        }
                        else if (parseInt(tuoi) >= 31 && parseInt(tuoi) <= 40) {
                            iDoTuoi_31_40++;
                        }
                        else if (parseInt(tuoi) >= 41 && parseInt(tuoi) <= 50) {
                            iDoTuoi_41_50++;
                        }
                        else if (parseInt(tuoi) >= 51 && parseInt(tuoi) <= 60) {
                            iDoTuoi_51_60++;
                        }
                        else if (parseInt(tuoi) > 60) {
                            iDoTuoi_60_TroLen++;
                        }
                        //Check tuổi theo giới tính
                        if (json[i].GIOITINH_MA == "0") {
                            if (parseInt(tuoi) >= 51 && parseInt(tuoi) <= 55) {
                                iDoTuoi_51_55_Nu++;
                            }
                        }
                        else if (json[i].GIOITINH_MA == "1") {
                            if (parseInt(tuoi) >= 56 && parseInt(tuoi) <= 60) {
                                iDoTuoi_56_60_Nam++;
                            }
                        }
                    }
                    //--------------------------------------------------Fill table
                    //Bind data to table 
                    tblRow = '';
                    tblRow += '<tr id="tblRow">';
                    tblRow += '<td class="td-center">' + iTongSoNhanSu + '</td>';
                    tblRow += '<td class="td-center">' + iGioiTinh_Nu + '</td>';
                    tblRow += '<td class="td-center">' + iDangVien + '</td>';
                    tblRow += '<td class="td-center">' + iDanToc_ThieuSo + '</td>';
                    tblRow += '<td class="td-center">' + iTonGiao + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_TienSy + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_ThacSy + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_DaiHoc + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_CaoDang + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_TrungHoc + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCM_SoCap + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCT_CuNhan + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCT_CaoCap + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCT_TrungCap + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoCT_SoCap + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoTH_TrungCap + '</td>';
                    tblRow += '<td class="td-center">' + iTrinhDoTH_ChungChi + '</td>';
                    tblRow += '<td class="td-center">' + iNgoaiNgu_Anh_DaiHoc + '</td>';
                    tblRow += '<td class="td-center">' + iNgoaiNgu_Anh_ChungChi + '</td>';
                    tblRow += '<td class="td-center">' + iNgoaiNgu_Khac_DaiHoc + '</td>';
                    tblRow += '<td class="td-center">' + iNgoaiNgu_Khac_ChungChi + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_30_TroXuong + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_31_40 + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_41_50 + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_51_60 + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_51_55_Nu + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_56_60_Nam + '</td>';
                    tblRow += '<td class="td-center">' + iDoTuoi_60_TroLen + '</td>';
                    tblRow += '</tr>';
                    $("#tblChatLuongNhanSu tbody").append(tblRow);
                }
                else {
                    edu.system.alert("NS_HoSo/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_HoSo/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: 'GET',
            action: 'NS_HoSo/LayDanhSach',            
            contentType: true,
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'iTrangThai': iTrangThai,
                'strChung_DonVi_Id': strChung_DonVi_Id,
                'strNhanSu_Id': strNhanSu_Id,
                'strHocVi_Id': strHocVi_Id,
                'strChucDanh_Id': strChucDanh_Id,
                'strLoaiCanBo_Id': strLoaiCanBo_Id,
                'strGioiTinh_Id': strGioiTinh_Id,
                'strDanToc_Id': strDanToc_Id,
                'strTonGiao_Id': strTonGiao_Id,
                'strTinhTrangHonNhan_Id': strTinhTrangHonNhan_Id,
                'strChucVu_Id': strChucVu_Id,
                'strTrinhDoChuyenMonCN_Id': strTrinhDoChuyenMonCN_Id,
                'iDoTuoiBatDau': iDoTuoiBatDau,
                'iDoTuoiKetThuc': iDoTuoiKetThuc,
                'strLoaiDoiTuong_Id': strLoaiDoiTuong_Id,
                'iTimKiemLaDangVien': iTimKiemLaDangVien,
                'strNoiSinh_TinhThanh_Id': strNoiSinh_TinhThanh_Id,
                'strQueQuan_TinhThanh_Id': strQueQuan_TinhThanh_Id,
                'strGiaDinhThuocDienUuTien_Id': strGiaDinhThuocDienUuTien_Id,
                'strCoQuanTiepNhanLamViec': strCoQuanTiepNhanLamViec,
                'strTrinhDoLyLuanChinhTri_Id': strTrinhDoLyLuanChinhTri_Id,
                'strTrinhDoQuanLyNhaNuoc_Id': strTrinhDoQuanLyNhaNuoc_Id,
                'strTrinhDoTinHoc_Id': strTrinhDoTinHoc_Id,
                'strTrinhDoNgoaiNgu_Id': strTrinhDoNgoaiNgu_Id,
                'strDanhHieuDuocCaoNhat_Id': strDanhHieuDuocCaoNhat_Id,
                'strNgachCongChuc_Id': strNgachCongChuc_Id,
                'strLoaiCoCauToChuc_Id': strLoaiCoCauToChuc_Id,
                'strThoiGian_Id': strThoiGian_Id,
                'iTinhTrang': iTinhTrang
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
};