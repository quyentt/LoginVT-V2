function qlklgd_duyetdulieutach() { };
qlklgd_duyetdulieutach.prototype = {
     
    strPhanCongId: '',
    strKhoiLuongThoiKhoaBieuId:'',
    dtLopHocPhan: [],
    dtLopHocPhanDaTach: [],
    strErr : '',
    init: function () {
        var me = this;
        me.page_load();
        
        $('#drpHocKy').on('select2:select', function () {
            me.getList_drpDotHoc(); 
            me.getList_drpMonHoc();
        });

        $('#drpNamHoc').on('select2:select', function () {
            me.getList_drpHocKy();
            me.getList_drpDotHoc();
            me.getList_drpBoMon();
            me.getList_drpBoMon_All();
            me.getList_drpMonHoc();
        });
        $("#tblLopDaTach").delegate(".inputnhapso", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongSo("tblLopDaTach");
        });
        $('#drpDotHoc').on('select2:select', function () {          
            me.getList_drpMonHoc();
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.getList_drpAcademicyear();
            me.getList_drpMonHoc();
        });
        $('#drpBoMon').on('select2:select', function () {
            me.getList_drpGiangVien();
            me.getList_drpMonHoc();
            
        });
        $('#drpLoaiLop').on('select2:select', function () {
         
            me.getList_drpMonHoc();
           

        });        
        $('#btnSearch').click(function () {
            me.getList_tblLopHocPhan(); 
        });
        
        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });
        $("[id$=chkSelectAll_LopDaTach]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopDaTach" });
        });
      
        $("#btnToanBoPhanCong").click(function () {
          
            if (edu.util.getValById('drpSchoolYear') == "") {
                edu.system.alert("Bạn chưa chọn năm học");
                return;
            }
           
            $("#modalToanBoPhanCong").modal('show');
            
        });
        $('#drpBoMon_All').on('select2:select', function () { 
            me.getList_drpGiangVien_All();
           
        });
        $('#btnPhanCong_Tach').click(function () {

            if (me.strKhoiLuongThoiKhoaBieuId == '') {
                edu.system.alert("Bạn chưa chọn học phần tách cần phân công ?");
                return;
            };

            edu.system.confirm("Bạn có chắc chắn phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                var strStaffId = edu.util.getValById('drpGiangVien_All');
                me.CapNhatPhanCongBMKhac(strStaffId);
            });

        });
        $('#btnXoaPhanCong').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopDaTach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần xóa phân công?");
                return;
            }

           
            me.strErr = "";
            edu.system.confirm("Bạn có chắc chắn xóa phân công giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strKhoiLuongThoiKhoaBieuId_Xoa += arrChecked_Id[i] + ",";
                    me.XoaKhoiLuong(arrChecked_Id[i]);
                }
                
                setTimeout(function () {
                    if (me.strErr == "") {
                        edu.system.alert("Cập nhật thành công");
                        me.getList_tblLopDaTach(me.strLopHocPhanId);
                    }
                    else
                        edu.system.alert(me.strErr);

                }, 2000);
                
            });

        });
        $('#drpGiangVien_All').on('select2:select', function () {
          
        });
         
        $('#drpMonHoc').on('select2:select', function () {



        });
        $("#tblLopHocPhan").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strLopHocPhanId = strId;
            me.getList_tblLopDaTach(strId);
        });
        $("#tblLopDaTach").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strKhoiLuongThoiKhoaBieuId = strId;
            $("#modalChonGiangVienPhanCong").modal('show');
        });
        $('#btnCapNhatSoTiet').click(function () {

            me.strErr = "";

            edu.system.confirm("Bạn có chắc chắn cập nhật?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var dt = edu.util.objGetDataInData(me.strLopHocPhanId, me.dtLopHocPhan, "IDLOPMONHOC");
                var iSOSINHVIEN = dt[0].SOSINHVIEN;
                var TongSinhVienTach = 0; LT = 0; BT = 0; TH = 0; TL = 0; BTL = 0; TKMH = 0; TN = 0; TT = 0;

                var strTACHTHEOSINHVIEN_TIET = edu.util.returnEmpty(me.dtLopHocPhanDaTach[0].TACHTHEOSINHVIEN_TIET);

                if (strTACHTHEOSINHVIEN_TIET == "") {
                    edu.system.alert("Không được phép cập nhật");
                    return;
                }
                const array_LoaiLopTachTheoSV = ['DA', 'TN', 'TT'];

                if (strTACHTHEOSINHVIEN_TIET == "SV") {
                    for (var i = 0; i < me.dtLopHocPhanDaTach.length; i++) {
                        strKhoiLuongThoiKhoaBieuId = me.dtLopHocPhanDaTach[i].ID;
                        TongSinhVienTach += Number(edu.util.getValById('txtSoSV' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                    }
                    if (TongSinhVienTach > Number(iSOSINHVIEN)) {
                        edu.system.alert("Không được phép cập nhật do số sinh viên > " + iSOSINHVIEN);
                        return;
                    }
                }
                else {
                    for (var i = 0; i < me.dtLopHocPhanDaTach.length; i++) {

                        strKhoiLuongThoiKhoaBieuId = me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID;
                        LT += Number(edu.util.getValById('txtLyThuyet' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        BT += Number(edu.util.getValById('txtBaiTap' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        TL += Number(edu.util.getValById('txtThaoLuan' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        TN += Number(edu.util.getValById('txtThiNghiem' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        TH += Number(edu.util.getValById('txtThucHanh' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        BTL += Number(edu.util.getValById('txtBTL' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                        TKMH += Number(edu.util.getValById('txtTKMH' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID));
                    }

                    if (LT > Number(dt[0].TIETLYTHUYET_DC) || BT > Number(dt[0].TIETBAITAP_DC) || TL > Number(dt[0].TIETTHAOLUAN_DC) || TN > Number(dt[0].TIETTHINGHIEM_DC)
                        || TH > Number(dt[0].TIETTHUCHANH_DC) || BTL > Number(dt[0].BTL) || TKMH > Number(dt[0].TKMH)) {
                        edu.system.alert("Số tiết cập nhật lớn hơn số tiết");
                        return;
                    }

                }


                var strSoSV = "";
                var strSoTietQuyDoi = "";
                var strLyThuyet = "";
                var strBaiTap = "";
                var strThaoLuan = "";
                var strThucHanh = "";
                var strThiNghiem = "";
                var strBTL = "";
                var strSoNgay = "";
                var strGiangVienID = "";
                var strTenLop = "";
                var strTKMH = ""; var strKhoiLuongThoiKhoaBieuId = ""; var strLopHocPhanId = "";

                for (var i = 0; i < me.dtLopHocPhanDaTach.length; i++) {

                    strKhoiLuongThoiKhoaBieuId = me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID;
                    strSoSV = edu.util.getValById('txtSoSV' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strSoTietQuyDoi = me.dtLopHocPhanDaTach[i].TONGTIETDECUONG;
                    strSoNgay = me.dtLopHocPhanDaTach[i].SONGAY;
                    strGiangVienID = me.dtLopHocPhanDaTach[i].STAFFID;
                    strTenLop = me.dtLopHocPhanDaTach[i].TENLOP;
                    strLyThuyet = edu.util.getValById('txtLyThuyet' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strBaiTap = edu.util.getValById('txtBaiTap' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strThaoLuan = edu.util.getValById('txtThaoLuan' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strThiNghiem = edu.util.getValById('txtThiNghiem' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strThucHanh = edu.util.getValById('txtThucHanh' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strBTL = edu.util.getValById('txtBTL' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strTKMH = edu.util.getValById('txtTKMH' + me.dtLopHocPhanDaTach[i].KHOILUONGTHOIKHOABIEUID);
                    strLopHocPhanId = me.dtLopHocPhanDaTach[i].LOPHOCPHANID;

                    me.CapNhatPhanCongThucTapNC(strKhoiLuongThoiKhoaBieuId,
                        strSoSV, strSoTietQuyDoi, strLyThuyet, strBaiTap, strThaoLuan, strThiNghiem, strThucHanh, strBTL, strSoNgay,
                        strGiangVienID, strTKMH, strTenLop, strTACHTHEOSINHVIEN_TIET, strLopHocPhanId);
                }
                setTimeout(function () {
                    if (me.strErr == "") {
                        edu.system.alert("Cập nhật thành công");

                        me.getList_tblLopHocPhan();
                    }
                    else
                        edu.system.alert(me.strErr);

                }, 2000);


            });


        });
        $('#btnDuyet').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần duyệt?");
                return;
            }

            var strLopHocPhanId = "";

            edu.system.confirm("Bạn có chắc chắn duyệt?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strLopHocPhanId += arrChecked_Id[i] + ",";
                }
                strLopHocPhanId = strLopHocPhanId.substr(0, strLopHocPhanId.length - 1);

                me.ThucHienDuyet(strLopHocPhanId,"1");
            });

        });
        $('#btnKhongDuyet').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn lớp cần duyệt?");
                return;
            }

            var strLopHocPhanId = "";

            edu.system.confirm("Bạn có chắc chắn duyệt?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');

                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strLopHocPhanId += arrChecked_Id[i] + ",";
                }
                strLopHocPhanId = strLopHocPhanId.substr(0, strLopHocPhanId.length - 1);

                me.ThucHienDuyet(strLopHocPhanId, "0");
            });

        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_LoaiLop();
        me.getList_NamHoc();
        me.getList_drpDotHoc();
        me.getList_drpHeDaoTao();
        me.getList_drpAcademicyear();
        me.getList_drpCoSoDaoTao();
        me.getList_drpBoMon();
        me.getList_drpGiangVien();
        me.getList_drpMonHoc();

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
            renderPlace: ["drpHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpAcademicyear: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpNamHoc') + "_" + edu.util.getValById('drpHocKy');

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
    getList_tblDaPhanCong: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachPhanCong',
            'versionAPI': 'v1.0',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strStaffId': edu.util.getValById('drpGiangVien'),            
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'), 
            'strNguoiDung_Id': edu.system.userId,
             
        };
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genTable_tblDaPhanCong(data.Data, data.Pager);
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
    genTable_tblDaPhanCong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDaPhanCong",
            aaData: data,
           
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DVHT"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                }, 
                {
                    "mDataProp": "TONGTIETPHANBO"
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "MACONGCHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.PHANCONGTINCHIID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_drpBoMon_All: function () {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/GetNhomMonHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpBoMon_All(data.Data);
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
    genList_drpBoMon_All: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon_All"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpBoMon_All").select2({//Search on modal
            dropdownParent: $('#modalChonGiangVienPhanCong .modal-content')
        });
    },
    getList_drpGiangVien_All: function () {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachCanBoNienHoc',
            'strNhomMonHocId': edu.util.getValById('drpBoMon_All'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpGiangVien_All(data.Data);
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
    genList_drpGiangVien_All: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "STAFFID",
                parentId: "",
                name: "HOTENMASO",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpGiangVien_All"],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#drpGiangVien_All").select2({//Search on modal
            dropdownParent: $('#modalChonGiangVienPhanCong .modal-content')
        });
    },
    getList_tblChuaPhanCong: function () {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachLopHocPhan',
            'versionAPI': 'v1.0',
            'strHocKy': strHocKy,
            'strBoMonId': edu.util.getValById('drpBoMon'),  
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strAyId': edu.util.getValById('drpAcademicyear'),
            'strNguoiDung_Id': edu.system.userId,

        }; 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genTable_tblChuaPhanCong(data.Data, data.Pager);
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
    genTable_tblChuaPhanCong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        var jsonForm = {
            strTable_Id: "tblChuaPhanCong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "DVHT"
                } ,
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TONGTIETPHANBO"
                },
                {
                    "mDataProp": "LOAILOPHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        
                        return '<input type="checkbox" id="checkX' + aData.IDTHOIKHOABIEU + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
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
            renderPlace: ["drpLoaiLop"],
            type: "",
            title: "Chọn kiểu lớp"
        };
        edu.system.loadToCombo_data(obj);
    },
    XoaKhoiLuong: function (strKhoiLuongThoiKhoaBieuId_Xoa) {
        var me = this;

        var strHocKy = edu.util.getValById('drpNamHoc') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_QLKLGD/XoaKhoiLuong',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': strHocKy,
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strKhoiLuongThoiKhoaBieuId': strKhoiLuongThoiKhoaBieuId_Xoa,
            'strLopHocPhanId': me.strLopHocPhanId, 
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strErr += data.Message;
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: "TKGG_QLKLGD/XoaKhoiLuong",
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

        me.getList_tblDaPhanCong();

    },
    getList_drpMonHoc: function () {
        var me = this;
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetMonHocPhanCong',
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
            'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strLoaiLopId': edu.util.getValById('drpLoaiLop'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHienId': edu.system.userId,
            
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0)
                        me.genList_drpMonHoc(data.Data);
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
    genList_drpMonHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "IDHOCPHAN",
                parentId: "",
                name: "TENHOCPHAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpMonHoc"],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblLopHocPhan: function () {
        var me = this;
        //--Edit
         var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachLopHPDuyetTach',
            'versionAPI': 'v1.0',
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strBoMonId': edu.util.getValById('drpBoMon'),
            'strDotHocId': edu.util.getValById('drpDotHoc'),
             'strHeDaoTaoId': edu.util.getValById('drpHeDaoTao'),
             'strKhoaHocId': edu.util.getValById('drpAcademicyear'),
            'strCoSoDaoTaoId': edu.util.getValById('drpCoSoDaoTao'),
            
            'strKieuHoc': edu.util.getValById('drpLoaiLop'),            
            'strMonHocId': edu.util.getValById('drpMonHoc'), 
            'strDaDuyet': edu.util.getValById('drpTrangThaiDuyet'),            
            'strNguoiThucHienId': edu.system.userId,

        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblLopHocPhan(data.Data, data.Pager);
                    me.dtLopHocPhan = data.Data;
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
    genTable_tblLopHocPhan: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        console.log(data);
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TENLOP;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<span>' + aData.TENLOP + '</span><span style="color:red;">(Tách tiết)</span>';
                        if (aData.TACHTHEOSINHVIEN_TIET == "SV")
                            strReturn = '<span>' + aData.TENLOP + '</span><span style="color:red;">(Tách SV)</span>';
                        return strReturn;

                    }
                    
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "SOSINHVIEN"
                },
                {
                    "mDataProp": "TENHINHTHUCHOC"
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = "";
                        if (aData.DUYETTACH == "1" || aData.DUYETTACH ==1)
                            strReturn = "<span style='color:red'>Đã duyệt</span>";
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.IDLOPMONHOC + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>DS tách</a></span>';
                    }

                } 
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.IDLOPMONHOC + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    getList_tblLopDaTach: function (strLopHocPhanId) {
        var me = this;
        //--Edit
         var obj_list = {
            'action': 'TKGG_QLKLGD/GetDanhSachLopThucTap',
            'versionAPI': 'v1.0',
            'strLopHocPhanId': strLopHocPhanId,
            'strNguoiThucHienId': edu.system.userId, 
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblLopDaTach(data.Data, data.Pager);
                    me.dtLopHocPhanDaTach = data.Data;
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
    genTable_tblLopDaTach: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var dulieuLopHocPhan = edu.util.objGetDataInData(me.strLopHocPhanId, me.dtLopHocPhan, "IDLOPMONHOC");
        $("#lblLopHocPhanTach").text("");

        $("#lblTongSinhVien").text('');
        $("#lblTongLyThuyet").text('');
        $("#lblTongBaiTap").text('');
        $("#lblTongThaoLuan").text('');
        $("#lblTongThiNghiem").text('');
        $("#lblTongThucHanh").text('');
        $("#lblTongBTL").text('');
        $("#lblTongTKMH").text('');
        $("#lblLopHocPhanTach").text(dulieuLopHocPhan[0].MAHOCPHAN + "_" + dulieuLopHocPhan[0].TENLOP);

        $("#lblTongSinhVien").text("(" + dulieuLopHocPhan[0].SOSINHVIEN + ")");
        $("#lblTongLyThuyet").text("(" + dulieuLopHocPhan[0].TIETLYTHUYET_DC + ")");
        $("#lblTongBaiTap").text("(" + dulieuLopHocPhan[0].TIETBAITAP_DC + ")");
        $("#lblTongThaoLuan").text("(" + dulieuLopHocPhan[0].TIETTHAOLUAN_DC + ")");
        $("#lblTongThiNghiem").text("(" + dulieuLopHocPhan[0].TIETTHINGHIEM_DC + ")");
        $("#lblTongThucHanh").text("(" + dulieuLopHocPhan[0].TIETTHUCHANH_DC + ")");
        $("#lblTongBTL").text("(" + dulieuLopHocPhan[0].BTL + ")");
        $("#lblTongTKMH").text("(" + dulieuLopHocPhan[0].TKMH + ")");

        var jsonForm = {
            strTable_Id: "tblLopDaTach",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        //return '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID  + '" value ="' + edu.util.returnEmpty(aData.SOSV) + '" class="form-control" />';
                        var strReturn = aData.SOSINHVIEN;
                        if (aData.TACHTHEOSINHVIEN_TIET == "SV")
                            strReturn = '<input type="text"  class="inputnhapso"  id="txtSoSV' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.SOSV) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TIETLYTHUYET_DC;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text" class="inputnhapso"  id="txtLyThuyet' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TIETLYTHUYET_DC) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TIETBAITAP_DC;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text"  class="inputnhapso"  id="txtBaiTap' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TIETBAITAP_DC) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TIETTHAOLUAN_DC;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text" class="inputnhapso"  id="txtThaoLuan' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TIETTHAOLUAN_DC) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TIETTHINGHIEM_DC;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text"  class="inputnhapso"  id="txtThiNghiem' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TIETTHINGHIEM_DC) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TIETTHUCHANH_DC;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text"  class="inputnhapso"  id="txtThucHanh' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TIETTHUCHANH_DC) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = aData.BTL;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text"  class="inputnhapso"  id="txtBTL' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.BTL) + '" >';
                        return strReturn;

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.TKMH;
                        if (aData.TACHTHEOSINHVIEN_TIET == "TIET")
                            strReturn = '<input type="text" class="inputnhapso" id="txtTKMH' + aData.KHOILUONGTHOIKHOABIEUID + '"  style="width:30px;" value="' + edu.util.returnEmpty(aData.TKMH) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "HOTENMASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.KHOILUONGTHOIKHOABIEUID + '" title="PC"><i class="fa fa-eye color-active"></i>PC</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.KHOILUONGTHOIKHOABIEUID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != undefined && data.length > 0) {

            edu.system.insertSumAfterTable('tblLopDaTach', [3, 4, 5, 6, 7, 8, 9, 10]);
            // $("#" + 'tblLopDaTach' + " tfoot tr td:eq(3)").attr("style", "text-align: right; font-size: 20px; padding-right: 20px");
        } else {
            $("#" + 'tblLopDaTach' + " tfoot").html('');
        }
        /*III. Callback*/
    },
    CapNhatPhanCongBMKhac: function (strStaffId) {
        var me = this;
        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatPhanCongBMKhac',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId,
            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strLopHocPhanId': me.strLopHocPhanId,
            'strKhoiLuongThoiKhoaBieuId': me.strKhoiLuongThoiKhoaBieuId,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblLopDaTach(me.strLopHocPhanId);
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
    CapNhatPhanCongThucTapNC: function (strKhoiLuongThoiKhoaBieuId,
        strSoSV, strSoTietQuyDoi, strLyThuyet, strBaiTap, strThaoLuan, strThiNghiem, strThucHanh, strBTL, strSoNgay, strGiangVienID, strTKMH,
        strTenLop, strTACHTHEOSINHVIEN_TIET, strLopHocPhanId) {
        var me = this;


        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatPhanCongThucTapNC',
            'versionAPI': 'v1.0',

            'strNamHoc': edu.util.getValById('drpNamHoc'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotHoc': edu.util.getValById('drpDotHoc'),
            'strKhoiLuongThoiKhoaBieuId': strKhoiLuongThoiKhoaBieuId,
            'strSoSV': strSoSV,
            'strSoTietQuyDoi': strSoTietQuyDoi,
            'strLyThuyet': strLyThuyet,
            'strBaiTap': strBaiTap,
            'strThaoLuan': strThaoLuan,
            'strThiNghiem': strThiNghiem,
            'strThucHanh': strThucHanh,
            'strBTL': strBTL,
            'strSoNgay': strSoNgay,
            'strGiangVienID': strGiangVienID,
            'strTKMH': strTKMH,
            'strTenLop': strTenLop,
            'strTACHTHEOSINHVIEN_TIET': strTACHTHEOSINHVIEN_TIET,
            'strLopHocPhanId': strLopHocPhanId,
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                    me.strErr += JSON.stringify(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                me.strErr += JSON.stringify(er);
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
    ThucHienDuyet: function (strLopHocPhanId, strDaDuyet) {
        var me = this;

        
        var obj_list = {
            'action': 'TKGG_QLKLGD/ThucHienDuyet',
            'versionAPI': 'v1.0',

            'strLopHocPhanId': strLopHocPhanId,
            'strDaDuyet': strDaDuyet, 
            'strNguoiThucHienId': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_tblLopHocPhan(me.strPhanCongId);

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

        me.getList_tblDaPhanCong();
        
    },
    show_TongSo: function (strTableId) {
        //Tìm tất cả checkbox đang check trong bảng loại bỏ phần dư thừa rồi cộng lại để hiện tổng trên cùng cạnh sinh viên
        setTimeout(function () { 
            edu.system.insertSumAfterTable(strTableId, [4, 5, 6, 7, 8, 9, 10]);
        }, 100);
    },
}

