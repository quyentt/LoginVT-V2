/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuyetDinh() { };
QuyetDinh.prototype = {
    dtQuyetDinh: [],
    strQuyetDinh_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    dtHocKy: [],
    dtHocPhan: [],
    strCoSo_Id: '',
    dtView: [],

    init: function () {
        var me = this;
        console.log(this.name);
        me["strHead"] = $("#tblHPCongNhan thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHANLOAI.COSODAOTAO", "dropPhanLoai");
        me.getList_CoSoDaoTao();
        me.getList_QuyetDinh();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        //me.getList_HinhThuc();
        me.getList_LoaiQuyetDinh();
        //me.getList_HocPhan();

        $("#btnSearch").click(function (e) {
            me.getList_QuyetDinh();
        });
        $("#txtSearch_QD").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuyetDinh();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAddQuyetDinh").click(function () {
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
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuyetDinh" });
        });
        $("#btnXoaQuyetDinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyetDinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyetDinh(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_QuyetDinh();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblQuyetDinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblQuyetDinh");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtQuyetDinh, "ID")[0];
                me.viewEdit_QuyetDinh(data);
                me.getList_ThongTin();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('#dropSearch_HeDaoTao_QD').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_QD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropQuyetDinh_Loai').on('select2:select', function (e) {
            me.getList_HinhThuc();
        });
        $('#dropSearch_HocPhan_Full').on('select2:select', function (e) {
            me.getList_SinhVien_QuyetDinh();
        });
        $("#MainContent").delegate(".ckbDSTrangThaiSV_QD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QD").each(function () {
                this.checked = checked_status;
            });
        });
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
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
        $("#btnXoa_QuyetDinh").click(function () {
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
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.LQD", "dropQuyetDinh_Loai");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.CQD", "dropQuyetDinh_Cap");
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtQuyetDinh_So", "THONGTIN1": "EM" },
        ];
        edu.system.uploadFiles(["txtQuyetDinh_File"]);

        edu.system.getList_MauImport("zonebtnSVQD");

        $("#btnThemDongMoi").click(function () {
            edu.extend.genModal_HocPhan(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    //edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                    arrChecked_Id.forEach(strSinhVien_Id => {
                        var objHocPhan = edu.extend.dtHocPhan.find(e => e.ID == strSinhVien_Id);
                        var strKetQua_Id = edu.util.randomString(30, "");
                        var iViTri = document.getElementById("tblCauHinhThongTin").getElementsByTagName('tbody')[0].rows.length + 1;
                        var aData = {};
                        var row = '';
                        row += '<tr id="' + strKetQua_Id + '" name="new">';
                        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
                        row += '<td><select id="dropThoiGian' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
                        row += '<td><input style="display: none" id="txtHocPhan' + strKetQua_Id + '" value="' + objHocPhan.DAOTAO_HOCPHAN_ID +'" />' + objHocPhan.TEN + ' - ' + objHocPhan.MA + '</td>';
                        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
                        row += '</tr>';
                        $("#tblCauHinhThongTin tbody").append(row);
                        me.genComBo_HocKy("dropThoiGian" + strKetQua_Id, aData.DAOTAO_THOIGIANDAOTAO_ID);
                    })
                }
            });
            edu.extend.getList_HocPhan("SEARCH");
        });
        //$("#btnThemDongMoi").click(function () {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThongTin(id, "");
        //});
        $("#tblCauHinhThongTin").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCauHinhThongTin tr[id='" + strRowId + "']").remove();
        });
        $("#tblCauHinhThongTin").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThongTin(strId);
            });
        });

        $("#tblQuyetDinh").delegate('.btnViewHocPhan', 'click', function (e) {
            var strId = this.id;
            me.strQuyetDinh_Id = strId;
            me.toggle_viewhocphan()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblQuyetDinh");
            if (edu.util.checkValue(strId)) {
                me.getList_HocPhan_QuyetDinh();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSave_QuyetDinh_HocPhan").click(function () {
            
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHPCongNhan .checkHocPhan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).attr("name") != $(x[i]).val()) {
                    if ($(x[i]).val() != "") {
                        arrThem.push(x[i]);
                    } else {
                        console.log($(x[i]).attr("title"))
                        if ($(x[i]).attr("title") != undefined ) arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>')
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_SinhVien_QuyetDinh(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_SinhVien_QuyetDinh(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        $("#btnSave_QuyetDinh_HocPhan_LuuLai").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHPCongNhan .checkHocPhan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).attr("name") || ($(x[i]).attr("name") != $(x[i]).val())) {
                    if ($(x[i]).val() != "") {
                        arrThem.push(x[i]);
                    } else {
                        console.log($(x[i]).attr("title"))
                        if ($(x[i]).attr("title") != undefined) arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>')
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_SinhVien_QuyetDinh(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_SinhVien_QuyetDinh(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnCoSoCongNhan").click(function () {
            me.toggle_CoSo();
        });

        $("#tblCoSoCongNhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_CoSoDaoTao(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddCoSo").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_CoSoDaoTao").click(function () {
            me.save_CoSoDaoTao();
        });
        $("#btnXoa_CoSoDaoTao").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoSoCongNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CoSoDaoTao(arrChecked_Id[i]);
                }
            });
        });
        
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCoSoCongNhan" });
        });


        $("#btnTaoDanhSachNhapDiem").click(function (e) {
            var strCoSo_Id = $("#dropSearch_CoSoDaoTao").val();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHPCongNhan", "checkX");
            var arrId = [];
            arrChecked_Id.forEach(strId => {
                var strTemp = $("#dropCoSo" + strId).val();
                if (!strTemp) {
                    arrId.push(strId)
                    //$("#dropCoSo" + strId).val(strCoSo_Id).trigger("change");
                }
            })
            arrId.forEach(e => {
                $("#dropCoSo" + e).val(strCoSo_Id).trigger("change");
            })
            setTimeout(function () {
                var arrThem = [];
                var arrXoa = [];
                var x = $("#tblHPCongNhan .checkHocPhan");
                for (var i = 0; i < x.length; i++) {
                    if ($(x[i]).attr("name") != $(x[i]).val()) {
                        if ($(x[i]).val() != "") {
                            arrThem.push(x[i]);
                        } else {
                            console.log($(x[i]).attr("title"))
                            if ($(x[i]).attr("title") != undefined) arrXoa.push(x[i]);
                        }
                    }
                }
                if ((arrThem.length + arrXoa.length) > 0) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>')
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_SinhVien_QuyetDinh2(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_SinhVien_QuyetDinh2(arrXoa[i]);
                    }
                } else {
                    me.save_TaoDanhSach();
                }
            }, 500);
        });

        $("#tblHPCongNhan").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            console.log(strClass);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#btnSave_ApDung").click(function (e) {
            var strCoSo_Id = $("#dropSearch_CoSoDaoTao").val();
            if (!edu.util.checkValue(strCoSo_Id)) {
                edu.system.alert("Vui lòng chọn cơ sở công nhận điểm trước khi điền?");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHPCongNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng tích chọn ô học phần cần điền (dùng ô check ở đầu bảng để chọn tất cả, hoặc ô check trên tiêu đề từng cột học phần)?");
                return;
            }
            var iDaDien = 0, iBoQua = 0;
            arrChecked_Id.forEach(strId => {
                var $drop = $("#dropCoSo" + strId);
                if (!$drop.length) return;
                var strTemp = $drop.val();
                if (!strTemp) {
                    $drop.val(strCoSo_Id).trigger("change");
                    iDaDien++;
                } else {
                    iBoQua++;
                }
            })
            edu.system.alert("Đã điền " + iDaDien + " ô." + (iBoQua > 0 ? " Bỏ qua " + iBoQua + " ô đã có cơ sở." : ""));
        });

        $("#btnAddKyHieuLuc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modalAddHocKy").modal("show");
        });
        $("#btnChonTrangThaiChuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên?");
                return;
            }
            me.cbGenCombo_TrangThaiChuyen(me.dtTrangThai);
            $("#modalChonTrangThai").modal("show");
        });
        $("#btnSave_TrangThaiChuyen").click(function () {
            var strTrangThai_Id = edu.util.getValById("dropTrangThaiChuyen");
            if (!edu.util.checkValue(strTrangThai_Id)) {
                edu.system.alert("Vui lòng chọn trạng thái?");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên?");
                return;
            }
            $("#modalChonTrangThai").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.capNhat_TrangThai_QD_NH(arrChecked_Id[i], strTrangThai_Id);
            }
        });
        $("#btnChonLopChuyen").click(function () {
            me.openModalChonLop("N1");
        });
        $("#btnChonLopN2Chuyen").click(function () {
            me.openModalChonLop("N2");
        });
        $('#dropChuyen_HeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao_Chuyen();
            me.getList_ChuongTrinh_Chuyen();
            me.getList_LopQuanLy_Chuyen();
        });
        $('#dropChuyen_KhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinh_Chuyen();
            me.getList_LopQuanLy_Chuyen();
        });
        $('#dropChuyen_ChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy_Chuyen();
        });
        $("#btnSave_LopChuyen").click(function () {
            var strLop_Id = edu.util.getValById("dropChuyen_Lop");
            if (!edu.util.checkValue(strLop_Id)) {
                edu.system.alert("Vui lòng chọn lớp?");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên?");
                return;
            }
            $("#modalChonLop").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            var fnSave = (me.chuyenLopMode === "N2") ? me.capNhat_LopQuanLy_N2_QD_NH : me.capNhat_LopQuanLy_QD_NH;
            for (var i = 0; i < arrChecked_Id.length; i++) {
                fnSave.call(me, arrChecked_Id[i], strLop_Id);
            }
        });
        $("#btnNhapPhanTramPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên?");
                return;
            }
            $("#txtPhanTramTinhPhi").val("");
            $("#modalNhapPhanTramPhi").modal("show");
        });
        $("#btnSave_PhanTramPhi").click(function () {
            var strPhanTram = $.trim($("#txtPhanTramTinhPhi").val());
            if (strPhanTram === "" || isNaN(strPhanTram)) {
                edu.system.alert("Vui lòng nhập số phần trăm hợp lệ?");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn sinh viên?");
                return;
            }
            $("#modalNhapPhanTramPhi").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.capNhat_PhanTramPhi_QD_NH(arrChecked_Id[i], strPhanTram);
            }
        });
        $("#btnSave_AddHocKy").click(function (e) {
            var arrHocKy = $("#dropAddHocKy").val();
            if (arrHocKy.length) {
                $("#modalAddHocKy").modal("hide");
                var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (arrChecked_Id.length * arrHocKy.length));
                arrChecked_Id.forEach(e => arrHocKy.forEach(ele => me.save_HocKy(me.dtSinhVien.find(ef => ef.ID == e).QLSV_NGUOIHOC_ID, ele)));
            }
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnHocKy', 'click', function (e) {
            var strId = this.id;
            $("#myModalHocKyApDung").modal("show");
            me.getList_SVHocKy(strId);
        });
        $("#btnDelete_HocKyApDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocKyApDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            $("#myModalHocKyApDung").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_SVHocKy(arrChecked_Id[i]);
            }
        });
    },

    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strCoSo_Id = "";
        edu.util.viewValById("txtMaCoSo", "");
        edu.util.viewValById("txtTenCoSo", "");
        edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("txtDiaChi", "");
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
            "txtQuyetDinh_NguoiKy", "txtQuyetDinh_ChuKy", "dropHinhThuc", "txtNgayHetHieuLuc"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtQuyetDinh_File", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblCauHinhThongTin tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuyetDinh();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_viewhocphan: function () {
        edu.util.toggle_overide("zone-bus", "zoneViewHocPhan");
    },
    toggle_CoSo: function () {
        edu.util.toggle_overide("zone-bus", "zoneCoSo");
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
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_QD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
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
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
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
        var me = main_doc.QuyetDinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QD", "dropAddHocKy"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QD").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
        me.dtHocKy = data;
        me.genComBo_HocKy('dropHocKyFull', '');
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
            renderPlace: ["dropThoiGianDaoTao_QD"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.QuyetDinh.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_QD_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_QD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
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
            renderPlace: ["dropSearch_NamNhapHoc_QD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_QD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QD").val("").trigger("change");
    },
    getList_MauImport: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_Import_PhanQuyen/LayDanhSach',            

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.strApp_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
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
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_LHD" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_LHD").html(row);
    },
    getList_QuyetDinh: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/DSA4BRIQDRIXHhA0OCQ1BSgvKQPP',
            'func': 'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_QD'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_QD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_QD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_QD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_QD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_QD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_QD"),
            'strTrangThaiNguoiHoc_Id': "",
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh_QD'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_ThoiGianDaoTao_QD'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strTuNgayQD': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgayQD': edu.util.getValById('txtSearch_DenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuyetDinh = dtReRult;
                    me.genTable_QuyetDinh(dtReRult, data.Pager);
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
    save_QuyetDinh: function () {
        var me = this;
        var obj_save = {
			'action': 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKQPP',
			'func': 'PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh',
			'iM' : edu.system.iM,
            'strId': me.strQuyetDinh_Id,
            'strHinhThucQuyetDinh_Id': edu.util.getValById('dropHinhThuc'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Loai'),
            'strSoQuyetDinh': edu.util.getValById('txtQuyetDinh_So'),
            'strNgayQuyetDinh': edu.util.getValById('txtQuyetDinh_Ngay'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Cap'),
            'strNgayHieuLuc': edu.util.getValById('txtQuyetDinh_NgayHieuLuc'),
            'strNguyenNhan_LyDo': edu.util.getValById('txQuyetDinh_MoTa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_QD'),
			'strNgayHetHieuLuc' : edu.system.getValById('txtNgayHetHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'SV_QuyetDinh_MH/EjQgHhANEhceEDQ4JDUFKC8p'
            obj_save.func = 'PKG_HOSOHOCVIEN_QUYETDINH.Sua_QLSV_QuyetDinh';
        }        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyetDinh_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strQuyetDinh_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strQuyetDinh_Id = obj_save.strId
                    }
                    edu.system.saveFiles("txtQuyetDinh_File", strQuyetDinh_Id, "SV_Files");
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strQuyetDinh_Id);
                        }
                    });
                    $("#tblCauHinhThongTin tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new") {
                            me.save_ThongTin(strKetQua_Id, strQuyetDinh_Id);
                        }
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }                
                me.getList_QuyetDinh();
            },
            error: function (er) {
                edu.system.alert("SV_QuyetDinh/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyetDinh: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_QuyetDinh/Xoa',            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_QuyetDinh();
                }
                else {
                    obj = {
                        content: "SV_QuyetDinh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
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
    genTable_QuyetDinh: function (data, iPager) {
        var me = this;
        $("#lblQuyetDinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            bPaginate: {
                strFuntionName: "main_doc.QuyetDinh.getList_QuyetDinh()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                },
                {
                    "mDataProp": "SOQUYETDINH",
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "CAPQUYETDINH_TEN"
                },
                {
                    "mDataProp": "NGUYENNHAN_LYDO"
                },
                {
                    "mData": "SOLUONG",

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewHocPhan" id="' + aData.ID + '" title="Sửa">' + edu.util.returnEmpty(aData.SOLUONG) + '</a></span>';
                    }
                },
                {
                    "mData": "KHOAQUANLY_TEN",
                    "mRender": function (nRow, aData) {
                        return '<div id="lblFile' + aData.ID + '"></div>';
                    }
                },
                {
                    "mDataProp": "THOIGIAN",
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS",
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN",
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
        let iTong = 0;
        for (var i = 0; i < data.length; i++) {
            iTong += data[i].SOLUONG;
            edu.system.viewFiles("lblFile" + data[i].ID, data[i].ID, "SV_Files");
        }
        $("#tblQuyetDinh tfoot").html('<tr><td colspan="6"></td><td class="td-center">' + iTong + '</td><td colspan="3"></td></tr>')
        //edu.system.insertSumAfterTable(jsonForm.strTable_Id, [6])
    },
    viewEdit_QuyetDinh: function (data) {
        var me = this;
        edu.util.viewValById("dropQuyetDinh_Loai", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("dropQuyetDinh_Cap", data.CAPQUYETDINH_ID);
        edu.util.viewValById("dropThoiGianDaoTao_QD", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtQuyetDinh_So", data.SOQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_Ngay", data.NGAYQUYETDINH);
        edu.util.viewValById("txtQuyetDinh_NgayHieuLuc", data.NGAYHIEULUC);
        edu.util.viewValById("txtNgayHetHieuLuc", data.NGAYHETHIEULUC);
        edu.util.viewValById("txQuyetDinh_MoTa", data.NGUYENNHAN_LYDO);
        me.strHinhThuc_Preselect = data.HINHTHUCQUYETDINH_ID;
        me.getList_HinhThuc();
        edu.system.viewFiles("txtQuyetDinh_File", data.ID, "SV_Files");
        me.strQuyetDinh_Id = data.ID;
        me.getList_SinhVien();
    },

    getList_SinhVien: function () {
        var me = main_doc.QuyetDinh;
        var obj_list = {
            'action': 'SV_QuyetDinh_NguoiHoc/LayDanhSach',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': "",
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
                    me["dtSinhVien"] = dtResult;
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_QuyetDinh_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKR4PJjQuKAkuIgPP',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh_NguoiHoc',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_QuyetDinh_Id': strQLSV_QuyetDinh_Id,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ToChucCT_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strTrack_Id': aData.TRACK_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm sinh viên thành công!");
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

        var obj_delete = {
            'action': 'SV_QuyetDinh_MH/GS4gHhANEhceEDQ4JDUFKC8pHg8mNC4oCS4i',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.Xoa_QLSV_QuyetDinh_NguoiHoc',
            'iM': edu.system.iM,
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_SinhVien();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            action: obj_delete.action,            
            contentType: true,            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].SINHVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_MASO + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM + " " + data[i].QLSV_NGUOIHOC_TEN + "</span></td>"; 
            html += "<td class='td-left'><span>" + data[i].DAOTAO_LOPQUANLY_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHOMLOP_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_KHOADAOTAO_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].TRANGTHAINGUOIHOC_MOI_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_MOI_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].PHAMTRAMTINHPHI) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_N2_TEN) + "</span></td>";
            html += '<td class="td-left"><span><a class="btn btn-default btnHocKy" id="' + data[i].QLSV_NGUOIHOC_ID + '" title="Chi tiết">' + edu.util.returnEmpty(data[i].DSKETQUANHIEUKY) + '</a></span></td>';
            html += "<td class='td-center'><input type='checkbox' id='checkX" + data[i].ID + "'/></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].SINHVIEN_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.QuyetDinh;
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
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + edu.util.returnEmpty(aData.NHOMLOP_TEN) + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-left'></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.QuyetDinh;
        console.log(strNhanSu_Id);
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="14">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    getList_HinhThuc: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDSHinhThucQuyetDinh',
            'type': 'GET',
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Loai'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HinhThuc(json);
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
    cbGenCombo_HinhThuc: function (data) {
        var me = main_doc.QuyetDinh;
        if (data.length === 0) $("#dropHinhThuc").parent().parent().hide();
        else $("#dropHinhThuc").parent().parent().show();
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHinhThuc"],
            type: "",
            title: "Chọn hình thức",
        }
        edu.system.loadToCombo_data(obj);
        if (me.strHinhThuc_Preselect) {
            edu.util.viewValById("dropHinhThuc", me.strHinhThuc_Preselect);
            me.strHinhThuc_Preselect = "";
        }
    },

    getList_LoaiQuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh',
            'type': 'GET',
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
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
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


    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_ThongTin: function (strKetQua_Id, strQLSV_QuyetDinh_Id) {
        var me = this;
        var strId = strKetQua_Id;
        //var strTruongThongTin_Id = edu.util.getValById('dropHocPhan' + strKetQua_Id);
        //if (!edu.util.checkValue(strTruongThongTin_Id)) {
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_QuyetDinh_HocPhan/Them_QLSV_QuyetDinh_HocPhan',
            'type': 'POST',
            'strQLSV_QuyetDinh_Id': strQLSV_QuyetDinh_Id,
            'strXauCongThuc': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('txtHocPhan' + strKetQua_Id),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'SV_QuyetDinh_HocPhan/Them_QLSV_QuyetDinh_HocPhan';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
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
    getList_ThongTin: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_HocPhan/LayDSQLSV_QuyetDinh_HocPhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
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
                    me.genHTML_ThongTin_Data(dtResult);
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
    delete_ThongTin: function (strIds) {
        var me = this;
        var obj = {};
        var obj_save = {
            'action': 'SV_QuyetDinh_HocPhan/Xoa_QLSV_QuyetDinh_HocPhan',
            'type': 'POST',
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.genHTML_ThongTin_Data(data.Data);
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_ThongTin_Data: function (data) {
        var me = this;
        $("#tblCauHinhThongTin tbody").html("");
        var strHtmlHocPhan = $("#dropHocPhanFull").html();
        var strHtmlHocKy = $("#dropHocKyFull").html();
        var row = '';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td>' + edu.util.returnEmpty(aData.THOIGIAN) + '</td>';
            row += '<td>' + aData.DAOTAO_HOCPHAN_TEN + " - " + aData.DAOTAO_HOCPHAN_MA +'</td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
        }
        $("#tblCauHinhThongTin tbody").html(row);
        //data.forEach(e => { 
        //    //me.genComBo_HocKy("dropThoiGian" + strKetQua_Id, aData.DAOTAO_THOIGIANDAOTAO_ID);
        //    //me.genComBo_HocPhan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_HOCPHAN_ID);
        //    //$("#dropHocPhan" + e.ID).select2();
        //    //$("#dropHocPhan" + e.ID).val(aData.DAOTAO_HOCPHAN_ID).trigger("change");
        //})
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        }
    },
    genHTML_ThongTin: function (strKetQua_Id) {
        var me = this;
        //var iViTri = document.getElementById("tblCauHinhThongTin").getElementsByTagName('tbody')[0].rows.length + 1;
        //var aData = {};
        //var row = '';
        //row += '<tr id="' + strKetQua_Id + '">';
        //row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        //row += '<td><select id="dropThoiGian' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        //row += '<td><select id="dropHocPhan' + strKetQua_Id + '" class="select-opt"><option value=""><option value=""> --- Chọn thông tin--</option ></select ></td>';
        //row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        //row += '</tr>';
        //$("#tblCauHinhThongTin tbody").append(row);
        //me.genComBo_HocKy("dropThoiGian" + strKetQua_Id, aData.DAOTAO_THOIGIANDAOTAO_ID);
        //me.genComBo_HocPhan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_HOCPHAN_ID);
    },
    genComBo_HocKy: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHocKy,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_HocPhan: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHocPhan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.MA) + " - " + edu.util.returnEmpty(aData.TEN)
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn trường thông tin"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',


            'strTuKhoa': "",
            'strDaoTao_MonHoc_Id': "",
            'strThuocBoMon_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.dtHocPhan = dtResult;
                    me.genComBo_HocPhan('dropHocPhanFull', "");
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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/

    getList_HocPhan_QuyetDinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh',
            'type': 'GET',
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
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
                    me["dtHocPhan_QuyetDinh"] = dtResult;
                    //me.getList_SinhVien_QuyetDinh();
                    me.cbGenCombo_HocPhan_QuyetDinh(dtResult);
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

    cbGenCombo_HocPhan_QuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocPhan_Full"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_SinhVien_QuyetDinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_QuyetDinh_NguoiHoc/LayDanhSach',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': "",
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
                    me["dtSinhVien_QuyetDinh"] = dtResult;
                    me.genTable_SinhVien_QuyetDinh(dtResult);
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
    getData_SinhVien_QuyetDinh: function (jsonSV, strDaoTao_HocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CoSoCongNhanDiem/LayKQCongNhanHocPhan',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': jsonSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        var inputCheck = $("#dropCoSo" + jsonSV.ID + "_" + dtReRult[i].DAOTAO_HOCPHAN_ID);
                        //me.genComBo_CoSoDaoTao("dropCoSo" + jsonSV.ID + "_" + dtReRult[i].DAOTAO_HOCPHAN_ID, dtReRult[i].DIEM_COSODAOTAOCONGNHANDIEM_ID)
                        inputCheck.val(dtReRult[i].DIEM_COSODAOTAOCONGNHANDIEM_ID).trigger("change");
                        inputCheck.attr("name", dtReRult[i].DIEM_COSODAOTAOCONGNHANDIEM_ID);
                        inputCheck.attr("title", dtReRult[i].ID);
                        if (dtReRult[i].DIEM_COSODAOTAOCONGNHANDIEM_ID) {
                            $("#checkX" + jsonSV.ID + "_" + dtReRult[i].DAOTAO_HOCPHAN_ID).attr("checked", "checked");
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_SinhVien_QuyetDinh: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(8);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien_QuyetDinh, "ID");
        //--Edit
        var obj_save = {
            'action': 'D_CoSoCongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': arrId[1],
            'strDiem_CoSoCongNhan_Id': $(point).val(),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        var me = main_doc.QuyetDinh;
        me.getList_SinhVien_QuyetDinh();
    },
    delete_SinhVien_QuyetDinh: function (point) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strIds': $(point).attr("title"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa quyền thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    save_SinhVien_QuyetDinh2: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(8);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien_QuyetDinh, "ID");
        //--Edit
        var obj_save = {
            'action': 'D_CoSoCongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': arrId[1],
            'strDiem_CoSoCongNhan_Id': $(point).val(),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_TaoDanhSach();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_SinhVien_QuyetDinh2: function (point) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap',
            'type': 'POST',
            'strIds': $(point).attr("title"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Xóa quyền thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: 'POST',
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_TaoDanhSach();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_SinhVien_QuyetDinh: function (data, iPager) {
        var me = this;
        $("#tblHPCongNhan thead").html(me.strHead);
        var arrHocPhan_Id = $("#dropSearch_HocPhan_Full").val();
        var dtView = [];
        arrHocPhan_Id.forEach(e => {
            var x = me.dtHocPhan_QuyetDinh.find(ele => ele.ID === e);
            if (x) dtView.push(x)
        })
        me.dtView = dtView;
        var row = '';
        for (var i = 0; i < dtView.length; i++) {
            row += '<th class="td-center">' + edu.util.returnEmpty(dtView[i].MA) + " - " + edu.util.returnEmpty(dtView[i].TEN) + '<input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + dtView[i].ID + '" /></th>';
        }
        $("#tblHPCongNhan thead tr:eq(1)").append(row);
        document.getElementById("lblHPCongNhan").colSpan = dtView.length;

        var jsonForm = {
            strTable_Id: "tblHPCongNhan",

            aaData: data,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    // Check all theo hàng (SV) - để ngay sau Stt, khớp với th chkSystemSelectAll ở đầu thead
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + aData.ID + '"/>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                }
            ]
        };
        for (var i = 0; i < dtView.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<div style="width: calc(100% - 50px)"><select class="select-opt checkHocPhan" id="dropCoSo' + aData.ID + '_' + main_doc.QuyetDinh.dtView[iThuTu].ID + '" ></select></div> <input style="width: 48px" type="checkbox" id="checkX' + aData.ID + '_' + main_doc.QuyetDinh.dtView[iThuTu].ID + '" class="check' + aData.ID + ' check' + main_doc.QuyetDinh.dtView[iThuTu].ID + '" />';
                        
                }
            });
        }
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            dtView.forEach(ele => {
                me.genComBo_CoSoDaoTao("dropCoSo" + e.ID + '_' + ele.ID)
            })
        })
        //edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        for (var i = 0; i < data.length; i++) {
            me.getData_SinhVien_QuyetDinh(data[i]);
        }
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CoSoDaoTao: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_CoSoCongNhanDiem/Them_Diem_CoSoCongNhanDiem',
            'type': 'POST',
            'strId': me.strCoSo_Id,
            'strMa': edu.util.getValById('txtMaCoSo'),
            'strTen': edu.util.getValById('txtTenCoSo'),
            'strDiaChi': edu.util.getValById('txtDiaChi'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'D_CoSoCongNhanDiem/Sua_Diem_CoSoCongNhanDiem';
        }
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
                    me.getList_CoSoDaoTao();
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
    getList_CoSoDaoTao: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CoSoCongNhanDiem/LayDSDiem_CoSoCongNhanDiem',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCoSo"] = dtReRult;
                    me.genTable_CoSoDaoTao(dtReRult, data.Pager);
                    //me.genTable_CoSoDaoTao(dtReRult, data.Pager);
                    me.genComBo_CoSoDaoTao2("dropSearch_CoSoDaoTao");
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
    delete_CoSoDaoTao: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_CoSoCongNhanDiem/Xoa_Diem_CoSoCongNhanDiem',
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
                    me.getList_CoSoDaoTao();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CoSoDaoTao: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblCoSoCongNhan",
            aaData: data,
            colPos: {
                center: [0, 5, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "DIACHI"
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
        /*III. Callback*/
    },
    viewForm_CoSoDaoTao: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtCoSo, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMaCoSo", data.MA);
        edu.util.viewValById("txtTenCoSo", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("txtDiaChi", data.DIACHI);
        me.strCoSo_Id = data.ID;
    },

    genComBo_CoSoDaoTao2: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCoSo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                selectFirst: true
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn cơ sở"
        };
        edu.system.loadToCombo_data(obj);
    },

    genComBo_CoSoDaoTao: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCoSo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn cơ sở"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    save_TaoDanhSach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_PhanQuyen/PhanQuyen_TaoDSTheoQuyetDinh',
            'type': 'POST',
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.getList_HocPhan_QuyetDinh();
                    $("#tblHPCongNhan tbody").html("")
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

    save_HocKy: function (strQLSV_NguoiHoc_Id, strDaoTao_ThoiGianDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/FSkkLB4QDRIXHhAFHhUpLigGKCAv',
            'func': 'pkg_hososinhvien_thongtin.Them_QLSV_QD_ThoiGian',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
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
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    cbGenCombo_TrangThaiChuyen: function (data) {
        var obj = {
            data: data || [],
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTrangThaiChuyen"],
            type: "",
            title: "Chọn trạng thái",
        };
        edu.system.loadToCombo_data(obj);
        $("#dropTrangThaiChuyen").val("").trigger("change");
    },
    getList_HeDaoTao_Chuyen: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao_Chuyen);
    },
    cbGenCombo_HeDaoTao_Chuyen: function (data) {
        var obj = {
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENHEDAOTAO", code: "", avatar: "" },
            renderPlace: ["dropChuyen_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropChuyen_HeDaoTao").val("").trigger("change");
    },
    getList_KhoaDaoTao_Chuyen: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValById("dropChuyen_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao_Chuyen);
    },
    cbGenCombo_KhoaDaoTao_Chuyen: function (data) {
        var obj = {
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENKHOA", code: "", avatar: "" },
            renderPlace: ["dropChuyen_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropChuyen_KhoaDaoTao").val("").trigger("change");
    },
    getList_ChuongTrinh_Chuyen: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValById("dropChuyen_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinh_Chuyen);
    },
    cbGenCombo_ChuongTrinh_Chuyen: function (data) {
        var obj = {
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENCHUONGTRINH", code: "", avatar: "" },
            renderPlace: ["dropChuyen_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropChuyen_ChuongTrinh").val("").trigger("change");
    },
    getList_LopQuanLy_Chuyen: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValById("dropChuyen_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropChuyen_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuyen_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy_Chuyen);
    },
    cbGenCombo_LopQuanLy_Chuyen: function (data) {
        var obj = {
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
            renderPlace: ["dropChuyen_Lop"],
            type: "",
            title: "Chọn lớp",
        };
        edu.system.loadToCombo_data(obj);
        $("#dropChuyen_Lop").val("").trigger("change");
    },
    openModalChonLop: function (mode) {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn sinh viên?");
            return;
        }
        me.chuyenLopMode = mode;
        $("#lblChonLopMode").text(mode === "N2" ? "Chọn lớp ngành 2" : "Chọn lớp cần chuyển");
        me.getList_HeDaoTao_Chuyen();
        me.getList_KhoaDaoTao_Chuyen();
        me.getList_ChuongTrinh_Chuyen();
        me.getList_LopQuanLy_Chuyen();
        $("#modalChonLop").modal("show");
    },
    capNhat_LopQuanLy_QD_NH: function (strQLSV_QD_NguoiHoc_Id, strDaoTao_LopQuanLy_Moi_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/AiAxDykgNR4NLjEQNCAvDTgeEAUeDwkP',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.CapNhat_LopQuanLy_QD_NH',
            'iM': edu.system.iM,
            'strQLSV_QD_NguoiHoc_Id': strQLSV_QD_NguoiHoc_Id,
            'strDaoTao_LopQuanLy_Moi_Id': strDaoTao_LopQuanLy_Moi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    capNhat_LopQuanLy_N2_QD_NH: function (strQLSV_QD_NguoiHoc_Id, strDaoTao_LopQuanLy_N2_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/AiAxDykgNR4NLjEQNCAvDTgeD3MeEAUeDwkP',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.CapNhat_LopQuanLy_N2_QD_NH',
            'iM': edu.system.iM,
            'strQLSV_QD_NguoiHoc_Id': strQLSV_QD_NguoiHoc_Id,
            'strDaoTao_LopQuanLy_N2_Id': strDaoTao_LopQuanLy_N2_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    capNhat_PhanTramPhi_QD_NH: function (strQLSV_QD_NguoiHoc_Id, dPhamTramTinhPhi) {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/AiAxDykgNR4RKSAvFTMgLBEpKB4QBR4PCQPP',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.CapNhat_PhanTramPhi_QD_NH',
            'iM': edu.system.iM,
            'strQLSV_QD_NguoiHoc_Id': strQLSV_QD_NguoiHoc_Id,
            'dPhamTramTinhPhi': dPhamTramTinhPhi,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    capNhat_TrangThai_QD_NH: function (strQLSV_QD_NguoiHoc_Id, strTrangThaiNguoiHoc_Moi_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_QuyetDinh_MH/AiAxDykgNR4VMyAvJhUpICgeEAUeDwkP',
            'func': 'PKG_HOSOHOCVIEN_QUYETDINH.CapNhat_TrangThai_QD_NH',
            'iM': edu.system.iM,
            'strQLSV_QD_NguoiHoc_Id': strQLSV_QD_NguoiHoc_Id,
            'strTrangThaiNguoiHoc_Moi_Id': strTrangThaiNguoiHoc_Moi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_SVHocKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/DSA4BRIKJDUQNCAPKSgkNAo4',
            'func': 'pkg_hososinhvien_thongtin.LayDSKetQuaNhieuKy',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strQLSV_QuyetDinh_Id': me.strQuyetDinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSVHocKy"] = dtReRult;
                    me.genTable_SVHocKy(dtReRult, data.Pager);
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
    genTable_SVHocKy: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocKyApDung",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [

                {
                    "mDataProp": "THOIGIAN"
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
    delete_SVHocKy: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/GS4gHhANEhceEAUeFSkuKAYoIC8P',
            'func': 'pkg_hososinhvien_thongtin.Xoa_QLSV_QD_ThoiGian',
            'iM': edu.system.iM,
            'strId': strId,
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
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}