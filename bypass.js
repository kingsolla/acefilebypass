// ==UserScript==
// @name         Acefile to Google Drive
// @namespace    https://example.com/
// @version      1.0
// @description  Redirect Acefile ke Google Drive
// @match        https://acefile.co/f/*
// @match        https://acefile.co/player/*
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    (function () {
    'use strict';

    if (typeof GM_setClipboard !== 'function') {
        alert('GM_setClipboard is not supported by your userscript manager.');
        return;
    }

    function extractIdFromEval() {
        try {
            const html = document.documentElement.innerHTML;

            // Cari eval(...) pada seluruh halaman
            const evalMatch = html.match(/eval\([\s\S]*?\)<\/script>/i);
            if (!evalMatch) return null;

            // Pastikan fungsi unPack tersedia
            if (typeof unPack !== 'function') {
                console.warn('unPack() is not defined.');
                return null;
            }

            const unpacked = unPack(evalMatch[0]);

            const codeMatch = unpacked.match(/"code":"([^"]+)"/);
            if (!codeMatch) return null;

            return atob(codeMatch[1]);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async function fetchIdFromApi() {
        const match = location.pathname.match(/^\/(?:f|player)\/(\d+)/);
        if (!match) return null;

        try {
            const res = await fetch(
                `https://acefile.co/service/resource_check/${match[1]}/`
            );

            if (!res.ok) return null;

            const json = await res.json();

            return json?.data ?? null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    (async () => {
        let driveId = extractIdFromEval();

        if (!driveId) {
            driveId = await fetchIdFromApi();
        }

        if (!driveId) {
            console.log('Drive ID not found.');
            return;
        }

        const driveLink = `https://drive.google.com/file/d/${driveId}/view`;

        GM_setClipboard(driveLink);

        location.replace(driveLink);
    })();

})();
})();
