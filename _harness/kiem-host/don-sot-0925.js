// Dọn tồn của lượt thử ghi 2026-09-25 (người dùng cho phép: "thử ghi tất cả, xong phải xoá")
//  1. MST hồ sơ tài khoản thử → "0001" (giá trị trước lượt thử, ảnh 025_9FE0_25): ThemMoi giảm trừ TẠM mang MST 0001
//     → Xoa bản ghi tạm (đúng đường đã ghi lan vào hồ sơ).
//  2. Nhiệm vụ chiến lược: xoá dòng mang dấu ZKT, in phản hồi máy chủ, kiểm lại.
const { connect } = require('./cdp');
const ROLE = '9FE0F1BECB90438AA17FEDB72DAE48F4';
(async () => {
  const b = await connect();
  await b.ev(`location.hash='#/r/${ROLE}'; location.reload()`).catch(() => {});
  await b.sleep(1500);
  await b.waitFor('window.ums && ums.api && ums.session && ums.session.userId && document.readyState==="complete"', 30000);
  await b.waitFor(`ums.state.menu && ums.state.roleId==='${ROLE}'`, 30000);
  await b.ev(`location.hash='#/r/${ROLE}/375B7B629FF74BB08363EBC1873E254E'`); await b.sleep(3000);
  await b.say('Khôi phục MST hồ sơ tài khoản thử về 0001');
  const R1 = await b.ev(`(async function(){
    var C='L_GiamTruGiaCanh', u=ums.session.userId, out=[];
    var L=function(){return ums.api.call({action:C+'/LayDanhSach',method:'GET',strTuKhoa:'',strNhanSu_HoSoCanBo_Id:u,strNguoiThucHien_Id:'',pageIndex:1,pageSize:100}).then(function(r){return Array.isArray(r.data)?r.data:[]})};
    var f=function(a){return a.map(function(x){return x.ID.slice(0,8)+' MST='+x.NHANSU_HOSOCANBO_MASOTHUE+' HOTEN='+x.HOTEN}).join(' ; ')};
    var a=await L(); out.push('truoc: '+f(a));
    var x={action:C+'/ThemMoi',strId:'',strMaSoThue:'0001',strHoTen:'ZKTKHOIPHUC',strNhanSu_HoSoCanBo_Id:u,strNguoiThucHien_Id:u};
    ['strNgaySinh','strThangSinh','strNamSinh','strQuocTich_Id','strCMTND','strHoChieu','strTheCanCuoc','strMaSoThueNguoiPhuThuoc','strQuanHeVoiNguoiNopThue_Id','strGiayKhaiSinh_So','strGiayKhaiSinh_Quyen','strGiayKhaiSinh_QuocGia_Id','strGiayKhaiSinh_TinhThanh_Id','strGiayKhaiSinh_QuanHuyen_Id','strGiayKhaiSinh_PhuongXa_Id','strTuThang','strTuNam','strDenThang','strDenNam'].forEach(function(k){x[k]=''});
    await ums.api.call(x);
    var tam=(await L()).filter(function(y){return y.HOTEN==='ZKTKHOIPHUC'});
    if(tam.length===1){ await ums.api.call({action:C+'/Xoa',strIds:tam[0].ID,strNguoiThucHien_Id:u}); out.push('xoa tam '+tam[0].ID); } else out.push('!! thay '+tam.length+' dong tam — KHONG xoa');
    out.push('sau: '+f(await L()));
    return out;})()`);
  R1.forEach(x => b.log('  ' + x));

  await b.ev(`location.hash='#/r/${ROLE}/4FBA625FE8464CEC83C5553C93980D8E'`); await b.sleep(3000);
  await b.say('Xoá bản ghi thử ở Nhiệm vụ chiến lược');
  const R2 = await b.ev(`(async function(){
    var C='NS_QT_NhiemVuChienLuoc', u=ums.session.userId, out=[];
    var L=function(){return ums.api.call({action:C+'/LayDanhSach',method:'GET',strNhanSu_HoSoCanBo_Id:u}).then(function(r){return Array.isArray(r.data)?r.data:[]}).catch(function(e){out.push('LayDanhSach LOI '+e.message);return [];})};
    var a=(await L()).filter(function(x){return /ZKT/.test(JSON.stringify(x))}); out.push('mang dau: '+a.map(function(x){return x.ID}).join(','));
    for(var i=0;i<a.length;i++){ for (var k of ['strIds','strId']) { var o={action:C+'/Xoa',strNguoiThucHien_Id:u}; o[k]=a[i].ID;
      try{ var r=await ums.api.call(o); out.push('Xoa '+k+' -> '+JSON.stringify(r.raw).slice(0,200)); }catch(e){ out.push('Xoa '+k+' LOI '+e.message); }
      if(!(await L()).some(function(x){return x.ID===a[i].ID})) { out.push('  da mat sau '+k); break; } } }
    out.push('con mang dau: '+(await L()).filter(function(x){return /ZKT/.test(JSON.stringify(x))}).length);
    return out;})()`);
  R2.forEach(x => b.log('  ' + x));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
