import cerateDiv from "./createDiv";
export const pickUpLocation = (viewer, fn) => {
  let position;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (e) {
    //获取点击位置笛卡尔坐标
    position = viewer.scene.pickPosition(e.position);
    //将笛卡尔坐标转化为经纬度坐标
    position = descarteTolatAndLon(position);
    console.log(position);
    return position;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

//清除实体
export const removeEntityById = (id) => {
  let entID = viewer.entities.getById(id);
  viewer.entities.remove(entID);
};

//清除全部实体
export const removeAllEntity = (viewer) => {
  viewer.entities.removeAll();
};

//绘制普通实体(不可编辑的线(Line)、面(Polygon))
export const drawOrdinaryEntity = (viewer, type) => {
  // handler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
  handler = new Cesium.DrawHandler(viewer, Cesium.DrawMode[type]);
  handler.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
    } else {
      viewer.enableCursorStyle = true;
    }
  });
  handler.movingEvt.addEventListener(function (windowPosition) {
    tooltip.showAt(windowPosition, DrawMode[type]);
  });
  handler.drawEvt.addEventListener(function (result) {
    tooltip.setVisible(false);
  });
  handler.activate();
};

//绘点
export const addIconPoint = (viewer, pic, id, text, color, otherInfos) => {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (e) {
    //获取点击位置笛卡尔坐标
    let position = viewer.scene.pickPosition(e.position);
    //将笛卡尔坐标转化为经纬度坐标
    position = descarteTolatAndLon(position);
    let point = new Cesium.Entity({
      id,
      label: {
        text,
        font: "12px",
        scale: 0.1,
        style: Cesium.LabelStyle.FILL,
        fillColor: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(0, -65),
        showBackground: true,
        backgroundColor: "transparent",
        // scaleByDistance: new Cesium.NearFarScalar(30, 1, 50, 0),
      },
      billboard: {
        image: pic,
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // scaleByDistance: new Cesium.NearFarScalar(50, 2.0, 1000, 0),
        width: 40,
        height: 40,
        depthTestAgainstTerrain: true,
        color: color
          ? Cesium.Color.fromCssColorString(color)
          : Cesium.Color.RED,
      },
      position: Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.height
      ),
      otherInfos: otherInfos ? otherInfos : {},
      // materialType, // 素材的类型
    });
    viewer.entities.add(point);
    return point;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

//编辑元素
export const handleEdit = (viewer, entity) => {
  let editHandler = null;
  if (!entity) {
    editHandler && editHandler.deactivate();
    return;
  }
  if (!editHandler) {
    editHandler = new Cesium.EditHandler(viewer, entity);
    editHandler.isEditZ = true;
    editHandler.activate();
  }
};

//绘线
export const drawPolyline = (positions, config_) => {
  if (positions.length < 1) return;
  let config = config_ ? config_ : {};
  return viewer.entities.add({
    name: "线几何对象",
    polyline: {
      positions: positions,
      width: config.width ? config.width : 5.0,
      material: new Cesium.PolylineGlowMaterialProperty({
        color: config.color
          ? new Cesium.Color.fromCssColorString(config.color)
          : Cesium.Color.GOLD,
      }),
      depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
        color: config.color
          ? new Cesium.Color.fromCssColorString(config.color)
          : Cesium.Color.GOLD,
      }),
      clampToGround: true,
    },
  });
};

//笛卡尔转经纬度
export const descarteTolatAndLon = (position) => {
  var cartographic = Cesium.Cartographic.fromCartesian(position);
  var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  var height = cartographic.height;
  if (height < 0) {
    height = 0;
  }
  return {
    longitude,
    latitude,
    height,
  };
};

//绘面(可编辑)
export const drawCanEditPolygon = (materialItem) => {
  const positions = [];
  let isDrawing = true;
  let drawingEntity = null;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  let entity;
  let poly;

  let polygonEntity = (function () {
    function _(positions) {
      this.options = {
        name: "绘制区域",
        polygon: {
          hierarchy: {
            positions: [],
          },
          perPositionHeight: true,
          material: materialItem?.color
            ? Cesium.Color.fromCssColorString(materialItem.color).withAlpha(0.5)
            : Cesium.Color.RED.withAlpha(0.5),
        },
      };
      this.positions = positions;
      this._init();
    }

    _.prototype._init = function () {
      let _self = this;
      this.options.polygon.hierarchy = new Cesium.CallbackProperty(function () {
        return {
          positions: _self.positions,
        };
      }, false);
      drawingEntity = entity = viewer.entities.add(this.options);
    };
    return _;
  })();

  handler.setInputAction(function (movement) {
    let cartesian = viewer.scene.pickPosition(movement.position);
    let ent = viewer.selectedEntity;
    if (ent && drawingEntity !== ent) {
      return;
    }
    isDrawing = true;
    if (positions.length === 0) {
      positions.push(cartesian.clone());
    }
    positions.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((movement) => {
    let cartesian = viewer.scene.pickPosition(movement.endPosition);
    if (positions.length >= 2) {
      if (!Cesium.defined(poly)) {
        poly = new polygonEntity(positions);
      } else {
        if (cartesian != undefined) {
          positions.pop();
          positions.push(cartesian);
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((movement) => {
    console.log(positions);
    positions.pop();
    isDrawing = false;
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    // callback && callback.call(this, entity);
    handleEdit(viewer, entity);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

//经纬度转笛卡尔坐标
export const latitudeAndLongitudeToDescarte = (position) => {
  position = Cesium.Cartesian3.fromDegrees(
    position.longitude,
    position.latitude,
    position.height
  );
  return position;
};
//笛卡尔坐标转屏幕坐标
export const descarteToScreenCoordinates = (viewer, position) => {
  let screenCoordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    position
  );
  return screenCoordinates;
};

//获取屏幕坐标并转经纬度
export const screenCoordinatesToLatitudeAndLongitude = (viewer) => {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((e) => {
    var position = e.endPosition;
    var last = scene.pickPosition(position);
    console.log("position", position);
    //计算该点与视口位置点坐标的距离
    var distance = Cesium.Cartesian3.distance(viewPosition, last);

    if (distance > 0) {
      // 将鼠标当前点坐标转化成经纬度
      var cartographic = Cesium.Cartographic.fromCartesian(last);
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      var height = cartographic.height;
      return {
        longitude,
        latitude,
        height,
      };
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

//可视域分析
export const visibleRange = (viewer) => {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // viewer.entities.removeAll();
  window.scene = viewer.scene;
  scene.viewFlag = true;
  window.pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
  // 创建可视域分析对象
  window.viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3D.distance = 0.1;
  // scene.viewFlag = true;

  //激活绘制点类
  pointHandler.activate();
  var viewPosition;
  pointHandler.drawEvt.addEventListener(function (result) {
    var point = result.object;
    var position = point.position;
    viewPosition = position;
    console.log("position", position);
    // 将获取的点的位置转化成经纬度
    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height + 1.8;
    point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    console.log("position", point.position);
    if (scene.viewFlag) {
      // 设置视口位置
      viewshed3D.viewPosition = [longitude, latitude, height];
      viewshed3D.build();
      // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
      scene.viewFlag = false;
    }
  });

  handler.setInputAction(function (e) {
    // 若此标记为false，则激活对可视域分析对象的操作
    if (!scene.viewFlag) {
      //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
      var position = e.endPosition;
      var last = scene.pickPosition(position);

      //计算该点与视口位置点坐标的距离
      var distance = Cesium.Cartesian3.distance(viewPosition, last);

      if (distance > 0) {
        // 将鼠标当前点坐标转化成经纬度
        var cartographic = Cesium.Cartographic.fromCartesian(last);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;
        // 通过该点设置可视域分析对象的距离及方向
        viewshed3D.setDistDirByPoint([longitude, latitude, height]);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (e) {
    //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
    scene.viewFlag = true;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

//创建div
export const createDiv = (viewer, id, position, el) => {
  let val = {
    viewer: viewer,
    position: [position.longitude, position.latitude],
    height: 0,
    dom: el,
  };
  window.layer = {};
  layer[id] = new cerateDiv(val);
};

export const updateDivLabel = (id, position) => {
  window.layer[id].changePosition([position.longitude, position.latitude]);
};
