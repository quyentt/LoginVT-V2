/*----------------------------------------------
--Author: nnThuong
--Phone: 
--Date of created: 02/08/2016
--Input:
--Output:
--Note:
--Updated by:
--Date of updated: 10/11/2016
----------------------------------------------*/
function TongQuanNhanLuc() { };
TongQuanNhanLuc.prototype = {
    Id: '',
    arrCCTC_Cha_Id:[],
    arrCCTC_TheoCha_Id:[],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearchNS_CoCauToChuc").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_NhanSu();
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
        me.getList_CoCauToChuc();
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NhanSu
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        var strCoCauToChuc = "";
        if (edu.util.checkValue(edu.util.getValById("dropSearchNS_BoMon"))) {
            strCoCauToChuc = edu.util.getValById("dropSearchNS_BoMon");
        }
        else {
            strCoCauToChuc = edu.util.getValById("dropSearchNS_CoCauToChuc");
        }
        //
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var iTrangThai = 1;
        var strChung_DonVi_Id = strCoCauToChuc;
        var strNhanSu_Id = "";
        var strHocVi_Id = "";
        var strChucDanh_Id = "";
        var strLoaiCanBo_Id = "";
        var strGioiTinh_Id = "";
        var strDanToc_Id = "";
        var strTonGiao_Id = "";
        var strTinhTrangHonNhan_Id = "";
        var strChucVu_Id = "";
        var strTrinhDoChuyenMonCN_Id = "";
        //TuooBatDau
        var iDoTuoiBatDau = 0;
        //TuoiKetThuc
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
                    var json = data.Data;
                    var mlen = json.length;
                    var i = 0;
                    var k = 0;
                    var tblRow = '';
                    //------------------------------ LOOP LẤY MẶC ĐỊNH THEO CƠ CẤU TỔ CHỨC LÀ CHA (Khoa, trung tâm, phòng chức năng)------------------------------------//
                    if (!edu.util.checkValue(strChung_DonVi_Id)) {
                        for (i = 0; i < me.arrCCTC_Cha_Id.length; i++) {
                            //Initialize globle variable
                            var strTenDonVi = "";
                            var iGioiTinh_Nam = 0;
                            var iGioiTinh_Nu = 0;
                            var iDoTuoi_Max = 0;
                            var iDoTuoi_Min = 0;
                            var iDoTuoi_Medium = 0;
                            var iGiangVien_V070101 = 0;
                            var iGiangVien_V070102 = 0;
                            var iGiangVien_V070103 = 0;
                            var iChucDanh_GS = 0;
                            var iChucDanh_PGS = 0;
                            var iTrinhDo_TS = 0;
                            var iTrinhDo_Ths = 0;
                            var iTrinhDo_DH = 0;
                            var iTrinhDo_Khac = 0;
                            var iHeSoLuong_Max = 0;
                            var iHeSoLuong_Min = 0;
                            var iHeSoLuong_Medium = 0;
                            var iKLGG_Max = 0;
                            var iKLGG_Min = 0;
                            var iKLGG_Total = 0;
                            var iKLNCKH_Max = 0;
                            var iKLNCKH_Min = 0;
                            var iKLNCKH_Total = 0;
                            var iSLBaiBaoQuocTe_Max = 0;
                            var iSLBaiBaoQuocTe_Min = 0;
                            var iSLBaiBaoQuocTe_Total = 0;
                            //temp variable
                            var countNhanSu = 0;
                            //tuoi
                            var tuoi_Total = 0;
                            var tuoi_temp_min = 0;
                            var tuoi_temp_max = 0;
                            var tuoi = 0;
                            var count = 0;
                            //hs luong
                            var hsLuong_Total = 0;
                            var hsLuong_temp_min = 0;
                            var hsLuong_temp_max = 0;
                            var hsLuong = 0;
                            var countHsLuong = 0;
                            //tkgg
                            var gioTKGG_Total = 0;
                            var gioTKGG_temp_min = 0;
                            var gioTKGG_temp_max = 0;
                            var gioTKGG = 0;
                            var countgioTKGG = 0;
                            //nckh_baibaoquocte
                            var slBaiBaoQuocTe_Total = 0;
                            var slBaiBaoQuocTe_temp_min = 0;
                            var slBaiBaoQuocTe_temp_max = 0;
                            var slBaiBaoQuocTe = 0;
                            var countslBaiBaoQuocTe = 0;

                            for (var j = 0; j < mlen; j++) {
                                if (json[j].DAOTAO_COCAUTOCHUC_CHA_ID == me.arrCCTC_Cha_Id[i] || json[j].DAOTAO_COCAUTOCHUC_ID == me.arrCCTC_Cha_Id[i]) {
                                    /*Sl nhan su*/
                                    countNhanSu++;
                                    /*Ten Don Vi*/
                                    if (json[j].DAOTAO_COCAUTOCHUC_CHA == null || json[j].DAOTAO_COCAUTOCHUC_CHA == "" || json[j].DAOTAO_COCAUTOCHUC_CHA == undefined) {
                                        strTenDonVi = json[j].DAOTAO_COCAUTOCHUC;
                                        console.log("strTenDonVi: " + strTenDonVi);
                                    }
                                    else {
                                        strTenDonVi = json[j].DAOTAO_COCAUTOCHUC_CHA;
                                        console.log("strTenDonVi: " + strTenDonVi);
                                    }
                                    /*Check GioiTinh_Nu, GioiTinh_Nam*/
                                    if (json[j].GIOITINH_MA == "0") {
                                        iGioiTinh_Nu++;
                                    } else if (json[j].GIOITINH_MA == "1") {
                                        iGioiTinh_Nam++;
                                    }
                                    /*var iDoTuoi_Max = 0; var iDoTuoi_Min = 0; var iDoTuoi_Medium = 0;*/
                                    tuoi = parseInt(json[j].TUOI);
                                    if (tuoi != null) {
                                        count++;
                                        tuoi_Total += tuoi;
                                        if (count == 1) {
                                            tuoi_temp_min = tuoi;
                                            tuoi_temp_max = tuoi;
                                            iDoTuoi_Min = tuoi;
                                            iDoTuoi_Max = tuoi;
                                        }
                                        else {
                                            if (tuoi <= tuoi_temp_min) {
                                                iDoTuoi_Min = tuoi;
                                            }
                                            if (tuoi >= tuoi_temp_max) {
                                                iDoTuoi_Max = tuoi;
                                            }
                                            tuoi_temp_min = iDoTuoi_Min;
                                            tuoi_temp_max = iDoTuoi_Max;
                                        }
                                        iDoTuoi_Medium = tuoi_Total / count;
                                    }
                                    /*Check: iGiangVien_V070101, iGiangVien_V070102, iGiangVien_V070103*/
                                    if (json[j].NGACHLUONG_MA == "V.07.01.01") {
                                        iGiangVien_V070101++;

                                    } else if (json[j].NGACHLUONG_MA == "V.07.01.02") {

                                        iGiangVien_V070102++;

                                    } else if (json[j].NGACHLUONG_MA == "V.07.01.03") {

                                        iGiangVien_V070103++;
                                    }
                                    /*Check: iChucDanh_GS, iChucDanh_PGS*/
                                    if (json[j].LOAICHUCDANH_MA == "GS") {
                                        iChucDanh_GS++;

                                    } else if (json[j].LOAICHUCDANH_MA == "PGS") {

                                        iChucDanh_PGS++;
                                    }
                                    /*Check: iChucDanh_GS, iChucDanh_PGS*/
                                    if (json[j].LOAIHOCVI_MA == "TS") {

                                        iTrinhDo_TS++;

                                    } else if (json[j].LOAIHOCVI_MA == "ThS") {

                                        iTrinhDo_Ths++;
                                    }
                                    else {
                                        if (json[j].TRINHDOCHUYENMONCAONHAT_MA == "CN") {
                                            iTrinhDo_DH++;
                                        }
                                        else {
                                            iTrinhDo_Khac++;
                                        }
                                    }
                                    /*Check: iHeSoLuong_Max ,iHeSoLuong_Min, iHeSoLuong_Medium*/
                                    hsLuong = json[j].HESOLUONG_HIENTAI;
                                    if (hsLuong == null || hsLuong == "" || hsLuong == undefined) {
                                        //nothing
                                    }
                                    else {
                                        hsLuong = parseFloat(hsLuong);
                                        countHsLuong++;
                                        hsLuong_Total += hsLuong;
                                        if (countHsLuong == 1) {
                                            hsLuong_temp_min = hsLuong;
                                            hsLuong_temp_max = hsLuong;
                                            iHeSoLuong_Min = hsLuong;
                                            iHeSoLuong_Max = hsLuong;
                                        }
                                        else {
                                            if (hsLuong <= hsLuong_temp_min) {
                                                iHeSoLuong_Min = hsLuong;
                                            }
                                            if (hsLuong >= hsLuong_temp_max) {
                                                iHeSoLuong_Max = hsLuong;
                                            }
                                            hsLuong_temp_min = iHeSoLuong_Min;
                                            hsLuong_temp_max = iHeSoLuong_Max;
                                        }
                                        iHeSoLuong_Medium = hsLuong_Total / countHsLuong;
                                    }
                                    /*Check: iKLGG_Max ,iKLGG_Min , iKLGG_Total */
                                    gioTKGG = parseFloat(json[j].SOGIOHODO + json[j].SOGIOCOTH + json[j].SOGIODIPH + json[j].SOGIOHDHD + json[j].SOGIOKHAC);
                                    if (gioTKGG != null) {
                                        countgioTKGG++;
                                        gioTKGG_Total += gioTKGG;
                                        if (countgioTKGG == 1) {
                                            gioTKGG_temp_min = gioTKGG;
                                            gioTKGG_temp_max = gioTKGG;
                                            iKLGG_Min = gioTKGG;
                                            iKLGG_Max = gioTKGG;
                                        }
                                        else {
                                            if (gioTKGG <= gioTKGG_temp_min) {
                                                iKLGG_Min = gioTKGG;
                                            }
                                            if (gioTKGG >= gioTKGG_temp_max) {
                                                iKLGG_Max = gioTKGG;
                                            }
                                            gioTKGG_temp_min = iKLGG_Min;
                                            gioTKGG_temp_max = iKLGG_Max;
                                        }
                                        iKLGG_Total = gioTKGG_Total;
                                    }
                                    /*Check: iKLNCKH_Max, iKLNCKH_Min, iKLNCKH_Total */

                                    /*Check: iSLBaiBaoQuocTe_Max, iSLBaiBaoQuocTe_Min, iSLBaiBaoQuocTe_Total  */
                                    slBaiBaoQuocTe = parseFloat(json[j].SOLUONGBAIBAOQUOCTE);
                                    if (slBaiBaoQuocTe != null) {
                                        countslBaiBaoQuocTe++;
                                        slBaiBaoQuocTe_Total += slBaiBaoQuocTe;
                                        if (countslBaiBaoQuocTe == 1) {
                                            slBaiBaoQuocTe_temp_min = slBaiBaoQuocTe;
                                            slBaiBaoQuocTe_temp_max = slBaiBaoQuocTe;
                                            iSLBaiBaoQuocTe_Min = slBaiBaoQuocTe;
                                            iSLBaiBaoQuocTe_Max = slBaiBaoQuocTe;
                                        }
                                        else {
                                            if (slBaiBaoQuocTe <= slBaiBaoQuocTe_temp_min) {
                                                iSLBaiBaoQuocTe_Min = slBaiBaoQuocTe;
                                            }
                                            if (slBaiBaoQuocTe >= slBaiBaoQuocTe_temp_max) {
                                                iSLBaiBaoQuocTe_Max = slBaiBaoQuocTe;
                                            }
                                            slBaiBaoQuocTe_temp_min = iSLBaiBaoQuocTe_Min;
                                            slBaiBaoQuocTe_temp_max = iSLBaiBaoQuocTe_Max;
                                        }
                                        iSLBaiBaoQuocTe_Total = slBaiBaoQuocTe_Total;
                                    }
                                }
                            }
                            //Bind data into table//
                            tblRow = '';
                            tblRow += '<tr class="tblRow">';
                            tblRow += '<td style="display:none;"></td>';
                            tblRow += '<td>' + parseInt(i + 1) + '</td>';
                            tblRow += '<td style="text-align:left; padding-left:5px !important; width: 270px;">' + strTenDonVi + '</td>';
                            tblRow += '<td>' + countNhanSu + '</td>';
                            tblRow += '<td>' + iGioiTinh_Nam + '</td>';
                            tblRow += '<td>' + iGioiTinh_Nu + '</td>';
                            tblRow += '<td>' + iDoTuoi_Max + '</td>';
                            tblRow += '<td>' + iDoTuoi_Min + '</td>';
                            tblRow += '<td>' + iDoTuoi_Medium.toFixed(2) + '</td>';
                            tblRow += '<td>' + iGiangVien_V070101 + '</td>';
                            tblRow += '<td>' + iGiangVien_V070102 + '</td>';
                            tblRow += '<td>' + iGiangVien_V070103 + '</td>';
                            tblRow += '<td>' + iChucDanh_GS + '</td>';
                            tblRow += '<td>' + iChucDanh_PGS + '</td>';
                            tblRow += '<td>' + iTrinhDo_TS + '</td>';
                            tblRow += '<td>' + iTrinhDo_Ths + '</td>';
                            tblRow += '<td>' + iTrinhDo_DH + '</td>';
                            tblRow += '<td>' + iTrinhDo_Khac + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Max + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Min + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Medium.toFixed(2) + '</td>';
                            tblRow += '<td>' + iKLGG_Max + '</td>';
                            tblRow += '<td>' + iKLGG_Min + '</td>';
                            tblRow += '<td>' + iKLGG_Total.toFixed(2) + '</td>';
                            tblRow += '<td>' + iKLNCKH_Max + '</td>';
                            tblRow += '<td>' + iKLNCKH_Min + '</td>';
                            tblRow += '<td>' + iKLNCKH_Total + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Max + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Min + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Total + '</td>';
                            tblRow += '</tr>';
                            $("#tbldata tbody").append(tblRow);
                        }
                    }
                    //------------------------------ LOOP LẤY THEO CƠ CẤU TỔ CHỨC CÓ CHA (Bộ môn...)------------------------------------//
                    else {
                        for (k = 0; k < me.arrCCTC_TheoCha_Id.length; k++) {
                            //Initialize globle variable
                            var strTenDonVi = "";
                            var iGioiTinh_Nam = 0;
                            var iGioiTinh_Nu = 0;
                            var iDoTuoi_Max = 0;
                            var iDoTuoi_Min = 0;
                            var iDoTuoi_Medium = 0;
                            var iGiangVien_V070101 = 0;
                            var iGiangVien_V070102 = 0;
                            var iGiangVien_V070103 = 0;
                            var iChucDanh_GS = 0;
                            var iChucDanh_PGS = 0;
                            var iTrinhDo_TS = 0;
                            var iTrinhDo_Ths = 0;
                            var iTrinhDo_DH = 0;
                            var iTrinhDo_Khac = 0;
                            var iHeSoLuong_Max = 0;
                            var iHeSoLuong_Min = 0;
                            var iHeSoLuong_Medium = 0;
                            var iKLGG_Max = 0;
                            var iKLGG_Min = 0;
                            var iKLGG_Total = 0;
                            var iKLNCKH_Max = 0;
                            var iKLNCKH_Min = 0;
                            var iKLNCKH_Total = 0;
                            var iSLBaiBaoQuocTe_Max = 0;
                            var iSLBaiBaoQuocTe_Min = 0;
                            var iSLBaiBaoQuocTe_Total = 0;
                            //temp variable
                            var countNhanSu = 0;
                            //
                            var tuoi_Total = 0;
                            var tuoi_temp_min = 0;
                            var tuoi_temp_max = 0;
                            var tuoi = 0;
                            var count = 0;
                            //
                            var hsLuong_Total = 0;
                            var hsLuong_temp_min = 0;
                            var hsLuong_temp_max = 0;
                            var hsLuong = 0;
                            var countHsLuong = 0;
                            //
                            var gioTKGG_Total = 0;
                            var gioTKGG_temp_min = 0;
                            var gioTKGG_temp_max = 0;
                            var gioTKGG = 0;
                            var countgioTKGG = 0;
                            //
                            var slBaiBaoQuocTe_Total = 0;
                            var slBaiBaoQuocTe_temp_min = 0;
                            var slBaiBaoQuocTe_temp_max = 0;
                            var slBaiBaoQuocTe = 0;
                            var countslBaiBaoQuocTe = 0;

                            for (var h = 0; h < mlen; h++) {
                                if (json[h].DAOTAO_COCAUTOCHUC_ID == me.arrCCTC_TheoCha_Id[k]) {
                                    /*Sl nhan su*/
                                    countNhanSu++;
                                    /*Ten Don Vi*/
                                    strTenDonVi = json[h].DAOTAO_COCAUTOCHUC;
                                    /*Check GioiTinh_Nu, GioiTinh_Nam*/
                                    if (json[h].GIOITINH_MA == "0") {
                                        iGioiTinh_Nu++;
                                    } else if ((json[h].GIOITINH_MA == "1")) {
                                        iGioiTinh_Nam++;
                                    }
                                    /*var iDoTuoi_Max = 0; var iDoTuoi_Min = 0; var iDoTuoi_Medium = 0;*/
                                    tuoi = parseInt(json[h].TUOI);
                                    if (tuoi != null) {
                                        count++;
                                        tuoi_Total += tuoi;
                                        if (count == 1) {
                                            tuoi_temp_min = tuoi;
                                            tuoi_temp_max = tuoi;
                                            iDoTuoi_Min = tuoi;
                                            iDoTuoi_Max = tuoi;
                                        }
                                        else {
                                            if (tuoi <= tuoi_temp_min) {
                                                iDoTuoi_Min = tuoi;
                                            }
                                            if (tuoi >= tuoi_temp_max) {
                                                iDoTuoi_Max = tuoi;
                                            }
                                            tuoi_temp_min = iDoTuoi_Min;
                                            tuoi_temp_max = iDoTuoi_Max;
                                        }
                                        iDoTuoi_Medium = tuoi_Total / count;
                                    }
                                    /*Check: iGiangVien_V070101, iGiangVien_V070102, iGiangVien_V070103*/
                                    if (json[h].NGACHLUONG_MA = "V.07.01.01") {
                                        iGiangVien_V070101++;

                                    } else if (json[h].NGACHLUONG_MA = "V.07.01.02") {

                                        iGiangVien_V070102++;

                                    } else if (json[h].NGACHLUONG_MA = "V.07.01.03") {

                                        iGiangVien_V070103++;
                                    }
                                    /*Check: iChucDanh_GS, iChucDanh_PGS*/
                                    if (json[h].LOAICHUCDANH_MA == "GS") {
                                        iChucDanh_GS++;

                                    } else if (json[h].LOAICHUCDANH_MA == "PGS") {

                                        iChucDanh_PGS++;
                                    }
                                    /*Check: iChucDanh_GS, iChucDanh_PGS*/
                                    if (json[h].LOAIHOCVI_MA == "TS") {

                                        iTrinhDo_TS++;

                                    } else if (json[h].LOAIHOCVI_MA == "ThS") {

                                        iTrinhDo_Ths++;
                                    }
                                    else {
                                        if (json[h].TRINHDOCHUYENMONCAONHAT_MA == "CN") {
                                            iTrinhDo_DH++;
                                        }
                                        else {
                                            iTrinhDo_Khac++;
                                        }
                                    }
                                    /*Check: iHeSoLuong_Max ,iHeSoLuong_Min, iHeSoLuong_Medium*/
                                    hsLuong = json[h].HESOLUONG_HIENTAI;
                                    if (hsLuong == null || hsLuong == "" || hsLuong == undefined) {
                                        //nothing
                                    }
                                    else {
                                        hsLuong = parseFloat(hsLuong);
                                        countHsLuong++;
                                        hsLuong_Total += hsLuong;
                                        if (countHsLuong == 1) {
                                            hsLuong_temp_min = hsLuong;
                                            hsLuong_temp_max = hsLuong;
                                            iHeSoLuong_Min = hsLuong;
                                            iHeSoLuong_Max = hsLuong;
                                        }
                                        else {
                                            if (hsLuong <= hsLuong_temp_min) {
                                                iHeSoLuong_Min = hsLuong;
                                            }
                                            if (hsLuong >= hsLuong_temp_max) {
                                                iHeSoLuong_Max = hsLuong;
                                            }
                                            hsLuong_temp_min = iHeSoLuong_Min;
                                            hsLuong_temp_max = iHeSoLuong_Max;
                                        }
                                        iHeSoLuong_Medium = hsLuong_Total / countHsLuong;
                                    }
                                    /*Check: iKLGG_Max ,iKLGG_Min , iKLGG_Total */
                                    gioTKGG = parseFloat(json[h].SOGIOHODO + json[h].SOGIOCOTH + json[h].SOGIODIPH + json[h].SOGIOHDHD + json[h].SOGIOKHAC);
                                    if (gioTKGG != null) {
                                        countgioTKGG++;
                                        gioTKGG_Total += gioTKGG;
                                        if (countgioTKGG == 1) {
                                            gioTKGG_temp_min = gioTKGG;
                                            gioTKGG_temp_max = gioTKGG;
                                            iKLGG_Min = gioTKGG;
                                            iKLGG_Max = gioTKGG;
                                        }
                                        else {
                                            if (gioTKGG <= gioTKGG_temp_min) {
                                                iKLGG_Min = gioTKGG;
                                            }
                                            if (gioTKGG >= gioTKGG_temp_max) {
                                                iKLGG_Max = gioTKGG;
                                            }
                                            gioTKGG_temp_min = iKLGG_Min;
                                            gioTKGG_temp_max = iKLGG_Max;
                                        }
                                        iKLGG_Total = gioTKGG_Total;
                                    }
                                    /*Check: iKLNCKH_Max, iKLNCKH_Min, iKLNCKH_Total */

                                    /*Check: iSLBaiBaoQuocTe_Max, iSLBaiBaoQuocTe_Min, iSLBaiBaoQuocTe_Total  */
                                    slBaiBaoQuocTe = parseFloat(json[h].SOLUONGBAIBAOQUOCTE);
                                    if (slBaiBaoQuocTe != null) {
                                        countslBaiBaoQuocTe++;
                                        slBaiBaoQuocTe_Total += slBaiBaoQuocTe;
                                        if (countslBaiBaoQuocTe == 1) {
                                            slBaiBaoQuocTe_temp_min = slBaiBaoQuocTe;
                                            slBaiBaoQuocTe_temp_max = slBaiBaoQuocTe;
                                            iSLBaiBaoQuocTe_Min = slBaiBaoQuocTe;
                                            iSLBaiBaoQuocTe_Max = slBaiBaoQuocTe;
                                        }
                                        else {
                                            if (slBaiBaoQuocTe <= slBaiBaoQuocTe_temp_min) {
                                                iSLBaiBaoQuocTe_Min = slBaiBaoQuocTe;
                                            }
                                            if (slBaiBaoQuocTe >= slBaiBaoQuocTe_temp_max) {
                                                iSLBaiBaoQuocTe_Max = slBaiBaoQuocTe;
                                            }
                                            slBaiBaoQuocTe_temp_min = iSLBaiBaoQuocTe_Min;
                                            slBaiBaoQuocTe_temp_max = iSLBaiBaoQuocTe_Max;
                                        }
                                        iSLBaiBaoQuocTe_Total = slBaiBaoQuocTe_Total;
                                    }
                                }
                            }
                            //Bind data into table//
                            tblRow = '';
                            tblRow += '<tr class="tblRow">';
                            tblRow += '<td style="display:none;"></td>';
                            tblRow += '<td>' + parseInt(k + 1) + '</td>';
                            tblRow += '<td style="text-align:left; padding-left:5px !important; width: 270px;">' + strTenDonVi + '</td>';
                            tblRow += '<td>' + countNhanSu + '</td>';
                            tblRow += '<td>' + iGioiTinh_Nam + '</td>';
                            tblRow += '<td>' + iGioiTinh_Nu + '</td>';
                            tblRow += '<td>' + iDoTuoi_Max + '</td>';
                            tblRow += '<td>' + iDoTuoi_Min + '</td>';
                            tblRow += '<td>' + iDoTuoi_Medium.toFixed(2) + '</td>';
                            tblRow += '<td>' + iGiangVien_V070101 + '</td>';
                            tblRow += '<td>' + iGiangVien_V070102 + '</td>';
                            tblRow += '<td>' + iGiangVien_V070103 + '</td>';
                            tblRow += '<td>' + iChucDanh_GS + '</td>';
                            tblRow += '<td>' + iChucDanh_PGS + '</td>';
                            tblRow += '<td>' + iTrinhDo_TS + '</td>';
                            tblRow += '<td>' + iTrinhDo_Ths + '</td>';
                            tblRow += '<td>' + iTrinhDo_DH + '</td>';
                            tblRow += '<td>' + iTrinhDo_Khac + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Max + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Min + '</td>';
                            tblRow += '<td>' + iHeSoLuong_Medium.toFixed(2) + '</td>';
                            tblRow += '<td>' + iKLGG_Max + '</td>';
                            tblRow += '<td>' + iKLGG_Min + '</td>';
                            tblRow += '<td>' + iKLGG_Total.toFixed(2) + '</td>';
                            tblRow += '<td>' + iKLNCKH_Max + '</td>';
                            tblRow += '<td>' + iKLNCKH_Min + '</td>';
                            tblRow += '<td>' + iKLNCKH_Total + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Max + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Min + '</td>';
                            tblRow += '<td>' + iSLBaiBaoQuocTe_Total + '</td>';
                            tblRow += '</tr>';
                            $("#tbldata tbody").append(tblRow);
                        }
                    }
                    me.arrCCTC_TheoCha_Id = [];//Reset arr
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
    /*------------------------------------------
    --Discription: [2] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML CoCauToChuc
    --ULR:  Modules
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.TongQuanNhanLuc;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }

        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNS_CoCauToChuc"],
            type: "",
            title: "Chọn cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNS_BoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
};