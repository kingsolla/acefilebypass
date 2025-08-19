
(function () {
    'use strict';

    if (typeof GM_setClipboard !== 'function') {
        alert('Clipboard function (GM_setClipboard) is not supported by your userscript manager.');
        return;
    }

    /**
     * Try to extract and decode Google Drive ID from the obfuscated JS
     */
    function extractIdFromEval() {
        try {
            const body = document.body.innerHTML;
            const evalMatch = body.match(/eval.*/);
            if (!evalMatch) return null;

            const unpacked = unPack(evalMatch[0]);
            const codeMatch = unpacked.match(/"code":"(\w+)"/);
            return codeMatch ? atob(codeMatch[1]) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Fetch ID from Acefile API as fallback
     */
    async function fetchIdFromApi() {
        const urlMatch = window.location.href.match(/^https?:\/\/acefile\.co\/(?:f|player)\/(\d+)/);
        if (!urlMatch) return null;

        const fileId = urlMatch[1];
        try {
            const res = await fetch(`https://acefile.co/service/resource_check/${fileId}/`);
            const json = await res.json();
            return json?.data || null;
        } catch {
            return null;
        }
    }

    /**
     * Main logic
     */
    (async () => {
        let driveId = extractIdFromEval();
        if (!driveId) {
            driveId = await fetchIdFromApi();
        }

        if (driveId) {
            const driveLink = `https://drive.google.com/file/d/${driveId}/view`;
            GM_setClipboard(driveLink);
            window.location.replace(driveLink);
        }
    })();

})();
