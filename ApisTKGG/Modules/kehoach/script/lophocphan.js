/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LopHocPhan() { };
LopHocPhan.prototype = {
    dtLopHocPhan: [],
    strLopHocPhan_Id: '',
    dtSinhVien: [],
    arrSinhVien_Id: [],
    dtPhanLoai: [],
    dtXacNhan: [],
    dtKhoiLuongCaNhan: [],
    strGiangVien_Id: '',

    init: function () {
        var me = this;
        me['strHead'] = $("#tblDuyetBuoiHoc thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.pageSize_default = 10;
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        
        //me.getList_LopQuanLy();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGian();
        me.getList_KeHoachChung();
        me.getList_ThoiGianDaoTao();
        me.getList_CCTC();
        me.getList_HS();
        me.getList_HinhThucHoc();
        //me.getList_KeHoachChiTiet();

        $("#dropSearch_ThoiGian").on("select2:select", function () {
            me.getList_KeHoachChung();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_KeHoachChiTiet();
        });
        $("#dropSearch_KeHoachChiTiet").on("select2:select", function () {
            me.getList_DotHoc();
            me.getList_DonViHP();
            me.getList_HocPhan_KeHoach();
        });
        $("#dropSearch_DotHoc").on("select2:select", function () {
            me.getList_DonViHP();
            me.getList_HocPhan_KeHoach();
        });
        $("#dropSearch_DonViHP").on("select2:select", function () {
            me.getList_HocPhan_KeHoach();
        });
        $("#dropSearch_HocPhan").on("select2:select", function () {
            me.getList_LopHocPhan();
        });
        $("#dropLoaiXacNhan").on("select2:select", function () {
            me.getList_TinhTrang();
        });
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.toggle_edit();
        });

        // Xuất Excel (cùng pattern với DaQHHT) — click nút hoặc Ctrl+G
        $("#btnXuatExcel_LopHocPhan").click(function (e) {
            if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
            me.exportExcel_LopHocPhan();
        });
        $(document).off('keydown.lhp_export').on('keydown.lhp_export', function (e) {
            // Skip nếu đang ở trong input/textarea hoặc form Edit lớp đang mở
            if (/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) return;
            if (!$("#tblLopHocPhan").length) return;
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me.exportExcel_LopHocPhan();
            }
        });
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaToChuc();
            me.getList_HocPhan();
            me.getList_LopHocPhanAdd();
            me.resetCombobox(this);
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            ////me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {

            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop').on('select2:select', function (e) {

            var x = $(this).val();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_HocPhanAdd').on('select2:select', function (e) {
            me.getList_LopHocPhanAdd();
            me.resetCombobox(this);
        });
        $("#dropLopCuoi").on("select2:select", function () {
            me.getList_DangKyHocKQ();
        });

        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
        });
        $("#btnSearch").click(function (e) {
            me.getList_LopHocPhan();
        });
        $("#btnSearchAdd").click(function (e) {
            me.getList_LopHocPhanAdd();
        });
        
        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });
        $("[id$=chkSelectAll_LopHocPhanAdd]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhanAdd" });
        });

        $(".btnSave_LopHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanAdd", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu <span style='color: red'>" + arrChecked_Id.length + "</span> dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_LopHocPhan(arrChecked_Id[i]);
                }
            });
        });
        
        edu.system.getList_MauImport("zonebtnBaoCao_LopHocPhan", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strKLGD_KeHoachChiTiet_Id", edu.util.getValById("dropSearch_KeHoachChiTiet"));
            addKeyValue("strKLGD_TongHopKhoiLuong_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strDotHoc_Id", edu.util.getValById("dropSearch_DotHoc"));
            addKeyValue("strDonViQuanLyHocPhan_Id", edu.util.getValById("dropSearch_DonViHP"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strDonViQuanLyGiangVien_Id", edu.util.getValById("dropSearch_DonViThanhVien"));
            addKeyValue("strGiangVien_Id2", edu.util.getValById("dropSearch_ThanhVien"));
            addKeyValue("strGiangVien_Id", main_doc.LopHocPhan.strGiangVien_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV');
            arrTrangThai.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e));
        });
        edu.system.getList_MauImport("zonebtnBaoCao_LopHocPhan2", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strDotHoc_Id", edu.util.getValById("dropSearch_DotHoc"));
            addKeyValue("strDonViQuanLyHocPhan_Id", edu.util.getValById("dropSearch_DonViHP"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strDonViQuanLyGiangVien_Id", edu.util.getValById("dropSearch_DonViThanhVien"));
            addKeyValue("strGiangVien_Id2", edu.util.getValById("dropSearch_ThanhVien"));
            addKeyValue("strKLGD_KeHoachChiTiet_Id", edu.util.getValById("dropSearch_KeHoachChiTiet"));
            addKeyValue("strGiangVien_Id", main_doc.LopHocPhan.strGiangVien_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV');
            arrTrangThai.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e));
        });
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropLoaiXacNhan", "", data => {
            me.dtPhanLoai = data;
            if (data.length) {
                var html = '';
                data.forEach(e => {
                    html += '<th>' + e.TEN + '</th>';
                })
                $("#zonePhanLoai").html(html);
                document.getElementById("lblPhanLoai").colSpan = data.length;
            }
        });

        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var objTemp = me.dtLopHocPhan.find(e => e.ID === arrChecked_Id[i]).DULIEUXACNHAN;
                me.save_XacNhan(objTemp, strTinhTrang, strMoTa);
            }
        });

        $("#btnLopHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopHocPhan(arrChecked_Id[i]);
                }
            });
        });

        $("#btnTaoDuLieu").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng!");
            //    return;
            //}
            //arrChecked_Id.forEach(e => me.save_TaoDuLieu(e));
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                me.getList_LopHocPhanTaoDuLieu();
            });
        });

        $("#btnTinhKhoiLuong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện tính khối lượng cho <span style='color: red'>" + arrChecked_Id.length + "</span> dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_TinhKhoiLuong(arrChecked_Id[i]);
                }
            });
        });

        $("#btnXacDinhKhongTKB").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_KhongTKB").modal('show');
        });

        $("#btnSave_KhongTKB").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var dHanhDong = edu.util.getValById('dropKhongTKB');
            $("#modal_KhongTKB").modal('hide');
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_KhongTKB(arrChecked_Id[i], dHanhDong);
            }
        });

        $("#tblLopHocPhan").delegate(".btnDuyet", "click", function () {
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneDuyetBuoiHoc");
            me.getList_GiangVien();
        });

        $("#tblLopHocPhan").delegate(".btnApDat", "click", function () {
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            $("#myModalApDat").modal("show");
            me.getList_ApDat(strId);
        });
        $("#tblLopHocPhan").delegate(".btnKhoiLuongCaNhan", "click", function () {
            var strId = this.id;
            var strGiangVien_Id = $(this).attr('name');
            me['strGiangVien_Id'] = strGiangVien_Id;
            var strGiangVien = $(this).attr('title');
            $("#lblHoTen").html(strGiangVien)
            me.strLopHocPhan_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneKhoiLuongCaNhan");
            me.getList_KhoiLuongCaNhan(me.dtLopHocPhan.find(e => e.ID == strId).KLGD_KEHOACHCHITIET_ID, strGiangVien_Id);
        });
        $(".btnSave_DuyetBuoiHoc").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyetBuoiHoc", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng cần?");
            //    return;
            //}
            //$("#modal_XacNhan").modal("show");
            me.strLoaiXacNhan = "KHOA_XACNHAN_BUOIDAY";
            var x = $("#tblDuyetBuoiHoc .checkdata");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
            x.each(function () {
                var icheck = $(this).is(':checked') ? 1 : 0;
                var arrId = this.id.replace(/checkX/g, '').split("_");
                var objLopHocPhan = me.dtDuyetBuoiHoc.find(ele => ele.ID === arrId[0]);
                strSanPham_Id = objLopHocPhan.DAOTAO_LOPHOCPHAN_ID + arrId[1] + objLopHocPhan.NGAY + objLopHocPhan.TIETBATDAU + objLopHocPhan.TIETKETTHUC;
                me.save_XacNhanSanPham(strSanPham_Id, icheck, "", me.strLoaiXacNhan);
            })
            //var strLopHocPhan_Id = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id).IDLOPHOCPHAN;

            //me.getList_XacNhanSanPham(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
            //me.getList_XacNhan(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
        });
        $("#tblDuyetBuoiHoc").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnKhoaDuLieu").click(function () {
            $("#modal_KhoaDuLieu").modal('show');
        });

        $("#btnSave_KhoaDuLieu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_KhoaDuLieu(arrChecked_Id[i]);
            }
        });

        $("#tblKhoiLuongCaNhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                var objData = me.dtKhoiLuongCaNhan.find(e => e.ID === strId);
                me.getList_DuLieuChiTiet(objData);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXacNhanTuDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTuDong(arrChecked_Id[i]);
            }
        });
        $("#btnSave_ApDat").click(function () {
            me.save_ApDat();
        });
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao(dtReRult);
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
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
                    me.cbGenCombo_HocPhan(dtResult, iPager);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhanAdd"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhanAdd: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSLopHocPhan',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhanAdd'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,


            'strDangKy_KeHoachDangKy_Id': '',
            'dLocGanTheoCTDT': 0,
            'dChiLayCacLopChuaPhanCong':0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': -1,
            'dSoDaDangDenSo': -1,
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
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
                    me.dtLopHocPhanAdd = dtResult;
                    me.genTable_LopHocPhanAdd(dtResult, iPager);
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
    genTable_LopHocPhanAdd: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanAdd",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanAdd()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan_KeHoach: function () {
        var me = this;

        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSHocPhan',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViHP'),
            'strDotHoc_Id': edu.util.getValById('dropSearch_DotHoc'),
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
                    me.cbGenCombo_HocPhanKeHoach(dtResult);
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
    cbGenCombo_HocPhanKeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: Xuất Excel danh sách Lớp học phần đang hiển thị
    --Nguồn: me.dtLopHocPhan (đã apply bộ lọc & pageSize hiện tại)
    --Lib: XLSX (SheetJS) load lazy từ CDN trong lophocphan.html
    -------------------------------------------*/
    exportExcel_LopHocPhan: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert('Thư viện Excel chưa load xong. Vui lòng thử lại sau vài giây.', 'w');
            return;
        }
        var data = me.dtLopHocPhan || [];
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
        var dsPhanLoai = me.dtPhanLoai || [];
        var iMissingPhanLoai = 0;

        // ===== Header 2 cấp giống UI: cột tĩnh rowspan=2, "Phân loại theo nhóm lớp" colspan=N =====
        var staticHeaders = [
            'STT', 'Mã học phần', 'Tên học phần', 'Lớp học phần', 'Hình thức học',
            'Giảng viên', 'Phân bổ theo CTDT', 'Tổng số tiết TKB', 'Tổng tiết theo phân GV',
            'Tổng tiết xác nhận', 'Năm học', 'Học kỳ', 'Đợt', 'Buổi bắt đầu', 'Buổi kết thúc',
            'Khóa', 'Khoa quản lý chuyên môn', 'Số lượng', 'Số giờ chuẩn', 'Khóa dữ liệu',
            'Không tính theo TKB'
        ];
        var phanLoaiHeaders = dsPhanLoai.map(function (pl) { return pl.TEN; });
        var nStatic = staticHeaders.length;
        var nPL = phanLoaiHeaders.length;
        var nCols = nStatic + nPL;

        // Build 2 hàng header
        var headerRow1 = new Array(nCols).fill('');
        var headerRow2 = new Array(nCols).fill('');
        for (var ih = 0; ih < nStatic; ih++) headerRow1[ih] = staticHeaders[ih];
        if (nPL > 0) {
            headerRow1[nStatic] = 'Phân loại theo nhóm lớp';
            for (var jh = 0; jh < nPL; jh++) headerRow2[nStatic + jh] = phanLoaiHeaders[jh];
        }

        // Build data rows dạng array (positional)
        var dataRows = data.map(function (e, i) {
            var row = [
                i + 1,
                v(e.DAOTAO_HOCPHAN_MA),
                v(e.DAOTAO_HOCPHAN_TEN),
                v(e.DAOTAO_LOPHOCPHAN_TEN),
                v(e.HINHTHUCHOC_MA),
                v(e.GIANGVIEN),
                v(e.TTPHANBOTHEOCTDT),
                v(e.TONGSOTIETTKBMO),
                v(e.TONGSOTIETGIANG),
                v(e.TONGSOTIETGIANGXACNHAN),
                v(e.NAMHOC),
                v(e.HOCKY),
                v(e.DOTHOC),
                v(e.NGAYBATDAU),
                v(e.NGAYKETTHUC),
                v(e.DAOTAO_KHOADAOTAO_TEN),
                v(e.DAOTAO_KHOAQUANLY_TEN),
                v(e.QUYMO),
                v(e.TONGSOGIOCHUAN),
                (e.KHOADULIEU == '1' ? 'Khóa' : ''),
                (parseFloat(e.KHONGTINHTHEOTKB) > 0 ? 'Không tính theo TKB' : '')
            ];
            dsPhanLoai.forEach(function (pl) {
                var val = (e._PhanLoai && e._PhanLoai[pl.ID]) || '';
                if (!val) {
                    var $cell = $('#lbl' + e.ID + '_' + pl.ID);
                    if ($cell.length) val = $.trim($cell.text());
                }
                var loaded = e._PhanLoaiLoaded && e._PhanLoaiLoaded[pl.ID];
                if (!loaded && !val) iMissingPhanLoai++;
                row.push(val);
            });
            return row;
        });
        if (iMissingPhanLoai > 0) {
            if (!confirm('Có ' + iMissingPhanLoai + ' ô "Phân loại theo nhóm lớp" chưa tải xong (đang gọi API). Vẫn tiếp tục xuất Excel?')) {
                return;
            }
        }

        var aoa = [headerRow1, headerRow2].concat(dataRows);
        var ws = XLSX.utils.aoa_to_sheet(aoa);

        // Tính độ rộng cột (xét cả header con lẫn data)
        var allHeaders = staticHeaders.concat(phanLoaiHeaders);
        ws['!cols'] = allHeaders.map(function (h, idx) {
            var maxLen = (h || '').length;
            dataRows.forEach(function (r) {
                var l = String(r[idx] == null ? '' : r[idx]).length;
                if (l > maxLen) maxLen = l;
            });
            return { wch: Math.min(maxLen + 2, 40) };
        });

        // Merges: cột tĩnh rowspan=2; "Phân loại theo nhóm lớp" colspan=nPL
        var merges = [];
        for (var im = 0; im < nStatic; im++) {
            merges.push({ s: { r: 0, c: im }, e: { r: 1, c: im } });
        }
        if (nPL > 1) {
            merges.push({ s: { r: 0, c: nStatic }, e: { r: 0, c: nStatic + nPL - 1 } });
        } else if (nPL === 1) {
            // Chỉ 1 phân loại → vẫn rowspan=2 cho gọn
            merges.push({ s: { r: 0, c: nStatic }, e: { r: 1, c: nStatic } });
        }
        ws['!merges'] = merges;

        // ===== Styling (xlsx-js-style hỗ trợ; bản Community sẽ bỏ qua không lỗi) =====
        var headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { patternType: "solid", fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "999999" } },
                bottom: { style: "thin", color: { rgb: "999999" } },
                left: { style: "thin", color: { rgb: "999999" } },
                right: { style: "thin", color: { rgb: "999999" } }
            }
        };
        var yellowFill = { patternType: "solid", fgColor: { rgb: "FFFF00" } };
        var thinBorder = {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } }
        };
        // Style cho 2 hàng header (row 0 + row 1)
        for (var hr = 0; hr <= 1; hr++) {
            for (var hc = 0; hc < nCols; hc++) {
                var addrH = XLSX.utils.encode_cell({ r: hr, c: hc });
                if (!ws[addrH]) ws[addrH] = { v: '', t: 's' };
                ws[addrH].s = headerStyle;
            }
        }
        // Freeze 2 hàng header
        ws['!freeze'] = { xSplit: 0, ySplit: 2 };
        ws['!views'] = [{ state: 'frozen', ySplit: 2 }];
        // Đặt chiều cao 2 hàng header cho dễ đọc khi wrap
        ws['!rows'] = [{ hpt: 22 }, { hpt: 42 }];
        // Style body, tô vàng dòng cảnh báo
        data.forEach(function (e, i) {
            var r = i + 2; // 2 hàng header phía trên
            var isWarn = (e.TONGSOTIETGIANG != e.TONGSOTIETGIANGXACNHAN
                       || e.TONGSOTIETGIANG != e.TONGSOTIETTKBMO);
            for (var cc = 0; cc < nCols; cc++) {
                var addr = XLSX.utils.encode_cell({ r: r, c: cc });
                if (!ws[addr]) ws[addr] = { v: '', t: 's' };
                var style = { border: thinBorder, alignment: { vertical: 'center', wrapText: true } };
                if (isWarn) style.fill = yellowFill;
                ws[addr].s = style;
            }
        });

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Lớp học phần');

        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                    + '_' + pad(now.getHours()) + pad(now.getMinutes());
        XLSX.writeFile(wb, 'LopHocPhan_' + stamp + '.xlsx');
    },

    getList_LopHocPhan: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNAPP',
            'func': 'pkg_klgv_v2_kehoach.LayDSKLGD_DuLieu',
            'iM': edu.system.iM,
            'strTKB_HinhThucHoc_Id': edu.util.getValById('dropSearch_HinhThucHoc'),
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strKLGD_TongHopKhoiLuong_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strDotHoc_Id': edu.util.getValById('dropSearch_DotHoc'),
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDongXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strDonViQuanLyHocPhan_Id': edu.util.getValById('dropSearch_DonViHP'),
            'strDonViQuanLyGiangVien_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strGiangVien_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNguoiThucHien_Id': edu.system.userId,
            'dQuyMoBatDau': edu.system.getValById('txtQuyMoBatDau') ? edu.system.getValById('txtQuyMoBatDau'): -1,
            'dQuyMoKetThuc': edu.system.getValById('txtQuyMoKetThuc') ? edu.system.getValById('txtQuyMoKetThuc'): -1,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtLopHocPhan = dtResult;
                    me.genTable_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    getList_LopHocPhanTaoDuLieu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_DuLieu',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", dtResult.length);
                    dtResult.forEach(e => me.save_TaoDuLieu(e.ID))
                    
                    //me.dtLopHocPhan = dtResult;
                    //me.genTable_LopHocPhan(dtResult, iPager);
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
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhan()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    //"mDataProp": "DAOTAO_HOCPHAN_TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnApDat" id="' + aData.ID + '" title="Sửa">' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "HINHTHUCHOC_MA"
                },
                {
                    //"mDataProp": "GIANGVIEN",
                    "mRender": function (nRow, aData) {
                        if (!aData.GIANGVIEN_ID) return ""
                        var arrGiangVien_Id = [aData.GIANGVIEN_ID];
                        var arrGiangVien = [aData.GIANGVIEN];
                        if (aData.GIANGVIEN_ID.indexOf(',') != -1) {
                            arrGiangVien_Id = aData.GIANGVIEN_ID.split(',');
                            arrGiangVien = aData.GIANGVIEN.split(',');
                        }
                        var row = '';
                        arrGiangVien_Id.forEach((e, i) => {
                            row += '<a class="btn btn-default btnKhoiLuongCaNhan" id="' + aData.ID + '" name="' + e + '" title="' + arrGiangVien[i] + '">' + arrGiangVien[i] + '</a>';
                        })
                        return row;
                    }
                },
                {
                    "mDataProp": "TTPHANBOTHEOCTDT"
                },
                {
                    "mDataProp": "TONGSOTIETTKBMO"
                },
                {
                    "mDataProp": "TONGSOTIETGIANG"
                },
                {
                    "mDataProp": "TONGSOTIETGIANGXACNHAN",
                    //"mRender": function (nRow, aData) {
                    //    return '<span id="lblSoTiet' + aData.ID + '"></span>';
                    //}
                },
                {
                    "mDataProp": "NAMHOC"
                },
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "DOTHOC"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "TONGSOGIOCHUAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var x = aData.KHOADULIEU == "1" ? "Khóa" :  "";
                        return x
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDuyet" id="' + aData.ID + '" title="Sửa">Duyệt buổi học</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return parseFloat(aData.KHONGTINHTHEOTKB) > 0 ? "Không tính theo TKB" : "";
                    }
                }
            ]
        };
        me.dtPhanLoai.forEach(e => {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<a class="" id="lbl' + aData.ID + '_' + main_doc.LopHocPhan.dtPhanLoai[iThuTu].ID + '" ></a>';
                    }
                }
            );
        });
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.dtPhanLoai.forEach(ele => me.getData_XacNhan(e, ele.ID)));
        edu.system.insertSumAfterTable("tblLopHocPhan", [6, 7, 8, 9, 17, 18]);
        data.forEach(e => {
            if (e.TONGSOTIETGIANG != e.TONGSOTIETGIANGXACNHAN || e.TONGSOTIETGIANG != e.TONGSOTIETTKBMO) $("#tblLopHocPhan #" + e.ID).css({backgroundColor: 'yellow'})
        });
        me.syncScrollBar();
        //edu.system.genHTML_Progress("zoneprocessXXXX1", data.length);
        //data.forEach(e => me.getData_SoTiet(e));
    },

    syncScrollBar: function () {
        var topScroll = document.querySelector(".aps-lophocphan .scroll-table-top-x");
        var bottomScroll = document.querySelector(".aps-lophocphan .scroll-table-x");
        if (!topScroll || !bottomScroll) return;
        var inner = topScroll.firstElementChild;
        var updateWidth = function () {
            if (!inner) return;
            var table = bottomScroll.querySelector("table");
            var w = Math.max(bottomScroll.scrollWidth, table ? table.scrollWidth : 0);
            inner.style.width = w + "px";
        };
        updateWidth();
        setTimeout(updateWidth, 100);
        setTimeout(updateWidth, 500);
        setTimeout(updateWidth, 1500);
        if (topScroll._scrollSyncBound) return;
        topScroll._scrollSyncBound = true;
        topScroll.addEventListener("scroll", function () {
            if (topScroll._lockSync) { topScroll._lockSync = false; return; }
            bottomScroll._lockSync = true;
            bottomScroll.scrollLeft = topScroll.scrollLeft;
        });
        bottomScroll.addEventListener("scroll", function () {
            if (bottomScroll._lockSync) { bottomScroll._lockSync = false; return; }
            topScroll._lockSync = true;
            topScroll.scrollLeft = bottomScroll.scrollLeft;
        });
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(updateWidth);
            ro.observe(bottomScroll);
            var tbl = bottomScroll.querySelector("table");
            if (tbl) ro.observe(tbl);
        }
        $(window).on("resize.scrollTopX", updateWidth);
    },

    getData_XacNhan: function (e, strLoaiXacNhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_XacNhan/LayTTKLGD_PhanLoai_XacNhan',
            'type': 'GET',
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strDuLieuXacNhan': e.DULIEUXACNHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    // Đánh dấu đã gọi xong (kể cả khi trả về rỗng — rỗng là dữ liệu hợp lệ)
                    e._PhanLoaiLoaded = e._PhanLoaiLoaded || {};
                    e._PhanLoaiLoaded[strLoaiXacNhan_Id] = true;
                    if (dtReRult.length) {
                        $('#lbl' + e.ID + '_' + strLoaiXacNhan_Id).html(dtReRult[0].HANHDONG_TEN);
                        e._PhanLoai = e._PhanLoai || {};
                        e._PhanLoai[strLoaiXacNhan_Id] = dtReRult[0].HANHDONG_TEN;
                    }

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

    getData_SoTiet: function (e, strLoaiXacNhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_Chung_MH/DSA4ChAVLi8mFSgkNRkgIg8pIC8GKCAvJgU0OCQ1',
            'func': 'pkg_klgv_v2_chung.LayKQTongTietXacNhanGiangDuyet',
            'iM': edu.system.iM,
            'strKLGD_KeHoachChitiet_Id': e.KLGD_KEHOACHCHITIET_ID,
            'strDaoTao_HocPhan_Id': e.DAOTAO_HOCPHAN_ID,
            'strDaoTao_LopHocPhan_Id': e.DULIEUXACNHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length) {
                        $('#lblSoTiet' + e.ID).html(dtReRult[0].KETQUA);
                    }

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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX1", function () {

                    edu.system.insertSumAfterTable("tblLopHocPhan", [6, 7]);
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    save_LopHocPhan: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        //var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'TKGG_KeHoach/Them_KLGD_DuLieu_LopHocPhan',
            'type': 'POST',
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            type: 'POST',
            contentType: true,
            async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_LopHocPhan: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TKGG_KeHoach/Xoa_KLGD_DuLieu_LopHocPhan',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSThoiGianTongHopKL',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThoiGian(dtReRult, data.Pager);
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
    genCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachChung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'dHieuLuc': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtKeHoachChung = dtReRult;
                    me.genCombo_KeHoachChung(dtReRult, data.Pager);
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
    genCombo_KeHoachChung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachChiTiet: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strKLGD_TongHopKhoiLuong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strCheDoApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtKeHoachChung = dtReRult;
                    me.genCombo_KeHoachChiTiet(dtReRult, data.Pager);
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
    genCombo_KeHoachChiTiet: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_KeHoachChiTiet"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    loadBtnXacNhan: function (data) {
        var me = this;
        me.dtXacNhan = data;
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
        $("#zoneBtnXacNhan").html(row);
    },
    save_XacNhan: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TKGG_XacNhan/Them_KLGD_PhanLoai_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': edu.util.getValById('dropLoaiXacNhan'),
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TKGG_XacNhan/LayDSKLGD_PhanLoai_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
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

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhan: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
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
    getList_TinhTrang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_XacNhan/LayHanhDongXacNhanNguoiDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropLoaiXacNhan'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data)

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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    save_TaoDuLieu: function (strKLGD_DuLieu_Id) {
        var me = this;
        //var obj = me.dtSinhVien.find(e => e.ID === strId);
        //var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
        var obj_save = {
            'action': 'TKGG_TinhToan/ThucHienTaoDuLieuGiang',
            'type': 'POST',
            'dCachXacDinhDuLieuGiang': edu.util.getValById('dropSearch_XacDinhDuLieuGiang'),
            'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_LopHocPhan();
                });
            },
            type: 'POST',
            contentType: true,
            //async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien: function () {
        var me = this;
        var aData = me.dtLopHocPhan.find(e => e.ID == me.strLopHocPhan_Id);
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': aData.KLGD_KEHOACHCHITIET_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_LopHocPhan_Id': aData.DULIEUXACNHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtGiangVien = dtResult;
                    me.getList_DuyetBuoiHoc();
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
    getList_DuyetBuoiHoc: function () {
        var me = this;

        var aData = me.dtLopHocPhan.find(e => e.ID == me.strLopHocPhan_Id);
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDuLieuLichGiangDuyet',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': aData.KLGD_KEHOACHCHITIET_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_LopHocPhan_Id': aData.DULIEUXACNHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtDuyetBuoiHoc = dtResult;
                    me.genTable_DuyetBuoiHoc(dtResult, iPager);
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DuyetBuoiHoc: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblDuyetBuoiHoc";
        $("#tblDuyetBuoiHoc thead").html(me.strHead);
        var arrDoiTuong = me.dtGiangVien;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th style="text-align: center" class="border-left"><input type="checkbox" class="chkSelectAll pointer" id="chkSelectAll_' + arrDoiTuong[j].ID + '"></td>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left text-white" scope="col" >Xác nhận</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left text-white" scope="col" >Tình trạng</th>');
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="3" class="td-center  border-left">' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_HODEM) + ' ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_TEN) + ' - ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_MASO) + '</th>');
        }

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "THU"
                },     
                //{ 
                //    "mDataProp": "SOTIET"
                //},
                {
                    "mRender": function (nRow, aData) {
                        return (aData.SOTIET) +" (" + aData.TIETBATDAU + " -> " + aData.TIETKETTHUC + ")";
                    }
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<div id="divcheck_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '"></div>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="xacnhan_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="tinhtrang_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        var iTongTiet = 0;
        data.forEach(e => iTongTiet += e.SOTIET);
        var htmlfoot = "";
        arrDoiTuong.forEach(e => {
            htmlfoot += '<td colspan="3" id="sum' + e.ID + '"></td>';
        })
        $("#" + strTable_Id + " tfoot tr:eq(0)").html('<td colspan="5"></td><td>' + edu.util.returnEmpty(iTongTiet) + '</td>' + htmlfoot)
        //if (data.rsNhanSu.length > 0) {
        //    edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        //}
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua(data[i], arrDoiTuong[j].ID);
            }
        }
        edu.system.genHTML_Progress("zoneprocessDuyetBuoiHoc", (data.length * arrDoiTuong.length));

        //edu.system.insertSumAfterTable(jsonForm.strTable_Id, [5])
        /*III. Callback*/
    },
    getList_KetQua: function (objLichGiang, strNguoiDung_Id) {
        var me = this;
        $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left').addClass('td-center');
        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG',
            'type': 'GET',
            'strNguoiDung_Id': strNguoiDung_Id,
            'strKLGD_DuLieu_LichGiang_Id': objLichGiang.ID,
            'strKLGD_KeHoachChitiet_Id': objLichGiang.KLGD_KEHOACHCHITIET_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        dtResult = dtResult[0];
                        dtResult.COLICH != '0' ? $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).html('<input type="checkbox" id="checkX' + objLichGiang.ID + '_' + strNguoiDung_Id + '" class="check' + strNguoiDung_Id + ' checkdata" />') : null;
                        var lblXacNhan = "";
                        switch (dtResult.XACNHANDONGY_KHONGDONGY) {
                            case "1": { lblXacNhan = '<span><i class="fas fa-check-circle text-success"></i></span>'; $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).prop('checked', true); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('checked', 'checked'); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('name', (objLichGiang.SOTIET)); }; break;
                            case "0": lblXacNhan = '<span><i class="fas fa-times-circle text-danger"></i></span>'; break;
                            default: lblXacNhan = "";
                        }
                        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblXacNhan)
                        var lblDiemDanh = "";
                        switch (dtResult.TINHTRANGDIEMDANH) {
                            case "1": lblDiemDanh = 'Có điểm danh'; break;
                            case "0": lblDiemDanh = 'Không điểm danh'; break;
                            default: lblDiemDanh = "";
                        }
                        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblDiemDanh)
                    }
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
            complete: function () {
                edu.system.start_Progress("zoneprocessDuyetBuoiHoc", function () {
                    me.dtGiangVien.forEach(e => {
                        var iTongSo = 0;
                        var x = $(".check" + e.ID).each(function () {
                            if ($(this).is(':checked')) {
                                iTongSo += parseInt($(this).attr("name"))
                            }
                        })
                        $("#sum" + e.ID).html("Tổng số tiết: " + iTongSo);
                    });
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //$("#modal_XacNhan").modal('hide');
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GiangVien();
                });
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    save_KhoaDuLieu: function (strKLGD_DuLieu_Id) {
        var me = this;
        //var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'TKGG_KeHoach/Them_KLGD_DuLieu_Khoa',
            'type': 'POST',
            'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
            'dKhoaDuLieu': edu.util.getValById('dropKhoaDuLieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            type: 'POST',
            contentType: true,
            async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_KhoiLuongCaNhan: function (strKLGD_KeHoachChitiet_Id, strNguoiThucHien_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDuLieuKLCaNhan',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': strKLGD_KeHoachChitiet_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhoiLuongCaNhan = dtReRult;
                    //me['dtLopHocPhan2'] = dtReRult;
                    me.genTable_KhoiLuongCaNhan(dtReRult, data.Pager);
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
    genTable_KhoiLuongCaNhan: function (data, iPager) {
        $("#lblKhoiLuongCaNhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoiLuongCaNhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_KhoiLuongCaNhan()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 1, 3, 5, 6, 7, 8, 9, 10, 11, 12],
                //right: [5]
            },
            aoColumns: [
                {
                    //"mDataProp": "DONVI_PHUTRACH_HOCPHAN_TEN1",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mDataProp": "DONVI_PHUTRACH_HOCPHAN_TEN1",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDuyet" id="' + aData.ID + '" title="Duyệt">Duyệt buổi học</a></span>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DONVI_PHUTRACH_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "TONGPHANBO"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "SOGIOCHUAN"
                },
                {
                    "mDataProp": "TINHTRANGXACNHAN_TEN"
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [11, 9, 10, 12])
        $("#tblKhoiLuongCaNhan tfoot").css({ 'text-align': 'center' })
        /*III. Callback*/
    },

    getList_DuLieuChiTiet: function (objData) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_ThongTin/LayDSDuLieu_ChiTiet',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': objData.KLGD_KEHOACHCHITIET_ID,
            'strLoai': objData.LOAI,
            'strId': objData.ID,
            'strNguoiThucHien_Id': me.strGiangVien_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDoiTuong_View"] = dtReRult.rsThanhPhanCongThuc;
                    me.viewForm_KhoiLuongCaNhan(objData, dtReRult.rs, dtReRult.rsThanhPhanCongThuc);
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

    viewForm_KhoiLuongCaNhan: function (objData, data, dataCot) {
        var me = this;
        //call popup --Edit
        $("#modal_lichgiang").modal('show');
        $("#lblModalLable").html(objData.GHICHU);
        $("#tblModalLichGiang thead").html("");
        $("#tblModalLichGiang tbody").html("");
        var strHead = "";
        var arrHead = [];
        var arrNoiDung = [];
        switch (objData.LOAI) {
            case "KLGD_DULIEU_LICHGIANG": {
                arrHead = ["Ngày học", "Tiết bắt đầu", "Tiết kết thúc", "Số tiết", "Số sinh viên", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [{
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "GIOCHUAN"
                }]
            }; break;
            case "KLGD_DULIEU_LAMSAN": {
                arrHead = ["Ngày đi", "Số ngày", "Số sinh viên", "Số tín chỉ", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [{
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "SOTINCHIHOCPHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "GIOCHUAN"
                }]
            }; break;
            case "KLGD_DULIEU_DOANKHOALUAN": {
                arrHead = ["Số sinh viên", "Số tín chỉ", "Học phần", "Lớp học phần", "Giờ chuẩn"];
                arrNoiDung = [
                    {
                        "mDataProp": "QUYMO"
                    },
                    {
                        "mDataProp": "SOTINCHIHOCPHAN"
                    },
                    {
                        "mRender": function (nRow, aData) {
                            return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                        }
                    },
                    {
                        "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                    },
                    {
                        "mDataProp": "GIOCHUAN"
                    }]
            }; break;
            case "KLGD_DULIEU_DOANKHOALUAN": {
                arrHead = ["Vai trò", "Giờ chuẩn"];
                arrNoiDung = [
                    {
                        "mDataProp": "VAITRO_TEN"
                    },
                    {
                        "mDataProp": "GIOCHUAN"
                    }]
            }; break;
            case "KLGD_DULIEU_HOIDONG": {
                arrHead = ["Giờ chuẩn"];
                arrNoiDung = [
                    {
                        "mDataProp": "GIOCHUAN"
                    }]
            }; break;
        }
        strHead += '<tr><th  rowspan="2" class="text-center w-50px" scope="col">STT</th>';
        arrHead.forEach(e => strHead += '<th rowspan="2" class="text-center" scope="col">' + e + '</th>');
        if (dataCot.length) {
            strHead += '<th colspan="' + dataCot.length + '" class="text-center" scope="col">' + dataCot[0].XAUCONGTHUC + '</th>'
        }
        strHead += '</tr>';
        if (dataCot.length) {
            strHead += '<tr>';
            dataCot.forEach(e => strHead += '<th class="text-center" scope="col">' + e.TENTUKHOA + '</th>');
            strHead += '</tr>';
        }
        $("#tblModalLichGiang thead").html(strHead);
        var arrSum = [8];
        var jsonForm = {
            strTable_Id: "tblModalLichGiang",
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": arrNoiDung
        };
        var iLength = arrHead.length;
        dataCot.forEach((e, index) => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="ketqua_' + aData.ID + '_' + main_doc.LopHocPhan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            })
            arrSum.push((index + iLength + 1));
        })
        jsonForm.colPos.center = jsonForm.colPos.center.concat(arrSum);
        edu.system.loadToTable_data(jsonForm);
        console.log(jsonForm.colPos.center);
        data.forEach(e => dataCot.forEach(ele => me.getList_KetQua2(e.ID, ele.TUKHOA, ele.ID)))

        //edu.system.insertSumAfterTable(jsonForm.strTable_Id, arrSum)
        //$("#tblModalLichGiang tfoot").css({ 'text-align': 'center' })
    },
    getList_KetQua2: function (strKLGD_DuLieu_Loai_Id, strTuKhoa, strTuKhoa_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_ThongTin/LayGiaTriTuKhoa',
            'type': 'GET',
            'strTuKhoa': strTuKhoa,
            'strKLGD_DuLieu_Loai_Id': strKLGD_DuLieu_Loai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult) $("#ketqua_" + strKLGD_DuLieu_Loai_Id + "_" + strTuKhoa_Id).html(dtReRult[0].GIATRITUKHOA)
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


    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_DotHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSThoiGianTheoKHChiTiet',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtKeHoachChung = dtReRult;
                    me.genCombo_DotHoc(dtReRult, data.Pager);
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
    genCombo_DotHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_DotHoc"],
            title: "Chọn đợt học theo TKB"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_DonViHP: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDonViPhuTrachHocPhan',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoachChiTiet'),
            'strDotHoc_Id': edu.util.getValById('dropSearch_DotHoc'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtKeHoachChung = dtReRult;
                    me.genCombo_DonViHP(dtReRult, data.Pager);
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
    genCombo_DonViHP: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_DonViHP"],
            title: "Chọn đơn vị phục trách học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HinhThucHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP',
            'func': 'pkg_klgv_v2_chung.LayDSHinhThucHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_HinhThucHoc(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HinhThucHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHINHTHUCHOC",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TENHINHTHUCHOC) + " - " + edu.util.returnEmpty(aData.MAHINHTHUCHOC);
                }
            },
            renderPlace: ["dropSearch_HinhThucHoc"],
            title: "Chọn hình thức học"
        };
        edu.system.loadToCombo_data(obj);

    },

    save_TinhKhoiLuong: function (strKLGD_DuLieu_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_TinhToan_MH/FSk0IgkoJC8VKC8pFS4gLwoNBgUeBTQNKCQ0',
            'func': 'PKG_KLGV_V2_TINHTOAN.ThucHienTinhToanKLGD_DuLieu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_KhongTKB: function (strKLGD_DuLieu_Id, dHanhDong) {
        var me = this;
        var objLHP = me.dtLopHocPhan.find(e => e.ID === strKLGD_DuLieu_Id);
        var strKLGD_KeHoachChiTiet_Id = objLHP ? objLHP.KLGD_KEHOACHCHITIET_ID : '';
        var obj_save = dHanhDong == "1"
            ? {
                'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgU0DSgkNB4KKS4vJhUKAwPP',
                'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_DuLieu_KhongTKB',
                'iM': edu.system.iM,
                'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
                'strKLGD_KeHoachChiTiet_Id': strKLGD_KeHoachChiTiet_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            }
            : {
                'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeBTQNKCQ0HgopLi8mFQoD',
                'func': 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_DuLieu_KhongTKB',
                'iM': edu.system.iM,
                'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
                'strKLGD_KeHoachChiTiet_Id': strKLGD_KeHoachChiTiet_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_XacNhanTuDong: function (strKLGD_DuLieu_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_TinhToan_MH/FSk0IgkoJC8ZICIPKSAvFTQFLi8m',
            'func': 'PKG_KLGV_V2_TINHTOAN.ThucHienXacNhanTuDong',
            'iM': edu.system.iM,
            'strKLGD_DuLieu_Id': strKLGD_DuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                var strKeHoachXuLy_Id = obj_save.strId;
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                    if (!obj_save.strId)
                        strKeHoachXuLy_Id = data.Id;
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
                //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                //});
                //me.getList_XacDinhPhamVi();
                //me.toggle_form();
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_XacDinhPhamVi();
                });
            },
            type: 'POST',
            contentType: true,
            async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ApDat: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/EjQgHgoNBgUeBTQNKCQ0HhIuDTQuLyYP',
            'func': 'PKG_KLGV_V2_KEHOACH.Sua_KLGD_DuLieu_SoLuong',
            'iM': edu.system.iM,
            'strId': me.strLopHocPhan_Id,
            'dSoLuongApDat': edu.system.getValById('txtSoLuongApDat'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ApDat: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4FRUKDQYFHgU0DSgkNAPP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayTTKLGD_DuLieu',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strDanhSach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var data = dtReRult[0];
                    me["strApDat_Id"] = data.ID;
                    edu.util.viewHTMLById("lblMaApDat", data.DULIEUXACNHAN_MA);
                    edu.util.viewHTMLById("lblTenApDat", data.DULIEUXACNHAN_TEN);
                    edu.util.viewHTMLById("lblQuyMoApDat", data.QUYMO);
                    edu.util.viewValById("txtSoLuongApDat", data.SOLUONGAPDAT);
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
}