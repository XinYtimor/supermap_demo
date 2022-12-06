define(["./Cartesian2-47311507","./EllipsoidTangentPlane-ceab6aaa","./buildModuleUrl-57a32107","./Cartographic-3309dd0d","./when-b60132fc","./Check-7b2a090c","./TerrainEncoding-dd15c157","./Math-119be1a3","./Matrix4-cde86d0e","./OrientedBoundingBox-fcba62fd","./GeometryAttribute-c42d25b7","./WebMercatorProjection-01b1b5e7","./RuntimeError-4a5c8994","./createTaskProcessorWorker","./Cartesian4-3ca25aab","./IntersectionTests-5e35c2ab","./Plane-ca0357f4","./WebGLConstants-4ae0db90","./AttributeCompression-90851096","./ComponentDatatype-c140a87d","./PolygonPipeline-805ba13c","./earcut-2.2.1-20c8012f","./EllipsoidRhumbLine-ed1a6bf4","./FeatureDetection-c3b71206"],(function(e,t,a,i,r,n,s,l,o,f,u,c,d,h,m,g,p,w,x,y,k,b,I,v){"use strict";var U=Object.freeze({NONE:0,LERC:1}),M={};M.DEFAULT_STRUCTURE=Object.freeze({heightScale:1,heightOffset:0,elementsPerHeight:1,stride:1,elementMultiplier:256,isBigEndian:!1});var T=new i.Cartesian3,V=new o.Matrix4,A=new i.Cartesian3,B=new i.Cartesian3;M.computeVertices=function(n){var d,h,m,g,p=Math.cos,w=Math.sin,x=Math.sqrt,y=Math.atan,k=Math.exp,b=l.CesiumMath.PI_OVER_TWO,I=l.CesiumMath.toRadians,v=n.heightmap,U=n.width,D=n.height,S=n.skirtHeight,P=r.defaultValue(n.isGeographic,!0),E=r.defaultValue(n.ellipsoid,e.Ellipsoid.WGS84),C=1/E.maximumRadius,F=n.nativeRectangle,L=n.rectangle;r.defined(L)?(d=L.west,h=L.south,m=L.east,g=L.north):P?(d=I(F.west),h=I(F.south),m=I(F.east),g=I(F.north)):(d=F.west*C,h=b-2*y(k(-F.south*C)),m=F.east*C,g=b-2*y(k(-F.north*C)));var O=n.relativeToCenter,N=r.defined(O);O=N?O:i.Cartesian3.ZERO;var R=r.defaultValue(n.exaggeration,1),z=r.defaultValue(n.includeWebMercatorT,!1),_=r.defaultValue(n.structure,M.DEFAULT_STRUCTURE),H=r.defaultValue(_.heightScale,M.DEFAULT_STRUCTURE.heightScale),Y=r.defaultValue(_.heightOffset,M.DEFAULT_STRUCTURE.heightOffset),W=r.defaultValue(_.elementsPerHeight,M.DEFAULT_STRUCTURE.elementsPerHeight),X=r.defaultValue(_.stride,M.DEFAULT_STRUCTURE.stride),Z=r.defaultValue(_.elementMultiplier,M.DEFAULT_STRUCTURE.elementMultiplier),j=r.defaultValue(_.isBigEndian,M.DEFAULT_STRUCTURE.isBigEndian),G=e.Rectangle.computeWidth(F),q=e.Rectangle.computeHeight(F),Q=G/(U-1),J=q/(D-1);P||(G*=C,q*=C);var K,$,ee=E.radiiSquared,te=ee.x,ae=ee.y,ie=ee.z,re=65536,ne=-65536,se=u.Transforms.eastNorthUpToFixedFrame(O,E),le=o.Matrix4.inverseTransformation(se,V);z&&(K=c.WebMercatorProjection.geodeticLatitudeToMercatorAngle(h),$=1/(c.WebMercatorProjection.geodeticLatitudeToMercatorAngle(g)-K));var oe=A;oe.x=Number.POSITIVE_INFINITY,oe.y=Number.POSITIVE_INFINITY,oe.z=Number.POSITIVE_INFINITY;var fe=B;fe.x=Number.NEGATIVE_INFINITY,fe.y=Number.NEGATIVE_INFINITY,fe.z=Number.NEGATIVE_INFINITY;var ue=Number.POSITIVE_INFINITY,ce=U*D,de=ce+(S>0?2*U+2*D:0),he=new Array(de),me=new Array(de),ge=new Array(de),pe=z?new Array(de):[],we=0,xe=D,ye=0,ke=U;S>0&&(--we,++xe,--ye,++ke);for(var be=1e-5,Ie=we;Ie<xe;++Ie){var ve=Ie;ve<0&&(ve=0),ve>=D&&(ve=D-1);var Ue=F.north-J*ve,Me=((Ue=P?I(Ue):b-2*y(k(-Ue*C)))-h)/(g-h);Me=l.CesiumMath.clamp(Me,0,1);var Te=Ie===we,Ve=Ie===xe-1;S>0&&(Te?Ue+=be*q:Ve&&(Ue-=be*q));var Ae,Be=p(Ue),De=w(Ue),Se=ie*De;z&&(Ae=(c.WebMercatorProjection.geodeticLatitudeToMercatorAngle(Ue)-K)*$);for(var Pe=ye;Pe<ke;++Pe){var Ee=Pe;Ee<0&&(Ee=0),Ee>=U&&(Ee=U-1);var Ce,Fe,Le=ve*(U*X)+Ee*X;if(1===W)Ce=v[Le];else if(Ce=0,j)for(Fe=0;Fe<W;++Fe)Ce=Ce*Z+v[Le+Fe];else for(Fe=W-1;Fe>=0;--Fe)Ce=Ce*Z+v[Le+Fe];Ce=(Ce*H+Y)*R,ne=Math.max(ne,Ce),re=Math.min(re,Ce);var Oe=F.west+Q*Ee;P?Oe=I(Oe):Oe*=C;var Ne=(Oe-d)/(m-d);Ne=l.CesiumMath.clamp(Ne,0,1);var Re=ve*U+Ee;if(S>0){var ze=Pe===ye,_e=Pe===ke-1,He=Te||Ve||ze||_e;if((Te||Ve)&&(ze||_e))continue;He&&(Ce-=S,ze?(Re=ce+(D-ve-1),Oe-=be*G):Ve?Re=ce+D+(U-Ee-1):_e?(Re=ce+D+U+ve,Oe+=be*G):Te&&(Re=ce+D+U+D+Ee))}var Ye=Be*p(Oe),We=Be*w(Oe),Xe=te*Ye,Ze=ae*We,je=1/x(Xe*Ye+Ze*We+Se*De),Ge=Xe*je,qe=Ze*je,Qe=Se*je,Je=new i.Cartesian3;Je.x=Ge+Ye*Ce,Je.y=qe+We*Ce,Je.z=Qe+De*Ce,he[Re]=Je,me[Re]=Ce,ge[Re]=new e.Cartesian2(Ne,Me),z&&(pe[Re]=Ae),o.Matrix4.multiplyByPoint(le,Je,T),i.Cartesian3.minimumByComponent(T,oe,oe),i.Cartesian3.maximumByComponent(T,fe,fe),ue=Math.min(ue,Ce)}}var Ke,$e,et=a.BoundingSphere.fromPoints(he);(r.defined(L)&&(Ke=f.OrientedBoundingBox.fromRectangle(L,re,ne,E)),N)&&($e=new s.EllipsoidalOccluder(E).computeHorizonCullingPointPossiblyUnderEllipsoid(O,he,re));for(var tt=new t.AxisAlignedBoundingBox(oe,fe,O),at=new s.TerrainEncoding(tt,ue,ne,se,!1,z),it=new Float32Array(de*at.getStride()),rt=0,nt=0;nt<de;++nt)rt=at.encode(it,rt,he[nt],ge[nt],me[nt],void 0,pe[nt]);return{vertices:it,maximumHeight:ne,minimumHeight:re,encoding:at,boundingSphere3D:et,orientedBoundingBox:Ke,occludeePointInScaledSpace:$e}};
/* Copyright 2015-2018 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
var D={};!function(){var e,t,a,i,r,n,s,l,o,f,u,c,d,h,m,g,p=(e={defaultNoDataValue:-34027999387901484e22,decode:function(n,s){var l=(s=s||{}).encodedMaskData||null===s.encodedMaskData,o=r(n,s.inputOffset||0,l),f=null!==s.noDataValue?s.noDataValue:e.defaultNoDataValue,u=t(o,s.pixelType||Float32Array,s.encodedMaskData,f,s.returnMask),c={width:o.width,height:o.height,pixelData:u.resultPixels,minValue:u.minValue,maxValue:o.pixels.maxValue,noDataValue:f};return u.resultMask&&(c.maskData=u.resultMask),s.returnEncodedMask&&o.mask&&(c.encodedMaskData=o.mask.bitset?o.mask.bitset:null),s.returnFileInfo&&(c.fileInfo=a(o),s.computeUsedBitDepths&&(c.fileInfo.bitDepths=i(o))),c}},t=function(e,t,a,i,r){var s,l,o,f=0,u=e.pixels.numBlocksX,c=e.pixels.numBlocksY,d=Math.floor(e.width/u),h=Math.floor(e.height/c),m=2*e.maxZError,g=Number.MAX_VALUE;a=a||(e.mask?e.mask.bitset:null),l=new t(e.width*e.height),r&&a&&(o=new Uint8Array(e.width*e.height));for(var p,w,x=new Float32Array(d*h),y=0;y<=c;y++){var k=y!==c?h:e.height%c;if(0!==k)for(var b=0;b<=u;b++){var I=b!==u?d:e.width%u;if(0!==I){var v,U,M,T,V=y*e.width*h+b*d,A=e.width-I,B=e.pixels.blocks[f];if(B.encoding<2?(0===B.encoding?v=B.rawData:(n(B.stuffedData,B.bitsPerPixel,B.numValidPixels,B.offset,m,x,e.pixels.maxValue),v=x),U=0):M=2===B.encoding?0:B.offset,a)for(w=0;w<k;w++){for(7&V&&(T=a[V>>3],T<<=7&V),p=0;p<I;p++)7&V||(T=a[V>>3]),128&T?(o&&(o[V]=1),g=g>(s=B.encoding<2?v[U++]:M)?s:g,l[V++]=s):(o&&(o[V]=0),l[V++]=i),T<<=1;V+=A}else if(B.encoding<2)for(w=0;w<k;w++){for(p=0;p<I;p++)g=g>(s=v[U++])?s:g,l[V++]=s;V+=A}else for(g=g>M?M:g,w=0;w<k;w++){for(p=0;p<I;p++)l[V++]=M;V+=A}if(1===B.encoding&&U!==B.numValidPixels)throw"Block and Mask do not match";f++}}}return{resultPixels:l,resultMask:o,minValue:g}},a=function(e){return{fileIdentifierString:e.fileIdentifierString,fileVersion:e.fileVersion,imageType:e.imageType,height:e.height,width:e.width,maxZError:e.maxZError,eofOffset:e.eofOffset,mask:e.mask?{numBlocksX:e.mask.numBlocksX,numBlocksY:e.mask.numBlocksY,numBytes:e.mask.numBytes,maxValue:e.mask.maxValue}:null,pixels:{numBlocksX:e.pixels.numBlocksX,numBlocksY:e.pixels.numBlocksY,numBytes:e.pixels.numBytes,maxValue:e.pixels.maxValue,noDataValue:e.noDataValue}}},i=function(e){for(var t=e.pixels.numBlocksX*e.pixels.numBlocksY,a={},i=0;i<t;i++){var r=e.pixels.blocks[i];0===r.encoding?a.float32=!0:1===r.encoding?a[r.bitsPerPixel]=!0:a[0]=!0}return Object.keys(a)},r=function(e,t,a){var i={},r=new Uint8Array(e,t,10);if(i.fileIdentifierString=String.fromCharCode.apply(null,r),"CntZImage"!==i.fileIdentifierString.trim())throw"Unexpected file identifier string: "+i.fileIdentifierString;t+=10;var n=new DataView(e,t,24);if(i.fileVersion=n.getInt32(0,!0),i.imageType=n.getInt32(4,!0),i.height=n.getUint32(8,!0),i.width=n.getUint32(12,!0),i.maxZError=n.getFloat64(16,!0),t+=24,!a)if(n=new DataView(e,t,16),i.mask={},i.mask.numBlocksY=n.getUint32(0,!0),i.mask.numBlocksX=n.getUint32(4,!0),i.mask.numBytes=n.getUint32(8,!0),i.mask.maxValue=n.getFloat32(12,!0),t+=16,i.mask.numBytes>0){var s=new Uint8Array(Math.ceil(i.width*i.height/8)),l=(n=new DataView(e,t,i.mask.numBytes)).getInt16(0,!0),o=2,f=0;do{if(l>0)for(;l--;)s[f++]=n.getUint8(o++);else{var u=n.getUint8(o++);for(l=-l;l--;)s[f++]=u}l=n.getInt16(o,!0),o+=2}while(o<i.mask.numBytes);if(-32768!==l||f<s.length)throw"Unexpected end of mask RLE encoding";i.mask.bitset=s,t+=i.mask.numBytes}else 0==(i.mask.numBytes|i.mask.numBlocksY|i.mask.maxValue)&&(i.mask.bitset=new Uint8Array(Math.ceil(i.width*i.height/8)));n=new DataView(e,t,16),i.pixels={},i.pixels.numBlocksY=n.getUint32(0,!0),i.pixels.numBlocksX=n.getUint32(4,!0),i.pixels.numBytes=n.getUint32(8,!0),i.pixels.maxValue=n.getFloat32(12,!0),t+=16;var c=i.pixels.numBlocksX,d=i.pixels.numBlocksY,h=c+(i.width%c>0?1:0),m=d+(i.height%d>0?1:0);i.pixels.blocks=new Array(h*m);for(var g=0,p=0;p<m;p++)for(var w=0;w<h;w++){var x=0,y=e.byteLength-t;n=new DataView(e,t,Math.min(10,y));var k={};i.pixels.blocks[g++]=k;var b=n.getUint8(0);if(x++,k.encoding=63&b,k.encoding>3)throw"Invalid block encoding ("+k.encoding+")";if(2!==k.encoding){if(0!==b&&2!==b){if(b>>=6,k.offsetType=b,2===b)k.offset=n.getInt8(1),x++;else if(1===b)k.offset=n.getInt16(1,!0),x+=2;else{if(0!==b)throw"Invalid block offset type";k.offset=n.getFloat32(1,!0),x+=4}if(1===k.encoding)if(b=n.getUint8(x),x++,k.bitsPerPixel=63&b,b>>=6,k.numValidPixelsType=b,2===b)k.numValidPixels=n.getUint8(x),x++;else if(1===b)k.numValidPixels=n.getUint16(x,!0),x+=2;else{if(0!==b)throw"Invalid valid pixel count type";k.numValidPixels=n.getUint32(x,!0),x+=4}}var I;if(t+=x,3!==k.encoding)if(0===k.encoding){var v=(i.pixels.numBytes-1)/4;if(v!==Math.floor(v))throw"uncompressed block has invalid length";I=new ArrayBuffer(4*v),new Uint8Array(I).set(new Uint8Array(e,t,4*v));var U=new Float32Array(I);k.rawData=U,t+=4*v}else if(1===k.encoding){var M=Math.ceil(k.numValidPixels*k.bitsPerPixel/8),T=Math.ceil(M/4);I=new ArrayBuffer(4*T),new Uint8Array(I).set(new Uint8Array(e,t,M)),k.stuffedData=new Uint32Array(I),t+=M}}else t++}return i.eofOffset=t,i},n=function(e,t,a,i,r,n,s){var l,o,f,u=(1<<t)-1,c=0,d=0,h=Math.ceil((s-i)/r),m=4*e.length-Math.ceil(t*a/8);for(e[e.length-1]<<=8*m,l=0;l<a;l++){if(0===d&&(f=e[c++],d=32),d>=t)o=f>>>d-t&u,d-=t;else{var g=t-d;o=(f&u)<<g&u,o+=(f=e[c++])>>>(d=32-g)}n[l]=o<h?i+o*r:s}return n},e),w=(s=function(e,t,a,i,r,n,s,l){var o,f,u,c,d,h=(1<<a)-1,m=0,g=0,p=4*e.length-Math.ceil(a*i/8);if(e[e.length-1]<<=8*p,r)for(o=0;o<i;o++)0===g&&(u=e[m++],g=32),g>=a?(f=u>>>g-a&h,g-=a):(f=(u&h)<<(c=a-g)&h,f+=(u=e[m++])>>>(g=32-c)),t[o]=r[f];else for(d=Math.ceil((l-n)/s),o=0;o<i;o++)0===g&&(u=e[m++],g=32),g>=a?(f=u>>>g-a&h,g-=a):(f=(u&h)<<(c=a-g)&h,f+=(u=e[m++])>>>(g=32-c)),t[o]=f<d?n+f*s:l},l=function(e,t,a,i,r,n){var s,l=(1<<t)-1,o=0,f=0,u=0,c=0,d=0,h=[],m=4*e.length-Math.ceil(t*a/8);e[e.length-1]<<=8*m;var g=Math.ceil((n-i)/r);for(f=0;f<a;f++)0===c&&(s=e[o++],c=32),c>=t?(d=s>>>c-t&l,c-=t):(d=(s&l)<<(u=t-c)&l,d+=(s=e[o++])>>>(c=32-u)),h[f]=d<g?i+d*r:n;return h.unshift(i),h},o=function(e,t,a,i,r,n,s,l){var o,f,u,c,d=(1<<a)-1,h=0,m=0,g=0;if(r)for(o=0;o<i;o++)0===m&&(u=e[h++],m=32,g=0),m>=a?(f=u>>>g&d,m-=a,g+=a):(f=u>>>g&d,m=32-(c=a-m),f|=((u=e[h++])&(1<<c)-1)<<a-c,g=c),t[o]=r[f];else{var p=Math.ceil((l-n)/s);for(o=0;o<i;o++)0===m&&(u=e[h++],m=32,g=0),m>=a?(f=u>>>g&d,m-=a,g+=a):(f=u>>>g&d,m=32-(c=a-m),f|=((u=e[h++])&(1<<c)-1)<<a-c,g=c),t[o]=f<p?n+f*s:l}return t},f=function(e,t,a,i,r,n){var s,l=(1<<t)-1,o=0,f=0,u=0,c=0,d=0,h=0,m=[],g=Math.ceil((n-i)/r);for(f=0;f<a;f++)0===c&&(s=e[o++],c=32,h=0),c>=t?(d=s>>>h&l,c-=t,h+=t):(d=s>>>h&l,c=32-(u=t-c),d|=((s=e[o++])&(1<<u)-1)<<t-u,h=u),m[f]=d<g?i+d*r:n;return m.unshift(i),m},u=function(e,t,a,i){var r,n,s,l,o=(1<<a)-1,f=0,u=0,c=4*e.length-Math.ceil(a*i/8);for(e[e.length-1]<<=8*c,r=0;r<i;r++)0===u&&(s=e[f++],u=32),u>=a?(n=s>>>u-a&o,u-=a):(n=(s&o)<<(l=a-u)&o,n+=(s=e[f++])>>>(u=32-l)),t[r]=n;return t},c=function(e,t,a,i){var r,n,s,l,o=(1<<a)-1,f=0,u=0,c=0;for(r=0;r<i;r++)0===u&&(s=e[f++],u=32,c=0),u>=a?(n=s>>>c&o,u-=a,c+=a):(n=s>>>c&o,u=32-(l=a-u),n|=((s=e[f++])&(1<<l)-1)<<a-l,c=l),t[r]=n;return t},d={HUFFMAN_LUT_BITS_MAX:12,computeChecksumFletcher32:function(e){for(var t=65535,a=65535,i=e.length,r=Math.floor(i/2),n=0;r;){var s=r>=359?359:r;r-=s;do{t+=e[n++]<<8,a+=t+=e[n++]}while(--s);t=(65535&t)+(t>>>16),a=(65535&a)+(a>>>16)}return 1&i&&(a+=t+=e[n]<<8),((a=(65535&a)+(a>>>16))<<16|(t=(65535&t)+(t>>>16)))>>>0},readHeaderInfo:function(e,t){var a=t.ptr,i=new Uint8Array(e,a,6),r={};if(r.fileIdentifierString=String.fromCharCode.apply(null,i),0!==r.fileIdentifierString.lastIndexOf("Lerc2",0))throw"Unexpected file identifier string (expect Lerc2 ): "+r.fileIdentifierString;a+=6;var n,s=new DataView(e,a,8),l=s.getInt32(0,!0);if(r.fileVersion=l,a+=4,l>=3&&(r.checksum=s.getUint32(4,!0),a+=4),s=new DataView(e,a,12),r.height=s.getUint32(0,!0),r.width=s.getUint32(4,!0),a+=8,l>=4?(r.numDims=s.getUint32(8,!0),a+=4):r.numDims=1,s=new DataView(e,a,40),r.numValidPixel=s.getUint32(0,!0),r.microBlockSize=s.getInt32(4,!0),r.blobSize=s.getInt32(8,!0),r.imageType=s.getInt32(12,!0),r.maxZError=s.getFloat64(16,!0),r.zMin=s.getFloat64(24,!0),r.zMax=s.getFloat64(32,!0),a+=40,t.headerInfo=r,t.ptr=a,l>=3&&(n=l>=4?52:48,this.computeChecksumFletcher32(new Uint8Array(e,a-n,r.blobSize-14))!==r.checksum))throw"Checksum failed.";return!0},checkMinMaxRanges:function(e,t){var a=t.headerInfo,i=this.getDataTypeArray(a.imageType),r=a.numDims*this.getDataTypeSize(a.imageType),n=this.readSubArray(e,t.ptr,i,r),s=this.readSubArray(e,t.ptr+r,i,r);t.ptr+=2*r;var l,o=!0;for(l=0;l<a.numDims;l++)if(n[l]!==s[l]){o=!1;break}return a.minValues=n,a.maxValues=s,o},readSubArray:function(e,t,a,i){var r;if(a===Uint8Array)r=new Uint8Array(e,t,i);else{var n=new ArrayBuffer(i);new Uint8Array(n).set(new Uint8Array(e,t,i)),r=new a(n)}return r},readMask:function(e,t){var a,i,r=t.ptr,n=t.headerInfo,s=n.width*n.height,l=n.numValidPixel,o=new DataView(e,r,4),f={};if(f.numBytes=o.getUint32(0,!0),r+=4,(0===l||s===l)&&0!==f.numBytes)throw"invalid mask";if(0===l)a=new Uint8Array(Math.ceil(s/8)),f.bitset=a,i=new Uint8Array(s),t.pixels.resultMask=i,r+=f.numBytes;else if(f.numBytes>0){a=new Uint8Array(Math.ceil(s/8));var u=(o=new DataView(e,r,f.numBytes)).getInt16(0,!0),c=2,d=0,h=0;do{if(u>0)for(;u--;)a[d++]=o.getUint8(c++);else for(h=o.getUint8(c++),u=-u;u--;)a[d++]=h;u=o.getInt16(c,!0),c+=2}while(c<f.numBytes);if(-32768!==u||d<a.length)throw"Unexpected end of mask RLE encoding";i=new Uint8Array(s);var m=0,g=0;for(g=0;g<s;g++)7&g?(m=a[g>>3],m<<=7&g):m=a[g>>3],128&m&&(i[g]=1);t.pixels.resultMask=i,f.bitset=a,r+=f.numBytes}return t.ptr=r,t.mask=f,!0},readDataOneSweep:function(e,t,a){var i,r=t.ptr,n=t.headerInfo,s=n.numDims,l=n.width*n.height,o=n.imageType,f=n.numValidPixel*d.getDataTypeSize(o)*s,u=t.pixels.resultMask;if(a===Uint8Array)i=new Uint8Array(e,r,f);else{var c=new ArrayBuffer(f);new Uint8Array(c).set(new Uint8Array(e,r,f)),i=new a(c)}if(i.length===l*s)t.pixels.resultPixels=i;else{t.pixels.resultPixels=new a(l*s);var h=0,m=0,g=0,p=0;if(s>1)for(g=0;g<s;g++)for(p=g*l,m=0;m<l;m++)u[m]&&(t.pixels.resultPixels[p+m]=i[h++]);else for(m=0;m<l;m++)u[m]&&(t.pixels.resultPixels[m]=i[h++])}return r+=f,t.ptr=r,!0},readHuffmanTree:function(e,t){var a=this.HUFFMAN_LUT_BITS_MAX,i=new DataView(e,t.ptr,16);if(t.ptr+=16,i.getInt32(0,!0)<2)throw"unsupported Huffman version";var r=i.getInt32(4,!0),n=i.getInt32(8,!0),s=i.getInt32(12,!0);if(n>=s)return!1;var l=new Uint32Array(s-n);d.decodeBits(e,t,l);var o,f,u,c,m=[];for(o=n;o<s;o++)m[f=o-(o<r?0:r)]={first:l[o-n],second:null};var g=e.byteLength-t.ptr,p=Math.ceil(g/4),w=new ArrayBuffer(4*p);new Uint8Array(w).set(new Uint8Array(e,t.ptr,g));var x,y=new Uint32Array(w),k=0,b=0;for(x=y[0],o=n;o<s;o++)(c=m[f=o-(o<r?0:r)].first)>0&&(m[f].second=x<<k>>>32-c,32-k>=c?32===(k+=c)&&(k=0,x=y[++b]):(k+=c-32,x=y[++b],m[f].second|=x>>>32-k));var I=0,v=0,U=new h;for(o=0;o<m.length;o++)void 0!==m[o]&&(I=Math.max(I,m[o].first));v=I>=a?a:I,I>=30&&console.log("WARning, large NUM LUT BITS IS "+I);var M,T,V,A,B,D=[];for(o=n;o<s;o++)if((c=m[f=o-(o<r?0:r)].first)>0)if(M=[c,f],c<=v)for(T=m[f].second<<v-c,V=1<<v-c,u=0;u<V;u++)D[T|u]=M;else for(T=m[f].second,B=U,A=c-1;A>=0;A--)T>>>A&1?(B.right||(B.right=new h),B=B.right):(B.left||(B.left=new h),B=B.left),0!==A||B.val||(B.val=M[1]);return{decodeLut:D,numBitsLUTQick:v,numBitsLUT:I,tree:U,stuffedData:y,srcPtr:b,bitPos:k}},readHuffman:function(e,t,a){var i,r,n,s,l,o,f,u,c,d=t.headerInfo,h=d.numDims,m=t.headerInfo.height,g=t.headerInfo.width,p=g*m,w=this.readHuffmanTree(e,t),x=w.decodeLut,y=w.tree,k=w.stuffedData,b=w.srcPtr,I=w.bitPos,v=w.numBitsLUTQick,U=w.numBitsLUT,M=0===t.headerInfo.imageType?128:0,T=t.pixels.resultMask,V=0;I>0&&(b++,I=0);var A,B=k[b],D=1===t.encodeMode,S=new a(p*h),P=S;for(A=0;A<d.numDims;A++){if(h>1&&(P=new a(S.buffer,p*A,p),V=0),t.headerInfo.numValidPixel===g*m)for(u=0,o=0;o<m;o++)for(f=0;f<g;f++,u++){if(r=0,l=s=B<<I>>>32-v,32-I<v&&(l=s|=k[b+1]>>>64-I-v),x[l])r=x[l][1],I+=x[l][0];else for(l=s=B<<I>>>32-U,32-I<U&&(l=s|=k[b+1]>>>64-I-U),i=y,c=0;c<U;c++)if(!(i=s>>>U-c-1&1?i.right:i.left).left&&!i.right){r=i.val,I=I+c+1;break}I>=32&&(I-=32,B=k[++b]),n=r-M,D?(n+=f>0?V:o>0?P[u-g]:V,n&=255,P[u]=n,V=n):P[u]=n}else for(u=0,o=0;o<m;o++)for(f=0;f<g;f++,u++)if(T[u]){if(r=0,l=s=B<<I>>>32-v,32-I<v&&(l=s|=k[b+1]>>>64-I-v),x[l])r=x[l][1],I+=x[l][0];else for(l=s=B<<I>>>32-U,32-I<U&&(l=s|=k[b+1]>>>64-I-U),i=y,c=0;c<U;c++)if(!(i=s>>>U-c-1&1?i.right:i.left).left&&!i.right){r=i.val,I=I+c+1;break}I>=32&&(I-=32,B=k[++b]),n=r-M,D?(f>0&&T[u-1]?n+=V:o>0&&T[u-g]?n+=P[u-g]:n+=V,n&=255,P[u]=n,V=n):P[u]=n}t.ptr=t.ptr+4*(b+1)+(I>0?4:0)}t.pixels.resultPixels=S},decodeBits:function(e,t,a,i,r){var n=t.headerInfo,d=n.fileVersion,h=0,m=e.byteLength-t.ptr>=5?5:e.byteLength-t.ptr,g=new DataView(e,t.ptr,m),p=g.getUint8(0);h++;var w=p>>6,x=0===w?4:3-w,y=(32&p)>0,k=31&p,b=0;if(1===x)b=g.getUint8(h),h++;else if(2===x)b=g.getUint16(h,!0),h+=2;else{if(4!==x)throw"Invalid valid pixel count type";b=g.getUint32(h,!0),h+=4}var I,v,U,M,T,V,A,B,D,S=2*n.maxZError,P=n.numDims>1?n.maxValues[r]:n.zMax;if(y){for(t.counter.lut++,B=g.getUint8(h),h++,M=Math.ceil((B-1)*k/8),T=Math.ceil(M/4),v=new ArrayBuffer(4*T),U=new Uint8Array(v),t.ptr+=h,U.set(new Uint8Array(e,t.ptr,M)),A=new Uint32Array(v),t.ptr+=M,D=0;B-1>>>D;)D++;M=Math.ceil(b*D/8),T=Math.ceil(M/4),v=new ArrayBuffer(4*T),(U=new Uint8Array(v)).set(new Uint8Array(e,t.ptr,M)),I=new Uint32Array(v),t.ptr+=M,V=d>=3?f(A,k,B-1,i,S,P):l(A,k,B-1,i,S,P),d>=3?o(I,a,D,b,V):s(I,a,D,b,V)}else t.counter.bitstuffer++,D=k,t.ptr+=h,D>0&&(M=Math.ceil(b*D/8),T=Math.ceil(M/4),v=new ArrayBuffer(4*T),(U=new Uint8Array(v)).set(new Uint8Array(e,t.ptr,M)),I=new Uint32Array(v),t.ptr+=M,d>=3?null===i?c(I,a,D,b):o(I,a,D,b,!1,i,S,P):null===i?u(I,a,D,b):s(I,a,D,b,!1,i,S,P))},readTiles:function(e,t,a){var i=t.headerInfo,r=i.width,n=i.height,s=i.microBlockSize,l=i.imageType,o=d.getDataTypeSize(l),f=Math.ceil(r/s),u=Math.ceil(n/s);t.pixels.numBlocksY=u,t.pixels.numBlocksX=f,t.pixels.ptr=0;var c,h,m,g,p,w,x,y,k=0,b=0,I=0,v=0,U=0,M=0,T=0,V=0,A=0,B=0,D=0,S=0,P=0,E=0,C=0,F=new a(s*s),L=n%s||s,O=r%s||s,N=i.numDims,R=t.pixels.resultMask,z=t.pixels.resultPixels;for(I=0;I<u;I++)for(U=I!==u-1?s:L,v=0;v<f;v++)for(B=I*r*s+v*s,D=r-(M=v!==f-1?s:O),y=0;y<N;y++){if(N>1&&(z=new a(t.pixels.resultPixels.buffer,r*n*y*o,r*n)),T=e.byteLength-t.ptr,h={},C=0,C++,A=(V=(c=new DataView(e,t.ptr,Math.min(10,T))).getUint8(0))>>6&255,(V>>2&15)!=(v*s>>3&15))throw"integrity issue";if((p=3&V)>3)throw t.ptr+=C,"Invalid block encoding ("+p+")";if(2!==p)if(0===p){if(t.counter.uncompressed++,t.ptr+=C,S=(S=U*M*o)<(P=e.byteLength-t.ptr)?S:P,m=new ArrayBuffer(S%o==0?S:S+o-S%o),new Uint8Array(m).set(new Uint8Array(e,t.ptr,S)),g=new a(m),E=0,R)for(k=0;k<U;k++){for(b=0;b<M;b++)R[B]&&(z[B]=g[E++]),B++;B+=D}else for(k=0;k<U;k++){for(b=0;b<M;b++)z[B++]=g[E++];B+=D}t.ptr+=E*o}else if(w=d.getDataTypeUsed(l,A),x=d.getOnePixel(h,C,w,c),C+=d.getDataTypeSize(w),3===p)if(t.ptr+=C,t.counter.constantoffset++,R)for(k=0;k<U;k++){for(b=0;b<M;b++)R[B]&&(z[B]=x),B++;B+=D}else for(k=0;k<U;k++){for(b=0;b<M;b++)z[B++]=x;B+=D}else if(t.ptr+=C,d.decodeBits(e,t,F,x,y),C=0,R)for(k=0;k<U;k++){for(b=0;b<M;b++)R[B]&&(z[B]=F[C++]),B++;B+=D}else for(k=0;k<U;k++){for(b=0;b<M;b++)z[B++]=F[C++];B+=D}else t.counter.constant++,t.ptr+=C}},formatFileInfo:function(e){return{fileIdentifierString:e.headerInfo.fileIdentifierString,fileVersion:e.headerInfo.fileVersion,imageType:e.headerInfo.imageType,height:e.headerInfo.height,width:e.headerInfo.width,numValidPixel:e.headerInfo.numValidPixel,microBlockSize:e.headerInfo.microBlockSize,blobSize:e.headerInfo.blobSize,maxZError:e.headerInfo.maxZError,pixelType:d.getPixelType(e.headerInfo.imageType),eofOffset:e.eofOffset,mask:e.mask?{numBytes:e.mask.numBytes}:null,pixels:{numBlocksX:e.pixels.numBlocksX,numBlocksY:e.pixels.numBlocksY,maxValue:e.headerInfo.zMax,minValue:e.headerInfo.zMin,noDataValue:e.noDataValue}}},constructConstantSurface:function(e){var t=e.headerInfo.zMax,a=e.headerInfo.numDims,i=e.headerInfo.height*e.headerInfo.width,r=i*a,n=0,s=0,l=0,o=e.pixels.resultMask;if(o)if(a>1)for(n=0;n<a;n++)for(l=n*i,s=0;s<i;s++)o[s]&&(e.pixels.resultPixels[l+s]=t);else for(s=0;s<i;s++)o[s]&&(e.pixels.resultPixels[s]=t);else if(e.pixels.resultPixels.fill)e.pixels.resultPixels.fill(t);else for(s=0;s<r;s++)e.pixels.resultPixels[s]=t},getDataTypeArray:function(e){var t;switch(e){case 0:t=Int8Array;break;case 1:t=Uint8Array;break;case 2:t=Int16Array;break;case 3:t=Uint16Array;break;case 4:t=Int32Array;break;case 5:t=Uint32Array;break;case 6:default:t=Float32Array;break;case 7:t=Float64Array}return t},getPixelType:function(e){var t;switch(e){case 0:t="S8";break;case 1:t="U8";break;case 2:t="S16";break;case 3:t="U16";break;case 4:t="S32";break;case 5:t="U32";break;case 6:default:t="F32";break;case 7:t="F64"}return t},isValidPixelValue:function(e,t){if(null===t)return!1;var a;switch(e){case 0:a=t>=-128&&t<=127;break;case 1:a=t>=0&&t<=255;break;case 2:a=t>=-32768&&t<=32767;break;case 3:a=t>=0&&t<=65536;break;case 4:a=t>=-2147483648&&t<=2147483647;break;case 5:a=t>=0&&t<=4294967296;break;case 6:a=t>=-34027999387901484e22&&t<=34027999387901484e22;break;case 7:a=t>=5e-324&&t<=17976931348623157e292;break;default:a=!1}return a},getDataTypeSize:function(e){var t=0;switch(e){case 0:case 1:t=1;break;case 2:case 3:t=2;break;case 4:case 5:case 6:t=4;break;case 7:t=8;break;default:t=e}return t},getDataTypeUsed:function(e,t){var a=e;switch(e){case 2:case 4:a=e-t;break;case 3:case 5:a=e-2*t;break;case 6:a=0===t?e:1===t?2:1;break;case 7:a=0===t?e:e-2*t+1;break;default:a=e}return a},getOnePixel:function(e,t,a,i){var r=0;switch(a){case 0:r=i.getInt8(t);break;case 1:r=i.getUint8(t);break;case 2:r=i.getInt16(t,!0);break;case 3:r=i.getUint16(t,!0);break;case 4:r=i.getInt32(t,!0);break;case 5:r=i.getUInt32(t,!0);break;case 6:r=i.getFloat32(t,!0);break;case 7:r=i.getFloat64(t,!0);break;default:throw"the decoder does not understand this pixel type"}return r}},h=function(e,t,a){this.val=e,this.left=t,this.right=a},{decode:function(e,t){var a=(t=t||{}).noDataValue,i=0,r={};r.ptr=t.inputOffset||0,r.pixels={},d.readHeaderInfo(e,r);var n=r.headerInfo,s=n.fileVersion,l=d.getDataTypeArray(n.imageType);d.readMask(e,r),n.numValidPixel===n.width*n.height||r.pixels.resultMask||(r.pixels.resultMask=t.maskData);var o,f=n.width*n.height;if(r.pixels.resultPixels=new l(f*n.numDims),r.counter={onesweep:0,uncompressed:0,lut:0,bitstuffer:0,constant:0,constantoffset:0},0!==n.numValidPixel)if(n.zMax===n.zMin)d.constructConstantSurface(r);else if(s>=4&&d.checkMinMaxRanges(e,r))d.constructConstantSurface(r);else{var u=new DataView(e,r.ptr,2),c=u.getUint8(0);if(r.ptr++,c)d.readDataOneSweep(e,r,l);else if(s>1&&n.imageType<=1&&Math.abs(n.maxZError-.5)<1e-5){var h=u.getUint8(1);if(r.ptr++,r.encodeMode=h,h>2||s<4&&h>1)throw"Invalid Huffman flag "+h;h?d.readHuffman(e,r,l):d.readTiles(e,r,l)}else d.readTiles(e,r,l)}r.eofOffset=r.ptr,t.inputOffset?(o=r.headerInfo.blobSize+t.inputOffset-r.ptr,Math.abs(o)>=1&&(r.eofOffset=t.inputOffset+r.headerInfo.blobSize)):(o=r.headerInfo.blobSize-r.ptr,Math.abs(o)>=1&&(r.eofOffset=r.headerInfo.blobSize));var m={width:n.width,height:n.height,pixelData:r.pixels.resultPixels,minValue:n.zMin,maxValue:n.zMax,validPixelCount:n.numValidPixel,dimCount:n.numDims,dimStats:{minValues:n.minValues,maxValues:n.maxValues},maskData:r.pixels.resultMask};if(r.pixels.resultMask&&d.isValidPixelValue(n.imageType,a)){var g=r.pixels.resultMask;for(i=0;i<f;i++)g[i]||(m.pixelData[i]=a);m.noDataValue=a}return r.noDataValue=a,t.returnFileInfo&&(m.fileInfo=d.formatFileInfo(r)),m},getBandCount:function(e){for(var t=0,a=0,i={ptr:0,pixels:{}};a<e.byteLength-58;)d.readHeaderInfo(e,i),a+=i.headerInfo.blobSize,t++,i.ptr=a;return t}}),x=(m=new ArrayBuffer(4),g=new Uint8Array(m),new Uint32Array(m)[0]=1,1===g[0]),y={decode:function(e,t){if(!x)throw"Big endian system is not supported.";var a,i,r=(t=t||{}).inputOffset||0,n=new Uint8Array(e,r,10),s=String.fromCharCode.apply(null,n);if("CntZImage"===s.trim())a=p,i=1;else{if("Lerc2"!==s.substring(0,5))throw"Unexpected file identifier string: "+s;a=w,i=2}for(var l,o,f,u,c,d,h=0,m=e.byteLength-10,g=[],y={width:0,height:0,pixels:[],pixelType:t.pixelType,mask:null,statistics:[]};r<m;){var k=a.decode(e,{inputOffset:r,encodedMaskData:l,maskData:f,returnMask:0===h,returnEncodedMask:0===h,returnFileInfo:!0,pixelType:t.pixelType||null,noDataValue:t.noDataValue||null});r=k.fileInfo.eofOffset,0===h&&(l=k.encodedMaskData,f=k.maskData,y.width=k.width,y.height=k.height,y.dimCount=k.dimCount||1,y.pixelType=k.pixelType||k.fileInfo.pixelType,y.mask=k.maskData),i>1&&k.fileInfo.mask&&k.fileInfo.mask.numBytes>0&&g.push(k.maskData),h++,y.pixels.push(k.pixelData),y.statistics.push({minValue:k.minValue,maxValue:k.maxValue,noDataValue:k.noDataValue,dimStats:k.dimStats})}if(i>1&&g.length>1){for(d=y.width*y.height,y.bandMasks=g,(f=new Uint8Array(d)).set(g[0]),u=1;u<g.length;u++)for(o=g[u],c=0;c<d;c++)f[c]=f[c]&o[c];y.maskData=f}return y}};D.Lerc=y}();var S=D.Lerc;return h((function(t,a){if(t.encoding===U.LERC){var i;try{i=S.decode(t.heightmap)}catch(e){throw new d.RuntimeError(e)}if(i.statistics[0].minValue===Number.MAX_VALUE)throw new d.RuntimeError("Invalid tile data");t.heightmap=i.pixels[0],t.width=i.width,t.height=i.height}t.ellipsoid=e.Ellipsoid.clone(t.ellipsoid),t.rectangle=e.Rectangle.clone(t.rectangle);var r=M.computeVertices(t),n=r.vertices;return a.push(n.buffer),{vertices:n.buffer,numberOfAttributes:r.encoding.getStride(),minimumHeight:r.minimumHeight,maximumHeight:r.maximumHeight,gridWidth:t.width,gridHeight:t.height,boundingSphere3D:r.boundingSphere3D,orientedBoundingBox:r.orientedBoundingBox,occludeePointInScaledSpace:r.occludeePointInScaledSpace,encoding:r.encoding,westIndicesSouthToNorth:r.westIndicesSouthToNorth,southIndicesEastToWest:r.southIndicesEastToWest,eastIndicesNorthToSouth:r.eastIndicesNorthToSouth,northIndicesWestToEast:r.northIndicesWestToEast}}))}));
