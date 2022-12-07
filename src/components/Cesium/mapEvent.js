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
