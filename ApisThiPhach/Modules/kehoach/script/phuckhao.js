    /*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhucKhao() { };
PhucKhao.prototype = {
    dtPhucKhao: [],
    dtPhucKhao_Full: [],
    isThongKe_KhoaQLHP_Visible: false,
    strPhucKhao_Id: '',
    dtXacNhan: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGian();
        me.getList_HocPhan();
        me.getList_ThoiGianPK();
        //me.getList_PhucKhao();
        edu.system.loadToCombo_DanhMucDuLieu("THI.PHUCKHAO.TINHTRANG", "dropSearch_KetQuaDuyet", "", main_doc.PhucKhao.loadBtnXacNhan);
        $("#btnSearch").click(function (e) {
            me.getList_PhucKhao();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhucKhao();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_HocPhan();
            //me.getList_PhucKhao();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            //me.getList_PhucKhao();
        });

        // Filter thống kê theo khoa QLHP (client-side)
        $("#dropFilter_KhoaQLHP").on('change', function () {
            me.applyFilter_KhoaQLHP();
        });

        $("#btnToggleThongKe_KhoaQLHP").on('click', function (e) {
            e.preventDefault();
            me.toggleThongKe_KhoaQLHP();
        });
       
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i], strTinhTrang, strMoTa, "DUYETDANGKYPHUCKHAO");
            }
        });
        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhan(arrChecked_Id[0], "DUYETDANGKYPHUCKHAO", "tblModal_XacNhan")
        });

        edu.system.getList_MauImport("zonebtnBaoCao_PK", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_HocPhan"));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValCombo("dropHeDaoTao_PK"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strPhucKhao_Id", e));
        });
        edu.extend.genBoLoc_HeKhoa("_PK")

        $("#btnAdd_PhucKhao").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneEdit");
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $('#dropSearch_ThoiGianPhucKhao').on('select2:select', function (e) {
            me.getList_ThoiGianPhucKhao();
            me.getList_DotThi();
        });
        $("#btnSearch").click(function (e) {
            me.getList_PhucKhao();
        });
        $("#btnSearchThoiGianPhucKhao").click(function (e) {
            me.getList_ThoiGianPhucKhao();
        });
        $("#tblThoiGianPhucKhao").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtThoiGianPhucKhao.find(e => e.ID == strId);
            me["strThoiGianPhucKhao_Id"] = data.ID;
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            edu.util.viewValById("txtNgayHetHan", data.NGAYHETHANTHUPHI);
            $("#myModalThoiGianPhucKhao").modal("show");
        });
        $("#btnAdd_ThoiGianPhucKhao").click(function () {
            var data = {};
            me["strThoiGianPhucKhao_Id"] = data.ID;
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            edu.util.viewValById("txtNgayHetHan", data.NGAYHETHANTHUPHI);
            $("#myModalThoiGianPhucKhao").modal("show");
        });
        $("#btnSave_ThoiGianPhucKhao").click(function () {
            if (me.strThoiGianPhucKhao_Id) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", 1);
                me.save_ThoiGianPhucKhao(me.dtThoiGianPhucKhao.find(e => e.ID == me.strThoiGianPhucKhao_Id).PHAMVIAPDUNG_ID);
                //setTimeout(function () {
                //    me.getList_ThoiGianPhucKhao();
                //}, 5000)
            } else {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblModalPhamViPhucKhao", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng?");
                    return;
                }
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThoiGianPhucKhao(arrChecked_Id[i]);
                }
            }
        });
        $("#btnDelete_ThoiGianPhucKhao").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThoiGianPhucKhao", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThoiGianPhucKhao(arrChecked_Id[i]);
                }
            });
        });
    },

    toggleThongKe_KhoaQLHP: function () {
        var me = this;
        me.isThongKe_KhoaQLHP_Visible = !me.isThongKe_KhoaQLHP_Visible;

        if (me.isThongKe_KhoaQLHP_Visible) {
            $("#rowThongKe_KhoaQLHP").show();
            $("#btnToggleThongKe_KhoaQLHP").text("Ẩn thống kê theo khoa QLHP");
            me.renderThongKe_KhoaQLHP(me.dtPhucKhao_Full);
        } else {
            $("#rowThongKe_KhoaQLHP").hide();
            $("#btnToggleThongKe_KhoaQLHP").text("Thống kê theo khoa QLHP");
        }
    },

    setTongBanGhi: function (iPager, data) {
        var total = 0;
        if (typeof iPager === "number") total = iPager;
        else if (iPager && typeof iPager === "string" && iPager.trim() !== "") total = iPager;
        else if (Array.isArray(data)) total = data.length;
        $("#lblXacNhan_Tong").html(total);
    },

    getKhoaQLHP_Ten: function (row) {
        var ten = row ? row.DAOTAO_KHOAQUANLYHP_TEN : "";
        ten = (ten == null) ? "" : ("" + ten).trim();
        return ten || "(Chưa xác định)";
    },

    populateFilter_KhoaQLHP: function (data) {
        var me = this;
        var seen = {};
        var items = [];
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                var ten = me.getKhoaQLHP_Ten(data[i]);
                if (!seen[ten]) {
                    seen[ten] = true;
                    items.push(ten);
                }
            }
        }

        items.sort(function (a, b) {
            return a.localeCompare(b);
        });

        var current = edu.util.getValById("dropFilter_KhoaQLHP");
        var html = '<option value="">Tất cả</option>';
        for (var j = 0; j < items.length; j++) {
            var val = items[j].replace(/"/g, '&quot;');
            html += '<option value="' + val + '">' + items[j] + '</option>';
        }
        $("#dropFilter_KhoaQLHP").html(html);

        // Giữ lựa chọn hiện tại nếu còn tồn tại
        if (current) {
            $("#dropFilter_KhoaQLHP").val(current);
        }
        if ($.fn.select2) {
            try {
                $("#dropFilter_KhoaQLHP").trigger('change.select2');
            } catch (e) { }
        } else {
            $("#dropFilter_KhoaQLHP").trigger('change');
        }
    },

    renderThongKe_KhoaQLHP: function (data) {
        var me = this;
        var total = Array.isArray(data) ? data.length : 0;
        var selected = edu.util.getValById("dropFilter_KhoaQLHP") || "Tất cả";
        var filtered = me.getFilteredData_KhoaQLHP().length;
        $("#lblThongKe_KhoaQLHP").html('Đang chọn: <b>' + selected + '</b> — Hiển thị: <b>' + filtered + '</b> / Tổng: <b>' + total + '</b>');

        // Nếu đang ẩn chi tiết thì chỉ cập nhật dòng tổng hợp
        if (!me.isThongKe_KhoaQLHP_Visible || !$("#rowThongKe_KhoaQLHP").is(":visible")) return;

        var map = {};
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                var key = me.getKhoaQLHP_Ten(data[i]);
                map[key] = (map[key] || 0) + 1;
            }
        }

        var keys = Object.keys(map);
        keys.sort(function (a, b) {
            return map[b] - map[a];
        });

        var maxVal = 0;
        for (var mi = 0; mi < keys.length; mi++) {
            var vv = map[keys[mi]] || 0;
            if (vv > maxVal) maxVal = vv;
        }

        var row = '';
        row += '<div class="table-responsive">';
        row += '<table class="table table-bordered table-hover" style="margin-bottom:0;">';
        row += '<thead><tr><th>Khoa QLHP</th><th style="width:120px" class="text-center">Số đơn</th></tr></thead>';
        row += '<tbody>';
        if (keys.length === 0) {
            row += '<tr><td colspan="2" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
        } else {
            for (var j = 0; j < keys.length; j++) {
                var k = keys[j];
                row += '<tr>';
                row += '<td>' + k + '</td>';
                row += '<td class="text-center">' + map[k] + '</td>';
                row += '</tr>';
            }
        }
        row += '</tbody></table></div>';
        $("#zoneThongKe_KhoaQLHP").html(row);

        // Biểu đồ cột ngang (progress bar)
        var chart = '';
        chart += '<div class="table-responsive">';
        chart += '<table class="table table-bordered table-hover" style="margin-bottom:0;">';
        chart += '<thead><tr><th colspan="3">Biểu đồ</th></tr></thead>';
        chart += '<tbody>';
        if (keys.length === 0) {
            chart += '<tr><td colspan="3" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
        } else {
            for (var ci = 0; ci < keys.length; ci++) {
                var name = keys[ci];
                var count = map[name] || 0;
                var pct = (maxVal > 0) ? Math.round((count * 100) / maxVal) : 0;
                if (count > 0 && pct < 2) pct = 2;
                chart += '<tr>';
                chart += '<td style="width: 45%;">' + name + '</td>';
                chart += '<td style="width: 45%;">';
                chart += '<div class="progress" style="margin-bottom: 0; height: 10px;">';
                chart += '<div class="progress-bar progress-bar-info" role="progressbar" style="width:' + pct + '%"></div>';
                chart += '</div>';
                chart += '</td>';
                chart += '<td style="width: 10%;" class="text-center">' + count + '</td>';
                chart += '</tr>';
            }
        }
        chart += '</tbody></table></div>';
        $("#zoneBieuDo_KhoaQLHP").html(chart);
    },

    getFilteredData_KhoaQLHP: function () {
        var me = this;
        var selected = edu.util.getValById("dropFilter_KhoaQLHP");
        var source = Array.isArray(me.dtPhucKhao_Full) ? me.dtPhucKhao_Full : [];
        if (!selected) return source;

        var out = [];
        for (var i = 0; i < source.length; i++) {
            if (me.getKhoaQLHP_Ten(source[i]) === selected) out.push(source[i]);
        }
        return out;
    },

    applyFilter_KhoaQLHP: function () {
        var me = this;
        var filtered = me.getFilteredData_KhoaQLHP();
        me.genTable_PhucKhao(filtered);
        me.renderThongKe_KhoaQLHP(me.dtPhucKhao_Full);
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    loadBtnXacNhan: function (data) {
        main_doc.PhucKhao.dtXacNhan = data;
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

    getList_BtnXacNhan: function (strDuLieuXacNhan, strLoaiXacNhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_PhucKhao/LayDSThi_PhucKhao_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strDuLieuXacNhan,
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnXacNhan(dtReRult, data.Pager);
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
    },    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhan: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan_Id) {
        var me = this;
        var obj_list = {
            'action': 'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strTinhTrang_Id': strTinhTrang_Id,
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
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhucKhao();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhan: function (strDuLieuXacNhan, strLoaiXacNhan_Id, strTable_Id) {
        var me = this;
        var obj_save = {
            'action': 'TP_PhucKhao/LayDSThi_PhucKhao_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strDuLieuXacNhan,
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
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

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhucKhao: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4BRIVKSgRKTQiCikgLgPP',
            'func': 'pkg_thi_phach_phuckhao.LayDSThiPhucKhao',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNgayHetHanDangKy': edu.util.getValById('txtNgayHetHanDangKy'),
            'strNgayHetHanNopPhi': edu.util.getValById('txtNgayHetHanNopPhi'),
            'strTinhTrangNopPhi': edu.util.getValById('dropSearch_PhiPhucKhao'),
            'strTinhTrang_Duyet_Id': edu.util.getValById('dropSearch_KetQuaDuyet'),
            'dChuaCoTrangThaiDuyetNao': $('#dTrangThaiDuyet').is(":checked") ? 1 : 0,
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_PK'),
        };
        if (!obj_save.strDaoTao_HeDaoTao_Id) {
            edu.system.alert("Bạn cần chọn hệ đào tạo");
            return;
        }
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNhapDiem = dtReRult;
                    me.dtPhucKhao_Full = dtReRult || [];
                    me.setTongBanGhi(data.Pager, me.dtPhucKhao_Full);
                    me.populateFilter_KhoaQLHP(me.dtPhucKhao_Full);
                    me.applyFilter_KhoaQLHP();
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_PhucKhao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSThi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
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
                    "mDataProp": "QLSV_NGUOIHOC_EMAIL"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLYSV_TEN",
                },
                {
                    "mDataProp": "TUI",
                },
                {
                    "mDataProp": "SOPHACH",
                },
                {
                    "mDataProp": "SOBAODANH",
                },
                {
                    "mDataProp": "CATHI_TEN",
                },
                {
                    "mDataProp": "PHONGTHI_TEN",
                },
                {
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                //{
                //    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                //},
                {
                    "mDataProp": "HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                //{
                //    "mDataProp": "CATHI_TEN"
                //},
                //{
                //    "mDataProp": "PHONGTHI_TEN"
                //},
                {
                    mRender: function (nRow, aData) {
                        var val = aData.DIEM;
                        if (val === null || val === undefined || val === "") return "";
                        var num = parseFloat(val);
                        if (isNaN(num)) return val;
                        return num.toFixed(1).replace('.', ',');
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLYHP_TEN"
                },
                {
                    "mDataProp": "NGAYXACNHANHOANTHANHDIEMTHI"
                },
                {
                    "mDataProp": "NGAYDANGKYPHUCKHAO"
                },
                {
                    "mDataProp": "NGAYHETHANDANGKYPHUCKHAO"
                },
                {
                    "mDataProp": "NGAYHETHANNOPPHIPHUCKHAO"
                },
                {
                    //"mDataProp": "PhiPhucKhao - TinhTrangNopPhi"
                    mRender: function (nRow, aData) {
                        var tinhTrangNopPhi = aData.TINHTRANGNOPPHI;
                        var daNop = false;
                        if (typeof tinhTrangNopPhi === "boolean") daNop = tinhTrangNopPhi;
                        else if (typeof tinhTrangNopPhi === "number") daNop = tinhTrangNopPhi !== 0;
                        else if (typeof tinhTrangNopPhi === "string") {
                            var v = tinhTrangNopPhi.trim().toLowerCase();
                            daNop = v !== "" && v !== "0" && v !== "false" && v !== "chua nop" && v !== "chưa nộp";
                        } else {
                            daNop = !!tinhTrangNopPhi;
                        }

                        return edu.util.returnEmpty(aData.PHIPHUCKHAO) + " - " + (daNop ? "Đã nộp" : "Chưa nộp");
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        var val = aData.KETQUAPHUCKHAO;
                        if (val === null || val === undefined || val === "") return "";
                        var num = parseFloat(val);
                        if (isNaN(num)) return val;
                        return num.toFixed(1).replace('.', ',');
                    }
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_PhucKhao/LayThoiGianTheoDotThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
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
    cbGenCombo_ThoiGian: function (data) {
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

    getList_HocPhan: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_PhucKhao/LayHocPhanPhucKhao',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    getList_ThoiGianPK: function () {
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
                    me.cbGenCombo_ThoiGianPK(json);
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
    cbGenCombo_ThoiGianPK: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectFirst: true
            },
            renderPlace: ["dropSearch_ThoiGianPhucKhao"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ThoiGianPhucKhao: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/FSkkLB4VKSgeESk0IgopIC4eFQYeACUP',
            'func': 'PKG_THI_PHACH_PHUCKHAO.Them_Thi_PhucKhao_TG_Ad',
            'iM': edu.system.iM,
            'strId': me.strThoiGianPhucKhao_Id,
            'strNgayBatDau': edu.system.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.system.getValById('txtNgayKetThuc'),
            'strNgayHetHanThuPhi': edu.system.getValById('txtNgayHetHan'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_ThoiGianPhucKhao();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThoiGianPhucKhao();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThoiGianPhucKhao: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4BRIVKSgeESk0IgopIC4eFQYeACUP',
            'func': 'PKG_THI_PHACH_PHUCKHAO.LayDSThi_PhucKhao_TG_Ad',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGianPhucKhao'),
            'strPhamViApDung_Id': edu.system.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtThoiGianPhucKhao"] = data.Data;
                    me.genTable_ThoiGianPhucKhao(data.Data);
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
    delete_ThoiGianPhucKhao: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBigg',
            'func': 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia',
            'iM': edu.system.iM,
            'strId': Ids,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThoiGianPhucKhao();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThoiGianPhucKhao: function (data, iPager) {
        $("#lblThoiGianPhucKhao_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThoiGianPhucKhao",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_ThoiGianPhucKhao()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
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
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "NGAYHETHANTHUPHI"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
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
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc1'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem1'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianPhucKhao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
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
    cbGenCombo_DotThi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblModalPhamViPhucKhao",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_ThoiGianPhucKhao()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}