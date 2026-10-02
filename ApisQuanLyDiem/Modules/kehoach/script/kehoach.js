/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtXacNhan: [],
    strKetQua_Id: '',
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_DMHocPhan();
        me.getList_LoaiChungChi();
        me.getList_LoaiQuyetDinh();
        me.getList_LoaiCongNhan();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.CONGNHANDIEM.MOHINH", "dropMoHinh");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.CQD", "dropQuyetDinh_Cap");
        //edu.system.loadToCombo_DanhMucDuLieu("DIEM.CONGNHAN.XACNHAN", "", "", data => me.loadBtnXacNhan(data, "#zoneBtnXacNhan"));

        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("[id$=chkSelectAll_KeHoachXuLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeHoachXuLy" });
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KeHoachXuLy();
                }, arrChecked_Id.length * 50);
            });
        });
        $("[id$=chkSelectAll_InputHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInputHocPhan" });
        });
        $("[id$=chkSelectAll_HocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });
        $("[id$=chkSelectAll_QuanSo]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanSoLop" });
        });
        
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });

        $(".btnSave_HocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            arrChecked_Id.forEach(e => {
                if ($("#tblInputHocPhan tr[id=" + e + "]").length == 0) {
                    $("#tblInputHocPhan tbody").append('<tr id="' + e + '" class="addHocPhan">' + $("#tblHocPhan tr[id=" + e + "]").html() + '</tr>');
                }
            });
        });

        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblKeHoachXuLy").delegate('.btnNoiDung', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = this.id;
            edu.util.toggle_overide("zone-bus", "zoneNoiDung");
        });

        $("#tblKeHoachXuLy").delegate('.btnQuyetDinh', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = this.id;
            edu.util.toggle_overide("zone-bus", "zoneQuyetDinh");
            me.getList_QuyetDinh();
            me.getList_QDNguoiHoc();
        });
        $("#btnSave_HocPhan").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHocPhan").click(function () {
            $("#myModalHocPhan").modal("show");
        });
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $(".btnSearch_SinhVienDKH").click(function () {
            me.genModal_SinhVienDKH();
            me.getList_SinhVienMDDKH("SEARCH");
        });
        $(".btnSearch_SinhVienKeHoach").click(function () {
            me.genModal_SinhVienKeHoach();
            //me.getList_SinhVienMDDKH("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#modal_sinhvien_kehoach").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
        
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearchDTSV_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblKeHoachXuLy").delegate('.btnDSDoiTuong', 'click', function (e) {
            //$('#myModal').modal('show');
            edu.util.toggle_overide("zone-bus", "zoneQuanSo");
            me["strKeHoach_Id"] = this.id
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#txtSearchHocPhan").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblHocPhan tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });

        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        $(".btnDeleteHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInputHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhan(arrChecked_Id[i]);
                }
            });
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            //$(".loaiXacNhan").html("Xác nhận");
            //me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            //kme.getList_XacNhan(me.strDSDiem_Id, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            $("#modal_XacNhan").modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => { 
                var aData = me.dtQuanSo.find(ele => ele.ID == e);
                me.save_XacNhan(aData.DULIEUXACNHAN, strTinhTrang, strMoTa, me.strLoaiXacNhan);
            })
            
        });
        edu.system.getList_MauImport("zonebtnBaoCao_KeHoach", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strDiem_KeHoachCongNhan_Id", e));
        });

        $("#tblQuanSoLop").delegate('.btnEdit', 'click', function (e) {
            var id = this.id;
            console.log(11111111);
            $("#lichsu_chitiet").modal("show");

            me.strKetQua_Id = id;
            var aData = me.dtQuanSo.find(e => e.ID == id);
            $("#lblHocPhan").html(aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN);
            $("#lblSinhVien").html(aData.QLSV_NGUOIHOC_MASO + " - " + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN);
            //edu.util.viewValById("dropCoSoDaoTao", "");
            //edu.util.viewValById("dropLoaiChungChi", "");
            //edu.util.viewValById("dropLoaiCongNhan", "");
            //edu.util.viewValById("txtKetQuaCongNhan", "");
            //edu.util.viewValById("txtNgayCap", "");
            //edu.util.viewValById("txtNgayHetHan", "");
            //edu.util.viewValById("txtGhiChu", "");
            //edu.util.viewValById("txtHeDaoTao", "");
            //edu.util.viewValById("txtSoTinChi", "");
            //edu.util.viewValById("txtTenHocPhan", "");
            edu.system.viewFiles("txtFileDinhKem", "CongNhan" + aData.DIEM_KEHOACHCONGNHANDIEM_ID + aData.QLSV_NGUOIHOC_ID,"SV_Files");
            me.getDetail_CongNhanDiem(aData);
        });
        $("#btnDelete_CongNhanDiem").click(function () {
            console.log(11111111);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_CongNhanDiem(me.strCongNhanDiem_Id)
            });
        });
        $("#btnSave_CongNhanDiem").click(function () {
            me.save_CongNhanDiem();
        });
        edu.system.uploadFiles(["txtFileDinhKem"]);
        $(".btnDownloadAllFile").click(function () {
            var arrFile = [];
            var arrFileName = [];
            me.dtQuanSo.forEach((e) => {
                var iVitri = 0;
                if ($('#tblQuanSoLop tr[id=' + e.ID + ']').is(":hidden")) return;
                $('#tblQuanSoLop tr[id=' + e.ID + '] .upload-img').each(function () {
                    var url = $(this).attr("name");

                    if (arrFile.indexOf(url) == -1) {
                        arrFile.push(url);
                        arrFileName.push(e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "//" + ++iVitri + "_" + e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "_" + $(this).attr("title"));
                    }
                });
                $('#tblQuanSoLop tr[id=' + e.ID + '] .upload-file').each(function () {
                    var url = $(this).attr("name");
                    if (arrFile.indexOf(url) == -1) {
                        arrFile.push(url);
                        arrFileName.push(e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "//" + ++iVitri + "_" + e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "_" + $(this).attr("title"));
                    }
                });
            });

            me.save_GopFile(arrFile, arrFileName);
        });

        $("#btnSearch_BangDiem").click(function () {
            me.getList_BangDiem();
        });
        $("#btnSearch_ChungChi").click(function () {
            me.getList_ChungChi();
        });
        $("#tblBangDiem").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me['strSinhVien_Id'] = strId;
            $("#myModalBangDiem").modal("show");
            me.getList_BangDiem_ChiTiet();
        });

        $("#tblChungChi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me['strSinhVien_Id'] = strId;
            $("#myModalChungChi").modal("show");
            me.getList_ChungChi_ChiTiet();
        });

        $("#btnXacNhan_BangDiem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBangDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me['arrXacNhan'] = arrChecked_Id;
            me['strLoaiXacNhan'] = "BangDiem";
            $("#modal_XacNhan2").modal("show");

        });
        $("#btnXacNhan_ChungChi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChungChi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me['arrXacNhan'] = arrChecked_Id;
            me['strLoaiXacNhan'] = "ChungChi";
            $("#modal_XacNhan2").modal("show");
        });
        $("#btnSave_XacNhan2").click(function () {
            var arrChecked_Id = me.arrXacNhan;
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan2(arrChecked_Id[i]);
            }
            $("#modal_XacNhan2").modal("hide");
        });

        $("#btnTaoMoiQuyetDinh").click(function () {
            $("#myModalAddQuyetDinh").modal("show");
            var arrId = ["txtQuyetDinh_Ten", "dropQuyetDinh_Loai", "txtQuyetDinh_So",
                "txtQuyetDinh_Ngay", "txtQuyetDinh_NgayHieuLuc", "txtQuyetDinh_NgayKetThuc",
                "dropThoiGianDaoTao_QD", "txQuyetDinh_MoTa", "dropQuyetDinh_Cap",
                "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy", "dropHinhThuc"];
            edu.util.resetValByArrId(arrId);
        });
        $("#btnSave_QuyetDinh").click(function () {
            me.save_QuyetDinh();
        });

        $("#btnAddSVQuyetDinh").click(function () {
            $("#myModalSVChuaQD").modal("show");
            me.getList_SVChuaQD();
        });
        $("#btnSave_SVChuaQD").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSVChuaQD", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            $("#myModalSVChuaQD").modal("hide");
            arrChecked_Id.forEach(e => me.save_QDNguoiHoc(e));
        });



        $("#dropLoaiXacNhan").on("select2:select", function () {
            me.getList_TrangThai();
        });
        $("#dropSearch_QuyetDinh").on("select2:select", function () {
            me.getList_QDNguoiHoc();
        });

        $("#btnTaoDSDiem").click(function () {
            me.save_TaoDSDiem();
        });
        $("#btnChuyenDiem").click(function () {
            me.save_ChuyenDiem();
        });

        $("#btnSearchQDR").click(function () {
            me.getList_QDNguoiHoc();
        });

        $("#btnTinhPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQDNguoiHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.save_TinhPhi(e));
        });
        $("#btnDeleteTinhPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQDNguoiHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.delete_TinhPhi(e));
        });


        $("#tblKeHoachXuLy").delegate('.btnDSNhanSu', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSNhanSu");
            me.strKeHoachXuLy_Id = strId;
            me.getList_PhanCong();
        });
        $("#btnAdd_PhanCong").click(function () {
            edu.extend.genModal_NguoiDung(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanCong(arrChecked_Id[i]);
                }
            });
            edu.extend.getList_NguoiDungP();
        });
        $("#btnDelete_PhanCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCong(arrChecked_Id[i]);
                }
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropMoHinh", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("txtHanInDon", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFKCQsHgokCS4gIikCLi8mDykgLwUoJCwP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDiem_KeHoachCongNhanDiem',
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'dHieuLuc': edu.util.getValById('dropSearch_HieuLuc'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHgokCS4gIikCLi8mDykgLwUoJCwP',
            'func': 'PKG_CONGTHONGTIN_CONGNHANDIEM.Them_Diem_KeHoachCongNhanDiem',
            'iM': edu.system.iM,
            'strId': me.strKeHoachXuLy_Id,
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'strMaKeHoach': edu.util.getValById('txtMa'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strMoHinhDangKy_Id': edu.util.getValById('dropMoHinh'),
            'strHanInDon': edu.system.getValById('txtHanInDon'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_CongNhanDiem_MH/EjQgHgUoJCweCiQJLiAiKQIuLyYPKSAvBSgkLAPP';
            obj_save.func = 'PKG_CONGTHONGTIN_CONGNHANDIEM.Sua_Diem_KeHoachCongNhanDiem';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                        }
                    });
                    //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    //});

                    for (var i = 0; i < me.arrKhoa.length; i++) {
                        me.save_SinhVien(me.arrKhoa[i], strKeHoachXuLy_Id);
                    }
                    for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                        me.save_SinhVien(me.arrChuongTrinh[i], strKeHoachXuLy_Id);
                    }
                    for (var i = 0; i < me.arrLop.length; i++) {
                        me.save_SinhVien(me.arrLop[i], strKeHoachXuLy_Id);
                    }
                    //$("#tblInputHocPhan tbody tr[class=addHocPhan]").each(function () {
                    //    me.save_HocPhan(this.id, strKeHoachXuLy_Id);
                    //});
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_CongNhanDiem/Xoa_Diem_KeHoachCongNhanDiem',
            

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Lop: function (strTN_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViLop',

            'strId':"",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strTN_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViCT',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strTN_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViKhoa',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,2, 3, 4, 5, 6],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "HANINDON"
                },
                {
                    //"mDataProp": "HIEULUC"
                    "mRender": function (nRow, aData) {
                        var x = aData.HIEULUC ?  "Có hiệu lực" :  "Hết hiệu lực";
                        return x;
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSNhanSu" id="' + aData.ID + '" title="Chi tiết">Phân công</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNoiDung" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnQuyetDinh" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //for (var i = 0; i < data.length; i++) {
        //    me.getList_PhanCong(data[i].ID);
        //}
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MAKEHOACH);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropMoHinh", data.MOHINHDANGKY_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        edu.util.viewValById("txtHanInDon", data.HANINDON);
        me.strKeHoachXuLy_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhanCong: function (strTN_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhanSu = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strNhanSu += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strNhanSu != "") strNhanSu = strNhanSu.substring(1);
                    $("#DSPhanCong").html(strNhanSu);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    $("#DSDoiTuong").html(strDoiTuong);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_CongNhanDiem/LayDSKeHoachCongNhan_PhamVi',
            'type': 'GET',
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        if (aData && aData.QLSV_NGUOIHOC_ID) strNhanSu_Id = aData.QLSV_NGUOIHOC_ID;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem/Them_KeHoachCongNhan_PhamVi',
            'type': 'POST',
            'strDiem_KeHoachCongNhan_Id': strQLSV_KeHoachXuLy_Id,
            'strPhamViApDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_CongNhanDiem/Xoa_KeHoachCongNhan_PhamVi',
            
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].PHAMVIAPDUNG_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_HOTEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
            html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        //html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVien: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="area-search">';
        html += '<div id="DSTrangThaiSV_MD" style="padding-left: 25px" class="inputSearch">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';

        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-left">Trạng thái</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienMD("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.extend.getList_HeDaoTao();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMD("SEARCH");
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            me.getList_SinhVienMD();
        });
        $("#modal_sinhvien").delegate("#btnChonSinhVien", "click", function (e) {
            e.stopImmediatePropagation();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        $("#modal_sinhvien").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        $("#modal_sinhvien").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $("#DSTrangThaiSV_MD .ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        //$("#modal_sinhvien").delegate(".ckbDSTrangThaiSV_ALL", "click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        //});
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", (data) => {
            var row = '';
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
            row += '<span><b>Tất cả</b></p></span>';
            row += '</div>';
            for (var i = 0; i < data.length; i++) {
                var strcheck = "";
                //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
                row += '<div class="col-lg-6 checkbox-inline user-check-print">';
                row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
                row += '<span><p>' + data[i].TEN + '</p></span>';
                row += '</div>';
            }
            $("#DSTrangThaiSV_MD").html(row);
        });
    },
    getList_SinhVienMD: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGetListModal_SinhVien: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMD('SEARCH')",
                iDataRow: iPager,
                //bLeft: false,
                //bChange: false
            },
            colPos: {
                center: [0,1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVienKeHoach: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiKeHoach_SV" class="select-opt" style="width:100% !important">';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_KeHoach_SV" class="select-opt" style="width:100% !important">';
        html += '</select>';
        html += '</div>';
        
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';

        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien_kehoach").html(html);
        $("#modal_sinhvien_kehoach").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienKeHoach("SEARCH");
            }
        });
        $('#dropSearchModal_KeHoach_SV').select2();
        $('#dropSearchModal_LoaiKeHoach_SV').select2();
        me.getList_KeHoachMD();
        //$('#dropSearchModal_He_SV').select2();
        //$('#dropSearchModal_Khoa_SV').select2();
        //$('#dropSearchModal_ChuongTrinh_SV').select2();
        //$('#dropSearchModal_Lop_SV').select2();
        //me.getList_ThoiGianDaoTaoDKH();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMDKeHoach("SEARCH");
        }); 
        $('#dropSearchModal_LoaiKeHoach_SV').on('select2:select', function (e) {
            me.getList_KeHoachMD();
        });
        $('#dropSearchModal_KeHoach_SV').on('select2:select', function (e) {
            me.getList_SinhVienMDKeHoach();
        });


        $("#modal_sinhvien_kehoach").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        $("#modal_sinhvien_kehoach").delegate("#btnChonSinhVien", "click", function (e) {
            e.stopImmediatePropagation();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearchModal_LoaiKeHoach_SV");
    },
    getList_SinhVienMDKeHoach: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': edu.util.getValById('dropSearchModal_KeHoach_SV'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVienKeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGetListModal_SinhVienKeHoach: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMDDKH('SEARCH')",
            //    iDataRow: iPager,
            //    //bLeft: false,
            //    //bChange: false
            //},
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
    
    getList_KeHoachMD: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearchA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearchModal_LoaiKeHoach_SV'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTaoA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MDKeHoach(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MDKeHoach: function (data) {
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
            renderPlace: ["dropSearchModal_KeHoach_SV"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayHeDaoTaoTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayKhoaHocTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayChuongTrinhTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayLopQuanLyTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LopQuanLy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_ThoiGianDaoTaoDKH: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao_DKH(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearchModal_He_SV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_He_SV").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_Khoa_SV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Khoa_SV").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_ChuongTrinh_SV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_ChuongTrinh_SV").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearchModal_Lop_SV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Lop_SV").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachXuLy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropKeHoachXuLy_ThoiGianDaoTao", "dropThoiGianDaoTao_QD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao_DKH: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_HocKy_SV"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_HocKy_SV").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoachXuLy.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strKeHoachXuLy_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_NhanSu/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strKeHoachXuLy_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TN_KeHoach_NhanSu/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach_NhanSu/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NGUOIDUNG_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TAIKHOAN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TENDAYDU) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID");
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html); edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuanSoTheoLop: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeERUP',
            'func': 'PKG_CONGTHONGTIN_CONGNHANDIEM.LayDSKH_NguoiHoc_HP_Cap_PT',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoach_Id,
            'strQLSV_QuyetDinh_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuanSo"] = dtReRult;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager, strTN_KeHoach_Id);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert( JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_QuanSoTheoLop: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_QuanSoTheoLop()",
                iDataRow: iPager,
                bFilter: true,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "LOAICONGNHAN_TEN",
                    //mRender: function (nRow, aData) {
                    //    return '<div class="input-group no-icon"><select id="dropLoaiChungChi' + aData.ID + '" class="select-opt dropLoaiChungChi"></select ><div>';
                    //}
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN",
                    //mRender: function (nRow, aData) {
                    //    return '<div class="input-group no-icon"><select id="dropLoaiCongNhan' + aData.ID + '" class="select-opt dropLoaiCongNhan"></select ><div>';
                    //}
                },
                {
                    "mDataProp": "DIEM",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtKetQuaCongNhan' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    //}
                },
                {
                    "mDataProp": "THONGTINHOCPHAN_CHUNGCHI",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtTenHocPhan' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    //}
                },
                {
                    "mDataProp": "SOTINCHI",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtSoTinChi' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    //}
                },
                {
                    "mDataProp": "HEDAOTAO",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtHeDaoTao' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    //}
                },
                {
                    "mDataProp": "NGAYCAP",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtNgayCap' + aData.ID + '" class="form-control input-datepicker" style="padding-left: 10px" placeholder="dd/mm/yyyy"/>';
                    //}
                },
                {
                    "mDataProp": "NGAYHETHAN",
                    //mRender: function (nRow, aData) {
                    //    return '<input type="text" id="txtNgayHetHan' + aData.ID + '" class="form-control input-datepicker" style="padding-left: 10px" placeholder="dd/mm/yyyy"/>';
                    //}
                },
                {
                    "mDataProp": "DIEM_COSODAOTAOCNDIEM_TEN",
                    //mRender: function (nRow, aData) {
                    //    return '<div class="input-group no-icon"><select id="dropCoSoDaoTao' + aData.ID + '" class="select-opt"></select ></div>';
                    //}
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="lblFile' + aData.ID + '"></div>';
                    }
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "TINHTRANGDAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        data.forEach(aData => {
            edu.system.viewFiles("lblFile" + aData.ID, "CongNhan" + aData.DIEM_KEHOACHCONGNHANDIEM_ID + aData.QLSV_NGUOIHOC_ID, "SV_Files");
        })
        /*III. Callback*/
    },


    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_DMHocPhan: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropAAAA'),
            'strThuocBoMon_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DMHocPhan(dtReRult, data.Pager, strTN_KeHoach_Id);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DMHocPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhan",

            
            aaData: data,
            colPos: {
                center: [0,3],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                
                {
                    "mDataProp": "TEN"
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

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan: function (strDaoTao_HocPhan_Id, strTN_KeHoach_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_HocPhan/Them_TN_KeHoach_HocPhan',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_HocPhan/LayDSTN_KeHoach_HocPhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_HocPhan(dtResult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach_HocPhan/Xoa_TN_KeHoach_HocPhan',
            'type': 'POST',
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInputHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_HocPhan()",
                iDataRow: iPager
            },

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },

                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
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

    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data, strZoneXacNhan) {
        this.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $(strZoneXacNhan).html(row);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhan: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem/Them_Diem_CongNhan_XacNhan',
            'type': 'POST',
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('strNoiDung'),
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/FSkkLB4FKCQsHgUKHgIuLyYPKSAvHhkgIg8pIC8P',
            'func': 'pkg_congthongtin_cnd_thongtin.Them_Diem_DK_CongNhan_XacNhan',
            'iM': edu.system.iM,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropLoaiCongNhan'),
            'strNoiDung': edu.util.getValById('strNoiDung'),
            'strHanhDong_Id': strTinhTrang_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanSoTheoLop(me.strKeHoachXuLy_Id);
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_LoaiCongNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSLoaiCongNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genCombo_LoaiCongNhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LoaiCongNhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            //selectFirst: true,
            title: "Chọn loại công nhận"
        };
        edu.system.loadToCombo_data(obj);
        me.getList_TrangThai();
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    getList_TrangThai: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSHanhDongTheoXacNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropLoaiXacNhan'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.loadBtnXacNhan(dtResult, "#zoneBtnXacNhan")
                    //me.genCombo_TrangThai(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_TrangThai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    getList_BtnXacNhan: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        return;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_LoaiChungChi: function (strId, aData) {
        var me = this;
        var obj_list = {
            'action': 'SV_CongNhanDiem/LayDSLoaiCC_BangDiem',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_LoaiChungChi(dtResult, strId, aData);
                    //me.getList_PhanLoai(strId, aData);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LoaiChungChi: function (data, strId, aData) {
        var me = this;
        console.log(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //selectOne: true,
                //default_val: aData.LOAICC_BANGDIEM_ID,
            },
            renderPlace: ["dropLoaiChungChi"],
            title: "Chọn loại chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropLoaiChungChi" + strId).select2();
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
        //}
    },
    
    getList_PhanLoai: function (strId, aData) {
        var me = this;
        var obj_list = {
            'action': 'SV_CongNhanDiem/LayDSLoaiCC_BDTheoPhanLoai',
            'type': 'GET',
            'strLoaiCC_BD_Id': edu.util.getValById('dropLoaiChungChi' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    //me.dtLoaiCongNhan = dtResult;
                    me.genComBo_LoaiCongNhan(dtResult, strId, aData);
                    me.getList_CoSo(strId, aData);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_LoaiCongNhan: function (data, strId, aData) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
                default_val: aData.LOAICONGNHAN_ID,
            },
            renderPlace: ["dropLoaiCongNhan" + strId],
            type: "",
            title: "Chọn loại",
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropLoaiCongNhan" + strId).select2();
    },
    
    getList_CoSo: function (strId, aData) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_CongNhanDiem/LayDSCoSoDaoTaoTheoLoai',
            'type': 'GET',
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };



        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genComBo_CoSoTable(dtResult, strId, aData);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_CoSoTable: function (data, strId, aData) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
                default_val: aData.DIEM_COSODAOTAOCONGNHANDIEM_ID
            },
            renderPlace: ["dropCoSoDaoTao" + strId],
            type: "",
            title: "Chọn cơ sở",
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropCoSoDaoTao" + strId).select2();
    },

    getDetail_CongNhanDiem: function (aData) {
        var me = this;
        //var aData = me.dtHocPhan.find(e => e.ID == me.strHocPhan_Id);
        var obj_list = {
            'action': 'SV_CongNhanDiem/LayTTDiem_NguoiHoc_HocPhan_Cap',
            'type': 'GET',
            'strDiem_KeHoachCongNhan_Id': aData.DIEM_KEHOACHCONGNHANDIEM_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    //me.dtCongNhanDiem = dtResult;
                    me.viewForm_CongNhanDiem(dtResult[0]);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    viewForm_CongNhanDiem: function (data) {
        var me = this;
        //call popup --Edit
        if (data) {

            //edu.util.viewValById("dropCoSoDaoTao", data.DIEM_COSODAOTAOCONGNHANDIEM_ID);
            //edu.util.viewValById("dropLoaiCongNhan", data.LOAICONGNHAN_ID);
            edu.util.viewValById("dropLoaiChungChi", data.LOAICC_BANGDIEM_ID);
            edu.util.viewValById("txtKetQuaCongNhan", data.DIEM);
            edu.util.viewValById("txtNgayCap", data.NGAYCAP);
            edu.util.viewValById("txtNgayHetHan", data.NGAYHETHAN);
            edu.util.viewValById("txtGhiChu", data.GHICHU);
            edu.util.viewValById("txtHeDaoTao", data.HEDAOTAO);
            edu.util.viewValById("txtSoTinChi", data.SOTINCHI);
            edu.util.viewValById("txtTenHocPhan", data.THONGTINHOCPHAN_CHUNGCHI);
            me["strCongNhanDiem_Id"] = data.ID;
            me.getList_PhanLoai("", data);
        }
    },

    save_CongNhanDiem: function () {
        var me = this;
        var obj_notify = {};
        var aData = me.dtQuanSo.find(e => e.ID == me.strKetQua_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strId': me.strCongNhanDiem_Id,
            'strDiem_KeHoachCongNhan_Id': aData.DIEM_KEHOACHCONGNHANDIEM_ID,
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan'),
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDiem_CoSoCongNhan_Id': edu.util.getValById('dropCoSoDaoTao'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem': edu.util.getValById('txtKetQuaCongNhan'),
            'strThongTinHocPhan_ChungChi': edu.util.getValById('txtTenHocPhan'),
            'strHeDaoTao': edu.util.getValById('txtHeDaoTao'),
            'dSoTinChi': edu.util.getValById('txtSoTinChi'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
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
                    me.getList_QuanSoTheoLop();
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
    delete_CongNhanDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strIds': Ids,
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
                    $("#lichsu_chitiet").modal("hide");
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_QuanSoTheoLop();
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

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessCheDoChinhSach", function () {
            //        me.getList_CheDoChinhSach();
            //    });
            //},
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_GopFile: function (arrUrl, arrFileName) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'CMS_Files/GopFile',

            'arrTuKhoa': arrUrl,
            'arrDuLieu': arrFileName,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data) {
                        window.open(edu.system.rootPathUpload + "/" + data.Data);
                    }
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_BangDiem: function () {
        var me = this;
        //--Edit
        //

        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_Diem',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_BangDiem'),
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
         
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtBangDiem"] = dtReRult;
                    me.genTable_BangDiem(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_BangDiem: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBangDiem",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_BangDiem()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MACONGNHAN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    //"mDataProp": "HOSO_DANOP",
                    "mRender": function (nRow, aData) {
                        return aData.HOSO_DANOP ? "Đã nộp": "";
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

    getList_BangDiem_ChiTiet: function () {
        var me = this;
        var aData = me.dtBangDiem.find(e => e.ID == me.strSinhVien_Id);
        //--Edit

        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSChiTetCongNhanTheoDiem',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BangDiem_ChiTiet(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_BangDiem_ChiTiet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanCongNhan_BangDiem",
            
            aaData: data.rs,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "DIEM_COSODAOTAO_TEN"
                },
                {
                    "mDataProp": "THONGTINHOCPHAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var jsonForm = {
            strTable_Id: "tblMinhChung_BangDiem",

            aaData: data.rsFiles,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TENCOSODAOTAO"
                },
                {
                    //"mDataProp": "TENHIENTHI",
                    "mRender": function (nRow, aData) {
                        return '<a href="' + edu.system.rootPathUpload + "/" + aData.DUONGDAN + '" target="_blank">' + edu.util.returnEmpty(aData.TENHIENTHI) + '</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_ChungChi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_CC',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_ChungChi'),
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChungChi"] = dtReRult;
                    me.genTable_ChungChi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChungChi: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChungChi",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_ChungChi()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MACONGNHAN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "PHANLOAICC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    //"mDataProp": "HOSO_DANOP",
                    "mRender": function (nRow, aData) {
                        return aData.HOSO_DANOP ? "Đã nộp" : "";
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

    getList_ChungChi_ChiTiet: function () {
        var me = this;
        var aData = me.dtChungChi.find(e => e.ID == me.strSinhVien_Id);
        //--Edit
        var obj_list = {
            'action': 'SV_CND_ThongTin/LayDSChiTetCongNhanTheoCC',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strDiem_ThongTin_CC_CapDo_Id': aData.DIEM_THONGTIN_CC_CAPDO_ID,
            'strPhanLoaiCC_Id': aData.PHANLOAICC_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ChungChi_ChiTiet(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChungChi_ChiTiet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanCongNhan_ChungChi",

            aaData: data.rs,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "DIEM_THONGTIN_CC_CAPDO_TEN"
                },
                {
                    "mDataProp": "DIEM_COSODAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYCAP"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var jsonForm = {
            strTable_Id: "tblMinhChung_ChungChi",

            aaData: data.rsFiles,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAICC_TEN"
                },
                {
                    "mDataProp": "DIEM_THONGTIN_CHUNGCHI_TEN"
                },
                {
                    "mDataProp": "CAPDO_TEN"
                },
                {
                    //"mDataProp": "TENHIENTHI",
                    "mRender": function (nRow, aData) {
                        return '<a href="' + edu.system.rootPathUpload + "/" + aData.DUONGDAN + '" target="_blank">' + edu.util.returnEmpty(aData.TENHIENTHI) + '</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    save_XacNhan2: function (strSinhVien_Id) {
        var me = this;
        var aData = me.strLoaiXacNhan == "BangDiem" ? me.dtBangDiem.find(e => e.ID == strSinhVien_Id) : me.dtChungChi.find(e => e.ID == strSinhVien_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin/XacNhanNopHoSo',
            'type': 'POST',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strDiem_ThongTin_CC_CapDo_Id': aData.DIEM_THONGTIN_CC_CAPDO_ID,
            'strPhanLoaiCC_Id': aData.PHANLOAICC_ID,
            'strMaCongNhan': aData.MACONGNHAN,
            'dHoSo_DaNop': edu.util.getValById('dropXacNhan2'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.strLoaiXacNhan == "BangDiem" ? me.getList_BangDiem() : me.getList_ChungChi();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    save_QuyetDinh: function (strSinhVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKQPP',
            'func': 'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh',
            'iM': edu.system.iM,
            'strHinhThucQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Loai'),
            'strSoQuyetDinh': edu.util.getValById('txtQuyetDinh_So'),
            'strNgayQuyetDinh': edu.util.getValById('txtQuyetDinh_Ngay'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Cap'),
            'strNgayHieuLuc': edu.util.getValById('txtQuyetDinh_NgayHieuLuc'),
            'strNguyenNhan_LyDo': edu.util.getValById('txQuyetDinh_MoTa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_QD'),
            'strNguonDuLieu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
                $("#myModalAddQuyetDinh").modal("hide")
                me.getList_QuyetDinh();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.strLoaiXacNhan == "BangDiem" ? me.getList_BangDiem() : me.getList_ChungChi();
                //});
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_QuyetDinh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/DSA4BRIQDRIXHhA0OCQ1BSgvKQPP',
            'func': 'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguonDuLieu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_QuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_QuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "SOQUYETDINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_QuyetDinh"],
            type: "",
            title: "Chọn quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_LoaiQuyetDinh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/DSA4BRINLiAoEDQ4JDUFKC8p',
            'func': 'pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh',
            'iM': edu.system.iM,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiQuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiQuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyetDinh_Loai", "dropSearch_QuyetDinh_QD"],
            type: "",
            title: "Chọn loại quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },

    save_QDNguoiHoc: function (strSinhVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/FSkkLB4QBR4FKCQsHg8JHgUoJCweAg8P',
            'func': 'pkg_congthongtin_cnd_thongtin.Them_QD_Diem_NH_Diem_CN',
            'iM': edu.system.iM,
            'strId': strSinhVien_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QDNguoiHoc();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QDNguoiHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeEAUP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSKH_NguoiHoc_HP_Cap_QD',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQDNguoiHoc"] = dtReRult;
                    me.genTable_QDNguoiHoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_QDNguoiHoc: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQDNguoiHoc",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + "(" + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },

                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_HP_TEN" 
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_HP_CHA_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "SOTINCHITINHPHI"
                },
                {
                    "mDataProp": "DIEM"
                },

                {
                    "mDataProp": "DIEMDACHUYEN"
                },
                {
                    "mDataProp": "PHIPHAINOP"
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
    
    getList_SVChuaQD: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKCR4PJjQuKAkuIh4JER4CIDEeAik0IBAF',
            'func': 'pkg_congthongtin_congnhandiem.LayDSKH_NguoiHoc_HP_Cap_ChuaQD',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSVChuaQD"] = dtReRult;
                    me.genTable_SVChuaQD(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SVChuaQD: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSVChuaQD",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [

                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
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
    
    save_TaoDSDiem: function (strSinhVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_PhanQuyen_MH/ESkgLxA0OCQvHhUgLgUSFSkkLhA0OCQ1BSgvKTdz',
            'func': 'pkg_diem_phanquyen.PhanQuyen_TaoDSTheoQuyetDinhv2',
            'iM': edu.system.iM,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_QDNguoiHoc();
                //});
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuyenDiem: function (strSinhVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_PhanQuyen_MH/Aik0OCQvBSgkLAIuLyYPKSAvHhUpJC4QBQPP',
            'func': 'pkg_diem_phanquyen.ChuyenDiemCongNhan_TheoQD',
            'iM': edu.system.iM,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_QDNguoiHoc();
                //});
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_TinhPhi: function (strSinhVien_Id) {
        var me = this;
        var aData = me.dtQDNguoiHoc.find(e => e.ID == strSinhVien_Id);

        //--Edit
        var obj_save = {
            'action': 'TC_TinhPhi_MH/FSgvKREpKA8mNC4oCS4i',
            'func': 'pkg_taichinh_tinhphi.TinhPhiNguoiHoc',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strNghiepVuApDung_Id': aData.NGHIEPVUAPDUNG_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strKieuHoc_Id': aData.KIEUHOC_ID,
            'strTaiChinh_CacKhoanThu_Id': aData.TAICHINH_CACKHOANTHU_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strNguonDuLieu_Id': aData.ID,
            'strPhantrammiengiamduyet': edu.util.getValById('txtAAAA'),
            'strQLSV_DoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_TrucTiep_LichSu_Id': edu.util.getValById('dropAAAA'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_QDNguoiHoc();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TinhPhi: function (strSinhVien_Id) {
        var me = this;
        var aData = me.dtQDNguoiHoc.find(e => e.ID == strSinhVien_Id);

        //--Edit
        var obj_save = {
            'action': 'TC_TinhPhi_MH/GS4gCiQ1EDQgBSAVKC8pESko',
            'func': 'pkg_taichinh_tinhphi.XoaKetQuaDaTinhPhi',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strNghiepVuApDung_Id': aData.NGHIEPVUAPDUNG_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strKieuHoc_Id': aData.KIEUHOC_ID,
            'strTaiChinh_CacKhoanThu_Id': aData.TAICHINH_CACKHOANTHU_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strNguonDuLieu_Id': aData.ID,
            'strPhantrammiengiamduyet': edu.util.getValById('txtAAAA'),
            'strQLSV_DoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_TrucTiep_LichSu_Id': edu.util.getValById('dropAAAA'),

            
            'strHeDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.system.getValById('dropAAAA'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_QDNguoiHoc();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/DSA4BRIFKCQsHgokCS4gIikeDykgLxI0',
            'func': 'pkg_congthongtin_cnd_thongtin.LayDSDiem_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strDiem_KeHoach_NhanSu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhanCong"] = dtReRult;
                    me.genTable_PhanCong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_PhanCong: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/FSkkLB4FKCQsHgokCS4gIikeDykgLxI0',
            'func': 'pkg_congthongtin_cnd_thongtin.Them_Diem_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strDiem_KeHoach_NhanSu_Id': me.strKeHoachXuLy_Id,
            'strNguoiDung_Id': strId,
            'strNgayBatDau': edu.util.getValById('txtTuNgayPhanCong'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgayPhanCong'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_PhanCong: function (strGiangVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/GS4gHgUoJCweCiQJLiAiKR4PKSAvEjQP',
            'func': 'pkg_congthongtin_cnd_thongtin.Xoa_Diem_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strId': strGiangVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_PhanCong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_PhanCong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU"
                },
                {
                    "mDataProp": "DONVI"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}