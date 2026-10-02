/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuanLyHoSoMoRong() { };
QuanLyHoSoMoRong.prototype = {
    strQuanLyHoSo_Id: '',
    dtQuanLyHoSo: [],
    strHead: '',
    strHeadNhapTuNguon: '',
    dtTruongThongTin: [],
    dtMon: [],
    strPath: '',
    arrHeadDiem_Id: [],
    strCotChinh: '',


    init: function () {

        var me = this;
        me.strHead = $("#tblQuanLyHoSo thead").html();
        me.strHeadNhapTuNguon = $("#tblNhapTuNguon thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //me.getList_QuanLyHoSo();
        me.getList_KeHoachTuyenSinh();
        me.getList_Nam();
        //me.getList_DotDoiTuong();
        //me.getList_TruongThongTin();
        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao();
        //me.getList_Nam();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
        });
        $("#btnThemNguyenVong").click(function () {
            me.getUrl_NguyenVong();
        });
        $("#btnTongHopDuLieu").click(function () {
            me.getList_TongHop();
        });
        $("#btnXetTrungTuyen").click(function () {
            console.log(111111);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyHoSo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            if (arrChecked_Id.length > 1) {
                edu.system.alert("Chỉ được chọn 1 đối tượng!");
                return;
            }
            me.strQuanLyHoSo_Id = arrChecked_Id[0];
            me.getList_TrungTuyen();
            me.getList_DangKy();
            $("#myModalTrungTuyen").modal("show");
        });

        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoachTuyenSinh();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            //me.getList_QuanLyHoSo();
            me.getList_HinhThuc();
            me.getList_DotDoiTuong();
            //me.getList_TruongThongTin();
        });
        $("#dropSearch_Dot").on("select2:select", function () {
            //me.getList_TruongThongTin();
        });
        $(".btnSearch").click(function () {
            me.getList_TruongThongTin();
            //me.getList_QuanLyHoSo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TruongThongTin();

            }
        });
        $("#tblQuanLyHoSo").delegate('.btnChiTietDuTuyen', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_Mon(this.id);
        });
        if (typeof (configTS) == "function") {
            me.strPath = configTS().path;
        } else {
            me.strPath = edu.system.strhost;
        }
        
        $("#tblQuanLyHoSo").delegate('#chkSelectAll', 'click', function (e) {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanLyHoSo" });
        });

        $("#chkSelectAll_TrungTuyen").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTrungTuyen" });
        });
        $("#chkSelectAll_DangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDangKy" });
        });
        $("#btnXoaQuanLyHoSo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyHoSo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanLyHoSo(arrChecked_Id[i]);
                }
            });
        });
        $("#tblQuanLyHoSo").delegate('.btnLichSu', 'click', function (e) {
            $('#myModalLichSu').modal('show');
            me.getList_LichSu(this);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_HoSo", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyHoSo", "checkX");
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
                'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
                'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
                'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
                'strNam': edu.util.getValById('dropSearch_Nam'),
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            arrChecked_Id.forEach(e => addKeyValue("strTS_HoSoDuTuyen_Id", e));
        });

        $("#btnSave_TrungTuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDangKy", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_TrungTuyen(arrChecked_Id[i]);
            }
        });
        $("#btnDelete_TrungTuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTrungTuyen", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_TrungTuyen(arrChecked_Id[i]);
            }
        });
        $(".btnDownloadAllFile").click(function () {
            var arrFile = [];
            var arrFileName = [];
            me.dtQuanLyHoSo.forEach((e) => {
                var iVitri = 0;
                $('#tblQuanLyHoSo tr[id=' + e.ID + '] .user-avartar').each(function () {
                    var url = $(this).attr("name");
                    arrFile.push(url);
                    arrFileName.push(e.MASO + "_" + e.HODEM + " " + e.TEN + url.substring(url.lastIndexOf(".")));
                });
                $('#tblQuanLyHoSo tr[id=' + e.ID + '] .upload-img').each(function () {
                    var url = $(this).attr("name");
                    arrFile.push(url);
                    arrFileName.push(e.MASO + "_" + ++iVitri + "_" + $(this).attr("title"));
                });
                $('#tblQuanLyHoSo tr[id=' + e.ID + '] .upload-file').each(function () {
                    var url = $(this).attr("name");
                    arrFile.push(url);
                    arrFileName.push(e.MASO + "_" + ++iVitri + "_" + $(this).attr("title"));
                });
            });

            me.save_GopFile(arrFile, arrFileName);
        });
        $("#btnGoLeft").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var element = document.getElementById("table-container");
            element.scrollLeft -= 200;
            $("#table-container").focus();
        })
        $("#btnGoRight").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var element = document.getElementById("table-container");
            element.scrollLeft += 200;
            $("#table-container").focus();
        })


        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.toggle_edit();
        });

        $("#btnDocTuNguon").click(function (e) {
            //if (!edu.util.getValById('dropSearch_KeHoach') || edu.util.getValById('dropSearch_Dot')) {
            //    edu.system.alert("Bạn cần chọn kế hoạch và đợt");
            //    return;
            //}
            //me.get_CustomAPI();
            edu.util.toggle_overide("zone-bus", "zoneNhapTuNguon");
        });
        $("#btnSearchNhapTuNguon").click(function () {
            me.get_CustomAPI();
        });
        $("#txtSearchNhapTuNguon").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.get_CustomAPI();
            }
        });
        $("#btnSave_NhapTuNguon").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapTuNguon", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            //edu.system.alert('<div id="zoneprocessXXXX"></div>');
            //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtCustomApi.find(e => e[me.strCotChinh] == arrChecked_Id[i])
                for (var x in aData) {
                    var temp = aData[x];
                    if (typeof temp == "object") temp = JSON.stringify(temp);
                    me.save_ThemHoSo(aData[me.strCotChinh], x, temp);
                }
            }
        });
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuanLyHoSo();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },

    getList_QuanLyHoSo: function () {
        var me = this;

        if (me.arrHeadDiem_Id.length == 0) {
            edu.system.alert("Không có dữ liệu để hiển thị");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strNam': edu.util.getValById('dropSearch_Nam'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
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
                        iPager = data.Pager;
                    }
                    me.dtQuanLyHoSo = dtResult;
                    me.genTable_QuanLyHoSo(dtResult, iPager);
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
    genTable_QuanLyHoSo: function (data, iPager) {
        var me = this;
        $("#table-container").focus();
        $("#lblQuanLyHoSo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanLyHoSo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyHoSoMoRong.getList_QuanLyHoSo()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }, {
                    
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" href="' + me.strPath + '/pages/tuyensinh.aspx?userId=' + edu.system.userId + '&strSinhVien_Id=' + aData.ID + '" id="' + aData.ID + '"  target="_blank" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        me.arrHeadDiem_Id.forEach(e => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    return '<span id="tt_' + aData.ID + '_' + main_doc.QuanLyHoSoMoRong.arrHeadDiem_Id[edu.system.icolumn++] + '"></span>';
                }
            });
        });
        
        edu.system.loadToTable_data(jsonForm);
        data.forEach(ele => me.getData_HoSo(ele.ID))
        //me.actionTable(jsonForm.strTable_Id)
        /*III. Callback*/
    },
    getData_HoSo: function (strTS_HoSoTuyenSinh_Id) {
        var me = this;

        //--Edit
        //var obj_list = {
        //    'action': 'TS_TaiKhoan/LayKQTS_KeHoach_DuLieu',
        //    'type': 'GET',
        //    'strTruongThongTin_Id': strTruongThongTin_Id,
        //    'strTS_HoSoTuyenSinh_Id': strTS_HoSoTuyenSinh_Id,
        //};
        var obj_list = {
            'action': 'TS_DuLieu/LayDSDuLieuHienThiHoSo',
            'type': 'GET',
            'strTS_HoSoDuTuyen_Id': strTS_HoSoTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    dtResult.forEach(e => {
                        var strTruongThongTin_Id = e.THANHPHAN_ID;
                        switch (e.KIEUDULIEU) {
                            case 'FILE': edu.system.viewFiles("tt_" + strTS_HoSoTuyenSinh_Id + '_' + strTruongThongTin_Id, strTS_HoSoTuyenSinh_Id + strTruongThongTin_Id, "SV_Files"); break;
                            case 'ANHCANHAN': {
                                if (e.THANHPHAN_GIATRI) {
                                    $("#tt_" + strTS_HoSoTuyenSinh_Id + '_' + strTruongThongTin_Id).html('<img style="width: 75px" class="user-avartar" src="' + edu.system.getRootPathImg(e.THANHPHAN_GIATRI) + '" name="' + edu.util.returnEmpty(e.THANHPHAN_GIATRI) +'" />');
                                }
                                break;
                            }
                            default: $("#tt_" + strTS_HoSoTuyenSinh_Id + '_' + strTruongThongTin_Id).html(edu.util.returnEmpty(e.THANHPHAN_GIATRI));
                        }
                    });
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_QuanLyHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_TaiKhoan/XoaDuLieuTuyenSinh',

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
                    me.getList_QuanLyHoSo();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    actionTable: function (strTable_Id) {
        setTimeout(function () {
            var me = this;
            edu.system.move_ThroughInTable(strTable_Id);
            function moveScroll() {
                var scroll = $(window).scrollTop();
                var left = $("#" + strTable_Id).offset().left;
                var anchor_top = $("#" + strTable_Id).offset().top;
                var anchor_bottom = $("#bottom_anchor").offset().top;
                if (scroll > anchor_top && scroll < anchor_bottom) {
                    clone_table = $("#clone");
                    if (clone_table.length == 0) {
                        clone_table = $("#" + strTable_Id).clone();
                        clone_table.attr('id', 'clone');
                        clone_table.css({
                            position: 'fixed',
                            'pointer-events': 'none',
                            top: 0,
                            left: left + "px"
                        });
                        clone_table.width($("#" + strTable_Id).width());
                        $("#table-container").append(clone_table);
                        $("#clone").css({ visibility: 'hidden' });
                        $("#clone thead").css({ visibility: 'visible', color: 'gray' }); 
                    }
                } else {
                    $("#clone").remove();
                }
            }
            $(window).scroll(moveScroll);
            $("#table-container").scroll(function () {
                var x = $("#clone");
                if (x.length > 0) {
                    x = x[0];
                    var anchor_left = $("#" + strTable_Id).offset().left;
                    $("#clone")[0].style.left = anchor_left + "px";
                }
            });
            //$("#table-container").append('<table id="tblNhapDiemclone" class="table table-hover table-bordered"><tbody></tbody></table>');
            //var x = $("#tblNhapDiem tbody");
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 0; j < 5; j++) {
            //        $("#")
            //    }
            //}
            //$("#tblNhapDiemclone").remove();
            //clone_table = $("#tblNhapDiem").clone();
            //clone_table.attr('id', 'tblNhapDiemclone');
            //clone_table.css({
            //    position: 'absolute',
            //    'pointer-events': 'none',
            //    top: 0
            //});
            //clone_table.width($("#tblNhapDiem").width());
            //$("#table-container").append(clone_table);
            //$("#tblNhapDiemclone").css({ visibility: 'hidden' });
            //$("#tblNhapDiemclone tbody").css({ visibility: 'visible' });
            //var x = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 7; j < x[i].cells.length; j++) {
            //        $(x[i].cells[j]).css({ visibility: 'hidden' });
            //    }
            //}
            //$("#tblNhapDiemclone tbody")[0].classList.add("mauthangcon");

            //var row = $("#tblNhapDiem tbody")[0].rows;
            //var rowNguoiHoc = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < row.length; i++) {
            //    var ilenghtDiem = row[i].clientHeight;
            //    var ilengthNguoiHoc = rowNguoiHoc[i].clientHeight;

            //    if (ilengthNguoiHoc < ilenghtDiem)
            //        $(rowNguoiHoc[i]).attr("height", row[i].clientHeight);
            //    else
            //        $(row[i]).attr("height", rowNguoiHoc[i].clientHeight);

            //    if (i < row.length - 1) {
            //        var iLengthTopDiem = $(row[i + 1]).offset().top;
            //        var iLengthTopNguoiHoc = $(rowNguoiHoc[i + 1]).offset().top;
            //        var iChenhLech = iLengthTopDiem - iLengthTopNguoiHoc;
            //        if (iChenhLech != 0) {
            //            if (iChenhLech > 0) {
            //                $(rowNguoiHoc[i]).attr("height", (rowNguoiHoc[i].clientHeight + iChenhLech));
            //            }
            //            else {
            //                $(row[i]).attr("height", (row[i].clientHeight - iChenhLech));
            //            }
            //        }
            //    }

            //}
            //var rowHead = $("#tblNhapDiem thead")[0].rows[0];
            //var rowHeadNguoiHoc = $("#tblNhapDiemclone thead")[0].rows[0];
            //var iSoCot = 7;
            //for (var i = 0; i < iSoCot; i++) {
            //    console.log(rowHead.cells[i].scrollWidth);
            //    rowHeadNguoiHoc.cells[i].scrollWidth = rowHead.cells[i].scrollWidth;
            //    rowHeadNguoiHoc.cells[i].style.width = rowHead.cells[i].scrollWidth + 1 + "px";
            //}
        }, 500);

    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_HeDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    //me.dtHeDaoTao= dtResult;
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KhoaDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    //me.dtKhoaDaoTao = dtResult;
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Nam: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
            'type': 'GET',
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
                    me.cbGenCombo_Nam(dtResult, iPager);
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
    cbGenCombo_Nam: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAM",
                parentId: "",
                name: "NAM",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Nam"],
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachTuyenSinh: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.system.userId,
            'strNam': edu.util.getValById('dropSearch_Nam'),
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
                    me.dtKeHoachTuyenSinh = dtResult;
                    me.genCombo_KeHoachTuyenSinh(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoachTuyenSinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DotDoiTuong: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDSTS_Dot',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    me.genCombo_DotDoiTuong(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DotDoiTuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOTTUYENSINH_ID",
                parentId: "",
                name: "DOTTUYENSINH_TEN",
            },
            renderPlace: ["dropSearch_Dot"],
            title: "Chọn đợt đối tượng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HinhThuc: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDSTS_DoiTuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    me.genCombo_HinhThuc(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HinhThuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOITUONGDUTUYEN_ID",
                parentId: "",
                name: "DOITUONGDUTUYEN_TEN",
            },
            renderPlace: ["dropSearch_HinhThuc"],
            title: "Chọn hình thức"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_TruongThongTin: function () {
        var me = this;

        //--Edit
        //var obj_list = {
        //    'action': 'TS_TaiKhoan/LayDSThongTinTheoKeHoach',
        //    'type': 'GET',
        //    'strChucNang_Id': edu.system.strChucNang_Id,
        //    'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
        //    'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};
        var obj_list = {
            'action': 'TS_DuLieu/LayDSCauHienThiHoSo',
            'type': 'GET',
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    var iPager = 0;
                    me.dtTruongThongTin = dtResult;
                    me.loadHead(dtResult);
                    me.getList_QuanLyHoSo();
                    //me.genHtml_TruongThongTin(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_TruongThongTin: function (data) {
        var me = this;
        $("#tblQuanLyHoSo thead").html(me.strHead);
        var html = "";
        data.forEach(e => {
            html += '<th class="td-center">' + e.TEN + '</th>';
        });
        $("#zoneHoSo").append(html);
        document.getElementById("lblHoSo").colSpan = data.length;
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead style="font-weight: bold"><tr><th class="td-fixed td-center">STT</th><th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll"></th><th class="td-center">Chi tiết</th></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].colSpan;
                if (z == 1) {
                    var irowspan = (x.length - i);
                    if (irowspan > 1) x[i].cells[j].rowSpan = (x.length - i);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.THANHPHAN_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].THANHPHAN_ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }

        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            //var lHeader = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
            //if (lHeader.length <= iThuTu) {
            //    $("#" + strTable_Id + " thead").append("<tr></tr>");
            //    setTimeout(function () {
            //        $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //    }, 1);
            //} else {
            //    $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //}
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.THANHPHAN_ID + "' colspan='" + colspan + "'>" + objHead.THANHPHAN_TEN + "</th>");
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                //$("#" + strTable_Id + "_Data thead tr:eq(0)").append("<th style='width: 60px'>" + objHead.HOCPHAN + "</th>");
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THANHPHAN_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    loadHead: function (data) {
        var me = this;
        me.arrHeadDiem_Id = me.insertHeaderTable("tblQuanLyHoSo", data, null);
    },

    getList_Mon: function (strTS_HoSoDuTuyen_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_KetQua/LayDSMonThiTheoThiSinh',
            'type': 'GET',
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtMon= dtResult;
                    me.genHtml_Mon(dtResult);
                    me.getList_NguyenVong(strTS_HoSoDuTuyen_Id);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_Mon: function (data) {
        var me = this;
        var html = "";
        data.forEach(e => {
            html += '<th class="td-center">' + e.TS_MONTHI_TEN + '</th>';
        });
        $("#zoneNguyenVong").html(html);
        document.getElementById("lblMon").colSpan = data.length;
    },

    getList_NguyenVong: function (strTS_HoSoDuTuyen_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_NguyenVong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
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
                    me.dtNguyenVong = dtResult;
                    me.genTable_NguyenVong(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NguyenVong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguyenVong",
            aaData: data,
            colPos: {
                center: [0],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANHNGHE_TEN"
                },
                {
                    "mDataProp": "TS_TOHOP_TEN"
                }
            ]
        };
        me.dtMon.forEach(e => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var strMonThi = aData.DSMONTHITHEOTOHOPNGANH_ID;
                    var arrMonThi = [strMonThi];
                    var x = main_doc.QuanLyHoSoMoRong.dtMon[edu.system.icolumn++];
                    var strMonThi_Id = x.ID;
                    
                    if (strMonThi.indexOf(",") != -1) arrMonThi = strMonThi.split(',');
                    if (arrMonThi.indexOf(strMonThi_Id) !== -1) {
                        if (x.DIEM) return x.DIEM;
                        return "x";
                    }
                    return '';
                }
            });
        });
        jsonForm.aoColumns.push({
            "mDataProp": "TS_XACNHANDUYETTT_TEN"
        });
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    
    getUrl_NguyenVong: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_Token/CreateTicket', 

            "strUser_Id": edu.system.userId,
            "strTicket_Id": edu.util.uuid(),
            "strApp_Id": ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var url = me.strPath + '/pages/tuyensinh.aspx?ticket=' + obj_save.strTicket_Id + '&langid=';
                    var win = window.open(url, '_blank');
                    if (win == undefined) {
                        edu.system.alert("Hãy cho phép mở tab mới trên trình duyệt của bạn!", "w");
                    } else {
                        win.focus();
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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


    getList_LichSu: function (point) {
        var me = this;
        var strId = point.id;
        var obj_list = {
            'action': 'TS_DuLieu/LayDSLichSuCapNhatHoSo',
            'type': 'GET',
            'strTS_HoSoDuTuyen_Id': strId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichSu(dtReRult, 0, strId);
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

    genTable_LichSu: function (data, iPager, strTS_HoSoTuyenSinh_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_TEN"
                },
                {
                    "mData": "DULIEU_TRUOCKHISUA",
                    "mRender": function (nRow, aData) {
                        return '<span id="DULIEU_TRUOCKHISUA_' + aData.TRUONGTHONGTIN_ID + '">' + edu.util.returnEmpty(aData.DULIEU_TRUOCKHISUA) + '</span>';
                    }
                },
                {
                    "mData": "DULIEU_SAUKHISUA",
                    "mRender": function (nRow, aData) {
                        return '<span id="DULIEU_SAUKHISUA_' + aData.TRUONGTHONGTIN_ID + '">' + edu.util.returnEmpty(aData.DULIEU_SAUKHISUA) + '</span>';
                    }
                },
                {
                    "mDataProp": "NGAYTHUCHIEN"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            if (e.KIEUDULIEU === "FILE") {
                ViewFileXXX("DULIEU_TRUOCKHISUA_" + e.TRUONGTHONGTIN_ID, e.DULIEU_TRUOCKHISUA);
                ViewFileXXX("DULIEU_SAUKHISUA_" + e.TRUONGTHONGTIN_ID, e.DULIEU_SAUKHISUA);
            }
        })
        function ViewFileXXX(strZone, strData) {
            var arrJson = [];
            var arrFile = { strData };
            if (strData.indexOf(",")) arrFile = strData.split(',');
            arrFile.forEach(e => arrJson.push({ "FILEMINHCHUNG": e }));
            viewFile(strZone, arrJson);
        }
        /*III. Callback*/
    },


    getList_TongHop: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_TinhToan/ThucHienTongHopDuLieu',
            'type': 'GET',
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_Dot'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strNam': edu.util.getValById('dropSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },


    getList_DangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_NguyenVong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': me.strQuanLyHoSo_Id,
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
                    me.genTable_DangKy(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDangKy",
            aaData: data,
            colPos: {
                center: [0, 3],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANHNGHE_MA"
                },
                {
                    "mDataProp": "NGANHNGHE_TEN"
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

    getList_TrungTuyen: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_NguyenVong/LayDSTS_ThiSinh_TrungTuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': me.strQuanLyHoSo_Id,
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
                    me.genTable_TrungTuyen(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TrungTuyen: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTrungTuyen",
            aaData: data,
            colPos: {
                center: [0, 3],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANHNGHE_MA"
                },
                {
                    "mDataProp": "NGANHNGHE_TEN"
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

    save_TrungTuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_XetTuyen/Them_TS_ThiSinh_TrungTuyen',
            'type': 'POST',
            'strTS_ThiSinh_NguyenVong_Id': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                
            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_save + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKy();
                    me.getList_TrungTuyen();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_TrungTuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_XetTuyen/Xoa_TS_ThiSinh_TrungTuyen',
            'type': 'POST',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_save + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKy();
                    me.getList_TrungTuyen();
                });
            },
            contentType: true,

            data: obj_save,
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


    get_CustomAPI: function (strId) {
        var me = this;
        me.strCotChinh = "mssv";
        var strLoaiXacThuc = "Authorization";
        var strMa = edu.util.getValById('txtSearchNhapTuNguon');
        if (strMa) strMa = '&filters=[["mssv","=","' + strMa + '"]]';
        var strHost = 'https://crm.cmcu.edu.vn/api/resource/Nhaphoc?fields=["*"]&limit_page_length=5000000' + strMa
        var strtokenJWT = "Basic " + window.btoa('e1d1c19ad6a677c:c8e5f7b53d015f3').trim();
        if (edu.system.strhost.indexOf('103.159.50.116') != -1) {
            strHost = 'https://tuyensinh.uhd.edu.vn/api/admission/user-registration/user-admitted';
            strtokenJWT = "Bearer HaiDuong@2025"
            me.strCotChinh = "userId"
        }
        if (edu.system.strhost.indexOf('phenikaa-uni.edu.vn') != -1) {
            strHost = 'https://hrm.phenikaa-uni.edu.vn/hrm/api/v1/profiles/apis?page=1&pageSize=100000&username=apis&password=ewdjkl213kSD22k3%40k41JDa';
            strtokenJWT = ""
            me.strCotChinh = ""
            strLoaiXacThuc = ""
        }

        //var strLoaiXacThuc = "Authorization";
        $("#tblNhapTuNguon thead").html(me.strHeadNhapTuNguon);
        //--Edit
        var obj_save = {
            'action': 'CM_UngDung/CustomAPIGet',
            'type': 'POST',
            'strHost': strHost,
            'strApi': '',
            'strLoaiXacThuc': strLoaiXacThuc,
            'strMaXacThuc': strtokenJWT,
            'strData': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    var data = JSON.parse(data.Data).data;
                    if (edu.system.strhost.indexOf('phenikaa-uni.edu.vn') != -1) {
                        data = data.listProfile;
                    }
                    me["dtCustomApi"] = data;
                    if (data.length) {
                        var row = '';
                        for (var x in data[0]) {
                            row += '<th>' + x + '</td>';
                        }
                        $("#tblNhapTuNguon thead tr").append(row);
                        row = '';
                        for (var i = 0; i < data.length; i++) {
                            row += '<tr>';
                            row += '<td><input type="checkbox" id="checkX' + data[i][me.strCotChinh] + '"/></td>';
                            row += '<td>'+ (i+1) +'</td>';
                            for (var x in data[0]) {
                                var temp = data[i][x];
                                if (typeof temp == "object") temp = JSON.stringify(temp);
                                row += '<td>' + temp + '</td>';
                            }
                            row += '</tr>';
                        }
                        row += '</tbody>';
                        $("#tblNhapTuNguon tbody").html(row);
                        
                    }
                }
                else {
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_ThemHoSo: function (strTS_HoSoTuyenSinh_Ma, strMaTruongThongTin, strTruongThongTin_GiaTri) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_Import_MH/CCwxLjM1HhUSHgkuEi4eBTQNKCQ0HgARCAPP',
            'func': 'pkg_TuyenSinh_Import.Import_TS_HoSo_DuLieu_API',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_HoSoTuyenSinh_Ma': strTS_HoSoTuyenSinh_Ma,
            'strTS_KeHoachTuyenSinh_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strMaTruongThongTin': strMaTruongThongTin,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'dChoPhepSuaDuLieu': $("#chkChoPhepSua").is(':checked') ? 1 : undefined,
            'strDotTuyenSinh_Id': edu.system.getValById('dropSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        //me.getList_PhanCong();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
};