
function qlklgd_nhapkhoiluong() { };
qlklgd_nhapkhoiluong.prototype = {
    dtHinhThucGiang: [],
    strErr: '',
    strID:'',
    dtKhoiLuongThoiKhoaBieu:[],
   
    init: function () {
        var me = this;
        me.page_load();
        $('#drpNamHoc').on('select2:select', function () {          
            me.getList_drpHocKy();
            me.getList_drpHocKy_THEM();
            me.getList_drpDotHoc();
            me.getList_drpDotHoc_THEM();
            me.getList_drpBoMon();             
            me.getList_drpBoMon_THEM();             
            me.getList_drpGiangVien();
            me.getList_drpGiangVien_THEM();
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#lblNamHoc").text($("#drpNamHoc option:selected").text());

            $("#tblKhoiLuong tbody").html("");
            
        });         
        $('#drpHocKy').on('select2:select', function () {
            me.getList_drpDotHoc();
            
        });
        $('#drpHocKy_THEM').on('select2:select', function () {
            me.getList_drpDotHoc_THEM();           
        });
        $('#drpDotHoc').on('select2:select', function () { 
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
            
        });
        $('#drpBoMon').on('select2:select', function () {
            me.getList_drpGiangVien();
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html(""); 
            
        });
        $('#drpBoMon_THEM').on('select2:select', function () {
            me.getList_drpGiangVien_THEM(); 

        });
        $("#btnXoa_PhanCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoiLuong", "checkXDelete");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var dulieuLopHocPhan;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    dulieuLopHocPhan = edu.util.objGetDataInData(arrChecked_Id[i], me.dtKhoiLuongThoiKhoaBieu, "KHOILUONGTHOIKHOABIEUID");
                    var strLopHocPhanId = dulieuLopHocPhan[0].IDLOPHOCPHAN;
                    me.XoaKhoiLuong(arrChecked_Id[i], strLopHocPhanId);
                }
                
                
            });


        });
        $('#drpLoaiTiet').on('select2:select', function () {
            
            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");

        });
        $('#drpLoaiLop').on('select2:select', function () {

            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");

        });
        $("#btnDanhSach").click(function () {
            me.getList_tblKhoiLuong();


        });
        $("#btnShowThemMoi").click(function () {
             
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
             
            me.strID = "#$";
           
            $("#modalThemMoi").modal('show');
        });
        $('#btnCapNhat').click(function () {  
            
            edu.system.confirm("Bạn có chắc chắn cập nhật ?");
           
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                for (var i = 0; i < me.dtKhoiLuongThoiKhoaBieu.length; i++) {
                    var strID = me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID;
                    var StaffID = me.dtKhoiLuongThoiKhoaBieu[i].STAFFID;
                    var NamHoc = me.dtKhoiLuongThoiKhoaBieu[i].NAMHOC;
                    var HocKy = me.dtKhoiLuongThoiKhoaBieu[i].HOCKYFULL;
                    var strTenMon = me.dtKhoiLuongThoiKhoaBieu[i].TENHOCPHAN;
                    var strTenLop = me.dtKhoiLuongThoiKhoaBieu[i].TENLOP;
                    var strSoSinhVien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOSV);
                    var strTongSoTiet = '';//edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIET);
                    var strThoiKhoaBieu = '';//me.dtKhoiLuongThoiKhoaBieu[i].LICHHOC;
                    var strHeDaoTao = me.dtKhoiLuongThoiKhoaBieu[i].DAOTAO_HEDAOTAO_ID;
                    var KieuLop = '';// me.dtKhoiLuongThoiKhoaBieu[i].KIEUHOC;
                    var strSoTietTheoKeHoach = '';//edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIET);
                    var strDVHT = me.dtKhoiLuongThoiKhoaBieu[i].HOCTRINH;
                    var strSoNgay = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SONGAY);
                    var strHinhThucGiangDay = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].HINHTHUCGIANGDAYID);
                    var strTIETLYTHUYET_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETLYTHUYET_DC);
                    var strTIETBAITAP_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETBAITAP_DC);
                    var strTIETTHAOLUAN_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHAOLUAN_DC);
                    var strTIETTHINGHIEM_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHINGHIEM_DC);
                    var strTIETTHUCHANH_DC = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TIETTHUCHANH_DC);
                    var strBTL = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].BTL);
                    var strTKMH = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].TKMH);
                    var strSoTien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIEN);
                    var strTrongTruong = me.dtKhoiLuongThoiKhoaBieu[i].TRONGTRUONG;
                    var strIDHINHTHUCHOC = me.dtKhoiLuongThoiKhoaBieu[i].IDHINHTHUCHOC;
                    var strSoTietHDMotSinhVien = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].SOTIETHUONGDANMOTSV);
                    var strHeSoTinChi = edu.util.returnEmpty(me.dtKhoiLuongThoiKhoaBieu[i].HESOTINCHI);
                    
                    var strCheckTrongTruong = $('#checkX' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID).is(":checked") == true ? "1" : "0";
                    
                        
                    
                    if (strSoSinhVien != edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID ) ||
                        
                        strTIETLYTHUYET_DC != edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID ) ||
                        strTIETBAITAP_DC != edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strTIETTHAOLUAN_DC != edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strTIETTHINGHIEM_DC != edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strTIETTHUCHANH_DC != edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strBTL != edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strTKMH != edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strSoNgay != edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strSoTietHDMotSinhVien != edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strHinhThucGiangDay != edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID) ||
                        strTrongTruong != strCheckTrongTruong
                    ) {


                        //console.log(strSoSinhVien + "; " + edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID));

                        //console.log("strTIETLYTHUYET_DC" + strTIETLYTHUYET_DC + "; " + edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETBAITAP_DC" + strTIETBAITAP_DC + "; " + edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHAOLUAN_DC" + strTIETTHAOLUAN_DC + "; " + edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHINGHIEM_DC" + strTIETTHINGHIEM_DC + "; " + edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTIETTHUCHANH_DC" + strTIETTHUCHANH_DC + "; " + edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strBTL" + strBTL + "; " + edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTKMH" + strTKMH + "; " + edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strSoNgay" + strSoNgay + "; " + edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strSoTietHDMotSinhVien" + strSoTietHDMotSinhVien + "; " + edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strHinhThucGiangDay" + strHinhThucGiangDay + "; " + edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID));
                        //console.log("strTrongTruong" + strTrongTruong + "; " + strCheckTrongTruong);
                        //console.log("dtKhoiLuongThoiKhoaBieu[i].ID " + me.dtKhoiLuongThoiKhoaBieu[i].ID);
                        //alert("strHinhThucGiangDay" + strHinhThucGiangDay + "; " + edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].ID))
                        
                        
                        strSoSinhVien = edu.util.getValById('txtSoSV' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strHeSoTinChi = edu.util.getValById('txtHESOTINCHI' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTIETLYTHUYET_DC = edu.util.getValById('txtTIETLYTHUYET_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTIETBAITAP_DC = edu.util.getValById('txtTIETBAITAP_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTIETTHAOLUAN_DC = edu.util.getValById('txtTIETTHAOLUAN_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTIETTHINGHIEM_DC = edu.util.getValById('txtTIETTHINGHIEM_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTIETTHUCHANH_DC = edu.util.getValById('txtTIETTHUCHANH_DC' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strBTL = edu.util.getValById('txtBTL' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strTKMH = edu.util.getValById('txtTKMH' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strSoNgay = edu.util.getValById('txtSONGAY' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strSoTietHDMotSinhVien = edu.util.getValById('txtSOTIETHUONGDANMOTSV' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID);
                        strHinhThucGiangDay = edu.util.getValById('drpHinhThucGiang' + me.dtKhoiLuongThoiKhoaBieu[i].KHOILUONGTHOIKHOABIEUID); 
                        strTrongTruong = strCheckTrongTruong;
                        me.UpdateKhoiLuong_Nhap(strID, StaffID, NamHoc, HocKy, strTenMon, strTenLop,
                            strSoSinhVien, strTongSoTiet,
                            strThoiKhoaBieu, strHeDaoTao, KieuLop, strSoTietTheoKeHoach,
                            strDVHT, strSoNgay, strHinhThucGiangDay, strTIETLYTHUYET_DC,
                            strTIETBAITAP_DC, strTIETTHAOLUAN_DC, strTIETTHINGHIEM_DC, strTIETTHUCHANH_DC,
                            strBTL, strTKMH, strSoTien, strTrongTruong, strIDHINHTHUCHOC,
                            strSoTietHDMotSinhVien, strHeSoTinChi);
                    }
                }
                if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblKhoiLuong(); 
                }, 2000);

            });
           
         
        });
        $('#drpGiangVien').on('select2:select', function () {

            me.dtKhoiLuongThoiKhoaBieu = null;
            $("#tblKhoiLuong tbody").html("");
            
        });
        
        $('#btnThemMoi').click(function () {
            
            if (edu.util.getValById('drpGiangVien_THEM') == "") {
                edu.system.alert("Bạn chưa giảng viên");
                return;
            }
            if (edu.util.getValById('drpHeDaoTao_THEM') == "") {
                edu.system.alert("Bạn chưa chọn hệ đào tạo");
                return;
            }
            if (edu.util.getValById('drpLoaiLop_THEM') == "") {
                edu.system.alert("Bạn chưa chọn kiểu lớp");
                return;
            }
            if (edu.util.getValById('drpHocKy_THEM') == "") {
                edu.system.alert("Bạn chưa chọn học kỳ");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm mới ?");

            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";

                strTenMon = edu.util.getValById('txtTenHocPhan');
                strTenLop = edu.util.getValById('txtTenLopHocPhan');
                strSoSinhVien = edu.util.getValById('txtSiSo');
                strTongSoTiet = '';
                strHeSoTinChi = "1.1";
                strSoTietTheoKeHoach = '';
                strThoiKhoaBieu = '';
                strTIETLYTHUYET_DC = edu.util.getValById('txtTietLyThuyet');
                strTIETBAITAP_DC = edu.util.getValById('txtTietBaiTap');
                strTIETTHAOLUAN_DC = edu.util.getValById('txtTietThaoLuan');
                strTIETTHINGHIEM_DC = edu.util.getValById('txtTietThiNghiem');
                strTIETTHUCHANH_DC = edu.util.getValById('txtTietThucHanh');
                strBTL = edu.util.getValById('txtTietBaiTapLon');
                strTKMH = edu.util.getValById('txtTKMH');
                strSoTien = '';
                strDVHT = edu.util.getValById('txtDVHT');
                strSoNgay = edu.util.getValById('txtSoNgay');
                strSoTietHDMotSinhVien = edu.util.getValById('txtSoTietHuongDanMotSinhVien');
                strHinhThucGiangDay = edu.util.getValById('drpHinhThucGiang_Them');
                strKieuLop = edu.util.getValById('drpKieuLop_ThemMoi');
                strGiangVienId = edu.util.getValById('drpGiangVien_THEM');
                NamHoc = edu.util.getValById('drpNamHoc');
                strIDHINHTHUCHOC = edu.util.getValById('drpLoaiLop_THEM');
                HocKy = edu.util.getValById('drpHocKy_THEM');
                strHeDaoTao = edu.util.getValById('drpHeDaoTao_THEM');
                DotHoc = $('#drpDotHoc_THEM option:selected').text();
                
                strTrongTruong = $('#chkTrongTruong').is(":checked") == true ? "1" : "0";
                

                me.UpdateKhoiLuong_Nhap(me.strID, strGiangVienId, NamHoc, HocKy, strTenMon, strTenLop,
                    strSoSinhVien, strTongSoTiet,
                    strThoiKhoaBieu, strHeDaoTao, strKieuLop, strSoTietTheoKeHoach,
                    strDVHT, strSoNgay, strHinhThucGiangDay, strTIETLYTHUYET_DC,
                    strTIETBAITAP_DC, strTIETTHAOLUAN_DC, strTIETTHINGHIEM_DC, strTIETTHUCHANH_DC,
                    strBTL, strTKMH, strSoTien, strTrongTruong, strIDHINHTHUCHOC,
                    strSoTietHDMotSinhVien, strHeSoTinChi,   DotHoc);
                  if (me.strErr == "")
                    edu.system.alert("Cập nhật thành công");
                else
                    edu.system.alert(me.strErr);

                setTimeout(function () {
                    me.getList_tblKhoiLuong();
                }, 2000); 
            });

              
        });
        $('#btnTiepTucThemMoi').click(function () {

            me.strID = "#$";  

        });
        $("#btnCall_Import_DMIP").click(function () {
            if (edu.util.getValById('drpNamHoc') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
 
            me.popup_import();
        });

        $("#btnFileMau").click(function (e) {
            e.preventDefault();
            me.report("TEMPLATE_IMPORTKHOILUONG_NHAP");
        });  
        $("#btnImport_DMIP").click(function () {
            me.import_DMIP();
        });  
       
        edu.system.uploadImport(["txtFile_DMIP"]);
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_LoaiLop();
        me.getList_drpCoSoDaoTao();
        me.getList_NamHoc();  
        me.getList_drpDotHoc();
        me.getList_drpHeDaoTao();            
        me.getList_drpBoMon();
        me.getList_drpGiangVien();
        me.getList_HinhThucGiang();
        
        

    },
    getList_NamHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strLoaiThoiGian': 'NAMHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_NamHoc(data.Data);

                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_NamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMHOC",
                parentId: "",
                name: "NAMHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNamHoc"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpHocKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpNamHoc'),
            'strLoaiThoiGian': 'HOCKY',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHocKy(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpHocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "HOCKY",
                parentId: "",
                name: "HOCKY",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy"],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpHocKy'),
            'strLoaiThoiGian': 'DOTHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDotHoc(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDotHoc: function (data) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOTHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotHoc"],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpHeDaoTao: function () {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_HeDaoTao',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHeDaoTao(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpHeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHeDaoTao","drpHeDaoTao_THEM"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpAcademicyear: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpHocKy');

        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_KhoaHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpAcademicyear(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpAcademicyear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpAcademicyear"],
            type: "",
            title: "Chọn khóa"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpCoSoDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_CoSoDaoTao',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };



        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpCoSoDaoTao(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpCoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpCoSoDaoTao"],
            type: "",
            title: "Chọn CSĐT"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpBoMon: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiDungId': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpBoMon(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpBoMon: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpGiangVien: function () {
        var me = this;


        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',
            'strNhomMonHocId': edu.util.getValById('drpBoMon'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpGiangVien(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpGiangVien: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "STAFFID",
                parentId: "",
                name: "HOTENMASO",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblKhoiLuong: function () {
        var me = this;
        //--Edit
        var strStaffId = edu.util.getValById('drpGiangVien');
        var strNhomMonHocId = edu.util.getValById('drpBoMon');
        
        var strDotHoc = edu.util.getValById('drpDotHoc') == "" ? "" : $('#drpDotHoc option:selected').text();

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetKhoiLuongNhap',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strStaffId': edu.util.getValById('drpGiangVien'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strDotHoc': strDotHoc,
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strNguoiThucHienId': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoiLuongThoiKhoaBieu = data.Data;
                    me.genTable_tblKhoiLuong(data.Data, data.Pager);

                    
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblKhoiLuong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblKhoiLuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENCOSODAOTAO"
                } ,
                {
                    
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENHOCPHAN + "_" +  aData.HOCTRINH+ "</span>";
                       
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.TENLOP;
                        if (aData.TACHTHEOSINHVIEN_TIET == "SV")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo SV)</span>";
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = strReturn + "<span style = 'color:red'>(Tách theo tiết)</span>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtSoSV' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TENHEDAOTAO"
                },
                {
                    "mDataProp": "HOCKYDOTHOCFULL"
                },                 
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETLYTHUYET_DC' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TIETLYTHUYET_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETBAITAP_DC' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TIETBAITAP_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHAOLUAN_DC' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TIETTHAOLUAN_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHINGHIEM_DC' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TIETTHINGHIEM_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTIETTHUCHANH_DC' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TIETTHUCHANH_DC) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtBTL' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.BTL) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtTKMH' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.TKMH) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =  
                        '<div class="form-item d-flex form-add-info">'+
                        '    <div class="input-group no-icon">'+
                            '        <input id="txtSONGAY' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.SONGAY)+'" class="form-control" style="width: 50px; height: 32px">'+
                        '    </div>'+
                        '</div>'; 
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span>' + edu.util.returnEmpty(aData.TENHINHTHUCGIANGDAY) + '</span>'
                            + '<select class="form-select select-opt" id="drpHinhThucGiang' + aData.KHOILUONGTHOIKHOABIEUID + '" aria-label="Default select example">'
                            + '<option value="">Chọn hình thức giảng</option>'
                            + '</select>';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOTENMASO"
                }, 
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
                        if (aData.TRONGTRUONG == 1)
                            strReturn = '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '" checked />';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn =
                            '<div class="form-item d-flex form-add-info">' +
                            '    <div class="input-group no-icon">' +
                            '        <input id="txtSOTIETHUONGDANMOTSV' + aData.KHOILUONGTHOIKHOABIEUID + '" value="' + edu.util.returnEmpty(aData.SOTIETHUONGDANMOTSV) + '" class="form-control" style="width: 50px; height: 32px">' +
                            '    </div>' +
                            '</div>';
                        return strReturn;
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkXDelete' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.genList_HinhThucGiang(me.dtHinhThucGiang, 'drpHinhThucGiang' + data[i].KHOILUONGTHOIKHOABIEUID);
            var strHinhThcGiangId = data[i].HINHTHUCGIANGDAYID;
            console.log(strHinhThcGiangId);
            console.log(me.dtHinhThucGiang);
            $("#" + 'drpHinhThucGiang' + data[i].KHOILUONGTHOIKHOABIEUID).val(strHinhThcGiangId).trigger("change");
        }
        /*III. Callback*/
    },  
    
    getList_LoaiLop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/ListDS_HinhThucHoc',

            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_LoaiLop(data.Data);

                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_LoaiLop: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHINHTHUCHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpLoaiLop","drpLoaiLop_THEM"],
            type: "",
            title: "Chọn kiểu lớp"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HinhThucGiang: function () {
        var me = this;
        var strHocKy =   edu.util.getValById('drpHocKy');


        var obj_list = {
            'action': 'TKGG_QLKLGD/GetHinhThucGiang',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.dtHinhThucGiang = data.Data;
                    me.genList_HinhThucGiang(me.dtHinhThucGiang,'drpHinhThucGiang_Them');
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_HinhThucGiang: function (data, drpHinhThucGiang) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [drpHinhThucGiang],
            type: "",
            title: "Chọn hình thức giảng"
        };
        edu.system.loadToCombo_data(obj);
    },
    UpdateKhoiLuong_Nhap: function (strID, StaffID, NamHoc, HocKy, strTenMon, strTenLop,
        strSoSinhVien, strTongSoTiet,
        strThoiKhoaBieu, strHeDaoTao, KieuLop, strSoTietTheoKeHoach,
        strDVHT, strSoNgay, strHinhThucGiangDay, strTIETLYTHUYET_DC,
        strTIETBAITAP_DC, strTIETTHAOLUAN_DC, strTIETTHINGHIEM_DC, strTIETTHUCHANH_DC,
        strBTL, strTKMH, strSoTien, strTrongTruong, strIDHINHTHUCHOC,
        strSoTietHDMotSinhVien, strHeSoTinChi, strDotHoc ) {
        var me = this;
      

        var obj_list = {
            'action': 'TKGG_QLKLGD/UpdateKhoiLuong_Nhap',
            'strID': strID,
            'StaffID': StaffID,
            'NamHoc': NamHoc,
            'HocKy': HocKy,
            'strTenMon': strTenMon,
            'strTenLop': strTenLop,
            'strSoSinhVien': strSoSinhVien,
            'strTongSoTiet': strTongSoTiet,
            'strThoiKhoaBieu': strThoiKhoaBieu,
            'strHeDaoTao': strHeDaoTao,
            'strSoTietTheoKeHoach': strSoTietTheoKeHoach,
            'strDVHT': strDVHT,
            'strSoNgay': strSoNgay,
            'strHinhThucGiangDay': strHinhThucGiangDay,
            'strTIETLYTHUYET_DC': strTIETLYTHUYET_DC,
            'strTIETBAITAP_DC': strTIETBAITAP_DC,
            'strTIETTHAOLUAN_DC': strTIETTHAOLUAN_DC,
            'strTIETTHINGHIEM_DC': strTIETTHINGHIEM_DC,
            'strTIETTHUCHANH_DC': strTIETTHUCHANH_DC,
            'strBTL': strBTL,
            'strTKMH': strTKMH,
            'strSoTien': strSoTien,
            'strTrongTruong': strTrongTruong,
            'strIDHINHTHUCHOC': strIDHINHTHUCHOC,
            'strSoTietHDMotSinhVien': strSoTietHDMotSinhVien,
            'strHeSoTinChi': strHeSoTinChi,
            'strDotHoc': strDotHoc, 
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strID = data.Id;
                }
                else {
                    me.strErr += data.Message;
                    
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            async: false,
            data: obj_list,
        }, false, false, false, null);
    },
     
    
    XoaKhoiLuong: function (strKhoiLuongThoiKhoaBieuId_Xoa, strLopHocPhanId) {
        var me = this;

        var strHocKy =  edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaKhoiLuong_Nhap',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strKhoiLuongThoiKhoaBieuId': strKhoiLuongThoiKhoaBieuId_Xoa,
            'strLopHocPhanId': strLopHocPhanId,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblKhoiLuong();

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
         

    },
    
    getList_drpHocKy_THEM: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpNamHoc'),
            'strLoaiThoiGian': 'HOCKY',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpHocKy_THEM(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpHocKy_THEM: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "HOCKY",
                parentId: "",
                name: "HOCKY",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy_THEM"],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotHoc_THEM: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinNamKyDot',
            'strThoiGian': edu.util.getValById('drpHocKy_THEM'),
            'strLoaiThoiGian': 'DOTHOC',
            'strChucNangId': edu.system.strChucNangId,
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpDotHoc_THEM(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDotHoc_THEM: function (data) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOTHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotHoc_THEM"],
            type: "",
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpDotHoc_THEM").select2({//Search on modal
            dropdownParent: $('#modalThemMoi .modal-content')
        });
    },
    getList_drpGiangVien_THEM: function () {
        var me = this;


        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',
            'strNhomMonHocId': edu.util.getValById('drpBoMon_THEM'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpGiangVien_THEM(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpGiangVien_THEM: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "STAFFID",
                parentId: "",
                name: "HOTENMASO",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien_THEM"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpGiangVien_THEM").select2({//Search on modal
            dropdownParent: $('#modalThemMoi .modal-content')
        });
    },
    getList_drpBoMon_THEM: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/LayDS_PhanQuyenNguoiDungDonVi',
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strNguoiDungId': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpBoMon_THEM(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpBoMon_THEM: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon_THEM"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpBoMon_THEM").select2({//Search on modal
            dropdownParent: $('#modalThemMoi .modal-content')
        });
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = []; 
        if (strLoaiBaoCao == "") {
            edu.system.alert("Bạn chưa chọn mẫu báo cáo");
            return;
        } 
         addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        addKeyValue("tokenJWT", edu.system.tokenJWT);

        var strExamRoomInfoIds = "";
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strExamRoomInfoIds += arrChecked_Id[i] + ";";
        }
        strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);

        addKeyValue("strExamRoomInfoIds", strExamRoomInfoIds);



        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    import_DMIP: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/Import_KhoiLuongNhap',
            'versionAPI': 'v1.0',
            'strNamHoc': edu.util.getValById('drpNamHoc'), 
            'strNguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    
                    edu.system.viewFiles("txtFile_DMIP", "");
                     
                    //  console.log(dtThanhCong);
                    if (data.Message =="")
                        $("#notify_import").html("Import thành công");
                    else
                        $("#notify_import").html("Import lỗi " + data.Message);

                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert( + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImport");



    },
    genTable_Import_View: function (data, strTable) {
        if (data == undefined || data.length == 0) {
            $("#" + strTable + "_Tong").html("");
            $("#" + strTable + " tbody").html("");
        }
        else {
            $("#" + strTable + "_Tong").html(data.length);
            var row = "";
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(x) + '</td>';
            }
            row += '</tr>';
            for (var i = 0; i < data.length; i++) {
                row += '<tr>';
                for (var x in data[0]) {
                    row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
                }
                row += '</tr>';
            }
            $("#" + strTable + " tbody").html(row);
        }

    }, 
}



