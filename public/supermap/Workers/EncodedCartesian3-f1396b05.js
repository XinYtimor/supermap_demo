define(["exports","./Cartographic-3309dd0d","./Check-7b2a090c","./when-b60132fc"],(function(e,n,i,o){"use strict";function h(){this.high=n.Cartesian3.clone(n.Cartesian3.ZERO),this.low=n.Cartesian3.clone(n.Cartesian3.ZERO)}h.encode=function(e,n){var i;return o.defined(n)||(n={high:0,low:0}),e>=0?(i=65536*Math.floor(e/65536),n.high=i,n.low=e-i):(i=65536*Math.floor(-e/65536),n.high=-i,n.low=e+i),n};var r={high:0,low:0};h.fromCartesian=function(e,n){o.defined(n)||(n=new h);var i=n.high,a=n.low;return h.encode(e.x,r),i.x=r.high,a.x=r.low,h.encode(e.y,r),i.y=r.high,a.y=r.low,h.encode(e.z,r),i.z=r.high,a.z=r.low,n};var a=new h;h.writeElements=function(e,n,i){h.fromCartesian(e,a);var o=a.high,r=a.low;n[i]=o.x,n[i+1]=o.y,n[i+2]=o.z,n[i+3]=r.x,n[i+4]=r.y,n[i+5]=r.z},e.EncodedCartesian3=h}));
