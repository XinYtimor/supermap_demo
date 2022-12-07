define(["./when-b60132fc","./Cartesian2-47311507","./arrayRemoveDuplicates-d2f048c5","./BoundingRectangle-c09cdb4c","./buildModuleUrl-57a32107","./Cartographic-3309dd0d","./ComponentDatatype-c140a87d","./PolylineVolumeGeometryLibrary-2ac63485","./Check-7b2a090c","./GeometryAttribute-c42d25b7","./GeometryAttributes-252e9929","./IndexDatatype-8a5eead4","./Math-119be1a3","./PolygonPipeline-805ba13c","./Matrix4-cde86d0e","./Cartesian4-3ca25aab","./RuntimeError-4a5c8994","./WebGLConstants-4ae0db90","./EllipsoidTangentPlane-ceab6aaa","./IntersectionTests-5e35c2ab","./Plane-ca0357f4","./PolylinePipeline-4ec7a59e","./EllipsoidGeodesic-0f19ac62","./EllipsoidRhumbLine-ed1a6bf4","./FeatureDetection-c3b71206","./earcut-2.2.1-20c8012f"],(function(e,i,a,t,n,r,o,l,s,p,c,d,u,y,h,g,f,m,v,E,b,P,_,C,k,L){"use strict";function D(a){var t=(a=e.defaultValue(a,e.defaultValue.EMPTY_OBJECT)).polylinePositions,n=a.shapePositions;this._positions=t,this._shape=n,this._ellipsoid=i.Ellipsoid.clone(e.defaultValue(a.ellipsoid,i.Ellipsoid.WGS84)),this._cornerType=e.defaultValue(a.cornerType,l.CornerType.ROUNDED),this._granularity=e.defaultValue(a.granularity,u.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeOutlineGeometry";var o=1+t.length*r.Cartesian3.packedLength;o+=1+n.length*i.Cartesian2.packedLength,this.packedLength=o+i.Ellipsoid.packedLength+2}D.pack=function(a,t,n){var o;n=e.defaultValue(n,0);var l=a._positions,s=l.length;for(t[n++]=s,o=0;o<s;++o,n+=r.Cartesian3.packedLength)r.Cartesian3.pack(l[o],t,n);var p=a._shape;for(s=p.length,t[n++]=s,o=0;o<s;++o,n+=i.Cartesian2.packedLength)i.Cartesian2.pack(p[o],t,n);return i.Ellipsoid.pack(a._ellipsoid,t,n),n+=i.Ellipsoid.packedLength,t[n++]=a._cornerType,t[n]=a._granularity,t};var T=i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),G={polylinePositions:void 0,shapePositions:void 0,ellipsoid:T,height:void 0,cornerType:void 0,granularity:void 0};D.unpack=function(a,t,n){var o;t=e.defaultValue(t,0);var l=a[t++],s=new Array(l);for(o=0;o<l;++o,t+=r.Cartesian3.packedLength)s[o]=r.Cartesian3.unpack(a,t);l=a[t++];var p=new Array(l);for(o=0;o<l;++o,t+=i.Cartesian2.packedLength)p[o]=i.Cartesian2.unpack(a,t);var c=i.Ellipsoid.unpack(a,t,T);t+=i.Ellipsoid.packedLength;var d=a[t++],u=a[t];return e.defined(n)?(n._positions=s,n._shape=p,n._ellipsoid=i.Ellipsoid.clone(c,n._ellipsoid),n._cornerType=d,n._granularity=u,n):(G.polylinePositions=s,G.shapePositions=p,G.cornerType=d,G.granularity=u,new D(G))};var R=new t.BoundingRectangle;return D.createGeometry=function(e){var i=e._positions,s=a.arrayRemoveDuplicates(i,r.Cartesian3.equalsEpsilon),u=e._shape;if(u=l.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(u),!(s.length<2||u.length<3)){y.PolygonPipeline.computeWindingOrder2D(u)===y.WindingOrder.CLOCKWISE&&u.reverse();var h=t.BoundingRectangle.fromPoints(u,R);return function(e,i){var a=new c.GeometryAttributes;a.position=new p.GeometryAttribute({componentDatatype:o.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e});var t,r,l=i.length,s=a.position.values.length/3,u=e.length/3/l,y=d.IndexDatatype.createTypedArray(s,2*l*(u+1)),h=0,g=(t=0)*l;for(r=0;r<l-1;r++)y[h++]=r+g,y[h++]=r+g+1;for(y[h++]=l-1+g,y[h++]=g,g=(t=u-1)*l,r=0;r<l-1;r++)y[h++]=r+g,y[h++]=r+g+1;for(y[h++]=l-1+g,y[h++]=g,t=0;t<u-1;t++){var f=l*t,m=f+l;for(r=0;r<l;r++)y[h++]=r+f,y[h++]=r+m}return new p.Geometry({attributes:a,indices:d.IndexDatatype.createTypedArray(s,y),boundingSphere:n.BoundingSphere.fromVertices(e),primitiveType:n.PrimitiveType.LINES})}(l.PolylineVolumeGeometryLibrary.computePositions(s,u,h,e,!1),u)}},function(a,t){return e.defined(t)&&(a=D.unpack(a,t)),a._ellipsoid=i.Ellipsoid.clone(a._ellipsoid),D.createGeometry(a)}}));
