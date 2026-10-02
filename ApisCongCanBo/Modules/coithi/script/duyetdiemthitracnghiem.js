function duyetdiemthitracnghiem() { };
duyetdiemthitracnghiem.prototype = {
    dtPhongThi: [],
    dtChiTietPhongThi: [],
    dtPhongThiImport: [],
    dtMucPheDuyet: [],
    dtDeThiThuCong: [],
    dtHocPhan: [],
    strStudentExamRoomId: '',
    strThiSinhId: '',

    strExamStructId: '',
    strExamRoomInfoId: '',
    strMatKhauChoPhongThi: '',
    strDepartOrganId: '',
    strWritenExamId: '',
    strWritenExamId_CacPhongThi: '',
    strKieuTaoDe: '',
    strDeThiThuCongId: '',
    strStudentExamRoomIds: '',
    strExamRoomInfoIds_CacPhongThi: '',
    rootPathReport: 'https://qldtbeta.phenikaa-uni.edu.vn/ttn.Apis.Report.QuanLyThiTracNghiem/Modules/Common/Baocao.aspx',
    init: function () {
        var me = this;
        me.page_load();
       

        $(".btnSearch_PhongThi").click(function () {
            me.getList_PhongThi();
        });
        $(".btnSearch_PhongThi_Tab2").click(function () {
            me.getList_PhongThi_Tab2();
        });
        $(".btnSearch_PhongThi_Tab3").click(function () {
            me.getList_PhongThi_Tab3();
        });
        $(".btnSearch_PhongThi_Tab4").click(function () {
            me.getList_PhongThi_Tab4();
        });
        $(".btnSearch_PhongThi_Tab5").click(function () {
            me.getList_PhongThi_Tab5();
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $(".btnClose_PhongThiImport_SinhVien").click(function () {
            me.toggle_batdau_ImportPhongThi_SinhVien();
        });
        $("#btnThucHienTacVu").click(function () {
            if (edu.util.getValById("drpTacVu") == "") {
                edu.system.alert("Bạn chưa chọn tác vụ cần thực hiện");
                return;
            }


        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi();
            }
        });
        $("#txtSearch_TuKhoa_Tab2").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi_Tab2();
            }
        });
        $("#txtSearch_TuKhoa_Tab3").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi_Tab3();
            }
        });
        $("#txtSearch_TuKhoa_Tab4").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi_Tab4();
            }
        });
        $("#txtSearch_TuKhoa_Tab5").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi_Tab5();
            }
        });

        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi('1');
        });

        $("#tblChiTietPhongThi").delegate(".btnChiTietThiSinh", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.rewrite_ThiSinh();
            me.toggle_edit_ThiSinh();
            me.viewEdit_ThiSinh(dt[0]);

        });

        $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;

            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('1');
            me.genThongTinDeThiDaTao();

            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);


        });
        $("#tblPhongThi_Tab2").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;

            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('1');
            me.genThongTinDeThiDaTao();

            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);


        });
        $("#tblPhongThi_Tab3").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;

            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('1');
            me.genThongTinDeThiDaTao();

            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);


        });
        $("#tblPhongThi_Tab4").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;

            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('1');
            me.genThongTinDeThiDaTao();

            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);


        });
        $("#tblPhongThi_Tab5").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;

            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('1');
            me.genThongTinDeThiDaTao();

            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);


        });

        $("#tblImportPhongThi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            //var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");

            me.toggle_edit_ImportPhongThi_SinhVien();
            me.getList_PhongThiImport_ThiSinhDaImport(strId);
            me.getList_PhongThiImport_ThiSinhChuaImport(strId);
            //me.viewEdit_PhongThi(dt[0]); 
        });
        $("[id$=chkSelectAll_PhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi" });
        });
        $("[id$=chkSelectAll_PhongThi_Tab2]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi_Tab2" });
        });
        $("[id$=chkSelectAll_PhongThi_Tab3]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi_Tab3" });
        });
        $("[id$=chkSelectAll_PhongThi_Tab4]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi_Tab4" });
        });
        //$("[id$=chkSelectAll_ChoPhepXemDiem]").on("click", function () {
        //    me.checkedCol_BgRow( "tblPhongThi" );
        //});
        //$("[id$=chkSelectAll_ChoPhepXemKetQua]").on("click", function () {
        //    me.checkedCol_BgRow( "tblPhongThi" );
        //});
        me.checkedCol_BgRow("tblImportPhongThi");
        $("#btnAdd_ChuyenDiemSangTacNghiep").click(function () {

            if (edu.util.getValById('drpExamstructPart') == "") {
                edu.system.alert("Bạn chưa chọn phần thi");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.Save_ChuyenDiemSangTacNghiep(me.strStudentExamRoomId);
                setTimeout(function () {
                    me.getList_ChiTietPhongThi('1');
                }, 2000);
            });

        });
        $("#btnThucHien_Duyet_Tab1").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'KHAOTHICONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi();
            }, 2000);

        });
        $("#btnThucHien_KhongDuyet_Tab2").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab2", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'GVCOITHICONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab2();
            }, 2000);

        });
        $("#btnThucHien_Duyet_Tab2").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab2", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var dt = edu.util.objGetDataInData("PHEDUYETDIEM", me.dtMucPheDuyet, "LOAIPHEDUYET");
                var strMucPheDuyet = "GIAOVUCONGNHAN";
                if (dt.length == 3) {
                    strMucPheDuyet = "DIEMDADUOCCONGNHAN";
                }
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, strMucPheDuyet);
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab2();
            }, 2000);

        });
        $("#btnThucHien_KhongDuyet_Tab3").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab3", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'KHAOTHICONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab3();
            }, 2000);

        });
        $("#btnThucHien_Duyet_Tab3").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab3", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'DAOTAOCONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab3();
            }, 2000);

        });

        $("#btnThucHien_KhongDuyet_Tab4").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab4", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'GIAOVUCONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab4();
            }, 2000);

        });
        $("#btnThucHien_Duyet_Tab4").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi_Tab4", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn chuyển dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var strExamRoomInfoIds = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strExamRoomInfoIds += arrChecked_Id[i] + ",";
                }
                strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                me.Update_PhongThi_MucPheDuyet(strExamRoomInfoIds, 'DIEMDADUOCCONGNHAN');
            });
            setTimeout(function () {
                me.getList_PhongThi_Tab4();
            }, 2000);

        });


        $("[id$=chkSelectAll_ChiTietPhongThi]").on("click", function () {
            me.checkedCol_BgRow("tblChiTietPhongThi");
        });

        $("#btnFileMau").click(function (e) {
            e.preventDefault();
            me.report("TEMPLATE_DANHSACHTHISINH");
        });
        $(".btnCloseSubDetail").click(function () {

            me.toggle_edit_chitiet();
        });

        edu.system.uploadImport(["txtFile_DMIP"]);

        $("#btnClose_KetQuaThi").click(function (e) {
            e.stopImmediatePropagation();
            me.closeKetQuaThi();
        });
        //#region tab_GenDeTuDeThiCoSan

        $("#drpExamstructPart").on("select2:select", function () {
            me.getList_ChiTietPhongThi("1");
        });
        $("#drpHocKy").on("select2:select", function () {
            me.getList_drpDotThi(edu.util.getValById("drpHocKy"), "drpDotThi");
        });
        $("#drpHocKy_Tab2").on("select2:select", function () {
            me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab2"), "drpDotThi_Tab2");
        });
        $("#drpHocKy_Tab3").on("select2:select", function () {
            me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab3"), "drpDotThi_Tab3");
        });
        $("#drpHocKy_Tab4").on("select2:select", function () {
            me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab4"), "drpDotThi_Tab4");
        });
        $("#drpHocKy_Tab5").on("select2:select", function () {
            me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab5"), "drpDotThi_Tab5");
        });
        //#endregion

        $("#btnIn_DeThiCuaThiSinh").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnTaiFile").click(function () {
            var selectedValue = $("#drpBaoCao").find('option:selected').val();
            me.report($("#drpBaoCao").val());
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_dropSearch_LoaiDiem();
            me.getList_dropSearch_HinhThuc();
            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {

            me.getList_dropSearch_HinhThuc();
            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_HinhThuc').on('select2:select', function (e) {

            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {
            me.getList_dropSearch_MonThi();
        });

        $("#zoneTab").delegate('.tab-item', 'click', function (e) {
            var tabId = $(this).attr("name");
            console.log(tabId)
            $(".swiper-slide-thumb-active").removeClass("swiper-slide-thumb-active");
            this.classList.add("swiper-slide-thumb-active");
            $("#swiperGiayTo .swiper-slide").slideUp();
            $("#" + tabId).slideDown();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.LayDS_MucPheDuyet();
        me.getList_drpDonVi();
        me.getList_drpHocKy();
        me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab5"), "drpDotThi_Tab5");
        me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab4"), "drpDotThi_Tab4");
        me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab3"), "drpDotThi_Tab3");
        me.getList_drpDotThi(edu.util.getValById("drpHocKy_Tab2"), "drpDotThi_Tab2");
        me.getList_drpDotThi(edu.util.getValById("drpHocKy"), "drpDotThi");

        me.get_drpViPhamQuyChe();

        me.getList_dropSearch_ThoiGian();
        me.getList_dropSearch_LoaiDiem();
        me.getList_dropSearch_HinhThuc();
        me.getList_dropSearch_DotThi();
        me.getList_dropSearch_MonThi();


    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit_chitiet: function () {
        var me = this;
        $("#modalDanhSachThiSinh").modal('show');
    },

    toggle_edit_ThiSinh: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneThiSinh");
    },
    toggle_edit_TaoDeThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTaoDeThi");
    },
    toggle_edit_TinhHuongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTinhHuongThi");
    },


    rewrite_ThiSinh: function () {
        var me = this;
        me.strThiSinhId = "#";
        edu.util.viewValById("txtStudentCode", "");
        edu.util.viewValById("txtLastName", "");
        edu.util.viewValById("txtFirtName", "");
        edu.util.viewValById("txtClassName", "");
        edu.util.viewValById("txtSoBaoDanh", "");
        edu.util.viewValById("txtBirthDate", "");
    },
    viewEdit_ThiSinh: function (dt) {
        var me = this;
        me.strThiSinhId = dt.USERID;
        edu.util.viewValById("txtStudentCode", dt.STUDENTCODE);
        edu.util.viewValById("txtLastName", dt.HODEM);
        edu.util.viewValById("txtFirtName", dt.TEN);
        edu.util.viewValById("txtClassName", dt.CLASSNAMEIMPORT);
        edu.util.viewValById("txtSoBaoDanh", dt.SOBAODANHIMPORT);
        edu.util.viewValById("txtBirthDate", dt.BIRTHDATE_USER);
    },

    viewEdit_PhongThi: function (dt) {
        var me = this;
        me.strExamRoomInfoId = dt.ID;

        edu.util.viewHTMLById("lblDonVi", dt.TENDONVI);
        edu.util.viewHTMLById("lblDotThi", dt.TENDOTTHI);
        edu.util.viewValById("txtRoomName", dt.ROOMNAME);
        edu.util.viewValById("txtCourseName", dt.COURSENAME);
        edu.util.viewValById("txtCourseCode", dt.COURSECODE);
        edu.util.viewValById("txtCourseCredit", dt.COURSECREDIT);
        edu.util.viewValById("txtCodeDST", dt.CODEDST);
        edu.util.viewValById("txtRoomTitle", dt.ROOMTITLE);
        edu.util.viewValById("txtRoomHelp", dt.ROOMHELP);
        edu.util.viewValById("txtTeacher1", dt.TEACHER1);
        edu.util.viewValById("txtTeacher2", dt.TEACHER2);
        edu.util.viewValById("txtExamDate", dt.EXAMDATE);
        edu.util.viewValById("txtTotalTime", dt.TOTALTIME);
        edu.util.viewValById("txtSoDiemLe", dt.SODIEMLE);
        edu.util.viewValById("txtThangDiem", dt.THANGDIEM);
        me.getList_CanBoCoiThi();
        edu.util.viewValById("txtMatKhauChoPhongThi", dt.MATKHAUCHOPHONGTHI);
        if (dt.CHOPHEPXEMDIEM == "1")
            $("#chkChoPhepXemDiem").prop("checked", true);
        else
            $("#chkChoPhepXemDiem").prop("checked", false);

        if (dt.CHOPHEPXEMKETQUATRALOI == "1")
            $("#chkChoPhepXemKetQuaTraLoi").prop("checked", true);
        else
            $("#chkChoPhepXemKetQuaTraLoi").prop("checked", false);

        $("#drpTrangThaiPhongThi_Edit").val(dt.OPENSTATUS).change();

        $("#drpHocPhan").val(dt.HOCPHANID).change();



        $("#drpCachTinhDiem").val(dt.CACHTINHDIEM).change();
    },
    toggle_edit_PhongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonePhongThi");
    },
    toggle_edit_ImportPhongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi");
    },
    toggle_edit_ImportPhongThi_SinhVien: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi_SinhVien");
    },
    toggle_batdau_ImportPhongThi_SinhVien: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi");
    },
    rewrite_PhongThi: function () {
        var me = this;
        me.strExamRoomInfoId = '';
        edu.util.viewHTMLById("lblDonVi", "");
        edu.util.viewHTMLById("lblDotThi", "");
        edu.util.viewValById("txtRoomName", "");
        edu.util.viewValById("txtCourseName", "");
        edu.util.viewValById("txtCourseCredit", "");
        edu.util.viewValById("txtCourseCode", "");
        edu.util.viewValById("txtCodeDST", "");
        edu.util.viewValById("txtRoomTitle", "");
        edu.util.viewValById("txtRoomHelp", "");
        edu.util.viewValById("txtTeacher1", "");
        edu.util.viewValById("txtTeacher2", "");
        edu.util.viewValById("txtExamDate", "");
        edu.util.viewValById("txtTotalTime", "");
        edu.util.viewValById("txtSoDiemLe", "");
        edu.util.viewValById("txtThangDiem", "");
        edu.util.viewValById("txtMatKhauChoPhongThi", "");
        $("#chkChoPhepXemDiem").prop("checked", true);
        $("#chkChoPhepXemKetQuaTraLoi").prop("checked", false);
        //$("#chkChoPhepXemDiem").attr("checked", true);
        //$("#chkChoPhepXemKetQuaTraLoi").attr("checked",false);
        $("#drpTrangThaiPhongThi_Edit").val("").change();



        $("#drpCachTinhDiem").val("").change();

    },

    getList_ChiTietPhongThi: function (strCoTinhLaiDiem) {
        var me = this;

        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");

        edu.util.viewHTMLById("lblDonVi_ChiTiet", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_ChiTiet", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_ChiTiet", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_ChiTiet", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_ChiTiet", dt[0].EXAMDATE);


        edu.util.viewHTMLById("lblDonVi_TaoDeThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeThi", dt[0].EXAMDATE);

        edu.util.viewHTMLById("lblDonVi_TaoDeTuDeThiThuCong", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeTuDeThiThuCong", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeTuDeThiThuCong", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeTuDeThiThuCong", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeTuDeThiThuCong", dt[0].EXAMDATE);



        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE);


        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;


        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiTao_Id': edu.system.userId,
            'strCoTinhLaiDiem': strCoTinhLaiDiem,
            'strExamStructPartId': edu.util.getValById('drpExamstructPart'),
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;

                    me.dtStudentFiles = data.Data.StudentFiles;

                    me.genTable_ChiTietPhongThi("0", me.dtChiTietPhongThi, data.Pager);
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
    genTable_ChiTietPhongThi: function (strCoTinhLaiDiem, data, iPager) {
        var me = this;
        var iSoThiSinhDuThi = 0;
        var iSoThiSinhKhongDat = 0;
        var iSoThiSinhDat = 0;
        var ranChar = me.randomString(3, "");



        $("#tblChiTietPhongThi tbody").html("");
        //$("#tblChiTietPhongThi tfoot").html('<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="3">Tổng số: ' + iSoThiSinhDuThi + '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' + iSoThiSinhDat + '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' + iSoThiSinhKhongDat + '</td></tr>');

        var jsonForm = {
            strTable_Id: "tblChiTietPhongThi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_ChiTietPhongThi('" + strCoTinhLaiDiem + "')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1, 3,],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        var html = '<span><img src="' + edu.system.rootPath + '/Upload/Avatar/avata-user.png" class= "table-img" id="sl_hinhanh' + aData.STUDENTCODE + '" /></span>';
                        return '<a>' + html + '</br>' + aData.STUDENTCODE + '</a>';
                    }


                },
                {
                    "mRender": function (nRow, aData) {

                        return '<span>' + aData.FULLNAME + '</span>';
                    }

                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mDataProp": "DETHITHU"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";

                        strHTML = edu.util.returnEmpty(aData.DIEMTINH);
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + aData.STUDENTEXAMROOMPARTID + '" value ="' + edu.util.returnEmpty(aData.MARK) + '" class="form-control" />';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        if (edu.util.returnEmpty(aData.TENVIPHAMQUYCHETHI) != "")
                            strHTML = "<span style='color:red;'>" + aData.TENVIPHAMQUYCHETHI + "</span>";
                        strHTML += '<input type ="text" id="txtGhiChu' + aData.STUDENTEXAMROOMPARTID + '" value ="' + edu.util.returnEmpty(aData.GHICHU) + '" class="form-control" />';
                        return strHTML;
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_drpDonVi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_DonViByUserId',
            'strUserId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDonVi(data.Data);
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
    genList_drpDonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDonVi", "drpDonVi_Tab2", "drpDonVi_Tab3", "drpDonVi_Tab4", "drpDonVi_Tab5"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotThi: function (strHocKy, strdrpDotThi) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DoThiByHocKy',
            'strStatus': '1',
            'strHocKy': strHocKy,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                     
                    me.genList_drpDotThi(data.Data, strdrpDotThi);
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
    genList_drpDotThi: function (data, strdrpDotThi) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: [strdrpDotThi],
            type: "",
            title: "Chọn đợt thi"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_PhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi'),
            'strHocKy': edu.util.getValById('drpHocKy'),
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strMucPheDuyet': 'GVCOITHICONGNHAN',
            'strStatus': '',
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi(data.Data, data.Pager);
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
    genTable_PhongThi: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_PhongThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_PhongThi_Tab2: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi_Tab2'),
            'strHocKy': edu.util.getValById('drpHocKy_Tab2'),
            'strDotThi_Id': edu.util.getValById('drpDotThi_Tab2'),
            'strMucPheDuyet': 'KHAOTHICONGNHAN',
            'strStatus': '',
            'strTuNgay': edu.util.getValById('txtTuNgay_Tab2'),
            'strDenNgay': edu.util.getValById('txtDenNgay_Tab2'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_Tab2'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi_Tab2(data.Data, data.Pager);
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
    genTable_PhongThi_Tab2: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong_Tab2").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi_Tab2",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_PhongThi_Tab2()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_PhongThi_Tab3: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi_Tab3'),
            'strHocKy': edu.util.getValById('drpHocKy_Tab3'),
            'strDotThi_Id': edu.util.getValById('drpDotThi_Tab3'),
            'strMucPheDuyet': 'GIAOVUCONGNHAN',
            'strStatus': '',
            'strTuNgay': edu.util.getValById('txtTuNgay_Tab3'),
            'strDenNgay': edu.util.getValById('txtDenNgay_Tab3'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_Tab3'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi_Tab3(data.Data, data.Pager);
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
    genTable_PhongThi_Tab3: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong_Tab3").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi_Tab3",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_PhongThi_Tab2()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_PhongThi_Tab4: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi_Tab4'),
            'strHocKy': edu.util.getValById('drpHocKy_Tab4'),
            'strDotThi_Id': edu.util.getValById('drpDotThi_Tab4'),
            'strMucPheDuyet': 'DAOTAOCONGNHAN',
            'strStatus': '',
            'strTuNgay': edu.util.getValById('txtTuNgay_Tab4'),
            'strDenNgay': edu.util.getValById('txtDenNgay_Tab4'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_Tab4'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi_Tab4(data.Data, data.Pager);
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
    genTable_PhongThi_Tab4: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong_Tab4").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi_Tab4",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_PhongThi_Tab4()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_PhongThi_Tab5: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi_Tab5'),
            'strHocKy': edu.util.getValById('drpHocKy_Tab5'),
            'strDotThi_Id': edu.util.getValById('drpDotThi_Tab5'),
            'strMucPheDuyet': 'DIEMDADUOCCONGNHAN',
            'strStatus': '',
            'strTuNgay': edu.util.getValById('txtTuNgay_Tab5'),
            'strDenNgay': edu.util.getValById('txtDenNgay_Tab5'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_Tab5'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi_Tab5(data.Data, data.Pager);
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
    genTable_PhongThi_Tab5: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong_Tab5").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi_Tab5",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_PhongThi_Tab5()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_CanBoCoiThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_CanBoCoiThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_CanBoCoiThi(data.Data, data.Pager);
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
    genTable_CanBoCoiThi: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCanBoCoiThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthitracnghiem.getList_CanBoCoiThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];

        //if (strLoaiBaoCao != "TEMPLATE_DANHSACHTHISINH") {
        //    if (edu.util.getValById("drpExamstructPart") == "") {
        //        edu.system.alert("Bạn chưa chọn phần thi");
        //        return;
        //    }
        //}
        if (strLoaiBaoCao == "") {
            edu.system.alert("Bạn chưa chọn mẫu báo cáo");
            return;
        }
        addKeyValue("ExamRoomInfo_Id", me.strExamRoomInfoId);
        addKeyValue("ExamstructPartId", edu.util.getValById("drpExamstructPart"));
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);

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
                        var url_report = me.rootPathReport + "?id=" + strBaoCao_Id;
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
            'action': 'QLTTN_QuanLyThi/Import_StudentExamRoom',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strMatKhauChoPhongThi': me.strMatKhauChoPhongThi,
            'NguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtErr = data.Data.Table1;
                    var dtThanhCong = data.Data.Table2;
                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                    me.getList_ChiTietPhongThi('1');
                    edu.system.viewFiles("txtFile_DMIP", "");

                    me.toggle_import();
                    //  console.log(dtThanhCong);
                    if (dtErr.length > 0) {

                        me.genTable_Import_View(dtErr, "tblImport_ThatBai");
                        me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");
                    }
                    else
                        me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");


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
                edu.system.alert("QLTTN_QuanLyThi/ImportNganHangCauHoi_Temp(er): " + JSON.stringify(er), "w");
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

    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },

    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImport");



    },



    closeKetQuaThi: function () {
        var me = this;
        $("#zoneChiTiet").show();
        $("#zoneKetQuaThi").slideUp();
    },

    //#region tab_GenDeTuDeThiCoSan

    //#endregion 

    getList_KieuLamBai: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamStructId': me.strExamStructId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 1000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dataExamPart = data.Data.filter(e => e.PARENTID === null);


                    me.genList_drpExamstructPart(dataExamPart);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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

    genList_drpExamstructPart: function (data) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TITLE",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpExamstructPart"],
            type: "",
            title: "Chọn phần thi"
        };
        edu.system.loadToCombo_data(obj);
    },

    get_drpViPhamQuyChe: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyTHI/LayDS_ViPhamQuyChe',
            'versionAPI': 'v1.0',

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpViPhamQuyChe(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpViPhamQuyChe: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder"
            },
            renderPlace: ["drpViPhamQuyChe"],
            title: "Chọn"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_dropSearch_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayLoaiDiem',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_LoaiDiem(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_LoaiDiem: function (data) {
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
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_HinhThuc: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_HinhThuc(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_HinhThuc: function (data) {
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
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDanhSach_DotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_DotThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_DotThi: function (data) {
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
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_MonThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_MonThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_MonThi: function (data) {
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
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_ImportPhongThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DSThiTheoDotThi',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strHinhThucThi_Id': "",
            'strLoaiDiem_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhongThiImport = dtReRult;

                    me.genTable_ImportPhongThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/

    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //alert(1);
        //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {

            var checked_status = $(this).is(':checked');
            var child = this.parentNode;
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            $("#" + strTable_Id + " tbody tr").each(function () {
                var arrcheck = $(this).find("td:eq(" + index + ")").find('input:checkbox');
                arrcheck.each(function () {
                    if ($(this).is(":hidden")) return;
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            });
        });
    },


    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWYabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    getList_drpHocKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocKy',
            'strStatus': '1',

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
                id: "SEMESTER",
                parentId: "",
                name: "SEMESTER",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy", "drpHocKy_Tab2", "drpHocKy_Tab3", "drpHocKy_Tab4", "drpHocKy_Tab5"],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },

    genThongTinDeThiDaTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data[0];
                    me.strExamStructId = dt.EXAMSTRUCTID;
                    me.getList_KieuLamBai();

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
    save_PheDuyetDiem: function (strStudentExamRoomPartId, strMark, strGhiChu) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/save_PheDuyetDiem',
            'versionAPI': 'v1.0',
            'strId': strStudentExamRoomPartId,
            'strMark': strMark,
            'strGhiChu': strGhiChu,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Save_ChuyenDiemSangTacNghiep: function (strExamRoomInfoId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Save_ChuyenDiemSangTacNghiep',
            'versionAPI': 'v1.0',
            'strId': strExamRoomInfoId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Update_PhongThi_MucPheDuyet: function (strIds, strMucPheDuyet) {
        var me = this;
        //--Edit
        console.log('strUngDung_Id:' + edu.system.AppId);
        console.log('strChucNang_Id:' + edu.system.strChucNang_Id);
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Update_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strMucPheDuyet': strMucPheDuyet,
            'strNguoiThucHien_Id': edu.system.userId,
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id


        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    // me.genThongTinDeThiDaTao();
                    edu.system.alert("Thực hiện chuyển thành công");
                }
                else {

                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    LayDS_MucPheDuyet: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_MucPheDuyet',
            'versionAPI': 'v1.0',           
            'strNguoiDung_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMucPheDuyet = data.Data;
                    var dt = edu.util.objGetDataInData("PHEDUYETDIEM", me.dtMucPheDuyet, "LOAIPHEDUYET");
                    
                    if (dt.length == 3) {
                        $('#tab_3').hide();
                        $('#tab_4').hide();
                    }
                     
                  

                    
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
}

