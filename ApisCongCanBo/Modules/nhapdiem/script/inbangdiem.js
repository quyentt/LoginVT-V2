/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function InBangDiem() { };
InBangDiem.prototype = {
    dtQuyetDinh: [],
    strQuyetDinh_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    strPhamViMa: '',
    strSinhVien_Id: '',
    strDaoTao_LopQuanLy_Id: [],

    init: function () {
        var me = this;
        main_doc.ChuongTrinh.strHead = $("#tblHocPhan thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHAMVITONGHOPDIEM", "", "", function (data) {
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
        });

        me.getList_KhoaQuanLy();
        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_LoaiXet();
        me.getList_KeHoach();
        me.getList_ThoiGianDaoTao();
        me.getList_NamNhapHoc();
        //me.getList_HinhThuc();
        //me.getList_LoaiQuyetDinh();

        $("#btnSearch").click(function (e) {
            me.getList_SinhVien();
        });
        $("#txtSearch_QD").keypress(function (e) {
            if (e.which === 13) {
                me.getList_SinhVien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_QuyetDinh").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_QuyetDinh();
            }
        });
        $("[id$=chkSelectAll_QuyetDinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#tblSinhVien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblQuyetDinh");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID")[0];
                me.viewEdit_QuyetDinh(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblSinhVien").delegate('.btnViewBangDiem', 'click', function (e) {
            var strId = this.id;
            $("#myModal_Diem").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $("#lblSinhVienDiem").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_KetQuaHocTap(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnViewBangDiemTheoKhoi', 'click', function (e) {
            var strId = this.id;
            $("#myModal_TichLuyTheoKhoi").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $("#lblSinhVienDiem2").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_TichLuyTheoKhoi(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });

        $("#tblSinhVien").delegate('.btnDetail_XemThongTinAll', 'click', function (e) {
            var strId = this.id;
            $("#myModalXemThongTinAll").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $("#lblSinhVienDiem5").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me["strHSSV_Id"] = data.QLSV_NGUOIHOC_ID;

            me.getList_KhoanPhaiNop();
            me.getList_KhoanDaNop();
            me.getList_KhoanDuocMien();
            me.getList_KhoanDaRut();
            me.getList_NoChungCacKhoan();
            me.getList_NoRiengTungKhoan();
            me.getList_DuChungCacKhoan();
            me.getList_DuRiengCacKhoan();

        });

        $("#tblSinhVien").delegate('.btnViewKetQuaDangKy', 'click', function (e) {
            var strId = this.id;
            $("#myModal_KetQuaDangKy").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            $("#lblSinhVienDiem3").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_ThoiGianDangKy(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnViewKetQuaDangKyCaLop', 'click', function (e) {
            var strId = this.id;
            $("#modal_ketquadkcalop").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            //me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            $("#lblLopKetQua").html('Lớp ' + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_KHOADAOTAO_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_CHUONGTRINH_TEN))
            me.getList_KetQuaHocKy(data);
            $("#lblHocKyKetQua").html("");

        });
        $("#tblSinhVien").delegate('.btnViewTongNoPhi', 'click', function (e) {
            var strId = this.id;
            $("#myModal_No").modal("show");
            me.getList_NoPhi(strId);

        });
        $("#tblSinhVien").delegate('.btnViewChuongTrinh', 'click', function (e) {
            var strId = this.id;
            $("#modal_cthoc").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            main_doc.ChuongTrinh.strSinhVien_Id = me.strSinhVien_Id;
            main_doc.ChuongTrinh.init();
            $(".lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO))
            //me.getList_KetQuaHocKy(data);
            //$("#lblHocKyKetQua").html("");

        });

        $("#tblSinhVien").delegate('.btnDetail_LichHoc', 'click', function (e) {
            var strId = this.id;
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            me.strSinhVien_Id = data.QLSV_NGUOIHOC_ID;
            me["strSinhVien"] = data.QLSV_NGUOIHOC_MASO + " - " + data.QLSV_NGUOIHOC_HODEM + " " + data.QLSV_NGUOIHOC_TEN;
            console.log(11111);
            $("#lblSinhVienDiem6").html(me["strSinhVien"]);
            //edu.system.beginLoadings();
            $("#myModalLichHoc").modal("show");
            edu.system.loadPage($("#zoneLichHoc"), "/modules/nhapdiem/html/lichhoc.html", null, function () {
                //edu.system.endLoadings();
            }, "ApisCongCanBo");
        });
        $("#tblDiemSinhVien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            $("#myModal").modal("show");
            me.getList_DiemThanhPhan(strId);

        });

        $("#tblSinhVien").delegate('.btnHocPhanNo', 'click', function (e) {
            var strId = this.id;
            $("#myModalHPNo").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $(".lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_HocPhanChuaQua(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnXuLyHocVu', 'click', function (e) {
            var strId = this.id;
            $("#myModalXuLyHocVu").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $(".lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_CanhBao(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });
        $("#tblSinhVien").delegate('.btnViewDiemRenLuyen', 'click', function (e) {
            var strId = this.id;
            $("#myModalDiemRenLuyen").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $(".lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN));
            me.getList_DiemRenLuyen(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        });
        $("#tblSinhVien").delegate('.btnQuyetDinh', 'click', function (e) {
            var strId = this.id;
            $("#myModalQuyetDinh").modal("show");
            var data = me.dtQuyetDinh.find(e => e.ID == strId);
            $(".lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            me.getList_QuaTrinhQuyetDinh(data.QLSV_NGUOIHOC_ID, data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        });

        $('#dropSearch_KhoaQuanLy_QD').on('select2:select', function (e) {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_SinhVien();
        });
        $('#dropSearch_HeDaoTao_QD').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
            me.getList_SinhVien();
        });
        $('#dropSearch_KhoaDaoTao_QD').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_SinhVien();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QD').on('select2:select', function (e) {

            me.getList_LopQuanLy();
            me.getList_SinhVien();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QD').on('select2:select', function (e) {

            me.getList_SinhVien();
            var x = $(this).val();
            me.resetCombobox(this);
        });

        $('#dropSearch_LoaiXet').on('select2:select', function (e) {
            me.getList_KeHoach();
        });

        $('#dropSearch_ThoiGianDangKy').on('select2:select', function (e) {
            me.getList_KetQuaDangKy(me.strSinhVien_Id);
        });
        $("#main-content-wrapper").delegate(".ckbDSTrangThaiSV_QD_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QD").each(function () {
                this.checked = checked_status;
            });
        });

        $("#dropPhanViTongHop").on("change", function () {
            var strMa = $("#dropPhanViTongHop option:selected").attr("id");
            me.strPhamViMa = strMa;
            edu.util.toggle_overide("zonePhamVi", "zone_" + strMa);
        });
        edu.system.getList_MauImport("zonebtnSVQD", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_QD'),
                'strNamNhapHoc': edu.util.getValById('txtAAAA'),
                'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
                'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
                'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
                'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
                'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
                'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            };
            addKeyValue("strPhamViTongHopDiem_Id", edu.util.getValById('dropPhanViTongHop'));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo('dropPhanViTongHop_' + main_doc.InBangDiem.strPhamViMa));
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            arrChecked_Id.forEach(e => {
                addKeyValue('strQlsv_NguoiHoc_Id', e);
            })
            //console.log(obj_list);
            //return false;
        });


        $("#tblHocKy_KetQua").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            //me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblHocKy_KetQua");
            if (edu.util.checkValue(strId)) {
                me.strDaoTao_ThoiGianDaoTao_Id = strId;
                //var data = edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID")[0];
                //me.viewEdit_QuyetDinh(data);
                me.getList_HocPhanDangKy();
                $("#lblHocKyKetQua").html($("#tblHocKy_KetQua tbody tr[id=" + strId + "] td:eq(1)").html());
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        const colors = ["#ffffff", "#faebd7"]; // Mảng màu
        let colorIndex = 0; // Chỉ số màu trong mảng

        $("#tblTongHopDiemHP tbody tr").each(function () {
            const td = $(this).find("td[rowspan]");
            if (td.length > 0) {
                const rowspan = parseInt(td.attr("rowspan")) || 1; // Lấy số rowspan
                const bgColor = colors[colorIndex % colors.length]; // Chọn màu

                // Đặt màu cho chính thẻ <tr>
                $(this).css("background-color", bgColor);

                // Đặt màu cho các hàng tiếp theo
                let nextRow = $(this).next();
                for (let i = 1; i < rowspan; i++) {
                    nextRow.css("background-color", bgColor);
                    nextRow = nextRow.next(); // Chuyển sang hàng tiếp theo
                }

                colorIndex++; // Chuyển sang màu tiếp theo trong mảng
            }
        });

        $("#tblLop_KetQua").delegate('.btnDSBuoiHoc', 'click', function (e) {
            var strId = this.id.split('_');
            $("#myModalBuoiHoc").modal("show");
            me.getList_BuoiHoc(strId[1], strId[2]); 
        });


        $("#btnTongHopDuLieu").click(function (e) {
            me.getList_TongHopDuLieu();
        });
        $("#btnSearchSinhVienNoMon").click(function (e) {
            me.getList_SinhVienNoMon();
        });

        // Filter client-side: chỉ SV có Tài chính (TONGNOPHI) > 0
        $("#chkFilterCongNo").on("change", function () {
            me.applyFilter_CongNo();
        });

        // Nút Xuất Excel + Ctrl+G shortcut theo dữ liệu hiển thị (đã filter)
        $("#btnXuatExcel_DSSV").click(function () {
            me.exportExcel_DSSinhVien();
        });
        $(document).off('keydown.inbangdiem_export').on('keydown.inbangdiem_export', function (e) {
            if (!$("#tblSinhVien").length) return;
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me.exportExcel_DSSinhVien();
            }
        });

        // ===== Gửi Email (theo pattern sinhviennotien) =====
        $("#btnGuiEmail_IBD").click(function (e) {
            e.stopImmediatePropagation();
            me.openModal_ChonPhamVi_Email();
        });
        $("#btnPhamVi_DaChon_IBD").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_IBD").modal('hide');
            me.openModal_GuiEmail_IBD('daChon');
        });
        $("#btnPhamVi_TatCa_IBD").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_IBD").modal('hide');
            me.openModal_GuiEmail_IBD('tatCa');
        });
        $("#btnConfirmGuiEmail_IBD").click(function (e) {
            e.stopImmediatePropagation();
            me.send_Email_KetQuaHocTap();
        });
        $(document).delegate("#dropPageSize_GuiEmail_IBD", "change", function (e) {
            e.stopImmediatePropagation();
            me.iPageSizePreview_IBD = parseInt(this.value, 10) || 100;
            me.iCurrentPagePreview_IBD = 1;
            me.renderPreviewPage_IBD();
        });
        $(document).delegate(".btnPrevPagePreview_IBD", "click", function (e) {
            e.stopImmediatePropagation();
            if ($(this).prop('disabled')) return;
            var iPage = parseInt($(this).attr('data-page'), 10);
            if (!isNaN(iPage)) {
                me.iCurrentPagePreview_IBD = iPage;
                me.renderPreviewPage_IBD();
            }
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strQuyetDinh_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        var arrId = ["txtQuyetDinh_Ten", "dropQuyetDinh_Loai", "txtQuyetDinh_So",
            "txtQuyetDinh_Ngay", "txtQuyetDinh_NgayHieuLuc", "txtQuyetDinh_NgayKetThuc",
            "dropThoiGianDaoTao_QD", "txQuyetDinh_MoTa", "dropQuyetDinh_Cap",
            "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy", "dropHinhThuc"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtQuyetDinh_File", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
    },
    toggle_form: function () {
        //edu.util.toggle_overide("zone-bus", "zonebatdau");
        //this.getList_SinhVien();
    },
    toggle_edit: function () {
        //edu.util.toggle_overide("zone-bus", "zoneEdit");
        $("#toanbo").modal("show");
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },

    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
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
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
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
            'action': 'KHCT_Quyen_ThongTin/LayDSKS_DaoTao_ToChucCTQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strDaoTao_N_CN_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
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
            'action': 'KHCT_Quyen_ThongTin/LayDSKS_DaoTao_LopQuanLyQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strDaoTao_Nganh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LoaiLop_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strNhomlop_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
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
    getList_NamNhapHoc: function () {
        var me = this;
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
        var obj_list = {
            'action': 'KHCT_Quyen_ThongTin/LayDSKhoaQuanLyPhanQuyen',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
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
            renderPlace: ["dropSearch_HeDaoTao_QD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_QD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_QD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_QD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QD").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.InBangDiem;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QD").val("").trigger("change");
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
            renderPlace: ["dropThoiGianDaoTao_QD", "dropPhanViTongHop_HOCKY", "dropPhanViTongHop_NHIEUKY", "dropPhanViTongHop_DOTHOC"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },

    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.InBangDiem.dtTrangThai = data;
        var row = '';
        row += '<div class="col-12 col-md-4 col-lg-2">';
        row += '<div class="form-check">';
        row += '<input class="form-check-input pointer ckbDSTrangThaiSV_QD_ALL" type="checkbox" value="" checked="checked" \>';
        row += '<label class="form-check-label pointer">';
        row += 'Tất cả';
        row += '</label>';
        row += '</div>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-12 col-md-4 col-lg-2">';
            row += '<div class="form-check">';
            row += '<input checked="checked" class="form-check-input ckbDSTrangThaiSV_QD pointer" type="checkbox" value="" id="' + data[i].ID + '" \>';
            row += '<label class="form-check-label pointer" for="' + data[i].ID + '">';
            row += data[i].TEN;
            row += '</label>';
            row += '</div>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_QD").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc_QD", "dropPhanViTongHop_NAMHOC"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        //var obj = {
        //    data: data,
        //    renderInfor: {
        //        id: "ID",
        //        parentId: "",
        //        name: "TEN",
        //        code: "",
        //        avatar: ""
        //    },
        //    renderPlace: ["dropSearch_KhoaQuanLy_QD"],
        //    type: "",
        //    title: "Tất cả khoa quản lý",
        //}
        //edu.system.loadToCombo_data(obj);
        ////$("#dropSearch_KhoaQuanLy_QD").select2();
        //if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
        var html = "";
        data.forEach(e => {
            html += '<option value="'+ e.ID +'" name="undefined"> '+ e.TEN +'</option>'
        })
        $("#dropSearch_KhoaQuanLy_QD").html(html);
        $("#dropSearch_KhoaQuanLy_QD").trigger({ type: 'select2:select' });
        if (data.length != 1) $("#dropSearch_KhoaQuanLy_QD").val(data[0].ID).trigger("change");
    },

    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        $("#tblSinhVienNoMon").parent().hide();
        $("#tblSinhVien").parent().show();
        var obj_save = {
            'action': 'D_BaoCao_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_diem_baocao.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    // Lưu raw để filter client-side (nợ tài chính) không mất data gốc
                    me.dtQuyetDinh_Raw = dtReRult;
                    me.iPagerRaw = data.Pager;
                    var filtered = me._filterByCongNo(dtReRult);
                    me.dtQuyetDinh = filtered;
                    me.genTable_QuyetDinh(filtered, data.Pager);
                    if ($("#chkFilterCongNo").is(":checked")) {
                        $("#lblSinhVien_Tong").html(filtered.length + ' / ' + dtReRult.length + ' (trang này)');
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Filter client-side: chỉ giữ SV có TONGNOPHI > 0 khi checkbox bật
    -------------------------------------------*/
    _filterByCongNo: function (data) {
        if (!$("#chkFilterCongNo").is(":checked")) return data || [];
        return (data || []).filter(function (e) {
            var no = Number(e.TONGNOPHI) || 0;
            return no > 0;
        });
    },

    applyFilter_CongNo: function () {
        var me = this;
        var raw = me.dtQuyetDinh_Raw || [];
        var filtered = me._filterByCongNo(raw);
        me.dtQuyetDinh = filtered;
        me.genTable_QuyetDinh(filtered, me.iPagerRaw);
        // Ghi đè badge để phản ánh số dòng đang hiển thị sau filter (trên trang hiện tại)
        if ($("#chkFilterCongNo").is(":checked")) {
            $("#lblSinhVien_Tong").html(filtered.length + ' / ' + (raw.length || 0) + ' (trang này)');
        } else {
            $("#lblSinhVien_Tong").html(me.iPagerRaw);
        }
    },

    /*------------------------------------------
    --Discription: Xuất Excel theo dữ liệu DSSV đang hiển thị (đã apply filter tài chính)
    --Nguồn: me.dtQuyetDinh
    --Lib: XLSX (SheetJS) - load lazy từ CDN trong inbangdiem.html
    -------------------------------------------*/
    exportExcel_DSSinhVien: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert('Thư viện Excel chưa load xong. Vui lòng thử lại sau vài giây.', 'w');
            return;
        }
        var data = me.dtQuyetDinh || [];
        if (!data.length) {
            edu.system.alert('Không có dữ liệu để xuất. Vui lòng tìm kiếm trước.', 'w');
            return;
        }
        if (data.length > 5000) {
            if (!confirm('Bạn sắp xuất ' + data.length.toLocaleString('vi-VN') + ' dòng dữ liệu. Quá trình có thể mất vài giây và sử dụng nhiều RAM. Tiếp tục?')) {
                return;
            }
        }
        var v = edu.util.returnEmpty;
        var rows = data.map(function (e, i) {
            return {
                'STT': i + 1,
                'Mã số': v(e.QLSV_NGUOIHOC_MASO),
                'Họ đệm': v(e.QLSV_NGUOIHOC_HODEM),
                'Tên': v(e.QLSV_NGUOIHOC_TEN),
                'Ngày sinh': v(e.QLSV_NGUOIHOC_NGAYSINH),
                'Trạng thái': v(e.QLSV_TRANGTHAINGUOIHOC_TEN),
                'Tài chính (nợ)': Number(e.TONGNOPHI) || 0,
                'Lớp': v(e.DAOTAO_LOPQUANLY_TEN),
                'Chương trình': v(e.DAOTAO_CHUONGTRINH_TEN),
                'Khóa': v(e.DAOTAO_KHOADAOTAO_TEN),
                'Hệ': v(e.DAOTAO_HEDAOTAO_TEN),
                'ĐTBTL Hệ 4': v(e.DTBTICHLUYHE4TOANKHOA),
                'ĐTBTL Hệ 10': v(e.DTBTICHLUYHE10TOANKHOA),
                'Số TCTL': v(e.SOTCTICHLUYTOANKHOA)
            };
        });

        var ws = XLSX.utils.json_to_sheet(rows);
        var headers = Object.keys(rows[0]);
        ws['!cols'] = headers.map(function (h) {
            var maxLen = h.length;
            rows.forEach(function (r) {
                var l = String(r[h] == null ? '' : r[h]).length;
                if (l > maxLen) maxLen = l;
            });
            return { wch: Math.min(maxLen + 2, 40) };
        });

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sinh viên');

        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                    + '_' + pad(now.getHours()) + pad(now.getMinutes());
        var tag = $("#chkFilterCongNo").is(":checked") ? '_ConNoTaiChinh' : '';
        var fileName = 'DSSV_InBangDiem' + tag + '_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fileName);
    },

    /*------------------------------------------
    --Discription: Gửi Email KQHT / công nợ (theo pattern sinhviennotien.js)
    --Data: me.dtQuyetDinh (đã load + apply filter tài chính)
    --Email field: cố gắng đọc từ nhiều tên trường vì record InBangDiem có thể khác API khác
    -------------------------------------------*/
    getEmail_NguoiHoc: function (aData) {
        if (!aData) return '';
        return aData.EMAIL || aData.Email || aData.EMAIL_CANHAN
            || aData.TTLL_EMAILCANHAN || aData.QLSV_NGUOIHOC_EMAIL
            || aData.QLSV_NGUOIHOC_EMAILCANHAN || aData.EMAILCANHAN
            || aData.EMAIL_TRUONGCAP || aData.EMAIL_TRUONG || '';
    },
    validateEmail: function (email) {
        if (!email) return false;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    openModal_ChonPhamVi_Email: function () {
        var me = this;
        var arrCheckedId = edu.util.getArrCheckedIds("tblSinhVien", "checkX") || [];
        var iSoLuongDaChon = arrCheckedId.length;
        var iSoLuongTatCa = (me.dtQuyetDinh || []).length;
        $("#lblSoLuongDaChon_IBD").text(iSoLuongDaChon);
        $("#lblSoLuongTatCa_IBD").text(iSoLuongTatCa);
        if (iSoLuongTatCa === 0) {
            edu.system.alert('Chưa có dữ liệu SV. Vui lòng tìm kiếm trước!', 'w');
            return;
        }
        if (iSoLuongDaChon === 0) {
            $("#btnPhamVi_DaChon_IBD").addClass('disabled').css('opacity', '0.5').css('pointer-events', 'none');
        } else {
            $("#btnPhamVi_DaChon_IBD").removeClass('disabled').css('opacity', '').css('pointer-events', '');
        }
        $("#myModalChonPhamVi_IBD").modal('show');
    },
    openModal_GuiEmail_IBD: function (strMode) {
        var me = this;
        var arrSelected = [];
        if (strMode === 'tatCa') {
            arrSelected = (me.dtQuyetDinh || []).slice();
        } else {
            var arrCheckedId = edu.util.getArrCheckedIds("tblSinhVien", "checkX") || [];
            var dt = me.dtQuyetDinh || [];
            for (var i = 0; i < arrCheckedId.length; i++) {
                var idStr = String(arrCheckedId[i]);
                var found = dt.find(function (e) { return String(e.ID) === idStr; });
                if (found) arrSelected.push(found);
            }
        }
        if (arrSelected.length === 0) {
            edu.system.alert('Không có sinh viên nào để gửi email!', 'w');
            return;
        }
        me.arrEmailQueue_IBD = arrSelected;
        me.genPreview_GuiEmail_IBD(arrSelected);
        $("#zonePercent_GuiEmail_IBD").html('');
        $("#myModalGuiEmail_IBD").modal('show');
    },
    genPreview_GuiEmail_IBD: function (arrData) {
        var me = this;
        me.arrPreviewData_IBD = arrData || [];
        var iSoLuongGui = 0;
        for (var i = 0; i < me.arrPreviewData_IBD.length; i++) {
            if (me.validateEmail(me.getEmail_NguoiHoc(me.arrPreviewData_IBD[i]))) iSoLuongGui++;
        }
        $("#lblSoLuongGuiEmail_IBD").text(iSoLuongGui + '/' + me.arrPreviewData_IBD.length);
        me.iCurrentPagePreview_IBD = 1;
        me.iPageSizePreview_IBD = parseInt($("#dropPageSize_GuiEmail_IBD").val(), 10) || 100;
        me.renderPreviewPage_IBD();
    },
    renderPreviewPage_IBD: function () {
        var me = this;
        var arrData = me.arrPreviewData_IBD || [];
        var iPageSize = me.iPageSizePreview_IBD || 100;
        var iTotalPage = Math.max(1, Math.ceil(arrData.length / iPageSize));
        if (me.iCurrentPagePreview_IBD > iTotalPage) me.iCurrentPagePreview_IBD = iTotalPage;
        if (me.iCurrentPagePreview_IBD < 1) me.iCurrentPagePreview_IBD = 1;
        var iStart = (me.iCurrentPagePreview_IBD - 1) * iPageSize;
        var iEnd = Math.min(iStart + iPageSize, arrData.length);
        var arrBuf = [];
        var v = edu.util.returnEmpty;
        for (var i = iStart; i < iEnd; i++) {
            var d = arrData[i];
            var email = me.getEmail_NguoiHoc(d);
            var isValid = me.validateEmail(email);
            var strTrangThai = isValid
                ? '<span class="badge bg-success">Sẵn sàng</span>'
                : '<span class="badge bg-danger" title="Thiếu email hoặc email không hợp lệ">Thiếu email</span>';
            var strHoTen = (v(d.QLSV_NGUOIHOC_HODEM) + ' ' + v(d.QLSV_NGUOIHOC_TEN)).trim();
            var congNo = Number(d.TONGNOPHI) || 0;
            arrBuf.push('<tr>'
                + '<td class="text-center">' + (i + 1) + '</td>'
                + '<td>' + v(d.QLSV_NGUOIHOC_MASO) + '</td>'
                + '<td>' + strHoTen + '</td>'
                + '<td>' + v(d.DAOTAO_LOPQUANLY_TEN) + '</td>'
                + '<td>' + (email || '<i class="text-muted">(chưa có)</i>') + '</td>'
                + '<td class="text-center">' + v(d.DTBTICHLUYHE4TOANKHOA) + '</td>'
                + '<td class="text-center">' + v(d.SOTCTICHLUYTOANKHOA) + '</td>'
                + '<td class="text-right">' + (congNo > 0 ? '<b style="color:#c0392b">' + edu.util.formatCurrency(congNo) + '</b>' : '0') + '</td>'
                + '<td style="font-size:12px; line-height:1.4;">' + me.createEmailPreview_Text_IBD(d) + '</td>'
                + '<td class="text-center">' + strTrangThai + '</td>'
                + '</tr>');
        }
        $("#tblPreviewGuiEmail_IBD tbody").html(arrBuf.join(''));
        me.renderPreviewPagination_IBD(iTotalPage, arrData.length, iStart, iEnd);
    },
    renderPreviewPagination_IBD: function (iTotalPage, iTotalRow, iStart, iEnd) {
        var me = this;
        var iCur = me.iCurrentPagePreview_IBD;
        function btn(page, label, disabled, active) {
            var cls = 'btn btn-default btn-sm';
            if (active) cls += ' btn-primary';
            if (disabled) cls += ' disabled';
            return '<button class="' + cls + ' btnPrevPagePreview_IBD" data-page="' + page + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button>';
        }
        var html = '<div><i>' + (iTotalRow === 0 ? '0' : (iStart + 1) + ' đến ' + iEnd) + ' trong ' + iTotalRow.toLocaleString('vi-VN') + ' sinh viên</i></div>';
        html += '<div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap">';
        html += btn(1, '<i class="fa fa-angle-double-left"></i>', iCur === 1);
        html += btn(iCur - 1, '<i class="fa fa-angle-left"></i>', iCur === 1);
        var iRange = 2;
        var pages = [];
        for (var p = 1; p <= iTotalPage; p++) {
            if (p === 1 || p === iTotalPage || (p >= iCur - iRange && p <= iCur + iRange)) {
                pages.push(p);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        for (var k = 0; k < pages.length; k++) {
            if (pages[k] === '...') {
                html += '<span style="padding:0 4px">...</span>';
            } else {
                html += btn(pages[k], String(pages[k]), false, pages[k] === iCur);
            }
        }
        html += btn(iCur + 1, '<i class="fa fa-angle-right"></i>', iCur === iTotalPage);
        html += btn(iTotalPage, '<i class="fa fa-angle-double-right"></i>', iCur === iTotalPage);
        html += '</div>';
        $("#zonePagination_GuiEmail_IBD").html(html);
    },
    createEmailPreview_Text_IBD: function (aData) {
        var v = edu.util.returnEmpty;
        var strTen = (v(aData.QLSV_NGUOIHOC_HODEM) + ' ' + v(aData.QLSV_NGUOIHOC_TEN)).trim();
        var strMaSV = v(aData.QLSV_NGUOIHOC_MASO);
        var congNo = Number(aData.TONGNOPHI) || 0;
        var strCongNo = congNo > 0
            ? ' Bạn đang còn <b style="color:#c0392b">' + edu.util.formatCurrency(congNo) + ' đ</b> công nợ tài chính.'
            : '';
        return 'Kính gửi <b>' + strTen + '</b> (MSSV: ' + strMaSV + '). ĐTBTL H4: <b>' + v(aData.DTBTICHLUYHE4TOANKHOA) + '</b> | Số TCTL: <b>' + v(aData.SOTCTICHLUYTOANKHOA) + '</b>.' + strCongNo;
    },
    createEmailTemplate_BaoKetQua: function (aData) {
        var v = edu.util.returnEmpty;
        var strTen = (v(aData.QLSV_NGUOIHOC_HODEM) + ' ' + v(aData.QLSV_NGUOIHOC_TEN)).trim();
        var strMaSV = v(aData.QLSV_NGUOIHOC_MASO);
        var strLop = v(aData.DAOTAO_LOPQUANLY_TEN);
        var strCT = v(aData.DAOTAO_CHUONGTRINH_TEN);
        var strKhoa = v(aData.DAOTAO_KHOADAOTAO_TEN);
        var strHe = v(aData.DAOTAO_HEDAOTAO_TEN);
        var strTT = v(aData.QLSV_TRANGTHAINGUOIHOC_TEN);
        var strDTBH4 = v(aData.DTBTICHLUYHE4TOANKHOA);
        var strDTBH10 = v(aData.DTBTICHLUYHE10TOANKHOA);
        var strTCTL = v(aData.SOTCTICHLUYTOANKHOA);
        var congNo = Number(aData.TONGNOPHI) || 0;

        var html = '';
        html += '<html><head><style>';
        html += 'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }';
        html += '.email-container { max-width: 680px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }';
        html += '.email-header { background-color: #1a71e8; color: white; padding: 15px; text-align: center; }';
        html += '.email-body { padding: 20px; background-color: #f9f9f9; }';
        html += '.tbl-kq { width: 100%; border-collapse: collapse; margin-top: 10px; }';
        html += '.tbl-kq th, .tbl-kq td { border: 1px solid #ccc; padding: 8px; }';
        html += '.tbl-kq th { background: #eee; text-align: left; width: 40%; }';
        html += '.money { color: #c0392b; font-weight: bold; }';
        html += '.warn-box { background:#fdecea; border-left:4px solid #c0392b; padding:10px; margin-top:15px; }';
        html += '.email-footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }';
        html += '</style></head><body>';
        html += '<div class="email-container">';
        html += '<div class="email-header"><h2>THÔNG BÁO KẾT QUẢ HỌC TẬP</h2></div>';
        html += '<div class="email-body">';
        html += '<p>Kính gửi: <strong>' + strTen + '</strong></p>';
        html += '<p>Mã sinh viên: <strong>' + strMaSV + '</strong></p>';
        html += '<p>Nhà trường xin thông báo tình hình học tập và tài chính của bạn như sau:</p>';
        html += '<table class="tbl-kq">';
        html += '<tr><th>Lớp</th><td>' + strLop + '</td></tr>';
        html += '<tr><th>Chương trình</th><td>' + strCT + '</td></tr>';
        html += '<tr><th>Khóa - Hệ</th><td>' + strKhoa + ' - ' + strHe + '</td></tr>';
        html += '<tr><th>Trạng thái</th><td><b>' + strTT + '</b></td></tr>';
        html += '<tr><th>ĐTBTL Hệ 4 (toàn khóa)</th><td><b>' + strDTBH4 + '</b></td></tr>';
        html += '<tr><th>ĐTBTL Hệ 10 (toàn khóa)</th><td><b>' + strDTBH10 + '</b></td></tr>';
        html += '<tr><th>Số TC tích lũy</th><td><b>' + strTCTL + '</b></td></tr>';
        html += '<tr><th>Công nợ tài chính</th><td class="money">' + edu.util.formatCurrency(congNo) + ' đ</td></tr>';
        html += '</table>';
        if (congNo > 0) {
            html += '<div class="warn-box">';
            html += '<b>Lưu ý:</b> Bạn hiện đang còn nợ tài chính. Đề nghị hoàn tất nghĩa vụ nộp phí để đảm bảo quyền lợi học tập.';
            html += '</div>';
        }
        html += '<p style="margin-top:15px">Trân trọng.</p>';
        html += '</div>';
        html += '<div class="email-footer">';
        html += '<p>Email này được gửi tự động từ hệ thống quản lý đào tạo.</p>';
        html += '<p>Vui lòng không trả lời email này.</p>';
        html += '</div>';
        html += '</div>';
        html += '</body></html>';
        return html;
    },
    send_Email_KetQuaHocTap: function () {
        var me = this;
        var strTieuDe = ($("#txtTieuDeEmail_IBD").val() || '').replace(/\s*[\r\n]+\s*/g, ' ').trim();
        if (!edu.util.checkValue(strTieuDe)) {
            edu.system.alert('Vui lòng nhập tiêu đề email!', 'w');
            return;
        }
        var arrQueue = me.arrEmailQueue_IBD || [];
        var arrValid = [];
        for (var i = 0; i < arrQueue.length; i++) {
            var email = me.getEmail_NguoiHoc(arrQueue[i]);
            if (me.validateEmail(email)) {
                arrQueue[i].__EMAIL_GUI = email;
                arrValid.push(arrQueue[i]);
            }
        }
        if (arrValid.length === 0) {
            edu.system.alert('Không có sinh viên nào có email hợp lệ để gửi!', 'w');
            return;
        }
        me.iSendSuccess_IBD = 0;
        me.iSendFailed_IBD = 0;
        me.arrSendFailedLog_IBD = [];
        $("#btnConfirmGuiEmail_IBD").prop('disabled', true);
        $("#zonePercent_GuiEmail_IBD").html('<div id="zoneSendProgressWrap_IBD" style="text-align:left"><div id="lblSendProgress_IBD" style="margin-bottom:6px"><i class="fa fa-paper-plane"></i> Đang gửi email... (0/' + arrValid.length + ')</div><div id="zoneSendBar_IBD"></div></div>');
        if (edu.system.genHTML_Progress) {
            edu.system.genHTML_Progress("zoneSendBar_IBD", arrValid.length);
        }
        console.log('[GuiEmail_IBD] Bắt đầu gửi ' + arrValid.length + ' email tuần tự...');
        me.sendEmail_Sequential_IBD(arrValid, 0, strTieuDe);
    },
    sendEmail_Sequential_IBD: function (arrValid, index, strTieuDe) {
        var me = this;
        if (index >= arrValid.length) {
            $("#btnConfirmGuiEmail_IBD").prop('disabled', false);
            var strMsg = '<b>Kết quả gửi email:</b><br/>'
                + '<span style="color:green">✓ Thành công: ' + me.iSendSuccess_IBD + '</span><br/>'
                + '<span style="color:red">✗ Thất bại: ' + me.iSendFailed_IBD + '</span>';
            if (me.arrSendFailedLog_IBD.length > 0) {
                strMsg += '<br/><br/><b>Chi tiết lỗi (tối đa 5):</b><br/>';
                for (var k = 0; k < Math.min(5, me.arrSendFailedLog_IBD.length); k++) {
                    strMsg += '- ' + me.arrSendFailedLog_IBD[k] + '<br/>';
                }
            }
            console.log('[GuiEmail_IBD] Hoàn tất. Success=' + me.iSendSuccess_IBD + ' Failed=' + me.iSendFailed_IBD);
            edu.system.alert(strMsg);
            return;
        }
        var aData = arrValid[index];
        var strBody = me.createEmailTemplate_BaoKetQua(aData);
        var obj_list = {
            'action': 'CMS_NguoiDung/SendEmail',
            'type': 'POST',
            'mailTo': aData.__EMAIL_GUI,
            'mailSubject': strTieuDe,
            'strBody': strBody,
            'arrFileDinhKem': [],
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.iSendSuccess_IBD++;
                    console.log('[GuiEmail_IBD] ✓ ' + aData.__EMAIL_GUI);
                } else {
                    me.iSendFailed_IBD++;
                    var strErr = (data && data.Message) ? data.Message : 'Không xác định';
                    me.arrSendFailedLog_IBD.push(aData.__EMAIL_GUI + ' → ' + strErr);
                    console.log('[GuiEmail_IBD] ✗ ' + aData.__EMAIL_GUI + ' | ' + strErr, data);
                }
            },
            error: function (er) {
                me.iSendFailed_IBD++;
                me.arrSendFailedLog_IBD.push(aData.__EMAIL_GUI + ' → (network) ' + JSON.stringify(er));
                console.log('[GuiEmail_IBD] ✗ ' + aData.__EMAIL_GUI + ' | network error', er);
            },
            complete: function () {
                var iDone = me.iSendSuccess_IBD + me.iSendFailed_IBD;
                $("#lblSendProgress_IBD").html('<i class="fa fa-paper-plane"></i> Đang gửi email... (' + iDone + '/' + arrValid.length + ') · ✓ ' + me.iSendSuccess_IBD + ' · ✗ ' + me.iSendFailed_IBD);
                if (edu.system.start_Progress) edu.system.start_Progress("zoneSendBar_IBD");
                me.sendEmail_Sequential_IBD(arrValid, index + 1, strTieuDe);
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_QuyetDinh: function (data, iPager) {
        var me = this;
        $("#lblSinhVien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            bPaginate: {
                strFuntionName: "main_doc.InBangDiem.getList_SinhVien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 10, 11, 12, 13, 14, 15, 24],
                right: [6]
            },
            aoColumns: [
                {
                    //"mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDetail_LichHoc" id="' + aData.ID + '" title="xem">Lịch học</a> ';//<a class="btn btn-default btnDetail_XemThongTinAll" id="' + aData.ID + '" title="xem">Chi tiết</a>
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    //"mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDetail_XemThongTinAll" id="' + aData.ID + '" title="xem">' + edu.util.formatCurrency(aData.TONGNOPHI) + '</a> ';//<a class="btn btn-default btnDetail_XemThongTinAll" id="' + aData.ID + '" title="xem">Chi tiết</a>
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DTBTICHLUYHE4TOANKHOA"
                },
                {
                    "mDataProp": "DTBTICHLUYHE10TOANKHOA"
                },
                {
                    "mDataProp": "SOTCTICHLUYTOANKHOA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnHocPhanNo" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXuLyHocVu" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnQuyetDinh" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewBangDiem" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewBangDiemTheoKhoi" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewKetQuaDangKy" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewKetQuaDangKyCaLop" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChuongTrinh" id="' + aData.ID + '" title="xem">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewDiemRenLuyen" id="' + aData.ID + '" title="xem">Xem</a></span>';
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
    },
    viewEdit_QuyetDinh: function (data) {
        var me = this;
        $("#lblSinhVien").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN));
        me.strQuyetDinh_Id = data.QLSV_NGUOIHOC_ID;
        me.getList_DiemSinhVien();
    },

    getList_DiemSinhVien: function () {
        var me = this;
        var obj_save = {
            'action': 'D_BaoCao_MH/DSA4BRIFKCQsCiQ1FSk0IgIgDykgLwPP',
            'func': 'pkg_diem_baocao.LayDSDiemKetThucCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strQuyetDinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me["dtDiemSinhVien"] = dtResult;
                    me.genTable_DiemSinhVien(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemSinhVien: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemSinhVien",

            aaData: data,
            colPos: {
                center: [0, 5, 3, 4, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN",
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },


    getList_DiemThanhPhan: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var aData = me.dtDiemSinhVien.find(e => e.ID == strDaoTao_HocPhan_Id)
        var obj_save = {
            'action': 'D_BaoCao_MH/DSA4BRIFKCQsFSkgLykRKSAvAiAPKSAv',
            'func': 'pkg_diem_baocao.LayDSDiemThanhPhanCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strQuyetDinh_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'dLanHoc': aData.LANHOC,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_DiemThanhPhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemThanhPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThanhPhan",

            aaData: data,
            colPos: {
                center: [0, 2, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DIEM",
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_LoaiXet: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_KeHoach/LayDSPhanLoaiXetTheoND1',
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiXet(json);
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
    cbGenCombo_LoaiXet: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiXet"],
            type: "",
            title: "Chọn loại xét",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_LoaiXet'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoach(json);
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
    cbGenCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoachXet"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KetQuaHocTap: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/KetQuaHocTapCaNhan',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me["dtKetQua"] = dtResult;
                    var arrThanhPhan = [];
                    me.dtKetQua.rsDiemThanhPhan.forEach(element => {
                        if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
                    });
                    me.genHtml_BangDiem();

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
    genHtml_BangDiem: function () {
        var me = this;
        var data = me.dtKetQua.rsDiemKetThucHocPhan;

        var arrHocKy = [];
        data.forEach(element => {
            var strHocKy = element.NAMHOC + "_" + element.HOCKY;
            if (arrHocKy.indexOf(strHocKy) === -1) arrHocKy.push(strHocKy);
        });

        var htmlBangDiem = "";
        var check = true;
        arrHocKy.forEach(element => {
            var strNamHoc = element.substring(0, element.lastIndexOf('_'));
            var strHocKy = element.substring(element.lastIndexOf('_') + 1);
            var jsonDiem = data.filter(element => element.NAMHOC === strNamHoc && element.HOCKY == strHocKy);

            htmlBangDiem += '<div class="collapse-point-item">';
            htmlBangDiem += '<a class="position-relative d-flex align-items-center" href="#hocky_' + element + '" data-bs-toggle="collapse" >';
            htmlBangDiem += '<b class="me-2">Năm học ' + strNamHoc + ' - Học kỳ ' + strHocKy + '</b>';
            htmlBangDiem += '<i class="fas fa-chevron-circle-down ms-auto"></i>';
            htmlBangDiem += '</a>';
            htmlBangDiem += '<div id="hocky_' + element + '" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">';
            htmlBangDiem += '<div class="accordion-body">';
            htmlBangDiem += '<table class="table transcrip-table">';
            htmlBangDiem += '<thead>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<th class="text-center" scope="col">STT</th>';
            htmlBangDiem += '<th scope="col">Mã học phần</th>';
            htmlBangDiem += '<th scope="col">Tên học phần</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Số tín chỉ</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Lần học</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Lần thi</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm hệ 10</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm hệ 4</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm chữ</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Đánh giá</th>';
            htmlBangDiem += '<th scope="col">Chi tiết</th>';
            htmlBangDiem += '</tr>';
            htmlBangDiem += '</thead>';
            htmlBangDiem += '<tbody>';

            jsonDiem.forEach((e, nRow) => {
                htmlBangDiem += '<tr>';
                htmlBangDiem += '<th class="text-center" scope="row"><em class="show-in-mobi">STT</em><span>' + (nRow + 1) + '</span></th>';
                htmlBangDiem += '<td><em class="show-in-mobi">Mã học phần:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_MA) + '</span></td>';
                htmlBangDiem += '<td><em class="show-in-mobi">Tên học phần:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_TEN) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Số tín chỉ:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_HOCTRINH) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Lần học:</em><span>' + edu.util.returnEmpty(e.LANHOC) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Lần thi:</em><span>' + edu.util.returnEmpty(e.LANTHI) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm hệ 10:</em><span>' + edu.util.returnEmpty(e.DIEM) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm hệ 4:</em><span>' + edu.util.returnEmpty(e.DIEMQUYDOI) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm chữ:</em><span>' + edu.util.returnEmpty(e.DIEMQUYDOI_TEN) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Đánh giá:</em><span>' + edu.util.returnEmpty(e.DANHGIA_TEN) + '</span></td>';
                htmlBangDiem += '<td class="btnXemDiemThanhPhan" id="' + e.ID + '"></td>';
                htmlBangDiem += '</tr>';
            });

            htmlBangDiem += '</tbody>';
            htmlBangDiem += '<tfoot></tfoot>';
            htmlBangDiem += '</table>';
            htmlBangDiem += '<div class="row py-4">';
            htmlBangDiem += '<div class="synthetic-line"></div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Tổng tín chỉ</span>';
            var temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            var diem = temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            console.log("TONGSOTINCHI");
            console.log(temp);
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Tổng số tín chỉ tích lũy</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình hệ 10</span>';
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình hệ 4</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình tích lũy hệ 10</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình tích lũy hệ 4</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
        });
        $("#zone_bangdiem").html(htmlBangDiem);
        $(".banghocphan").each(function () {
            $(this).trigger("click");
        });
    },

    getList_HocPhanChuaQua: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSHocPhanChuHoanThanh',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genHtml_HocPhanChuaQua(dtResult);

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
    genHtml_HocPhanChuaQua: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanChuaQua",
            aaData: data,
            colPos: {
                center: [0, 3, 4, 5, 6, 7, 8, 9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
                , {
                    "mDataProp": "THOIGIAN"
                }
                , {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_TichLuyTheoKhoi: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayKetQuaTichLuyTheoKhoi',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_TongHopDiem(dtResult.rsTongHop);
                    me.genTable_TongHopDiemHP(dtResult.rsChiTiet);
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
    genTable_TongHopDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiem",

            aaData: data,
            colPos: {
                center: [0, 3, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "MAKHOI"
                },
                {
                    "mDataProp": "TENKHOI"
                },
                {
                    "mDataProp": "TONGSOTINCHICUAKHOI"
                },
                {
                    "mDataProp": "SOBATBUOC"
                },
                {
                    "mDataProp": "SODATICHLUY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblTongHopDiem", [5, 3, 4])
    },
    genTable_TongHopDiemHP: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiemHP",

            aaData: data,
            colPos: {
                center: [0, 1, 3, 6, 7, 8, 9, 10, 11],
            },
            bHiddenOrder: true,
            aoColumns: [
                {
                    //"mDataProp": "MAKHOI",
                    "mRender": function (nRow, aData) {
                        return '<b>' + edu.util.returnEmpty(aData.MAKHOI) + '</b>';
                    }
                },
                {
                    //"mDataProp": "TENKHOI",
                    "mRender": function (nRow, aData) {
                        return '<b>' + edu.util.returnEmpty(aData.TENKHOI) + '</b>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return (nRow + 1);
                    }
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KETQUA == 1 ? "Hoàn thành" : "";
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return aData.HOCPHANTHUA == 1 ? "Thừa " + edu.util.returnEmpty(aData.HOCPHANTHUA_LOAIXULY) : "";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.actionRowSpan("tblTongHopDiemHP", [1,[2,3]]);
    },
    
    getList_KetQuaDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayKetQuaDangKyHocCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDangKy'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_KetQuaDangKy(dtResult.rsKetQuaDangKy);
                    me.genTable_LichSuDangKy(dtResult.rsLichSuDangKy);
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
    genTable_KetQuaDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaDangKy",

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    //"mDataProp": "QLSV_NguoiHoc_Ten - QLSV_NguoiHoc_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) +  edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO)
                    }
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblKetQuaDangKy", [3])
    },
    genTable_LichSuDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "THOIGIANTHUCHIEN"
                },
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_ThoiGianDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSThoiGianLichHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDangKy(json);
                    me.getList_KetQuaDangKy(strQLSV_NguoiHoc_Id)
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
    cbGenCombo_ThoiGianDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDangKy"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KetQuaHocKy: function (aData) {
        var me = this;
        me.strDaoTao_LopQuanLy_Id = aData.DAOTAO_LOPQUANLY_ID;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSThoiGianDKTheoLopQL',
            'type': 'GET',
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KetQuaHocKy(json)
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
    genTable_KetQuaHocKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocKy_KetQua",
            aaData: data,
            colPos: {
                center: [0, 1]
            },
            arrClassName: ["btnEdit"],
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length > 0) {
            $("#tblHocKy_KetQua tbody tr[id=" + data[0].ID + "]").trigger("click");
        }
    },


    getList_HocPhanDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSHocPhanDKTheoLop',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
            'strDaoTao_LopQuanLy_Id': me.strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtHocPhanDangKy"] = json;
                    me.genTable_HocPhanDangKy(json);
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
    genTable_HocPhanDangKy: function (data) {
        var me = this;
        var html = '';
        html += '<th class="text-center fw-normal border-left bg-white">Học đi</th>';
        html += '<th class="text-center fw-normal border-left bg-white">Học lại</th>';
        html += '<th class="text-center fw-normal border-left bg-white">Học nâng điểm</th>';
        data.forEach(e => html += '<th class="text-center fw-normal border-left bg-white" style="width: 70px">' + edu.util.returnEmpty(e.TEN) + '</th>');
        $("#tblLop_KetQua thead tr:eq(1)").html(html);
        document.getElementById("lblHocPhanDangKy_KetQua").colSpan = data.length;
        me.getList_NguoiHocTheoLop();
        //var jsonForm = {
        //    strTable_Id: "tblHocKy_KetQua",
        //    aaData: data,
        //    colPos: {
        //        center: [0, 1]
        //    },
        //    arrClassName: ["btnEdit"],
        //    aoColumns: [
        //        {
        //            "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);
        //if (data.length > 0) {
        //    $("#tblHocKy_KetQua tbody tr[id=" + data[0].ID + "]").trigger("click");
        //}
    },
    
    getList_NguoiHocTheoLop: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSNguoiHocTheoLopQL',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
            'strDaoTao_LopQuanLy_Id': me.strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtNguoiHocTheoLop"] = json;
                    me.genTable_NguoiHocTheoLop(json)
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
    genTable_NguoiHocTheoLop: function (data) {
        var me = this;
        //var jsonForm = {
        //    strTable_Id: "tblLop_KetQua",
            
        //    aaData: data,
        //    colPos: {
        //        center: [0, 3, 4, 5,6,7,8],
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "QLSV_NGUOIHOC_MASO"
        //        },
        //        {
        //            "mDataP": "TEN",
        //            "mRender": function (nRow, aData) {
        //                return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + ' - ' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
        //            }
        //        },
        //        {
        //            "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
        //        },
        //        {
        //            "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
        //        },
        //        {
        //            "mDataProp": "TONGNOPHI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCDI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCLAI"
        //        },
        //        {
        //            "mDataProp": "SOTINHOCNANGDIEM"
        //        }
        //    ]
        //};
        //me.dtHocPhanDangKy.forEach((e, index) => {
        //    jsonForm.aoColumns.push(
        //        {
        //            "mRender": function (nRow, aData) {
        //                var iThuTu = edu.system.icolumn++;
        //                return '<span style="width: 70px" id="lblketqua_' + aData.ID + '_' + main_doc.InBangDiem.dtHocPhanDangKy[iThuTu].ID + '"></span>';
        //            }
        //        });
        //    jsonForm.colPos.center.push(9 + index);
        //});
        //edu.system.loadToTable_data(jsonForm);
        var html = '';
        data.forEach((e, index) => {
            html += '<tr>';
            html += '<td class="text-center" scope="row">' + (index + 1) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_MASO) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_HODEM) + ' - ' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_TEN) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_NGUOIHOC_NGAYSINH) + '</td>';
            html += '<td>' + edu.util.returnEmpty(e.QLSV_TRANGTHAINGUOIHOC_TEN) + '</td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.TONGNOPHI) + '</td>';
            html += '<td class="text-center border-left" id="chuyencan' + e.ID + '"></td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCDI) + '</td>';
            html += '<td  class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCLAI) + '</td>';
            html += '<td   class="text-center border-left">' + edu.util.returnEmpty(e.SOTINHOCNANGDIEM) + '</td>';
            me.dtHocPhanDangKy.forEach((ele, index) => {
                html += '<td  class="text-center pointer border-left sv' + e.ID + '" id="' + e.ID +'" style="width: 70px"><span style="width: 70px;" class="btnDSBuoiHoc" id="lblketqua_' + e.ID + '_' + ele.ID + '"></span></td>';
            });
            html += '</tr>';
        });
        $("#tblLop_KetQua tbody").html(html);
        edu.system.genHTML_Progress("zoneprocessDiem", (data.length * me.dtHocPhanDangKy.length));
        data.forEach(e => {
            me.dtHocPhanDangKy.forEach(ele => me.getList_KetQua(e, ele.ID, ele.TEN));
        });
    },
    getList_KetQua: function (objHang, strTenCot_Id, strTenCot) {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/KiemTraNguoiHocDangKyHocPhan',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': objHang.ID,
            'strDaoTao_HocPhan_Id': strTenCot_Id,
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    if (dtResult.length > 0) {
                        for (var i = 0; i < dtResult.length; i++) {
                            var strKetQua = ""
                            if (dtResult[i].KETQUA == 1) {
                                strKetQua = 'X';
                                var point = $("#lblketqua_" + objHang.ID + '_' + strTenCot_Id);
                                if ((dtResult[i].SOTIETVANGMAT + dtResult[i].SOBUOIVANGMAT) > 0) {
                                    strKetQua += '(' + edu.util.returnEmpty(dtResult[i].SOTIETVANGMAT) + '/' + edu.util.returnEmpty(dtResult[i].SOBUOIVANGMAT) + ')';
                                    if (dtResult[i].TYLEVANG) strKetQua +=' + ' + edu.util.returnEmpty(dtResult[i].TYLEVANG);
                                    point.attr("tietvang", edu.util.returnEmpty(dtResult[i].SOTIETVANGMAT))
                                    point.attr("buoivang", edu.util.returnEmpty(dtResult[i].SOBUOIVANGMAT))
                                    point.css('color', 'orange')
                                }
                                point.html(strKetQua);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessDiem", function () {
                    main_doc.InBangDiem.dtNguoiHocTheoLop.forEach(e => {
                        var iTietVang = 0;
                        var iBuoiVang = 0;
                        main_doc.InBangDiem.dtHocPhanDangKy.forEach(ele => {
                            var pointSV = $('#lblketqua_' + e.ID + '_' + ele.ID);
                            if ($(pointSV).attr("tietvang")) {
                                iTietVang += parseInt($(pointSV).attr("tietvang"));
                                iBuoiVang += parseInt($(pointSV).attr("buoivang"));
                            }
                        })
                        if (iTietVang + iBuoiVang) {
                            $("#chuyencan" + e.ID).html("" + iTietVang + '/' + iBuoiVang);
                        }
                    });

                });
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_NoPhi: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSKhoanNoChung',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_NoPhi(json)
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
    genTable_NoPhi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNo",
            aaData: data,
            colPos: {
                center: [0, 1],
                right: [2]
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataP": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.util.insertSumAfterTable(jsonForm.strTable_Id, [2])
    },


    getList_KhoanPhaiNop: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanPhaiNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_KhoanPhaiNop(data.Data);
                    me.genChiTietKhoanPhaiNop_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDuocMien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanMien',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.dtKhoanMien = data.Data;
                    //me.genDetail_KhoanDuocMien(data.Data);
                    me.genChiTietKhoanDuocMien_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaNop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_KhoanDaNop(data.Data);
                    me.genChiTietKhoanDaNop_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaRut: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaRut',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoanDaRut = data.Data;
                    //me.genDetail_KhoanDaRut(data.Data);
                    me.genChiTietKhoanDaRut_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoRiengTungKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_NoRiengTungKhoan(data.Data);
                    me.genChiTietKhoanPhaiNopRieng_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NoChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_NoChungCacKhoan(data.Data);
                    me.genChiTietKhoanPhaiNopChung_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuRiengCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_DuRiengCacKhoan(data.Data);
                    me.genChiTietKhoanThuaRieng_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DuChungCacKhoan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genDetail_DuChungCacKhoan(data.Data);
                    me.genChiTietKhoanThuaChung_XemThongTinAll(data.Data);
                }
                else {
                    console.log(data.Message);
                }

                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    genChiTietKhoanPhaiNop_XemThongTinAll: function (data) {
        var me = this;
        me.dtKhoanPhaiNop = data;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNop_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [2, 3],
                right: [4],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanThuaRieng_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanThuaRieng_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanThuaChung_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanThuaChung_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        console.log(data);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [1, 2],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDaNop_XemThongTinAll: function (data) {
        var me = this;
        me.dtKhoanDaNop = data;
        var thead = '';
        var $table = "tblChiTietKhoanDaNop_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '<th class="td-center">Số chứng từ</th>';
        thead += '<th class="td-center">Ngày tạo</th>';
        thead += '<th class="td-center">Người tạo</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);

        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [2, 3],
                right: [4]
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
                , {
                    "mDataProp": "CHUNGTU_SO"
                }
                , {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
                , {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDuocMien_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanDuocMien_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền được miễn</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);

        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>';
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDaRut_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanDaRut_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopChung_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNopChung_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopRieng_XemThongTinAll: function (data) {
        var me = this;
        var thead = '';
        var $table = "tblChiTietKhoanPhaiNopRieng_XemThongTinAll";
        //1. thead
        $("#" + $table + " thead").html('');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        thead += '<tr>';
        thead += '<th class="td-center td-fixed">Stt</th>';
        thead += '<th class="td-center">Học kỳ</th>';
        thead += '<th class="td-center">Đợt</th>';
        thead += '<th class="td-left">Loại khoản</th>';
        thead += '<th class="td-left">Nội dung</th>';
        thead += '<th class="td-right">Số tiền</th>';
        thead += '</tr>';
        $("#" + $table + " thead").append(thead);
        //2. tbody
        var jsonForm = {
            strTable_Id: $table,
            "aaData": data,
            colPos: {
                left: [3, 4],
                right: [5]
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (nRow, aData) {
                        return '<span title="' + aData.NOIDUNG + '">' + edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) + '</span>'
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },


    getList_QuaTrinhQuyetDinh: function (strNguoiDung_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_ThongTin/LayDSQDCaNhan',
            'type': 'GET',
            'strNguoiDung_Id': strNguoiDung_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhQuyetDinh(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genTable_QuaTrinhQuyetDinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            colPos: {
                center: [0, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_BuoiHoc: function (strNguoiDung_Id, strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_CC_ThongTin_MH/DSA4BRIDNC4oCS4iFSkkLgkuIhEpIC8P',
            'func': 'pkg_chuyencan_thongtin.LayDSBuoiHocTheoHocPhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strNguoiDung_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': me.strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BuoiHoc(dtReRult);
                }
                else {
                    edu.system.alert(obj_save + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_BuoiHoc: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBuoiHoc",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYGHINHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TIETBATDAU) + ' -> ' + edu.util.returnEmpty(aData.TIETKETTHUC);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.CANBOGHINHAN_TENDAYDU) + ' - ' + edu.util.returnEmpty(aData.CANBOGHINHAN_TAIKHOAN);
                    }
                },
                {
                    "mDataProp": "KIEUCHUYENCAN_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => { if (e.TINHCHAT == 1) $("#tblBuoiHoc #" + e.ID).css({ backgroundColor: "yellow" }) })
        /*III. Callback*/
    },
    
    getList_CanhBao: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIKJDUQNCAZNA04CS4iFzQP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSKetQuaXuLyHocVu',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CanhBao(dtReRult);
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
    genTable_CanhBao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCanhBaoHocVu",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.THOIGIAN_HIENTHI) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mức xử lý:</em><span>' + edu.util.returnEmpty(aData.MUCXULY_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Chương trình học:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Lớp:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_LOPQUANLY_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ghi chú:</em><span>' + edu.util.returnEmpty(aData.GHICHU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_DiemRenLuyen: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4ChATJC8NNDgkLwIgDykgLwPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayKQRenLuyenCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_DiemRenLuyen(data.Data);
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
    genTable_DiemRenLuyen: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDRL_ToanKhoa",
            aaData: data.rsToanKhoa,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        jsonForm.aoColumns.push({
            "mDataProp": "THOIGIAN"
        });
        jsonForm.strTable_Id = "tblDRL_Nam";
        jsonForm.aaData = data.rsNam;
        edu.system.loadToTable_data(jsonForm);
        jsonForm.strTable_Id = "tblDRL_Ky";
        jsonForm.aaData = data.rsKy;
        edu.system.loadToTable_data(jsonForm);
    },

    getList_TongHopDuLieu: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'D_BaoCao_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_diem_baocao.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length) {
                        edu.system.genHTML_Progress("zoneprocessXXXXA", dtReRult.length);
                        var strKhoaKiemTra = edu.util.uuid();
                        dtReRult.forEach(e => {
                            me.save_TongHopDuLieu(e.QLSV_NGUOIHOC_ID, e.DAOTAO_TOCHUCCHUONGTRINH_ID, strKhoaKiemTra);
                        });
                    } else {
                        edu.system.alert("Không có dữ liệu");
                    }
                    
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_TongHopDuLieu: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id, strKhoaKiemTraDuLieu) {
        var me = this;
        var obj_save = {
            'action': 'D_TongHop_XuLy_MH/FS4vJgkuMQU0DSgkNAkuIhUgMQPP',
            'func': 'PKG_DIEM_TONGHOP_XULY.TongHopDuLieuHocTap',
            'iM': edu.system.iM,
            'strKhoaKiemTraDuLieu': strKhoaKiemTraDuLieu,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXXA", function () {
                    edu.system.alert("Thực hiện hoàn tất")
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_SinhVienNoMon: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        $("#tblSinhVienNoMon").parent().show();
        $("#tblSinhVien").parent().hide();
        var obj_save = {
            'action': 'D_BaoCao_MH/DSA4BSAvKRIgIikPLgwuLwPP',
            'func': 'pkg_diem_baocao.LayDanhSachNoMon',
            'iM': edu.system.iM,

            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_QD'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_QD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_QD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_QD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_QD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QD').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachXet'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSinhVienNoMon"] = dtReRult;
                    me.genTable_SinhVienNoMon(dtReRult);
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
    genTable_SinhVienNoMon: function (data, iPager) {
        var me = this;
        $("#lblSinhVien_Tong").html(data.length)
        var jsonForm = {
            strTable_Id: "tblSinhVienNoMon",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.InBangDiem.getList_SinhVien()",
                iDataRow: 1,
                bFilter: true
            },
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NguoiHoc_Ten - QLSV_NguoiHoc_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + "(" + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TENKHOI) + " - " + edu.util.returnEmpty(aData.MAKHOI);
                    }
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },
}