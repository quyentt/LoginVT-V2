function QuanLySoVaoSo() { }

QuanLySoVaoSo.prototype = {
	dtQuyTacSinhSo: [],
	dtSoVaoSo: [],

	init: function () {
		var me = this;

		me.getList_QuyTacSinhSo();
		$("#btnXemSoVaoSo").click(function () {
			me.getList_SoVaoSo();
		});
		$("#txtSoChungTu, #txtNamThucHien").keypress(function (e) {
			if (e.which === 13) {
				e.preventDefault();
				me.getList_SoVaoSo();
			}
		});
		$("#tblSoVaoSo").delegate(".btnDetailSoVaoSo", "click", function () {
			me.getDetail_SoVaoSo(this.id);
		});
		$("#btnThemSoVaoSo").click(function () {
			me.openForm_SoVaoSo();
		});
		$("#btnLuuSoVaoSoThuCong").click(function () {
			me.save_SoVaoSoThuCong();
		});
		$("#tblSoVaoSo").delegate(".btnEditSoVaoSo", "click", function () {
			me.getDetail_SoVaoSo(this.id, true);
		});
		$("#tblSoVaoSo").delegate(".btnDeleteSoVaoSo", "click", function () {
			me.delete_SoVaoSo(this.id);
		});
		$("#btnCloseChiTietSoVaoSo, #btnDongChiTietSoVaoSo").click(function () {
			$("#modalChiTietSoVaoSo").modal("hide");
		});
		$("#btnCloseSoVaoSoThuCong, #btnDongSoVaoSoThuCong").click(function () {
			$("#modalSoVaoSoThuCong").modal("hide");
		});
	},

	getList_QuyTacSinhSo: function () {
		var me = this;
		var objList = {
			action: "TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP",
			func: "PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad",
			iM: edu.system.iM,
			strNguoiThucHien_Id: edu.system.userId
		};

		edu.system.makeRequest({
			success: function (data) {
				if (data.Success) {
					me.dtQuyTacSinhSo = data.Data || [];
					me.loadCombo_QuyTacSinhSo(me.dtQuyTacSinhSo);
				}
				else {
					edu.system.alert(objList.action + ": " + data.Message, "w");
				}
			},
			error: function (er) {
				edu.system.alert(objList.action + " (er): " + JSON.stringify(er), "w");
			},
			type: "POST",
			action: objList.action,
			contentType: true,
			data: objList,
			fakedb: []
		}, false, false, false, null);
	},

	loadCombo_QuyTacSinhSo: function (data) {
		edu.system.loadToCombo_data({
			data: data,
			renderInfor: {
				id: "ID",
				parentId: "",
				name: "TEN",
				code: "",
				avatar: ""
			},
			renderPlace: ["dropQuyTacSinhSo", "dropQuyTacSinhSoThuCong"],
			type: "",
			title: "--Chọn quy tắc sinh số--"
		});
	},

	getList_SoVaoSo: function () {
		var me = this;
		var objList = {
			action: "TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0Hg0gOAUgLykSICIp",
			func: "PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayDanhSach",
			iM: edu.system.iM,
			strTN_HeThongChungTu_Ad_Id: edu.util.getValById("dropQuyTacSinhSo"),
			strNamThucHien: edu.util.getValById("txtNamThucHien"),
			strSoChungTu: edu.util.getValById("txtSoChungTu"),
			strNguoiThucHien_Id: edu.system.userId,
			pageIndex: edu.system.pageIndex_default,
			pageSize: edu.system.pageSize_default
		};

		edu.system.makeRequest({
			success: function (data) {
				if (data.Success) {
					me.dtSoVaoSo = data.Data || [];
					me.genTable_SoVaoSo(me.dtSoVaoSo, data.Pager);
				}
				else {
					edu.system.alert(objList.action + ": " + data.Message, "w");
				}
			},
			error: function (er) {
				edu.system.alert(objList.action + " (er): " + JSON.stringify(er), "w");
			},
			type: "POST",
			action: objList.action,
			contentType: true,
			data: objList,
			fakedb: []
		}, false, false, false, null);
	},

	genTable_SoVaoSo: function (data, pager) {
		var me = this;
		edu.system.loadToTable_data({
			strTable_Id: "tblSoVaoSo",
			aaData: data,
			iPager: pager,
			colPos: {
				center: [0, 1, 2, 4, 5, 6, 7, 8, 9]
			},
			aoColumns: [
				{ "mDataProp": "CHISO" },
				{ "mDataProp": "SOCHUNGTU" },
				{ "mDataProp": "HETHONGCHUNGTU_MA" },
				{ "mDataProp": "NGAYTHUCHIEN" },
				{ "mDataProp": "NAMTHUCHIEN" },
				{
					"mRender": function (nRow, aData) {
						return me.getNhapThuCongLabel(aData.IS_NHAP_THUCONG);
					}
				},
				{
					"mRender": function (nRow, aData) {
						return me.getDaSuDungLabel(aData.DA_SU_DUNG);
					}
				},
				{
					"mRender": function (nRow, aData) {
						return '<a class="btn btn-default btn-sm btnDetailSoVaoSo" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i></a>';
					}
				},
				{
					"mRender": function (nRow, aData) {
						if (String(aData.IS_NHAP_THUCONG) !== "1") {
							return '<span class="text-muted">-</span>';
						}
						return '<a class="btn btn-default btn-sm btnEditSoVaoSo" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a> ' +
							'<a class="btn btn-default btn-sm btnDeleteSoVaoSo" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-danger"></i></a>';
					}
				}
			]
		});
	},

	getNhapThuCongLabel: function (value) {
		return String(value) === "1" ? "Thủ công" : "Tự động";
	},

	getDaSuDungLabel: function (value) {
		return String(value) === "1" ? "Đã sử dụng" : "Chưa sử dụng";
	},

	getDetail_SoVaoSo: function (id, isEdit) {
		var me = this;
		if (!id) {
			return;
		}

		var objDetail = {
			action: "TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0Hg0gOBUpJC4IJQPP",
			func: "PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayTheoId",
			iM: edu.system.iM,
			strId: id,
			strNguoiThucHien_Id: edu.system.userId
		};

		edu.system.makeRequest({
			success: function (data) {
				if (data.Success) {
					if (isEdit) {
						me.openForm_SoVaoSo(data.Data);
					}
					else {
						me.renderDetail_SoVaoSo(data.Data);
						$("#modalChiTietSoVaoSo").modal("show");
					}
				}
				else {
					edu.system.alert(objDetail.action + ": " + data.Message, "w");
				}
			},
			error: function (er) {
				edu.system.alert(objDetail.action + " (er): " + JSON.stringify(er), "w");
			},
			type: "POST",
			action: objDetail.action,
			contentType: true,
			data: objDetail,
			fakedb: []
		}, false, false, false, null);
	},

	openForm_SoVaoSo: function (data) {
		var detail = data;
		if ($.isArray(data)) {
			detail = data.length ? data[0] : {};
		}
		detail = detail || {};
		$("#txtSoVaoSo_Id").val(detail.ID || "");
		$("#txtChiSoThuCong").val(detail.CHISO || "");
		$("#txtSoChungTuThuCong").val(detail.SOCHUNGTU || "");
		$("#txtNamThucHienThuCong").val(detail.NAMTHUCHIEN || "");
		$("#dropQuyTacSinhSoThuCong").val(detail.HETHONGCHUNGTU_AD_ID || detail.TN_HETHONGCHUNGTU_AD_ID || "").trigger("change");
		$("#lblTieuDeSoVaoSoThuCong").text(detail.ID ? "Sửa thủ công" : "Thêm mới thủ công");
		$("#modalSoVaoSoThuCong").modal("show");
	},

	save_SoVaoSoThuCong: function () {
		var me = this;
		var id = $("#txtSoVaoSo_Id").val();
		var ruleId = $("#dropQuyTacSinhSoThuCong").val();
		var soChungTu = $.trim($("#txtSoChungTuThuCong").val());
		var chiSo = $.trim($("#txtChiSoThuCong").val());
		var namThucHien = $.trim($("#txtNamThucHienThuCong").val());
		if (!ruleId || !soChungTu || !chiSo || !namThucHien) {
			edu.system.alert("Vui lòng nhập đầy đủ thông tin.");
			return;
		}

		var objSave = {
			action: id ? "TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhI0IB4VKTQCLi8m" : "TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhUpJCwMLigeFSk0Ai4vJgPP",
			func: id ? "PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_Sua_ThuCong" : "PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_ThemMoi_ThuCong",
			iM: edu.system.iM,
			strId: id,
			strSoChungTu: soChungTu,
			dChiSo: chiSo,
			strTN_HeThongChungTu_Ad_Id: ruleId,
			strNamThucHien: namThucHien,
			strNguoiThucHien_Id: edu.system.userId
		};

		edu.system.makeRequest({
			success: function (data) {
				if (data.Success) {
					edu.system.alert(id ? "Cập nhật thành công!" : "Thêm mới thành công!");
					$("#modalSoVaoSoThuCong").modal("hide");
					me.getList_SoVaoSo();
				}
				else {
					edu.system.alert(objSave.action + ": " + data.Message, "w");
				}
			},
			error: function (er) {
				edu.system.alert(objSave.action + " (er): " + JSON.stringify(er), "w");
			},
			type: "POST",
			action: objSave.action,
			contentType: true,
			data: objSave,
			fakedb: []
		}, false, false, false, null);
	},

	delete_SoVaoSo: function (id) {
		var me = this;
		if (!id) {
			return;
		}
		edu.system.confirm("Bạn có chắc chắn xóa số vào sổ này không?");
		$("#btnYes").off("click.quanLySoVaoSo").one("click.quanLySoVaoSo", function () {
			var objDelete = {
				action: "TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhkuIB4VKTQCLi8m",
				func: "PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_Xoa_ThuCong",
				iM: edu.system.iM,
				strId: id,
				strNguoiThucHien_Id: edu.system.userId
			};
			edu.system.makeRequest({
				success: function (data) {
					if (data.Success) {
						edu.system.alert("Xóa thành công!");
						me.getList_SoVaoSo();
					}
					else {
						edu.system.alert(objDelete.action + ": " + data.Message, "w");
					}
				},
				error: function (er) {
					edu.system.alert(objDelete.action + " (er): " + JSON.stringify(er), "w");
				},
				type: "POST",
				action: objDelete.action,
				contentType: true,
				data: objDelete,
				fakedb: []
			}, false, false, false, null);
		});
	},

	renderDetail_SoVaoSo: function (data) {
		var detail = data;
		if ($.isArray(data)) {
			detail = data.length ? data[0] : {};
		}
		detail = detail || {};

		var html = '<div class="table-responsive"><table class="table table-bordered table-hover mb-0">';
		$.each(detail, function (key, value) {
			var displayValue = value;
			if (key === "IS_NHAP_THUCONG") {
				displayValue = this.getNhapThuCongLabel(value);
			}
			else if (key === "DA_SU_DUNG") {
				displayValue = this.getDaSuDungLabel(value);
			}
			html += '<tr><th style="width:35%">' + key + '</th><td>' + edu.util.returnEmpty(displayValue) + '</td></tr>';
		}.bind(this));
		html += '</table></div>';
		$("#zoneChiTietSoVaoSo").html(html);
	}
};
