importScripts("collaboration.edit.diffMatchPatch.js");var sentDiffs=0;onmessage=function(e){var t=new diff_match_patch,n=e.data[1],r=e.data[2],i=e.data[0],s=t.diff_main(n,r);s.length>2&&t.diff_cleanupSemantic(s);var o=t.patch_make(n,r,s);o.length>0&&postMessage({id:i,changes:o})};