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
export const addIconPointByClick = (
  viewer,
  pic,
  id,
  text,
  color,
  otherInfos
) => {
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

  handler.setInputAction(() => {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler = handler && handler.destroy();
    // let pickedEntity = viewer.entities.getById("test");
    // handleEdit(viewer, pickedEntity);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

export const addIconPointByPosition = (
  viewer,
  position,
  pic,
  id,
  text,
  color,
  otherInfos
) => {
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
      color: color ? Cesium.Color.fromCssColorString(color) : Cesium.Color.RED,
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
};

// 绘制可编辑的线
export const drawLineEdit = (viewer) => {
  const positions = [];
  let drawingEntity = null;
  let poly, entity;
  let isDrawing = true;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  let polyLineEntity = (function () {
    function _(positions) {
      // polyline 配置
      this.options = {
        name: "polyline",
        polyline: {
          show: true,
          positions: [],
          material: Cesium.Color.GREEN,
          width: 3,
        },
      };
      this.positions = positions;
      this._init();
    }

    _.prototype._init = function () {
      let _self = this;
      this.options.polyline.positions = new Cesium.CallbackProperty(
        function () {
          return _self.positions;
        },
        false
      );
      drawingEntity = entity = viewer.entities.add(this.options);
    };
    return _;
  })();
  handler.setInputAction(function (movement) {
    let ent = viewer.selectedEntity;
    // 当前选中的entity不是绘制的entity，就return。实现绘制时也能选择
    if (ent && drawingEntity !== ent) {
      return;
    }
    isDrawing = true;
    let cartesian = viewer.scene.pickPosition(movement.position);
    if (positions.length == 0) {
      positions.push(cartesian.clone());
    }
    positions.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction((movement) => {
    let cartesian = viewer.scene.pickPosition(movement.endPosition);
    if (positions.length >= 2) {
      if (!Cesium.defined(poly)) {
        poly = new polyLineEntity(positions);
      } else {
        if (cartesian != undefined) {
          positions.pop();
          positions.push(cartesian);
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction((movement) => {
    positions.pop();

    isDrawing = false;
    handler = handler && handler.destroy(); // clear and empty the handler.
    // 继续绘制
    // this.drawLine(this.handleEdit);
    handleEdit(viewer, entity);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

//编辑元素
export const handleEdit = (viewer, entity) => {
  console.log("entity", entity);
  // let editHandler = null;
  // if (!entity) {
  //   editHandler && editHandler.deactivate();
  //   return;
  // }
  // if (!editHandler) {
  //   let editHandler = new Cesium.EditHandler(viewer, entity);
  //   console.log(editHandler);
  //   editHandler.isEditZ = true;
  //   editHandler.activate();
  // } else {
  //   editHandler.deactivate();
  //   editHandler.setEditObject(entity);
  //   editHandler.activate();
  // }
  let editHandler = null;
  if (!entity) {
    editHandler && editHandler.deactivate();
    return;
  }
  if (!editHandler) {
    editHandler = new Cesium.EditHandler(viewer, entity);
    console.log("editHandler", editHandler);
    editHandler.isEditZ = true;
    editHandler.activate();
  } else {
    editHandler.deactivate();
    editHandler.setEditObject(entity);
    editHandler.activate();
  }
};

//绘线
export const drawPolyline = (id, positions, config_) => {
  if (positions.length < 1) return;
  let config = config_ ? config_ : {};
  let posi = [];

  positions.forEach((item) => {
    let x = Cesium.Cartesian3.fromDegrees(
      item.longitude,
      item.latitude,
      item.height
    );
    posi.push(x);
  });

  return viewer.entities.add({
    id,
    name: "线几何对象",
    polyline: {
      positions: posi,
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
export const drawCanEditPolygon = (viewer) => {
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
          material: Cesium.Color.RED.withAlpha(0.5),
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

//经纬度转屏幕坐标
export function latitudeAndLongitudeToScreenCoordinates(positions) {
  let posiDatas = [];
  let position;
  let chanedc;
  positions.forEach((item) => {
    position = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0);
    chanedc = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      position
    );
    console.log("chanedc", chanedc);
    chanedc.value = item.value;
    chanedc.x = chanedc.x.toFixed();
    chanedc.y = chanedc.y.toFixed();
    posiDatas.push(chanedc);
  });
  return posiDatas;
}

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

//更新div位置
export const updateDivLabel = (id, position) => {
  window.layer[id].changePosition([position.longitude, position.latitude]);
};

//清除div
export const clearDivLabel = (id) => {
  window.layer[id].remove();
};

//飞到某处
export function flyToPoint(posi) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      posi.longitude,
      posi.latitude - 0.001,
      posi.height + 260
    ),
    orientation: {
      heading: 0.057143935920923816,
      pitch: -1.0925426386876458,
      roll: 6.191530127148629,
    },
  });
}

//更新实体的位置
export function updataEntityPosition(entity, posi, type, data) {
  let x;
  if (type == "line") {
    x = [
      Cesium.Cartesian3.fromDegrees(
        posi[0].longitude,
        posi[0].latitude,
        posi[0].height
      ),
      Cesium.Cartesian3.fromDegrees(
        posi[1].longitude,
        posi[1].latitude,
        posi[1].height
      ),
    ];
    entity.polyline.positions = new Cesium.CallbackProperty(() => {
      return x;
    }, false);
  } else if (type === "point") {
    let key = Object.keys(posi);

    x = Cesium.Cartesian3.fromDegrees(posi[key[0]], posi[key[1]], posi[key[2]]);
    entity.position = new Cesium.CallbackProperty(() => {
      return x;
    }, false);
  }
}

// 标点测距
export const distance = (viewer) => {
  let handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    //Cesium.MeasureMode.Area ：面积模式
    // Cesium.MeasureMode.Distance ： 距离量算模式
    // Cesium.MeasureMode.DVH ： 空间距离、水平距离、垂直距离三分量量算模式。
    0
  );
  //注册测距功能事件
  handlerDis.activate();
  // activate() 激活
  // deactivate() 关闭
  // clear() 清空绘制的要素
  console.log(handlerDis.measureEvt);

  handlerDis.measureEvt.addEventListener(function (result) {
    console.log(result);
    var dis = Number(result.distance);
    var distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
  });
};

// 测面积
export const area = (viewer) => {
  let handlerArea = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Area,
    0
  );
  handlerArea.activate();
  handlerArea.measureEvt.addEventListener(function (result) {
    var mj = Number(result.area);
    var area =
      mj > 1000000 ? (mj / 1000000).toFixed(2) + "km²" : mj.toFixed(2) + "㎡";
    handlerArea.areaLabel.text = "面积:" + area;
  });
};

// 测高度
export const heightMeasure = () => {
  let handlerHeight = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.DVH,
    0
  );
  handlerHeight.activate();
  handlerHeight.measureEvt.addEventListener(function (result) {
    var distance =
      result.distance > 1000
        ? (result.distance / 1000).toFixed(2) + "km"
        : result.distance + "m";
    var vHeight =
      result.verticalHeight > 1000
        ? (result.verticalHeight / 1000).toFixed(2) + "km"
        : result.verticalHeight + "m";
    var hDistance =
      result.horizontalDistance > 1000
        ? (result.horizontalDistance / 1000).toFixed(2) + "km"
        : result.horizontalDistance + "m";
    handlerHeight.disLabel.text = "空间距离:" + distance;
    handlerHeight.vLabel.text = "垂直高度:" + vHeight;
    handlerHeight.hLabel.text = "水平距离:" + hDistance;
  });
};

//显示笔型鼠标
export const enableBodyDrawCur = (viewer, isActive) => {
  viewer.enableCursorStyle = true;
  let list = document.body.classList;
  list.remove("drawCur");
  if (isActive) {
    viewer.enableCursorStyle = false;
    viewer._element.style.cursor = "";
    list.add("drawCur");
  }
};

// 通过点击实体来实现编辑实体
export const getEntityByPick = (viewer) => {
  handler.setInputAction(function (e) {
    let pick = viewer.scene.pick(e.position);
    console.log(pick.id._id);
    let entity = viewer.entities.getById(pick.id._id);
    handleEdit(viewer, entity);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
