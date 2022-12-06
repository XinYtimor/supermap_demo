<template><div id="cesiumContainer"></div></template>

<script setup>
import { reactive, ref, onMounted } from "vue";
const KEY = "AuZhjW6H0pb4-3NSK_dDK4WeHwdrjQn_T-6PVQrY17HGVHwn5McFdEZiFoUYKCF0";
const serverUrl =
  "http://10.12.6.38:8090/iserver/services/plot-jingyong/rest/plot";
window.viewer = null;
window.handler = null;
window.plotting = null;
// 控制点击实体后的信息框显示
let showTooltip = ref(false);
let tooltipClass = ref();
let scenePosition = null; // 记录在场景中点击的笛卡尔坐标点
let handlePostRender = null;
let pickedEntityFields = ref([]);
let pickedEntityType = ref();

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

  // initTooltip();
  // 加载 KML 文件
  // viewer.dataSources.add(
  //   Cesium.KmlDataSource.load('1667889134213.kml', {
  //     camera: viewer.scene.camera,
  //     canvas: viewer.scene.canvas,
  //   }),
  // );
  let scene = viewer.scene;
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
  // viewer.scene.globe.depthTestAgainstTerrain = true;

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

<style scoped lang="less"></style>
