/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhoDiem() { };
PhoDiem.prototype = {
    dtHocPhan: [],
    dtBangDiem: [],
    strHocPhan_Id: '',
    strTuiBai_Id: '',
    strHocPhan_Ten: '',
    bcheck: true,

    init: function () {
        var me = this;
        me["strThead"] = $("#tblThongKe thead").html();
        
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_Nganh();
        me.getList_ThoiGian();
        //me.getList_ThongKe();

        
        $("#btnSearch").click(function (e) {
            me.getList_HocPhan();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_HocPhan();
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM", "dropSearch_ThangDiem");
        $("#zoneNganhPhoDiem").delegate('.item', 'click', function (e) {
            var point = this; e.preventDefault();
            if ($(point).hasClass("active")) {
                point.classList.remove("active");
            } else {
                me.strHocPhan_Id = this.id;
                me.getList_BangDiem();
                point.classList.add("active");
                $("#lblHocPhanHienThi").html($(this).html());
                me.strHocPhan_Ten = $(this).html(); 
                me.report_PhoDiem();
            }
        });
        //$('#dropSearch_KeHoach').on('select2:select', function (e) {
        //    me.getList_HocPhan();
        //    //me.getList_TenCot();
        //    //me.getList_DuLieuThi();
        //});
        //$('#dropSearch_HocPhan').on('select2:select', function (e) {
        //    //me.getList_TenCot();
        //});
        $("#chkSelectAll_HocPhan").on("click", function () {
            var checked_status = $(this).is(':checked');
            if (checked_status) {
                $("#zoneNganhPhoDiem .item").each(function () {
                    this.classList.add("active");
                })
            } else {
                $("#zoneNganhPhoDiem .item").each(function () {
                    this.classList.remove("active");
                })
            }
        });
        $("#btnThongKe").click(function (e) {
            var arrItem = [];
            $("#zoneNganhPhoDiem .item").each(function () {
                var strId = this.id;
                var bActive = $(this).hasClass("active");
                if (bActive) {
                    arrItem.push(strId)
                }

            })
            if (arrItem.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrItem.length);
                arrItem.forEach(e => {
                    me.save_ThongKe(e);
                })
            }
        });
        $("#btnXoaTangThem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTangThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TangThem(arrChecked_Id[i]);
                }
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_PhoDiem", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strDaoTao_HocPhan_Id", main_doc.PhoDiem.strHocPhan_Id);
            addKeyValue("strThangDiem_Id", edu.util.getValCombo("dropSearch_ThangDiem"));
            addKeyValue("strNganhHoc_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            //addKeyValue("strDanhSachThi_Id", main_doc.NhapDiemHocPhan.strTuiBai_Id);
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            //arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_ThongKe/LayDSHocPhanTrongKy',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strNganhHoc_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHocPhan = dtReRult;
                    me.genTable_HocPhan(dtReRult, data.Pager);
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
    genTable_HocPhan: function (data, iPager) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<div class="item" id="' + aData.ID +'">';
            html += edu.util.returnEmpty(aData.MA) + " - " + edu.util.returnEmpty(aData.TEN) + "(TC " + edu.util.returnEmpty(aData.HOCTRINH) + ")" ;
            html += '</div>';
        });
        $("#zoneNganhPhoDiem").html(html);
    },

    getList_BangDiem: function () {
        var me = this;
        //var aData = me.dtHocPhan.find(e => me.strHocPhan_Id == e.ID);
        var obj_list = {
            'action': 'D_ThongKe/LayDSKetQuaPhoDiem',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strThangDiem_Id': edu.util.getValById('dropSearch_ThangDiem'),
            'strPhanViApDung_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    me.dtBangDiem = dtResult;
                    me.genTable_BangDiem(dtResult)
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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_BangDiem: function (data, iPager) {
        var me = this;
        var html = '';
        data.rsThanhPhanDiem.forEach((aData, nRow) => {
            html += '<th class="text-center " scope="col">' + edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_TEN) +'</th>';
        });
        $("#tblBangDiem thead tr").html('<th class="text-center " scope="col">Phổ điểm</th>' + html);
        html = '';
        data.rsPhoDiem.forEach((aData, nRow) => {
            html += '<tr>';
            html += '<td class="text-center ">' + edu.util.returnEmpty(aData.MUCCANDUOI) + ' đến ' + edu.util.returnEmpty(aData.MUCCANTREN) + '</th>';
            data.rsThanhPhanDiem.forEach((e, nRow) => {
                var objKetQua = data.rsKeQuaTheoPhoDiem.find(ele => ele.MUCCANDUOI == aData.MUCCANDUOI && ele.MUCCANTREN == aData.MUCCANTREN && ele.DIEM_THANHPHANDIEM_ID == e.DIEM_THANHPHANDIEM_ID)
                var iSoLuong = objKetQua ? objKetQua.SOLUONG : '';
                html += '<td class="text-center " id="lbl' + aData.MUCCANDUOI + "_" + aData.MUCCANTREN + "_" + e.DIEM_THANHPHANDIEM_ID + '">' + iSoLuong + '</td>';
            });
            html += '</tr>';
        });
        $("#tblBangDiem tbody").html(html);
    },
    save_ThongKe: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_ThongKe/TinhPhoDiemHocPhan',
            'type': 'POST',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strThangDiem_Id': edu.util.getValById('dropSearch_ThangDiem'),
            'strPhanViApDung_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
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
                    //me.getList_TangThem();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_TangThem();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Nganh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_ThongKe/LayDSNganhDaoTaoTheoCTDT',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_Nganh(dtReRult, data.Pager);
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
    genCombo_Nganh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn ngành"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGian: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_ThongKe/LayDSThoiGian',
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
    genCombo_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                //mRender: function (nRow, aData) {
                //    return aData.MA + " - " + aData.TEN;
                //}
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    report_PhoDiem: function () {
        var me = this;
        strLoaiBaoCao = "KetQuaPhoDiem";
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //
        addKeyValue("strLoaiBaoCao", strLoaiBaoCao);
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById('dropSearch_ThoiGian'));
        addKeyValue("strDaoTao_HocPhan_Id", me.strHocPhan_Id);
        addKeyValue("strThangDiem_Id", edu.util.getValById('dropSearch_ThangDiem'));
        addKeyValue("strPhanViApDung_Id", edu.util.getValById('dropSearch_ChuongTrinh'));
        addKeyValue("strTenHienThi", me.strHocPhan_Ten);
        addKeyValue("strNguoiThucHien_Id", edu.system.userId);
        
        //không sửa ở đây

        var obj_save = {
            'arrTuKhoa': arrTuKhoa,
            'arrDuLieu': arrDuLieu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //console.log(obj_save);
        //return;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.strhost + "/reporttest/modules/common/baocao.aspx?id=" + strBaoCao_Id;
                        console.log(url_report);
                        //if (edu.util.checkValue(strDuongDan) && strDuongDan != "undefined") {
                        //    url_report = strDuongDan + "?id=" + strBaoCao_Id;
                        //    if (strDuongDan.indexOf("http") == -1) url_report = me.strhost + url_report;
                        //}
                        getList_BaoCao(url_report);
                        //if (checkBaoCao && checkBaoCao.XEMFILE) {
                        //    getList_BaoCao(url_report);
                        //} else {
                        //    console.log('aa' + url_report);
                        //    location.href = url_report
                        //};
                        //console.log(url_report);
                        //var win = window.open(url_report, '_blank');
                        //if (win != undefined)
                        //    win.focus();
                        //else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
        function getList_BaoCao(strUrl, strToken) {
            //--Edit
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: strUrl,
                success: function (d, s, x) {
                    if (d.Success) {
                        //$("#modalBaoCao #modal_body").html('<iframe src="' + me.strhost + d.Data + '" width="' + (window.screen.width - 100) + 'px" height="' + (window.screen.height - 300) + 'px"></iframe>');
                        //$("#modalBaoCao").modal("show");
                        $("#lblBieuDo").html('<img class="w-100" src="' + edu.system.strhost + d.Data + '" alt="">')
                    } else {
                        edu.system.alert(d.Message);
                    }

                },
                error: function (x, t, m) {
                    edu.system.alert(x);
                },
                data: {
                },
                cache: false,
            });
        }
        
    },
}