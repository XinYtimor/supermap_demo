<template>
  <div class="select">
    <el-cascader
      @change="change"
      :options="mapOptions"
      v-model="select"
      :show-all-levels="false"
    />
  </div>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  pickUpLocation,
  addIconPoint,
  removeAllEntity,
  handleEdit,
  drawOrdinaryEntity,
  descarteToScreenCoordinates,
  latitudeAndLongitudeToDescarte,
  screenCoordinatesToLatitudeAndLongitude,
} from "./mapEvent";
import pic from "../../assets/img/position.png";
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
  let target = e[e.length - 1];
  switch (target) {
    case "点":
      addIconPoint(viewer, pic, "test", "位置1", "#d81e06");
      break;
    case "线":
      drawOrdinaryEntity(viewer, "Line");
      break;
    case "面":
      drawOrdinaryEntity(viewer, "Polygon");
      break;
    default:
      console.log("未匹配");
      break;
  }
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
    var url = "http://10.12.6.38:8090/iserver/services/3D-CBD/rest/realspace";
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
});
</script>

<style scoped lang="less">
.select {
  position: absolute;
  top: 10vh;
  left: 10rem;
  z-index: 1;
}
</style>
