/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/12/2018
--Note: CotDuLieuIn: [] lưu các cột mà người dùng chọn để in ra excel,
----------------------------------------------*/
function NhanSuTuyChon() { }
NhanSuTuyChon.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtReportTemp: [],
    strNhanSu_Id: '',
    CotDuLieuIn: [],
    dtNhanSuBaoCaoDong:[],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_select();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearchNS_CoCauToChuc").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
         /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearchNS_QueQuan").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.system.genCombo_DMDL_TheoCha(constant.setting.CATOR.CHUN.DMTT, strCha_Id, "dropSearchNS_NoiSinh");
                //var obj = {
                //    strCha_Id: strCha_Id,
                //    strTuKhoa:"",
                //    strDanhMucTenBang_Id: constant.setting.CATOR.CHUN.DMTT,
                //    strTenCotSapXep:"",
                //    pageIndex:1,
                //    pageSize:10000
                //};
                //edu.system.getList_DMDL_TheoCha(obj, "", "", me.cbGenCombo_Tinh);
            }
        });
        /*------------------------------------------
        --Author: nnThuong
        --Discription: In nâng cao tùy biến
        ------------------------------------------*/
        $("#btnResetCheckPrint").click(function () {
            $(':checkbox[id^=ckbPrint]').prop('checked', false);
        });
        $('#btnCheckAllPrint').click(function () {
            $(":checkbox[id^=ckbPrint]").prop("checked", true);
        });
        $("#btnPreViewPrint").click(function () {
            me.toggle_preview();
            me.getList_HeaderPrint_NhanSu();
        });
        $("#btnPreViewPrint_Refresh").click(function () {
            me.getList_HeaderPrint_NhanSu();
        });
        $("#btnAdVancedPrint").click(function () {
            var selectedFields = "";
            var len = me.CotDuLieuIn.length;
            for (var i = 0; i < len; i++) {
                if (i < (len - 1)) {
                    selectedFields += me.CotDuLieuIn[i] + "#";
                }
                else {
                    selectedFields += me.CotDuLieuIn[i];
                }
            }
            var strCoCauToChuc = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearchNS_BoMon"))) {
                strCoCauToChuc = edu.util.getValById("dropSearchNS_BoMon");
            }
            else {
                strCoCauToChuc = edu.util.getValById("dropSearchNS_CoCauToChuc");
            }
            edu.system.report("NhanSuTuyChon", "", function (addKeyValue) {
                addKeyValue("NS_CoCauToChuc", strCoCauToChuc);
                addKeyValue("NS_ChucVu", edu.util.getValById("dropSearchNS_ChucVu"));
                addKeyValue("NS_ChucDanh", edu.util.getValById("dropSearchNS_ChucDanh"));

                addKeyValue("NS_HocVi", edu.util.getValById("dropSearchNS_HocVi"));
                addKeyValue("NS_LoaiCanBo", edu.util.getValById("dropSearchNS_LoaiCanBo"));
                addKeyValue("NS_LoaiDoiTuong", edu.util.getValById("dropSearchNS_LoaiDoiTuong"));
                addKeyValue("ns_NgachCongChuc", edu.util.getValById("dropSearchNS_NgachCongChuc"));

                addKeyValue("NS_QueQuan", edu.util.getValById("dropSearchNS_QueQuan"));
                addKeyValue("NS_NoiSinh", edu.util.getValById("dropSearchNS_NoiSinh"));
                addKeyValue("NS_GioiTinh", edu.util.getValById("dropSearchNS_GioiTinh"));
                addKeyValue("NS_TinhTrangHonNhan", edu.util.getValById("dropSearchNS_TinhTrangHonNhan"));

                addKeyValue("NS_DanToc", edu.util.getValById("dropSearchNS_DanToc"));
                addKeyValue("NS_TonGiao", edu.util.getValById("dropSearchNS_TonGiao"));
                addKeyValue("NS_TuoiBatDau", edu.util.getValById("txtSearchNS_TuoiBatDau"));
                addKeyValue("NS_TuoiKetThuc", edu.util.getValById("txtSearchNS_TuoiKetThuc"));
                addKeyValue("NS_DangVien", edu.util.getValById(""));
                addKeyValue("NS_FIELDs", selectedFields);
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.toggle_select();
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_CoCauToChuc();
            setTimeout(function () {
                var obj = {
                    strMaBangDanhMuc: "BACO.HTQT.NHSU",
                    strTenCotSapXep: "HESO1",
                    iTrangThai: 1
                };
                edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_InTuyChon);
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropSearchNS_ChucVu");
                    setTimeout(function () {
                        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropSearchNS_ChucDanh");
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropSearchNS_HocVi");
                            setTimeout(function () {
                                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearchNS_LoaiDoiTuong");
                                setTimeout(function () {
                                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.NGLU, "dropSearchNS_NgachCongChuc");
                                    setTimeout(function () {
                                        edu.system.genCombo_DMDL_Cap1(constant.setting.CATOR.CHUN.DMTT, "dropSearchNS_QueQuan");
                                        setTimeout(function () {
                                            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropSearchNS_GioiTinh");
                                            setTimeout(function () {
                                                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTHN, "dropSearchNS_TinhTrangHonNhan");
                                                setTimeout(function () {
                                                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSearchNS_DanToc");
                                                    setTimeout(function () {
                                                        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropSearchNS_TonGiao");
                                                    }, 50);
                                                }, 50);
                                            }, 50);
                                        }, 50);
                                    }, 50);
                                }, 50);
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    toggle_select: function () {
        edu.util.toggle_overide("zonePrint", "zone_print_select");
    },
    toggle_preview: function () {
        edu.util.toggle_overide("zonePrint", "zone_print_preview");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        var arrId = [""];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSoLyLich
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearchNS_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchNS_CoCauToChuc");
        }

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchNS_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCCTC_Loai_Id: "",
            strChung_DonVi_Id: strCoCauToChuc,
            strLoaiDoiTuong_Ma: "",
            dLaCanBoNgoaiTruong: 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_NhanSu);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoSoLyLich
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhanSu: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHSLL_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblHSLL_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoLyLich.getList_NhanSu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            arrClassName: ["btnView"],
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.HOTEN) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINHDAYDU) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML CoCauToChuc
    --ULR:  Modules
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.NhanSuTuyChon;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }

        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNS_CoCauToChuc"],
            type: "",
            title: "Cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNS_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_DanhMucTinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchNS_QueQuan"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] InTuyChon
    --ULR:  Modules
    -------------------------------------------*/
    getList_HeaderPrint_NhanSu: function () {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "BACO.HTQT.NHSU",
            strTenCotSapXep:"HESO1",
            iTrangThai:1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genHeaderPrint_NhanSu);
    },
    genHeaderPrint_NhanSu: function (data) {
        var me = main_doc.NhanSuTuyChon;
        var dtResult = data;
        /*I. variable temp*/
        $("#tbldatapPreView thead").html("");
        $("#tbldatapPreView tbody").html("");
        var createTheadRow = "";
        var createTbodyRow = "";
        var strTieuDeBang = "";
        var cbkPrint = "";
        var colPrint = "";
        /*II. processing*/
        if (!edu.util.checkValue(dtResult)) {
            $("#tbldatapPreView thead").append("<tr><td colspan = '7'>Không có dữ liệu tìm kiếm</td></tr>");
        }
        else {
            /*TIÊU ĐỀ BẢNG*/
            createTheadRow += "<tr style='color:black'>";
            createTheadRow += "<th>#</td>";
            for (var i = 0; i < dtResult.length; i++) {
                iStt = i + 1;
                strTieuDeBang = dtResult[i].TEN;
                createTheadRow += "<th class='colPrint" + (i + 1) + "' style='text-align:left'>" + strTieuDeBang + "</td>";
            }
            createTheadRow += "</tr>";
            $("#tbldatapPreView thead").append(createTheadRow);
            createTheadRow = "";
            /*NỘI DUNG BẢNG*/
            me.getList_Print_NhanSu();
            var strMa_In = "";
            var strValues = "";
            for (var h = 0; h < me.dtNhanSuBaoCaoDong.length; h++) {
                createTbodyRow += "<tr>";
                createTbodyRow += "<td>" + (h + 1) + "</td>";
                for (var j = 0; j < dtResult.length; j++) {
                    strMa_In = dtResult[j].MA;//lấy tên cột dl(ví dụ: MASOCANBO, NGAYSINHDAYDU tương ứng tên trường dưới csdl)
                    strValues = me.dtNhanSuBaoCaoDong[h][strMa_In];
                    if (!edu.util.checkValue(strValues)) {
                        strValues = "";
                    }
                    createTbodyRow += "<td class='colPrint" + (j + 1) + "' style='text-align:left'>" + strValues + "</td>";
                }
                createTbodyRow += "</tr>";
                $("#tbldatapPreView tbody").append(createTbodyRow);
                createTbodyRow = "";
            }
            /*XỬ LÝ ẨN HIỆN CÁC CỘT TRONG BẢNG*/
            for (var k = 1; k <= dtResult.length; k++) {
                cbkPrint = "#ckbPrint" + k;                     //Lấy từng checkbox bên giao diện
                colPrint = ".colPrint" + k;                     //Lấy từng cột trong bảng bên giao diện
                if ($(cbkPrint).is(':checked')) {
                    me.CotDuLieuIn.push($(cbkPrint).val());     //Lấy ra tên cột dưới database được chọn
                    $(colPrint).show();
                }
                else {
                    $(colPrint).hide();
                }
            }
        }
    },
    getList_Print_NhanSu: function () {
        var me = main_doc.NhanSuTuyChon;
        var strCoCauToChuc = "";
        if (edu.util.checkValue(edu.util.getValById("dropSearchNS_BoMon"))) {
            strCoCauToChuc = edu.util.getValById("dropSearchNS_BoMon");
        }
        else {
            strCoCauToChuc = edu.util.getValById("dropSearchNS_CoCauToChuc");
        }
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var iTrangThai = 1;
        var strChung_DonVi_Id = strCoCauToChuc;
        var strNhanSu_Id = "";
        var strHocVi_Id = edu.util.getValById("dropSearchNS_HocVi");
        var strChucDanh_Id = edu.util.getValById("dropSearchNS_ChucDanh");
        var strLoaiCanBo_Id = edu.util.getValById("dropSearchNS_LoaiCanBo");
        var strGioiTinh_Id = edu.util.getValById("dropSearchNS_GioiTinh");
        var strDanToc_Id = edu.util.getValById("dropSearchNS_DanToc");
        var strTonGiao_Id = edu.util.getValById("dropSearchNS_TonGiao");
        var strTinhTrangHonNhan_Id = edu.util.getValById("dropSearchNS_TinhTrangHonNhan");
        var strChucVu_Id = edu.util.getValById("dropSearchNS_ChucVu");
        var strTrinhDoChuyenMonCN_Id = edu.util.getValById("");
        var iDoTuoiBatDau = 0;
        var tuoibatdau = edu.util.getValById("txtSearchNS_TuoiBatDau");
        if (!edu.util.checkValue(tuoibatdau)) {
            iDoTuoiBatDau = 1;
        }
        else {
            iDoTuoiBatDau = tuoibatdau;
        }
        var iDoTuoiKetThuc = 1000;
        var tuoiketthuc = edu.util.getValById("txtSearchNS_TuoiKetThuc");
        if (!edu.util.checkValue(tuoiketthuc)) {
            iDoTuoiKetThuc = 1000;
        }
        else {
            iDoTuoiKetThuc = tuoiketthuc;
        }
        var strLoaiDoiTuong_Id = edu.util.getValById("dropSearchNS_LoaiDoiTuong"); // giảng viên or cán bộ nhân viên
        var iTimKiemLaDangVien = -1; //edu.util.getValById(""); // 1-là đảng viên, 0 - k là đảng viên, -1 lay tat ca
        var strNoiSinh_TinhThanh_Id = edu.util.getValById("");
        var strQueQuan_TinhThanh_Id = edu.util.getValById("dropSearchNS_QueQuan");
        var strGiaDinhThuocDienUuTien_Id = edu.util.getValById("");
        var strCoQuanTiepNhanLamViec = edu.util.getValById("");
        var strTrinhDoLyLuanChinhTri_Id = edu.util.getValById("");
        var strTrinhDoQuanLyNhaNuoc_Id = edu.util.getValById("");
        var strTrinhDoTinHoc_Id = edu.util.getValById("");
        var strTrinhDoNgoaiNgu_Id = edu.util.getValById("");
        var strDanhHieuDuocCaoNhat_Id = edu.util.getValById("");
        var strNgachCongChuc_Id = edu.util.getValById("dropSearchNS_NgachCongChuc");
        var strLoaiCoCauToChuc_Id = edu.util.getValById("");
        var strThoiGian_Id = "";
        var iTinhTrang = 1;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    me.dtNhanSuBaoCaoDong = dtResult;
                }
                else {
                    console.log(data.Message);
                }
                
            },
            async: false,
            error: function (er) {
                edu.system.alert("NS_HoSoV2/LayDanhSach (er): " + JSON.stringify(er));
                
            },
            type: 'GET',
            action: 'NS_HoSoV2/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'strDaoTao_CoCauToChuc_Id': strLoaiCoCauToChuc_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'dLaCanBoNgoaiTruong': 0
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML InTuyChon
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_InTuyChon: function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<div class="col-sm-3">';
            html += '<div class="checkbox">';
            html += '<label class="poiter" title="' + data[i].TEN +'">';
            html += '<input type="checkbox" id="ckbPrint' + (i + 1) + '" name="ckbPrint' + (i + 1) + '" value="' + data[i].MA + '"> ';
            html += edu.util.splitString(data[i].TEN, 20);
            html += '</label >';
            html += '</div>';
            html += '</div>';
        }
        $("#zonePrint_Select").html(html);
    },
};