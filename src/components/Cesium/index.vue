<template>
  <div class="select">
    <el-cascader
      @change="change"
      :options="mapOptions"
      v-model="select"
      :show-all-levels="false"
    />
  </div>
  <div id="cesiumContainer">
    <div id="label" style="display: none">label</div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import divLabel from "./createDiv";
import {
  pickUpLocation,
  addIconPointByClick,
  addIconPointByPosition,
  removeAllEntity,
  drawLineEdit,
  drawOrdinaryEntity,
  descarteToScreenCoordinates,
  latitudeAndLongitudeToDescarte,
  screenCoordinatesToLatitudeAndLongitude,
  visibleRange,
  createDiv,
  updateDivLabel,
  updataEntityPosition,
  drawPolyline,
  flyToPoint,
  descarteTolatAndLon,
  clearDivLabel,
  distance,
  area,
  heightMeasure,
  enableBodyDrawCur,
  handleEdit,
  drawCanEditPolygon,
  getEntityByPick,
  latitudeAndLongitudeToScreenCoordinates,
} from "./mapEvent";
import pic from "../../assets/img/position.png";
import cerateDiv from "./createDiv";

const select = ref("");
const mapOptions = [
  {
    value: "三维标绘",
    label: "三维标绘",
    children: [
      {
        value: "点",
        label: "点",
      },
      {
        value: "线",
        label: "线",
      },
      {
        value: "线(可编辑)",
        label: "线(可编辑)",
      },
      {
        value: "面",
        label: "面",
      },
      {
        value: "面(可编辑)",
        label: "面(可编辑)",
      },
      {
        value: "动态标绘",
        label: "动态标绘",
        children: [
          {
            value: "动态点",
            label: "动态点",
          },
          {
            value: "轨迹线",
            label: "轨迹线",
          },
          {
            value: "更改线的位置",
            label: "更改线的位置",
          },
        ],
      },
    ],
  },
  {
    value: "量算",
    label: "量算",
    children: [
      {
        value: "空间量算",
        label: "空间量算",
        children: [
          {
            value: "测面",
            label: "测面",
          },
          {
            value: "测高",
            label: "测高",
          },
          {
            value: "测距",
            label: "测距",
          },
        ],
      },
      {
        value: "二维转三维",
        label: "二维转三维",
      },
    ],
  },
  {
    value: "三维空间分析",
    label: "三维空间分析",
    children: [
      {
        value: "可视域分析",
        label: "可视域分析",
      },
      {
        value: "通视分析",
        label: "通视分析",
        children: [
          {
            value: "设置观察点",
            label: "设置观察点",
          },
          {
            value: "设置目标点",
            label: "设置目标点",
          },
        ],
      },
      {
        value: "制高点分析",
        label: "制高点分析",
      },
    ],
  },
  {
    value: "热力图",
    label: "热力图",
  },
  {
    value: "态势推演",
    label: "态势推演",
  },
  {
    value: "创建div",
    label: "创建div",
    children: [
      {
        value: "新建div",
        label: "新建div",
      },
      {
        value: "更新div位置",
        label: "更新div位置",
      },
      {
        value: "移除div",
        label: "移除div",
      },
    ],
  },
];

const change = (e) => {
  let point = {
    longitude: 116.45388048381606,
    latitude: 39.90368684766768,
    height: 0,
  };
  screenCoordinatesToLatitudeAndLongitude(viewer);
  // descarteToScreenCoordinates(viewer, latitudeAndLongitudeToDescarte(point));
  viewer.entities.removeAll();
  enableBodyDrawCur(viewer, true);
  let targetLabel = e[e.length - 1];
  switch (targetLabel) {
    case "点":
      addIconPointByClick(viewer, pic, "test", "位置1", "#d81e06");
      break;
    case "线":
      drawOrdinaryEntity(viewer, "Line");
      break;
    case "面":
      drawOrdinaryEntity(viewer, "Polygon");
      break;
    case "新建div":
      createDiv(
        viewer,
        "div1",
        { longitude: 116.45388048381606, latitude: 39.90368684766768 },
        document.getElementById("label")
      );

      break;
    case "更新div位置":
      updateDivLabel("div1", {
        longitude: 116.85388048381606,
        latitude: 40.90368684766768,
      });
      break;
    case "可视域分析":
      visibleRange(viewer);
      break;
    case "动态点":
      updatePoint();
      break;
    case "轨迹线":
      playTrack();
      break;
    case "更改线的位置":
      updateLine();
      break;
    case "设置观察点":
      observe();
      break;
    case "设置目标点":
      target();
      break;
    case "移除div":
      clearDivLabel("div1");
      break;
    case "测距":
      distance(viewer);
      break;
    case "测面":
      area(viewer);
      break;
    case "测高":
      heightMeasure(viewer);
      break;
    case "线(可编辑)":
      drawLineEdit(viewer);
      break;
    case "面(可编辑)":
      drawCanEditPolygon(viewer);
      break;
    case "热力图":
      showHeatMap();
      break;
    default:
      console.log("未匹配");
      break;
  }
};

let tempPoints = [];
let tempEntities = [];
//轨迹线
const createTrajectoryline = (posi) => {
  tempPoints.push(posi);
  let tempLength = tempPoints.length;

  if (tempLength > 1) {
    let pointline = drawPolyline("test2", [
      tempPoints[tempPoints.length - 2],
      tempPoints[tempPoints.length - 1],
    ]);
    tempEntities.push(pointline);
  }
};
const list = [
  {
    longitude: 116.45448909735077,
    latitude: 39.90664167026053,
    height: 5.01471818390532,
  },
  {
    longitude: 116.45437251002404,
    latitude: 39.90663531305779,
    height: 5.020913836818234,
  },
  {
    longitude: 116.45428477913356,
    latitude: 39.90663491128082,
    height: 5.012471371515432,
  },
  {
    longitude: 116.45419713838585,
    latitude: 39.906636677800876,
    height: 5.012186060859659,
  },
  {
    longitude: 116.45407274475615,
    latitude: 39.90663918524774,
    height: 5.011370022739517,
  },
  {
    longitude: 116.4539257328469,
    latitude: 39.90664214836798,
    height: 5.010575102190116,
  },
  {
    longitude: 116.4537560225465,
    latitude: 39.906641221822625,
    height: 5.006942342246863,
  },
  {
    longitude: 116.45362879866248,
    latitude: 39.906639434371925,
    height: 5.015870305783903,
  },
  {
    longitude: 116.45348466931085,
    latitude: 39.906644514129724,
    height: 5.010476871842427,
  },
  {
    longitude: 116.45332922232326,
    latitude: 39.90664330242107,
    height: 5.006589597903376,
  },
  {
    longitude: 116.45322757279341,
    latitude: 39.90664100212228,
    height: 5.015905638080603,
  },
  {
    longitude: 116.45313142570888,
    latitude: 39.906649456551726,
    height: 5.0133712493683396,
  },
  {
    longitude: 116.45304658361835,
    latitude: 39.90665334118884,
    height: 5.0084597803539195,
  },
  {
    longitude: 116.4530699035403,
    latitude: 39.90664854664485,
    height: 5.007303211281564,
  },
  {
    longitude: 116.45296839526611,
    latitude: 39.90665493307963,
    height: 5.009917255766416,
  },
  {
    longitude: 116.45286950663481,
    latitude: 39.906656925283144,
    height: 5.009358674884923,
  },
  {
    longitude: 116.45277366568382,
    latitude: 39.90666537456599,
    height: 5.007265246475042,
  },
  {
    longitude: 116.45269485942018,
    latitude: 39.90667783349985,
    height: 5.008079461678473,
  },
  {
    longitude: 116.45261585375036,
    latitude: 39.90668595461474,
    height: 5.006054136136206,
  },
  {
    longitude: 116.45256535752677,
    latitude: 39.90670440220981,
    height: 5.005039598600874,
  },
  {
    longitude: 116.45251722950859,
    latitude: 39.90670537150528,
    height: 5.005053452569678,
  },
  {
    longitude: 116.45244653759129,
    latitude: 39.90671115547439,
    height: 5.007471112196971,
  },
  {
    longitude: 116.4523505903781,
    latitude: 39.90673711341254,
    height: 5.004754814079027,
  },
  {
    longitude: 116.4522316602026,
    latitude: 39.906754821577884,
    height: 5.008480150218423,
  },
  {
    longitude: 116.45217498204947,
    latitude: 39.906769112779415,
    height: 5.004586360468667,
  },
  {
    longitude: 116.45210118616144,
    latitude: 39.90678376596676,
    height: 5.000515057717475,
  },
  {
    longitude: 116.45203871871055,
    latitude: 39.90678721126967,
    height: 5.007998577449604,
  },
  {
    longitude: 116.4519875573272,
    latitude: 39.906790442562254,
    height: 5.003139456931709,
  },
  {
    longitude: 116.45194492818742,
    latitude: 39.906795690920106,
    height: 5.006057192263041,
  },
  {
    longitude: 116.45181141515344,
    latitude: 39.90679617758156,
    height: 5.0105520430500885,
  },
  {
    longitude: 116.45171207788505,
    latitude: 39.90678940205663,
    height: 5.004184959345786,
  },
  {
    longitude: 116.45166149164861,
    latitude: 39.90676192820926,
    height: 5.0038375411129765,
  },
  {
    longitude: 116.45159136972084,
    latitude: 39.906728377041844,
    height: 5.005023714141948,
  },
  {
    longitude: 116.45159317862196,
    latitude: 39.90664793549015,
    height: 5.00687380788924,
  },
  {
    longitude: 116.45159045221553,
    latitude: 39.9065189096833,
    height: 5.005963334460019,
  },
  {
    longitude: 116.451609825171,
    latitude: 39.90640159115586,
    height: 5.006331858329932,
  },
  {
    longitude: 116.4516015238892,
    latitude: 39.90643826827206,
    height: 5.002974356220881,
  },
  {
    longitude: 116.45158603554825,
    latitude: 39.90638193816972,
    height: 5.009982890162908,
  },
  {
    longitude: 116.45160212938487,
    latitude: 39.906320818911595,
    height: 5.001321133951964,
  },
  {
    longitude: 116.45160659930141,
    latitude: 39.906255788851155,
    height: 5.002709601051655,
  },
  {
    longitude: 116.45160472577817,
    latitude: 39.90616025999335,
    height: 5.0082191535130125,
  },
  {
    longitude: 116.45160928251306,
    latitude: 39.9061028083117,
    height: 5.007543318792865,
  },
  {
    longitude: 116.45159383864178,
    latitude: 39.906039505744424,
    height: 5.008643071991708,
  },
  {
    longitude: 116.4515896182136,
    latitude: 39.905967673243964,
    height: 5.003781261071823,
  },
  {
    longitude: 116.45157999894464,
    latitude: 39.90590722895562,
    height: 5.000101242791941,
  },
  {
    longitude: 116.45156728388237,
    latitude: 39.90582789212959,
    height: 5.0020564077701355,
  },
  {
    longitude: 116.45156009483416,
    latitude: 39.90574054436926,
    height: 4.998245236302898,
  },
  {
    longitude: 116.45156205541022,
    latitude: 39.90569386619719,
    height: 5.003263639965413,
  },
  {
    longitude: 116.4515499108057,
    latitude: 39.90563715996874,
    height: 5.007345831051162,
  },
  {
    longitude: 116.45154045232924,
    latitude: 39.90557234187873,
    height: 5.005494091243214,
  },
  {
    longitude: 116.45155141709266,
    latitude: 39.905721626884194,
    height: 5.001918594552164,
  },
  {
    longitude: 116.45154296031248,
    latitude: 39.90564363854893,
    height: 4.999173948446627,
  },
  {
    longitude: 116.4515527454735,
    latitude: 39.90552515083563,
    height: 4.999794429504856,
  },
  {
    longitude: 116.45154042196248,
    latitude: 39.90541690976726,
    height: 5.0060632046458595,
  },
  {
    longitude: 116.45153924976655,
    latitude: 39.90530747528389,
    height: 5.004578956609565,
  },
  {
    longitude: 116.45141642837368,
    latitude: 39.90528484509431,
    height: 4.999392437995772,
  },
  {
    longitude: 116.45126951997779,
    latitude: 39.90527528330944,
    height: 5.002766185405988,
  },
  {
    longitude: 116.45113089951951,
    latitude: 39.90526764594908,
    height: 5.0014112418700725,
  },
  {
    longitude: 116.45098233649482,
    latitude: 39.90526438867059,
    height: 5.003022984342314,
  },
  {
    longitude: 116.4507388653848,
    latitude: 39.90526094970037,
    height: 4.996705079530373,
  },
  {
    longitude: 116.45060047149542,
    latitude: 39.90527414689387,
    height: 4.997630740292467,
  },
  {
    longitude: 116.45063993393094,
    latitude: 39.90529637069526,
    height: 5.003297663759181,
  },
  {
    longitude: 116.4505808756962,
    latitude: 39.90528497591252,
    height: 5.006916311967754,
  },
  {
    longitude: 116.45036137807153,
    latitude: 39.90528519564716,
    height: 5.003608281790695,
  },
  {
    longitude: 116.45021386684513,
    latitude: 39.90527768784947,
    height: 5.0024824603143765,
  },
  {
    longitude: 116.45008070881418,
    latitude: 39.905280366576015,
    height: 5.002205538935539,
  },
  {
    longitude: 116.44993095362602,
    latitude: 39.9052854664124,
    height: 4.99738152913701,
  },
  {
    longitude: 116.44987274603008,
    latitude: 39.90528874280421,
    height: 5.004896972428963,
  },
  {
    longitude: 116.44981749433964,
    latitude: 39.905302424566855,
    height: 5.001199894232653,
  },
  {
    longitude: 116.44975947191541,
    latitude: 39.905318307328145,
    height: 5.019892817360989,
  },
  {
    longitude: 116.44968447975248,
    latitude: 39.90532191034195,
    height: 5.015452697798712,
  },
  {
    longitude: 116.44961208685996,
    latitude: 39.90530866809747,
    height: 5.011521880528256,
  },
  {
    longitude: 116.44956167134416,
    latitude: 39.905246957312634,
    height: 5.017018801355974,
  },
  {
    longitude: 116.44946195762147,
    latitude: 39.905221896686264,
    height: 5.016441306092792,
  },
  {
    longitude: 116.44939563383423,
    latitude: 39.90518172223821,
    height: 5.012099066230931,
  },
  {
    longitude: 116.4493020226906,
    latitude: 39.905150529177234,
    height: 5.013655875625105,
  },
  {
    longitude: 116.4490254182844,
    latitude: 39.90505792601037,
    height: 5.017164579570791,
  },
  {
    longitude: 116.44889282779063,
    latitude: 39.904999504452185,
    height: 5.013499252724749,
  },
  {
    longitude: 116.4487103689467,
    latitude: 39.90494676385401,
    height: 5.012941064428758,
  },
  {
    longitude: 116.44860641885083,
    latitude: 39.90488759201506,
    height: 5.008208502933502,
  },
  {
    longitude: 116.44844503906712,
    latitude: 39.90479698325847,
    height: 5.015508566104133,
  },
  {
    longitude: 116.4482937689117,
    latitude: 39.90476389522905,
    height: 5.0095671277606275,
  },
  {
    longitude: 116.4481078179235,
    latitude: 39.904702752670836,
    height: 5.009898037853642,
  },
  {
    longitude: 116.447995342516,
    latitude: 39.904655382703645,
    height: 5.018751400064918,
  },
  {
    longitude: 116.44782983013182,
    latitude: 39.90460011581634,
    height: 5.009629145070781,
  },
  {
    longitude: 116.44765774938917,
    latitude: 39.904520586860606,
    height: 5.017202839434978,
  },
  {
    longitude: 116.44745073707867,
    latitude: 39.904472871890064,
    height: 5.01967428984734,
  },
  {
    longitude: 116.44718895376383,
    latitude: 39.90448244669299,
    height: 5.01132421342996,
  },
  {
    longitude: 116.44702848034446,
    latitude: 39.9044684290256,
    height: 5.012599232371398,
  },
  {
    longitude: 116.44686249883246,
    latitude: 39.90447176400651,
    height: 5.0132946449539535,
  },
  {
    longitude: 116.446891335626,
    latitude: 39.904477664935285,
    height: 5.011666074638061,
  },
  {
    longitude: 116.44678364092529,
    latitude: 39.90446903126559,
    height: 5.011073526560228,
  },
  {
    longitude: 116.44660056576502,
    latitude: 39.90447270915379,
    height: 5.01207655793344,
  },
  {
    longitude: 116.44645129100708,
    latitude: 39.904475707854466,
    height: 5.012583047358632,
  },
  {
    longitude: 116.4462796261699,
    latitude: 39.90448347317541,
    height: 5.016385482510129,
  },
  {
    longitude: 116.44614722694666,
    latitude: 39.904486132452156,
    height: 5.0172122573890565,
  },
  {
    longitude: 116.44599510926895,
    latitude: 39.90448918765251,
    height: 5.017797089712923,
  },
  {
    longitude: 116.44591064856759,
    latitude: 39.90449304191947,
    height: 5.026181985401351,
  },
  {
    longitude: 116.44534739123783,
    latitude: 39.90448924693105,
    height: 5.025299897368753,
  },
  {
    longitude: 116.44533258355733,
    latitude: 39.904769276685904,
    height: 5.027189264236393,
  },
];
const updateLine = () => {
  let center = {
    longitude: 116.45448909735077,
    latitude: 39.90664167026053,
    height: 5.01471818390532,
  };

  drawPolyline("test3", [
    center,
    {
      longitude: 116.4490254182844,
      latitude: 39.90505792601037,
      height: 5.017164579570791,
    },
  ]);
  let lineEntity = viewer.entities.getById("test3");
  list.reduce((p, x) => {
    return p.then(() => {
      return new Promise((r) => {
        setTimeout(() => {
          r(updataEntityPosition(lineEntity, [center, x], "line"));
        }, 500);
      });
    });
  }, Promise.resolve());
};
const updatePoint = () => {
  addIconPointByPosition(
    viewer,
    {
      longitude: 116.45448909735077,
      latitude: 39.90664167026053,
      height: 5.01471818390532,
    },
    pic,
    "position1",
    "地点1",
    "#d81e06"
  );
  let pickedEntity = viewer.entities.getById("position1");
  flyToPoint({
    longitude: 116.45448909735077,
    latitude: 39.90664167026053,
    height: 5.01471818390532,
  });
  list.reduce((p, x) => {
    return p.then(() => {
      return new Promise((r) => {
        setTimeout(() => {
          r(updataEntityPosition(pickedEntity, x, "point"));
        }, 500);
      });
    });
  }, Promise.resolve());
};

const playTrack = () => {
  flyToPoint({
    longitude: 116.45448909735077,
    latitude: 39.90664167026053,
    height: 5.01471818390532,
  });
  addIconPointByPosition(
    viewer,
    {
      longitude: 116.45448909735077,
      latitude: 39.90664167026053,
      height: 5.01471818390532,
    },
    pic,
    "position1",
    "地点1",
    "#d81e06"
  );
  let pickedEntity = viewer.entities.getById("position1");
  list.reduce((p, x) => {
    return p.then(() => {
      return new Promise((r) => {
        setTimeout(() => {
          r(updataEntityPosition(pickedEntity, x, "point"));
          r(createTrajectoryline(x));
        }, 500);
      });
    });
  }, Promise.resolve());
};

const isAddObservePoint = ref(true);
//通视分析-观察点
const observe = () => {
  window.sightline = new Cesium.Sightline(viewer.scene);
  sightline.build();
  if (isAddObservePoint.value) {
    window.pointByObserve = new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Point
    );
    //激活绘制点类
    pointByObserve.activate();
    pointByObserve.drawEvt.addEventListener(function (result) {
      let observePosi = result.object.position;
      sightline.viewPosition = descarteTolatAndLon(observePosi);
      isAddObservePoint.value = false;
    });
  }
};

//通视分析-目标点
const target = () => {
  handler.setInputAction(function () {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  handler.setInputAction(function (evt) {
    //鼠标移动，更新最后一次添加的目标点的位置
    var position = viewer.scene.pickPosition(evt.endPosition);

    if (num.value > 0) {
      sightline.removeTargetPoint("point0");

      var cartographic = descarteTolatAndLon(position);

      var flag = sightline.addTargetPoint({
        position: cartographic,
        name: "point0",
      });
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (e) {
    var position = viewer.scene.pickPosition(e.position);
    addTarget(position);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const num = ref(0);
//通视分析
const addTarget = (CartesianPosition) => {
  //将获取的点的位置转化成经纬度
  var cartographic = descarteTolatAndLon(CartesianPosition);
  console.log("cartographic", cartographic);
  //添加目标点
  var name = num.value++;
  sightline.addTargetPoint({
    position: cartographic,
    name: name,
  });
};

const KEY = "AuZhjW6H0pb4-3NSK_dDK4WeHwdrjQn_T-6PVQrY17HGVHwn5McFdEZiFoUYKCF0";
const serverUrl =
  "http://10.12.6.38:8090/iserver/services/plot-jingyong/rest/plot";
window.viewer = null;
window.handler = null;
window.plotting = null;

onMounted(() => {
  window.viewer = new Cesium.Viewer("cesiumContainer", {
    infoBox: false,
    selectionIndicator: false,
  });

  viewer.entities.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
      url: "https://dev.virtualearth.net",
      mapStyle: Cesium.BingMapsStyle.AERIAL,
      key: KEY,
    })
  );
  window.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  window.scene = viewer.scene;
  let widget = viewer.cesiumWidget;
  scene.shadowMap.darkness = 1.275; //设置第二重烘焙纹理的效果（明暗程度）
  scene.skyAtmosphere.brightnessShift = 0.4; //修改大气的亮度
  scene.debugShowFramesPerSecond = true;
  scene.hdrEnabled = false;
  scene.sun.show = true;
  // 01设置环境光的强度-新处理CBD场景
  scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
  // 添加光源
  var position1 = new Cesium.Cartesian3.fromDegrees(
    116.261209157595,
    39.3042238956531,
    480
  );
  //光源方向点

  var targetPosition1 = new Cesium.Cartesian3.fromDegrees(
    116.261209157595,
    39.3042238956531,
    430
  );
  var dirLightOptions = {
    targetPosition: targetPosition1,
    color: new Cesium.Color(1.0, 1.0, 1.0, 1),
    intensity: 0.55,
  };
  let directionalLight_1 = new Cesium.DirectionalLight(
    position1,
    dirLightOptions
  );
  scene.addLightSource(directionalLight_1);
  viewer.scene.globe.depthTestAgainstTerrain = true;

  try {
    //打开所发布三维服务下的所有图层
    // var url = "http://10.12.6.38:8090/iserver/services/3D-CBD/rest/realspace";
    const url =
      "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace";
    var promise = scene.open(url);
    Cesium.when(
      promise,
      function (layers) {
        for (var i = 0; i < layers.length; i++) {
          layers[i].selectEnabled = false;
        }
        $("#s3mOptions").change(function () {
          scene.layers.removeAll(true);
          var value = parseInt($(this).val());
          var promise = scene.open(url);
          Cesium.when(promise, function (layers) {
            for (var layer of layers) {
              layer.LoadingPriority = value; //改变加载策略
            }
          });
        });
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法拾取位置！");
        }
      },
      function (e) {
        if (widget._showRenderLoopErrors) {
          var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
          widget.showErrorPanel(title, undefined, e);
        }
      }
    );
  } catch (e) {
    if (widget._showRenderLoopErrors) {
      var title = "渲染时发生错误，已停止渲染。";
      widget.showErrorPanel(title, undefined, e);
    }
  }

  getEntityByPick(viewer);
});

const showHeatMap = () => {
  let data = [
    {
      lon: 116.4536589046941,
      lat: 39.904588723639186,
      value: 20,
    },
    {
      lon: 116.45055888425955,
      lat: 39.90619495778332,
      value: 10,
    },
    {
      lon: 116.45388048381606,
      lat: 39.90368684766768,
      value: 15,
    },
    { lon: 116.44830877344315, lat: 39.90531110627574, value: 23 },
    {
      lon: 116.44630024308788,
      lat: 39.906526626472086,
      value: 40,
    },
    {
      lon: 116.44680114932157,
      lat: 39.90353052489719,
      value: 33,
    },
  ];

  var heatMap1 = createHeatMap(latitudeAndLongitudeToScreenCoordinates(data));
  creatRectangle(viewer, heatMap1);

  // 创建热力图
  function createHeatMap(data) {
    console.log("data", data);
    // 创建元素
    var heatDoc = document.createElement("div");
    heatDoc.setAttribute(
      "style",
      "width:1000px;height:1000px;margin: 0px;display: none;"
    );
    document.body.appendChild(heatDoc);
    // 创建热力图对象
    var heatmap = h337.create({
      container: heatDoc,
      radius: 20,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75,
      gradient: {
        0.9: "red",
        0.8: "orange",
        0.7: "yellow",
        0.5: "blue",
        0.3: "green",
      },
    });
    // 添加数据
    heatmap.setData({
      max: 40,
      data: data,
    });
    return heatmap;
  }
  function creatRectangle(viewer, heatMap) {
    viewer.entities.add({
      name: "Rotating rectangle with rotating texture coordinate",
      show: true,
      rectangle: {
        coordinates: Cesium.Rectangle.fromCartesianArray([
          Cesium.Cartesian3.fromDegrees(
            116.44468241146141,
            39.911940790287666,
            0
          ),
          Cesium.Cartesian3.fromDegrees(
            116.46356477866011,
            39.9121203978451,
            0
          ),
          Cesium.Cartesian3.fromDegrees(
            116.4631813104606,
            39.90388588959914,
            0
          ),
          Cesium.Cartesian3.fromDegrees(
            116.44437341789303,
            39.902900077003565,
            0
          ),
        ]),

        material: heatMap._renderer.canvas, // 核心语句，填充热力图
      },
    });
  }
};
</script>

<style scoped lang="less">
.select {
  position: absolute;
  top: 10vh;
  left: 10rem;
  z-index: 1;
}
#label {
  width: 100px;
  height: 100px;
  background-color: #fff;
  font-size: 30px;
}
</style>
