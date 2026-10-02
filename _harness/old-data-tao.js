// node _harness/old-data-tao.js
// Sinh _harness/old-data.js — vai trò + cây chức năng cho _harness/index-old.html (vỏ CŨ indexi).
//
// Nguồn:
//   1. _harness/gui-help/mapping-chuc-nang_*.json  (bản mới nhất) — toàn bộ chức năng trong CSDL,
//      xuất từ host bằng kiem-host/xuat-mapping.js. Mỗi ỨNG DỤNG trong tệp thành một vai trò.
//   2. Cây thư mục Apis*/Modules/*/html/*.html — tệp nào không mục menu nào trỏ tới thì gom vào
//      nhóm "Tệp ngoài menu" của đúng phân hệ, để màn nào cũng mở được.
// Máy khác chỉ cần chép old-data.js; chạy lại tệp này khi có bản xuất mới hoặc cây thư mục đổi.
const fs = require('fs');
const path = require('path');

const GOC = path.resolve(__dirname, '..');
const DIR_MAP = path.join(__dirname, 'gui-help');

function docMapping() {
    if (!fs.existsSync(DIR_MAP)) return null;
    const ds = fs.readdirSync(DIR_MAP).filter(f => /^mapping-chuc-nang_.*\.json$/.test(f)).sort();
    if (!ds.length) return null;
    const tep = ds[ds.length - 1];
    return { tep, m: JSON.parse(fs.readFileSync(path.join(DIR_MAP, tep), 'utf8')) };
}

// Tìm mục con không phân biệt hoa thường (CSDL ghi "modules", thư mục là "Modules")
function con(dir, ten) {
    let ds;
    try { ds = fs.readdirSync(dir); } catch (e) { return null; }
    const t = ten.toLowerCase();
    return ds.find(x => x.toLowerCase() === t) || null;
}
function timTep(rel) {
    let dir = GOC; const ra = [];
    for (const p of rel.split('/').filter(Boolean)) {
        const c = con(dir, p);
        if (!c) return null;
        ra.push(c); dir = path.join(dir, c);
    }
    return ra;
}

// Mọi màn trong cây thư mục: { 'apisxxx/modules/m/html/t.html': [ApisXxx, Modules, m, html, t.html] }
function quetCay() {
    const ra = {};
    fs.readdirSync(GOC).filter(d => /^Apis/i.test(d) && fs.statSync(path.join(GOC, d)).isDirectory()).forEach(ph => {
        const mod = con(path.join(GOC, ph), 'modules');
        if (!mod) return;
        fs.readdirSync(path.join(GOC, ph, mod)).forEach(m => {
            const html = con(path.join(GOC, ph, mod, m), 'html');
            if (!html) return;
            fs.readdirSync(path.join(GOC, ph, mod, m, html)).filter(f => /\.html?$/i.test(f)).forEach(f => {
                const p = [ph, mod, m, html, f];
                ra[p.join('/').toLowerCase()] = p;
            });
        });
    });
    return ra;
}

const src = docMapping();
const cay = quetCay();
const roles = [], menus = {}, daDung = {};
let soCN = 0, soThieu = 0, dem = 0;
const idMoi = () => 'HN' + String(++dem).padStart(6, '0');

if (src) {
    const m = src.m;
    m.applications.forEach(app => {
        const rows = [];
        m.menuGroups.filter(g => g.application === app.code).forEach(g => rows.push({
            ID: g.groupId, MACHUCNANG: g.code, TENCHUCNANG: g.name, CHUCNANGCHA_ID: g.parentId || '',
            DUONGDANHIENTHI: '', DUONGDANFILE: '', TENANH: 'fa fa-folder-o', MAUNGDUNG: app.code, THUTU: g.order
        }));
        m.functions.filter(f => f.application.id === app.id).forEach(f => {
            const tim = f.file ? timTep(f.file) : null;
            const rel = (f.file || '').split('/');
            if (tim) daDung[tim.join('/').toLowerCase()] = 1;
            const row = {
                ID: f.functionId, MACHUCNANG: f.code, TENCHUCNANG: f.name, CHUCNANGCHA_ID: f.parentId || '',
                DUONGDANHIENTHI: f.route || '#', DUONGDANFILE: '/' + (tim || rel).slice(1).join('/'),
                TENANH: f.icon || '', MAUNGDUNG: (tim || rel)[0], THUTU: f.order
            };
            if (!tim) { row._thieu = 1; soThieu++; }
            rows.push(row); soCN++;
        });
        rows.sort((a, b) => (a.THUTU || 0) - (b.THUTU || 0));
        roles.push({ ID: app.id, TENVAITRO: app.name, MAUNGDUNG: app.code, TENANH: '', TENFILEDINHKEM: '', CHOPHEPTHUVAI: '0' });
        menus[app.id] = rows;
    });
}

// Tệp ngoài menu → nhóm riêng cuối menu của vai trò cùng phân hệ (chưa có vai trò thì thêm một vai trò)
const ngoai = {};
Object.keys(cay).filter(k => !daDung[k]).sort().forEach(k => { const p = cay[k]; (ngoai[p[0]] = ngoai[p[0]] || []).push(p); });
let soNgoai = 0;
Object.keys(ngoai).forEach(ph => {
    let role = roles.find(r => r.MAUNGDUNG.toLowerCase() === ph.toLowerCase());
    if (!role) {
        role = { ID: idMoi(), TENVAITRO: ph + ' (không có trong danh sách ứng dụng)', MAUNGDUNG: ph, TENANH: '', TENFILEDINHKEM: '', CHOPHEPTHUVAI: '0', _ngoai: 1 };
        roles.push(role); menus[role.ID] = [];
    }
    const rows = menus[role.ID], gocId = idMoi(), theoMod = {};
    rows.push({ ID: gocId, TENCHUCNANG: 'Tệp ngoài menu (' + ngoai[ph].length + ')', CHUCNANGCHA_ID: '', DUONGDANHIENTHI: '', DUONGDANFILE: '', TENANH: 'fa fa-folder-open-o', MAUNGDUNG: ph, _ngoai: 1 });
    ngoai[ph].forEach(p => {
        if (!theoMod[p[2]]) {
            theoMod[p[2]] = idMoi();
            rows.push({ ID: theoMod[p[2]], TENCHUCNANG: p[2], CHUCNANGCHA_ID: gocId, DUONGDANHIENTHI: '', DUONGDANFILE: '', TENANH: 'fa fa-folder-o', MAUNGDUNG: ph, _ngoai: 1 });
        }
        rows.push({ ID: idMoi(), TENCHUCNANG: p[4].replace(/\.html?$/i, ''), CHUCNANGCHA_ID: theoMod[p[2]], DUONGDANHIENTHI: '#' + p[4].replace(/\.html?$/i, ''), DUONGDANFILE: '/' + p.slice(1).join('/'), TENANH: 'fa fa-file-o', MAUNGDUNG: ph, _ngoai: 1 });
        soNgoai++;
    });
});

const info = { nguon: src ? src.tep : '(không có bản xuất — chỉ theo cây thư mục)', taoLuc: new Date().toISOString(), vaiTro: roles.length, chucNang: soCN, thieuTep: soThieu, ngoaiMenu: soNgoai };
fs.writeFileSync(path.join(__dirname, 'old-data.js'),
    '/* TỰ SINH bằng  node _harness/old-data-tao.js  — không sửa tay. */\n' +
    'window.HARNESS_OLD = ' + JSON.stringify({ info, roles, menus }) + ';\n');
console.log(info);
