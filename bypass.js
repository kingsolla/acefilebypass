// ==/UserScript==

if (typeof GM_setClipboard != 'function') alert('Your UserScript client has no GM_setClipboard support');

(function() {
    'use strict';

    let evaljs = document.body.innerHTML.match(/eval.*/)[0];
    let unpackedjs = unPack(evaljs);
    if (!unpackedjs.match(/"code":"(\w+)"/)){
        let acefile_id = window.location.href.match(/^https?:\/\/acefile\.co\/(?:f|player)\/(\d+)/)[1]
        $.ajax({
            url: "https://acefile.co/service/resource_check/"+acefile_id+"/",
            cache: false,
            dataType: "json",
            success: function(response){
                let _id = response.data
                let drivelink = 'https://drive.google.com/file/d/'+_id+'/view';
                GM_setClipboard(drivelink);
                window.location.href = drivelink;
            }
        });
    }
    else {
        let _id = atob(unpackedjs.match(/"code":"(\w+)"/)[1]);
        let drivelink = 'https://drive.google.com/file/d/'+_id+'/view';
        GM_setClipboard(drivelink);
        window.location.href = drivelink;
    }
})();
