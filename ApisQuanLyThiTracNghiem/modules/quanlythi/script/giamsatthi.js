function giamsatthi() {}
giamsatthi.prototype = {
  dtPhongThi: [],
  dtChiTietPhongThi: [],
  dtPhongThiImport: [],
  dtDeThiThuCong: [],
  dtHocPhan: [],
  strStudentExamRoomId: "",
  strThiSinhId: "",

  strExamStructId: "",
  strExamRoomInfoId: "",
  strMatKhauChoPhongThi: "",
  strDepartOrganId: "",
  strWritenExamId: "",
  strKieuTaoDe: "",
  strDeThiThuCongId: "",
  strStudentExamRoomIds: "",
  init: function () {
    var me = this;
    me.page_load();
    $(".btnClose").click(function () {
      me.toggle_batdau();
    });
    $(".btnCloseSubDetail").click(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      edu.util.toggle_overide("zone-bus", "zoneChiTiet");
    });
    $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
      var strId = this.id;
      me.strExamRoomInfoId = strId;

      var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
      me.strDepartOrganId = dt[0].DEPARTORGANID;

      me.toggle_edit_chitiet();
      me.getList_ChiTietPhongThi("1");
      me.genThongTinDeThiDaTao();
      // me.getList_drpGroupQuestion_GenDeTuDeThiCoSan();
      // me.getList_drpGroupQuestion_TaoDeTuDeThiThuCong();
      // me.getList_drpExamStruct_GenDeTuDeThiCoSan();

      // me.getList_drpGroupQuestion_GenDeTheoCauTrucDeThi();
      //me.getList_drpExamStruct_GenDeTheoCauTrucDeThi();

      setTimeout(function () {
        me.getList_KieuLamBai();
      }, 2000);
    });
    $("#tblChiTietPhongThi").delegate(
      ".btnChiTietBaiThi",
      "click",
      function (e) {
        var strId = this.id;
        var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
        me.strThiSinhId = dt[0].USERID;
        me.strStudentExamRoomId = strId;
        e.stopImmediatePropagation();
        $("#zoneChiTiet").hide();
        $("#zoneKetQuaThi").slideDown();
        me.gen_KetQuaThi();

        //$(".zone-bus").hide();
        //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
      },
    );
    $("#btnClose_KetQuaThi").click(function (e) {
      e.stopImmediatePropagation();
      me.closeKetQuaThi();
    });
    $("#btnIn_DeThiCuaThiSinh").click(function (e) {
      e.stopImmediatePropagation();
      me.printPhieu();
    });
    $("#btnAdd_TinhHuongThi").click(function () {
      var arrChecked_Id = edu.util.getArrCheckedIds(
        "tblChiTietPhongThi",
        "checkX",
      );
      if (arrChecked_Id.length == 0) {
        edu.system.alert("Vui lòng chọn đối tượng?");
        return;
      }
      me.strStudentExamRoomIds = "";
      for (var i = 0; i < arrChecked_Id.length; i++) {
        me.strStudentExamRoomIds += arrChecked_Id[i] + ",";
      }

      me.strStudentExamRoomIds = me.strStudentExamRoomIds.substr(
        0,
        me.strStudentExamRoomIds.length - 1,
      );
      me.get_tblThiSinh_TinhHuongThi();
      me.toggle_edit_TinhHuongThi();
    });
    $("#btn_Refresh").click(function () {
      me.getList_ChiTietPhongThi("1");
    });
    $("#btnAdd_KetThucLamBai").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("KETTHUCLAMBAI", "");
      });
    });
    $("#btnAdd_KetThucLamBai").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("KETTHUCLAMBAI", "");
      });
    });
    $("#btnAdd_LamLaiBaiTuDau").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("KHOITAOLAITHOIGIANLAMBAI", "");
      });
    });
    $("#btnAdd_KhoiTaoLaiDe").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.KhoiTaoLaiDeChoThiSinh();
      });
    });
    $("#btnAdd_TamDung").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("TAMDUNGTHI", "");
      });
    });

    $("#btnAdd_TiepTucLamBai").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("THISINHTIEPTUCLAMBAI", "");
      });
    });
    $("#btnAdd_CongThemThoiGianLamBai").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      if (edu.util.getValById("txtCongThemThoiGianLamBai") == "") {
        edu.system.alert("Chưa nhập số phút?");
        return;
      }
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi(
          "CONGTHEMTHOIGIANLAMBAI",
          edu.util.getValById("txtCongThemThoiGianLamBai"),
        );
      });
    });
    $("#btnAdd_ViphamQuyCheThi").click(function () {
      if (me.strStudentExamRoomIds == 0) {
        edu.system.alert("Chưa chọn đối tượng?");
        return;
      }
      edu.system.confirm("Bạn có chắc chắn thực hiện?");
      $("#btnYes").click(function (e) {
        $("#myModalAlert #alert_content").html("");
        me.XulyTinhHuongThi("KETTHUCLAMBAI", "");
        me.Save_ViPhamQuyCheThi();
      });
    });
    $("#btnThucHienTacVu").click(function () {
      if (edu.util.getValById("drpTacVu") == "") {
        edu.system.alert("Bạn chưa chọn tác vụ cần thực hiện");
        return;
      }

      if (edu.util.getValById("drpTacVu") == "MOPHONGTHI") {
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        if (arrChecked_Id.length == 0) {
          edu.system.alert("Vui lòng chọn phòng thi cần mở?");
          return;
        }
        edu.system.confirm("Bạn có chắc chắn mở phòng thi?");
        $("#btnYes").click(function (e) {
          $("#myModalAlert #alert_content").html("");
          for (var i = 0; i < arrChecked_Id.length; i++) {
            me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "MOPHONGTHI");
          }
        });
        setTimeout(function () {
          me.getList_PhongThi();
        }, 2000);
      }
      if (edu.util.getValById("drpTacVu") == "DONGPHONGTHI") {
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        if (arrChecked_Id.length == 0) {
          edu.system.alert("Vui lòng chọn phòng thi cần đóng?");
          return;
        }
        edu.system.confirm("Bạn có chắc chắn đóng phòng thi?");
        $("#btnYes").click(function (e) {
          $("#myModalAlert #alert_content").html("");
          for (var i = 0; i < arrChecked_Id.length; i++) {
            me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "DONGPHONGTHI");
          }
        });
        setTimeout(function () {
          me.getList_PhongThi();
        }, 2000);
      }
      if (edu.util.getValById("drpTacVu") == "ANPHONGTHI") {
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        if (arrChecked_Id.length == 0) {
          edu.system.alert("Vui lòng chọn phòng thi cần ẩn?");
          return;
        }
        edu.system.confirm("Bạn có chắc chắn ẩn phòng thi?");
        $("#btnYes").click(function (e) {
          $("#myModalAlert #alert_content").html("");
          for (var i = 0; i < arrChecked_Id.length; i++) {
            me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "ANPHONGTHI");
          }
        });
        setTimeout(function () {
          me.getList_PhongThi();
        }, 2000);
      }
      if (edu.util.getValById("drpTacVu") == "HIENPHONGTHI") {
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        if (arrChecked_Id.length == 0) {
          edu.system.alert("Vui lòng chọn phòng thi cần hiển thị?");
          return;
        }
        edu.system.confirm("Bạn có chắc chắn hiển thị phòng thi?");
        $("#btnYes").click(function (e) {
          $("#myModalAlert #alert_content").html("");
          for (var i = 0; i < arrChecked_Id.length; i++) {
            me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "HIENPHONGTHI");
          }
        });
        setTimeout(function () {
          me.getList_PhongThi();
        }, 2000);
      }
    });
  },
  page_load: function () {
    var me = this;
    edu.system.page_load();
    me.getList_drpDonVi();
    me.getList_drpDotThi();
    $(".btnSearch_PhongThi").click(function () {
      me.getList_PhongThi();
    });
    $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
      var strId = this.id;
      me.strExamRoomInfoId = strId;

      var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
      me.strDepartOrganId = dt[0].DEPARTORGANID;

      me.toggle_edit_chitiet();
      me.getList_ChiTietPhongThi("1");
      me.genThongTinDeThiDaTao();
      //me.getList_drpGroupQuestion_GenDeTuDeThiCoSan();
      //me.getList_drpGroupQuestion_TaoDeTuDeThiThuCong();
      //me.getList_drpExamStruct_GenDeTuDeThiCoSan();

      // me.getList_drpGroupQuestion_GenDeTheoCauTrucDeThi();
      //me.getList_drpExamStruct_GenDeTheoCauTrucDeThi();

      setTimeout(function () {
        me.getList_KieuLamBai();
      }, 2000);
    });
  },
  getList_drpDonVi: function () {
    var me = this;

    //--Edit
    var obj_list = {
      action: "QLTTN_ThongTin/LayDS_DonViByUserId_GST",
      strUserId: edu.system.userId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.genList_drpDonVi(data.Data);
          } else {
            edu.system.alert(data.Message);
          }
        },
        error: function (er) {},
        type: "GET",
        contentType: true,
        action: obj_list.action,
        data: obj_list,
      },
      false,
      false,
      false,
      null,
    );
  },
  genList_drpDonVi: function (data) {
    var obj = {
      data: data,
      renderInfor: {
        id: "ID",
        parentId: "",
        name: "NAME",
        code: "",
        avatar: "",
      },
      renderPlace: ["drpDonVi"],
      type: "",
      title: "Chọn đơn vị",
    };
    edu.system.loadToCombo_data(obj);
  },
  getList_drpDotThi: function () {
    var me = this;

    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/LayDS_DotThi",
      strStatus: "1",
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.genList_drpDotThi(data.Data);
          } else {
            edu.system.alert(data.Message);
          }
        },
        error: function (er) {},
        type: "GET",
        contentType: true,
        action: obj_list.action,
        data: obj_list,
      },
      false,
      false,
      false,
      null,
    );
  },
  genList_drpDotThi: function (data) {
    var obj = {
      data: data,
      renderInfor: {
        id: "ID",
        parentId: "",
        name: "NAME",
        code: "",
        avatar: "",
      },
      renderPlace: ["drpDotThi"],
      type: "",
      title: "Chọn đợt thi",
    };
    edu.system.loadToCombo_data(obj);
  },
  getList_PhongThi: function () {
    var me = this;
    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/LayDS_ThongTinPhongThi_GST",
      versionAPI: "v1.0",
      strDonVi_Id: edu.util.getValById("drpDonVi"),
      strDotThi_Id: edu.util.getValById("drpDotThi"),
      strTrangThaiPhongThi: edu.util.getValById("drpTrangThaiPhongThi"),
      strStatus: edu.util.getValById("drpStatus"),
      strTuNgay: edu.util.getValById("txtTuNgay"),
      strDenNgay: edu.util.getValById("txtDenNgay"),
      strTuKhoa: edu.util.getValById("txtSearch_TuKhoa"),
      strNguoiDung_Id: edu.system.userId,
      PageNumber: edu.system.pageIndex_default,
      ItemPerPage: edu.system.pageSize_default,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.dtPhongThi = data.Data;

            me.genTable_PhongThi(data.Data, data.Pager);
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  genTable_PhongThi: function (data, iPager) {
    var me = this;
    $("#lblPhongThi_Tong").html(iPager);
    var jsonForm = {
      strTable_Id: "tblPhongThi",
      aaData: data,
      bPaginate: {
        strFuntionName: "main_doc.QuanLyThi.getList_PhongThi()",
        iDataRow: iPager,
        bInfo: false,
        bLeft: false,
      },
      sort: true,
      colPos: {
        center: [0, 3, 4, 5, 6, 7],
      },
      aoColumns: [
        {
          mDataProp: "ROOMNAME",
        },
        {
          mDataProp: "COURSENAME",
        },
        {
          mDataProp: "EXAMDATE",
        },
        {
          mDataProp: "TENDOTTHI",
        },
        {
          mRender: function (nRow, aData) {
            return aData.OPENSTATUS == "0" ? "Đóng" : "Mở";
          },
        },
        {
          mRender: function (nRow, aData) {
            return aData.STATUS == "0" ? "Ẩn" : "Hiện";
          },
        },
        {
          mDataProp: "SOLUONGTHISINH",
        },
        {
          mRender: function (nRow, aData) {
            return (
              '<span><a class="btn btn-default btnViewChiTiet" id="' +
              aData.ID +
              '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>'
            );
          },
        },
        {
          mRender: function (nRow, aData) {
            return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
          },
        },
      ],
    };
    edu.system.loadToTable_data(jsonForm);
    /*III. Callback*/
  },
  getList_ChiTietPhongThi: function (strCoTinhLaiDiem) {
    var me = this;

    var dt = edu.util.objGetDataInData(
      me.strExamRoomInfoId,
      me.dtPhongThi,
      "ID",
    );

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
      action: "QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua",
      versionAPI: "v1.0",
      strTuKhoa: "",
      strExamRoomInfoId: me.strExamRoomInfoId,
      strNguoiTao_Id: edu.system.userId,
      strCoTinhLaiDiem: strCoTinhLaiDiem,
      strExamStructPartId: edu.util.getValById("drpExamstructPart"),
      PageNumber: edu.system.pageIndex_default,
      ItemPerPage: edu.system.pageSize_default,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;

            me.dtStudentFiles = data.Data.StudentFiles;
            me.genTable_ChiTietPhongThi("1", me.dtChiTietPhongThi, data.Pager);
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  genTable_ChiTietPhongThi: function (strCoTinhLaiDiem, data, iPager) {
    var me = this;
    var iSoThiSinhDuThi = 0;
    var iSoThiSinhKhongDat = 0;
    var iSoThiSinhDat = 0;

    $("#tblChiTietPhongThi tfoot").html(
      '<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="6">Tổng số: ' +
        iSoThiSinhDuThi +
        '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' +
        iSoThiSinhDat +
        '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' +
        iSoThiSinhKhongDat +
        "</td></tr>",
    );

    var jsonForm = {
      strTable_Id: "tblChiTietPhongThi",
      aaData: data,
      sort: true,
      bPaginate: {
        strFuntionName:
          "main_doc.QuanLyThi.getList_ChiTietPhongThi('" +
          strCoTinhLaiDiem +
          "')",
        iDataRow: iPager,
        bInfo: false,
        bLeft: false,
      },
      colPos: {
        center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
        right: [6],
      },
      aoColumns: [
        {
          mRender: function (nRow, aData) {
            var html =
              '<span><img src="' +
              edu.system.rootPath +
              "/Upload/Anh/" +
              aData.STUDENTCODE +
              '.jpg" class= "table-img" id="sl_hinhanh' +
              aData.STUDENTCODE +
              '" /></span>';
            return "<a>" + html + "</br>" + aData.STUDENTCODE + "</a>";
          },
        },
        {
          mRender: function (nRow, aData) {
            return (
              '<span><a class="btn btn-default btnChiTietThiSinh" id="' +
              aData.ID +
              '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i>' +
              aData.FULLNAME +
              "</a></span>"
            );
          },
        },
        {
          mDataProp: "BIRTHDATE_USER",
        },
        {
          mDataProp: "SOBAODANHIMPORT",
        },
        {
          mDataProp: "DETHITHU",
        },
        {
          mRender: function (nrow, aData) {
            var strHTML = "";
            var timeMinute = aData.TIMERCOUNTDOWN;
            if (parseInt(timeMinute) < 0 || aData.FINISHED == "1")
              strHTML =
                aData.DIEMTINH == "" || aData.DIEMTINH == null
                  ? ""
                  : aData.DIEMTINH;
            return strHTML;
          },
        },
        {
          mRender: function (nrow, aData) {
            var strHTML = "";
            var timeMinute = aData.TIMERCOUNTDOWN;
            var strDiem = "";
            //console.log(aData.MARK);
            if (edu.util.returnEmpty(aData.MARK) == "") {
              if (parseInt(timeMinute) < 0 || aData.FINISHED == "1") {
                strDiem =
                  aData.MARK == "" || aData.MARK == null
                    ? edu.util.returnEmpty(aData.DIEMTINH)
                    : edu.util.returnEmpty(aData.MARK);
                strHTML =
                  '<input type ="text" id="txtDiemDuocCongNhan' +
                  aData.STUDENTEXAMROOMPARTID +
                  '" value ="' +
                  strDiem +
                  '" class="form-control" />';
              } else {
                strHTML =
                  '<input type ="text" id="txtDiemDuocCongNhan' +
                  aData.STUDENTEXAMROOMPARTID +
                  '" class="form-control" />';
              }
            } else {
              strHTML =
                '<input type ="text" id="txtDiemDuocCongNhan' +
                aData.STUDENTEXAMROOMPARTID +
                '" value ="' +
                aData.MARK +
                '" class="form-control" />';
            }
            return strHTML;
          },
        },
        {
          mRender: function (nrow, aData) {
            var strHTML = "";
            var idTimer = "timer" + aData.ID.toString();
            var timeMinute = aData.TIMERCOUNTDOWN;

            if (parseFloat(aData.THOIGIANCONLAI) > 0) {
              if (timeMinute != "" && timeMinute != null && timeMinute != "0") {
                if (parseInt(timeMinute) > 0 && aData.FINISHED == "0")
                  strHTML +=
                    "<span style='text-align:center' id='" +
                    idTimer +
                    "'></span>";
                else strHTML += "<span style='text-align:center'>--:--</span>";
              }
            } else if (parseInt(timeMinute) <= 0)
              strHTML = "<span style='color: Violet' >Kết thúc</span>";
            if (
              aData.TIMESTARTDOEXAM_TEXT == null ||
              aData.TIMESTARTDOEXAM_TEXT == ""
            )
              strHTML = "<span style='color: Green' >Chưa thi</span>";
            if (aData.FINISHED == "1")
              strHTML = "<span style='color: red' >Thi xong</span>";

            if (aData.FINISHED != "1" && aData.STATUS == "TAMDUNGTHI")
              strHTML = "<span style='color: red' >Tạm dừng thi</span>";

            if (
              timeMinute != "" &&
              timeMinute != null &&
              timeMinute != "0" &&
              parseInt(timeMinute) > 0 &&
              aData.FINISHED == "0"
            ) {
              $("#" + idTimer).html("");
              me.countdown(aData.TIMERSHOW, idTimer);
            }
            if (edu.util.getValById("drpExamstructPart") == "") strHTML = "";
            return strHTML;
          },
        },
        {
          mDataProp: "TIMEHHMISSSTARTDOEXAM",
        },
        {
          mDataProp: "DIACHIIPMAYDADANGNHAP",
        },
        {
          mRender: function (nrow, aData) {
            var strHTML = "";
            if (edu.util.returnEmpty(aData.TENVIPHAMQUYCHETHI) != "")
              strHTML =
                "<span style='color:red;'>" +
                aData.TENVIPHAMQUYCHETHI +
                "</span>";
            strHTML +=
              '<input type ="text" id="txtGhiChu' +
              aData.STUDENTEXAMROOMPARTID +
              '" value ="' +
              edu.util.returnEmpty(aData.GHICHU) +
              '" class="form-control" />';
            return strHTML;
          },
        },
        {
          mRender: function (nRow, aData) {
            var dt = edu.util.objGetDataInData(
              aData.STUDENTEXAMROOMPARTID,
              me.dtStudentFiles,
              "DULIEU_ID",
            );
            var rootPathUploadFile = edu.system.rootPathUpload;
            var strReturn = "";
            if (dt.length > 0) {
              for (var idl = 0; idl < dt.length; idl++)
                strReturn +=
                  '<a id="' +
                  dt[idl].ID +
                  '" href="' +
                  rootPathUploadFile +
                  "/" +
                  dt[idl].DUONGDAN +
                  '">' +
                  dt[idl].TENHIENTHI +
                  "</a>";
            }

            strReturn +=
              '<span><a class="btn btn-default btnChiTietBaiThi" id="' +
              aData.ID +
              '" title="Chi tiết bài thi"><i class="fa fa-eye color-active"></i>Chi tiết bài thi</a></span>';
            return strReturn;
          },
        },
        {
          mRender: function (nRow, aData) {
            return (
              '<input type="checkbox" style="display:none" class="checkStudentExamRoomPartID" id="checkStudentExamRoomPartID' +
              aData.STUDENTEXAMROOMPARTID +
              '" value="' +
              aData.STUDENTEXAMROOMPARTID +
              '"/>' +
              '<input type="checkbox" id="checkX' +
              aData.ID +
              '"/>'
            );
          },
        },
      ],
    };
    edu.system.loadToTable_data(jsonForm);
    /*III. Callback*/
  },
  genThongTinDeThiDaTao: function () {
    var me = this;
    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail",
      versionAPI: "v1.0",
      strExamRoomInfoId: me.strExamRoomInfoId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            var dt = data.Data[0];
            edu.util.viewHTMLById("lblKieuTaoDe_TaoDeThi", dt.GENSTYLETEXT);
            edu.util.viewHTMLById("lblCauTrucDe_TaoDeThi", dt.EXAMSTRUCTNAME);
            edu.util.viewHTMLById("lblTongSoCau_TaoDeThi", dt.TOLTALQUESTION);
            edu.util.viewHTMLById("lblTrangThai_TaoDeThi", dt.DATAODE);
            edu.util.viewHTMLById("lblDeThi_TaoDeThi", dt.WRITETENEXAMNAME);

            edu.util.viewHTMLById(
              "lblKieuTaoDe_TaoDeTuDeThiThuCong",
              dt.GENSTYLETEXT,
            );
            edu.util.viewHTMLById(
              "lblCauTrucDe_TaoDeTuDeThiThuCong",
              dt.EXAMSTRUCTNAME,
            );
            edu.util.viewHTMLById(
              "lblTongSoCau_TaoDeTuDeThiThuCong",
              dt.TOLTALQUESTION,
            );
            edu.util.viewHTMLById(
              "lblTrangThai_TaoDeTuDeThiThuCong",
              dt.DATAODE,
            );
            edu.util.viewHTMLById(
              "lblDeThi_TaoDeTuDeThiThuCong",
              dt.WRITETENEXAMNAME,
            );

            edu.util.viewHTMLById("lblKieuTaoDe_ChiTiet", dt.GENSTYLETEXT);
            edu.util.viewHTMLById("lblCauTrucDe_ChiTiet", dt.EXAMSTRUCTNAME);
            edu.util.viewHTMLById("lblTongSoCau_ChiTiet", dt.TOLTALQUESTION);
            edu.util.viewHTMLById("lblTrangThai_ChiTiet", dt.DATAODE);
            edu.util.viewHTMLById("lblDeThi_ChiTiet", dt.WRITETENEXAMNAME);

            edu.util.viewHTMLById("lblKieuTaoDe_TinhHuongThi", dt.GENSTYLETEXT);
            edu.util.viewHTMLById(
              "lblCauTrucDe_TinhHuongThi",
              dt.EXAMSTRUCTNAME,
            );
            edu.util.viewHTMLById(
              "lblTongSoCau_TinhHuongThi",
              dt.TOLTALQUESTION,
            );
            edu.util.viewHTMLById("lblTrangThai_TinhHuongThi", dt.DATAODE);
            edu.util.viewHTMLById("lblDeThi_TinhHuongThi", dt.WRITETENEXAMNAME);
            me.strExamStructId = dt.EXAMSTRUCTID;
            me.getList_KieuLamBai();
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },

  getList_KieuLamBai: function () {
    var me = this;

    var obj_list = {
      action: "QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart",
      versionAPI: "v1.0",
      strTuKhoa: "",
      strExamStructId: me.strExamStructId,
      strNguoiDung_Id: edu.system.userId,
      PageNumber: 1,
      ItemPerPage: 1000000,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            var dtMatKhauPhanThi;
            var dataExamPart = data.Data.filter((e) => e.PARENTID === null);
            dtMatKhauPhanThi = me.LayDS_MatKhauPhanThi();

            me.genList_KieuLamBai(dataExamPart, dtMatKhauPhanThi);
            me.genList_drpExamstructPart(dataExamPart);
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.endLoading();
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  LayDS_MatKhauPhanThi: function () {
    var me = this;
    var dt = null;
    var obj_list = {
      action: "TTN_ThiSinh/LayDS_MatKhauPhanThi",
      versionAPI: "v1.0",
      strExamRoomInfoId: me.strExamRoomInfoId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            dt = data.Data;
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.endLoading();
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        async: false,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );

    return dt;
  },
  genList_KieuLamBai: function (dataKieuLamBai, dtMatKhauPhanThi) {
    var me = this;
    var row = "";
    var rowMatKhauDeThi = "";
    $("#zoneKieuLamBai").html("");
    $("#zoneMatKhauDeThi").html("");

    for (var i = 0; i < dataKieuLamBai.length; i++) {
      row +=
        '<div class="col-lg-4 checkbox-inline user-check-print; pull-left">';
      row +=
        '<input style="float: left; margin-right: 5px" type="checkbox" id="' +
        dataKieuLamBai[i].ID +
        '" class="chkExamStruct" title="' +
        dataKieuLamBai[i].KIEULAMBAITHI +
        '" />';
      row += "<span><p>" + dataKieuLamBai[i].TITLE + "</p></span>";
      row += "</div>";
      var dt = edu.util.objGetDataInData(
        dataKieuLamBai[i].ID,
        dtMatKhauPhanThi,
        "EXAMSTRUCTPARTID",
      );
      var strMK = "";
      if (dt.length > 0) strMK = edu.util.returnEmpty(dt[0].MATKHAUPHANTHI);

      rowMatKhauDeThi += '<div class="row">';
      rowMatKhauDeThi +=
        '<span style="float:left;"><p> Mật khẩu phần ' +
        dataKieuLamBai[i].TITLE;
      rowMatKhauDeThi +=
        '<input class="form-control" style="width:100px; float: right;" type="text" id="txt' +
        dataKieuLamBai[i].ID +
        '"  title="' +
        dataKieuLamBai[i].KIEULAMBAITHI +
        '" value="' +
        strMK +
        '"/>';
      rowMatKhauDeThi += "</p></span>" + "</div>";
    }

    $("#zoneKieuLamBai").html(row);
    $("#zoneMatKhauDeThi").html(rowMatKhauDeThi);
    console.log(rowMatKhauDeThi);
  },
  genList_drpExamstructPart: function (data) {
    var obj = {
      data: data,
      renderInfor: {
        id: "ID",
        parentId: "",
        name: "TITLE",
        code: "",
        avatar: "",
      },
      renderPlace: ["drpExamstructPart"],
      type: "",
      title: "Chọn phần thi",
    };
    edu.system.loadToCombo_data(obj);
  },
  toggle_edit_chitiet: function () {
    var me = this;
    edu.util.toggle_overide("zone-bus", "zoneChiTiet");
  },

  toggle_batdau: function () {
    var me = this;
    edu.util.toggle_overide("zone-bus", "zonebatdau");
  },
  gen_KetQuaThi: function () {
    var me = this;

    var obj_list = {
      action: "TTN_ThiSinh/gen_KetQuaThi",
      versionAPI: "v1.0",
      strExamRoomInfoId: me.strExamRoomInfoId,
      strStudentExamRoomId: me.strStudentExamRoomId,
      strThiSinhId: me.strThiSinhId,
      strUserId: edu.system.userId,
    };

    $("#ThongTinBaiThi").html("");
    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            $("#ThongTinBaiThi").html(data.Data);
          } else {
            edu.system.alert(data.Message);
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  closeKetQuaThi: function () {
    var me = this;
    $("#zoneChiTiet").show();
    $("#zoneKetQuaThi").slideUp();
  },
  printPhieu: function () {
    var me = this;
    edu.extend.remove_PhoiIn("ThongTinBaiThi");
    edu.util.printHTML("ThongTinBaiThi");
    //  me.closePhieu();
  },
  countdown: function (timeCountdown, container) {
    var me = this;
    var t = timeCountdown;
    //console.log("timeCountdown: ", t);
    var current_seconds = Math.floor((t / 1000) % 60); //t.seconds;
    var seconds;

    if (current_seconds != 0) seconds = current_seconds + 1;
    else seconds = 60;
    var mins = Math.floor((t / 1000 / 60) % 60); //t.minutes;
    var hours = Math.floor((t / 1000 / (60 * 60)) % 60);

    var strColour = "orange";
    if (mins <= 3 && hours == 0 && seconds % 2 == 0) strColour = "red";
    //console.log("hours: ", hours + " mins: ", mins + " seconds: " + seconds);
    //clearInterval(tick());
    function tick() {
      if ($("#" + container) != null) {
        seconds--;
        //console.log("mins: ", mins + " seconds: " + seconds);
        $("#" + container).html(
          "<span style='text-align:center; color: " +
            strColour +
            "'>" +
            (hours > 0 ? hours.toString() + ":" : "") +
            (mins < 10 ? "0" : "") +
            mins.toString() +
            ":" +
            (seconds < 10 ? "0" : "") +
            seconds.toString() +
            "</span>",
        );
        //var  = "<span style='text-align:center; color: " + strColour + "'>" + mins.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString() + "</span>";

        if (seconds > 0) {
          setTimeout(tick, 1000);
        } else {
          //console.log("mins1: ", mins);
          if (t > 60000) {
            //mins > 1 || (mins == 1 && hours > 0)
            var newCountdown = hours * 3600000 + (mins - 1) * 60000;
            //console.log("newCountdown: ", newCountdown);
            setTimeout(function () {
              me.countdown(newCountdown, container);
            }, 1000);
          } else if (mins == 1) {
            setTimeout(function () {
              me.countdown(60000 - 0.01, container);
            }, 1000);
          }
        }
      }
    }
    tick();
  },
  get_tblThiSinh_TinhHuongThi: function () {
    var me = this;
    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/LayDS_ThiSinh_TinhHuongThi",
      versionAPI: "v1.0",
      strExamRoomInfoId: me.strExamRoomInfoId,
      strStudentExamRoomIds: me.strStudentExamRoomIds,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.gen_tblThiSinh_TinhHuongThi(data.Data);
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  gen_tblThiSinh_TinhHuongThi: function (data) {
    var me = this;

    var jsonForm = {
      strTable_Id: "tblThiSinh_TinhHuongThi",
      aaData: data,
      sort: true,
      colPos: {
        center: [0, 1, 3, 4, 5, 7, 8],
      },
      aoColumns: [
        {
          mDataProp: "STUDENTCODE",
        },
        {
          mDataProp: "FULLNAME",
        },
        {
          mDataProp: "BIRTHDATE_USER",
        },
        {
          mDataProp: "SOBAODANHIMPORT",
        },
        {
          mDataProp: "MARK",
        },
        {
          mDataProp: "TRANGTHAILAMBAICACPHANTHI",
        },
        {
          mDataProp: "TIMEHHMISSSTARTDOEXAM",
        },
        {
          mDataProp: "TENMAYDADANGNHAP",
        },
      ],
    };
    edu.system.loadToTable_data(jsonForm);
    /*III. Callback*/
  },
  toggle_edit_TinhHuongThi: function () {
    var me = this;
    edu.util.toggle_overide("zone-bus", "zoneTinhHuongThi");
  },
  XulyTinhHuongThi: function (strKhoiTaoNote, strAddTime) {
    var me = this;
    var strExamstructPartIds = edu.extend
      .getCheckedCheckBoxByClassName("chkExamStruct")
      .toString();

    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/XulyTinhHuongThi",
      versionAPI: "v1.0",
      strStudentExamRoomIds: me.strStudentExamRoomIds,
      strKhoiTaoNote: strKhoiTaoNote,
      strAddTime: strAddTime,
      strExamstructPartIds: strExamstructPartIds,
      strNguoiThucHienId: edu.system.userId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.get_tblThiSinh_TinhHuongThi();
            me.getList_ChiTietPhongThi("1");
            edu.system.alert("Thực hiện thành công");
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  Save_ViPhamQuyCheThi: function () {
    var me = this;
    var strExamstructPartIds = edu.extend
      .getCheckedCheckBoxByClassName("chkExamStruct")
      .toString();

    if (strExamstructPartIds == "") {
      edu.system.alert("Bạn chưa chọn phần thi");
      return;
    }

    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/Save_ViPhamQuyCheThi",
      versionAPI: "v1.0",
      strStudentExamRoomIds: me.strStudentExamRoomIds,
      strExamstructPartIds: strExamstructPartIds,
      strViPhamQuyCheThiId: edu.util.getValById("drpViPhamQuyChe"),
      strNguoiThucHienId: edu.system.userId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.get_tblThiSinh_TinhHuongThi();
            me.getList_ChiTietPhongThi("1");
            edu.system.alert("Thực hiện thành công");
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  KhoiTaoLaiDeChoThiSinh: function () {
    var me = this;
    var strExamstructPartIds = edu.extend
      .getCheckedCheckBoxByClassName("chkExamStruct")
      .toString();
    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/KhoiTaoLaiDeChoThiSinh",
      versionAPI: "v1.0",
      strExamRoomInfoId: me.strExamRoomInfoId,
      strStudentExamRoomIds: me.strStudentExamRoomIds,
      strExamstructPartIds: strExamstructPartIds,
      strNguoiThucHienId: edu.system.userId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            me.get_tblThiSinh_TinhHuongThi();
            me.getList_ChiTietPhongThi("1");
            edu.system.alert("Thực hiện thành công");
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
  ThaoTacPhongThi_PhongThi: function (strIds, strThaoTacPhongThi) {
    var me = this;
    //--Edit
    var obj_list = {
      action: "QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi",
      versionAPI: "v1.0",
      strExamRoomInfoId: strIds,
      strThaoTacPhongThi: strThaoTacPhongThi,
      strNguoiThucHien_Id: edu.system.userId,
    };

    edu.system.makeRequest(
      {
        success: function (data) {
          if (data.Success) {
            edu.system.alert("Cập nhật thành công");
          } else {
            edu.system.alert(
              obj_list.action + " (er): " + JSON.stringify(data.Message),
              "w",
            );
          }
        },
        error: function (er) {
          edu.system.alert(
            obj_list.action + " (er): " + JSON.stringify(er),
            "w",
          );
        },
        type: "GET",
        action: obj_list.action,
        versionAPI: obj_list.versionAPI,
        contentType: true,
        authen: true,
        data: obj_list,
        fakedb: [],
      },
      false,
      false,
      false,
      null,
    );
  },
};
