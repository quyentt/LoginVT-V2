/* Môi trường kiểm thử đơn vị cho tầng chung `_v2/assets/js` — jsdom, nạp các IIFE theo ĐÚNG thứ tự `_v2/index.aspx`.
   KHÔNG sửa mã chạy để "dễ test": mọi hàm riêng (toQuery, cauKiem, lyDo, fromFixture…) kiểm qua hành vi công khai
   (ums.api.call với fetch giả / chế độ demo).

   Dùng:   var { tao } = require('./moi-truong');   var w = tao();   w.ums.ui.table({...})
   Chạy:   node --test _harness/test          (Node ≥ 20, cần `npm install` một lần trong _harness/test)              */
'use strict';
var fs = require('fs'), path = require('path');
var { JSDOM, VirtualConsole } = require('jsdom');

var GOC = path.resolve(__dirname, '..', '..', '_v2');

/* Thứ tự nạp = index.aspx (bỏ: Config.js / encrypt.js của ứng dụng cha, flatpickr / chart / n2vi không cần cho đơn vị) */
var THU_TU = [
    'assets/config/site.config.js',
    'assets/config/apply-config.js',
    'assets/vendor/crypto/crypto-js.js',
    'assets/vendor/jquery/jquery-3.7.1.min.js',
    'assets/vendor/select2/select2.min.js',
    'assets/js/scroll.js',
    'assets/js/chrome.js',
    'assets/js/ui.js',
    'assets/js/session.js',
    'assets/js/api.js',
    'assets/js/crud.js',
    'assets/js/patterns.js',
    'assets/js/ref.js',
    'assets/js/demo-data.js'
];

function tao(o) {
    o = o || {};
    var vc = new VirtualConsole();
    var log = { error: [], warn: [], info: [] };
    vc.on('error', function (m) { log.error.push(String(m)); });
    vc.on('warn', function (m) { log.warn.push(String(m)); });
    vc.on('info', function (m) { log.info.push(String(m)); });
    vc.on('jsdomError', function (e) { log.error.push('jsdom: ' + (e && e.message)); });

    var dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="screen"></div></body></html>', {
        url: 'http://localhost:8787/_v2/index.html',
        runScripts: 'outside-only',
        pretendToBeVisual: true,
        virtualConsole: vc
    });
    var w = dom.window;
    w.requestAnimationFrame = w.requestAnimationFrame || function (f) { return setTimeout(f, 0); };
    w.matchMedia = w.matchMedia || function () { return { matches: false, addListener: function () {}, addEventListener: function () {} }; };
    w.scrollTo = function () {};
    if (!w.Element.prototype.scrollIntoView) w.Element.prototype.scrollIntoView = function () {};

    var nap = o.nap || THU_TU;
    var loiNap = [];
    nap.forEach(function (rel) {
        var p = path.join(GOC, rel);
        var src = fs.readFileSync(p, 'utf8');
        try { w.eval(src + '\n//# sourceURL=' + rel); }
        catch (e) { loiNap.push(rel + ': ' + e.message); }
    });
    w.__log = log;
    w.__loiNap = loiNap;
    w.__dom = dom;
    return w;
}

/* Giá trị sinh trong cửa sổ jsdom có prototype Object/Array của realm khác → assert.deepStrictEqual báo "same structure but not
   reference-equal". Bóc qua JSON trước khi so. */
function thuan(x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); }

module.exports = { tao: tao, THU_TU: THU_TU, thuan: thuan };
