const divLabel = class {
  constructor(t) {
    if (
      ((this.viewer = t.viewer),
      (this.height = t.height),
      (this.position = Cesium.Cartesian3.fromDegrees(
        t.position[0],
        t.position[1],
        t.height
      )),
      (this.vmInstance = t.dom),
      (this.Cesium = t.Cesium || window.Cesium),
      (this.offset = t.offset),
      !this.Cesium)
    )
      throw "no Cesium init function";
    if (!this.vmInstance || !this.vmInstance.style)
      throw "Not passing available Dom";
    (this.vmInstance.style.position = "absolute"),
      (this.vmInstance.style.zIndex = 10),
      this.vmInstance.classList.contains("Cesium-divLabel") ||
        this.vmInstance.classList.add("Cesium-divLabel"),
      (this.show = !0),
      t.viewer.container.appendChild(this.vmInstance),
      this.addPostRender();
  }
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRender, this);
  }
  postRender() {
    var t, e;
    this.vmInstance &&
      this.vmInstance.style &&
      ((t = this.viewer.scene.cartesianToCanvasCoordinates(this.position)),
      Cesium.defined(t) &&
        (this.offset
          ? ((this.vmInstance.style.top = t.y + this.offset[1] + "px"),
            (e = this.vmInstance.offsetWidth),
            (this.vmInstance.style.left = t.x - e / 2 + this.offset[0] + "px"))
          : ((this.vmInstance.style.top = t.y - 220 + "px"),
            (e = this.vmInstance.offsetWidth),
            (this.vmInstance.style.left = t.x - e / 2 + 190 + "px")),
        (t = this.viewer.camera.position),
        (e =
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(t).height),
        (e += this.viewer.scene.globe.ellipsoid.maximumRadius),
        !(this.Cesium.Cartesian3.distance(t, this.position) > e) &&
        this.viewer.camera.positionCartographic.height < 5e7
          ? (this.vmInstance.style.display = "block")
          : (this.vmInstance.style.display = "none")));
  }
  remove() {
    this.vmInstance.remove,
      this.vmInstance.remove(),
      this.viewer.scene.postRender.removeEventListener(this.postRender, this);
  }
  toggleShow(t) {
    return (
      (this.show = t ?? !this.show),
      (this.vmInstance.style.zIndex = this.show ? 10 : -1),
      this
    );
  }
  changePosition(t) {
    return (
      t instanceof Array &&
        2 == t.length &&
        (this.position = Cesium.Cartesian3.fromDegrees(
          t[0],
          t[1],
          this.height
        )),
      this
    );
  }
  removeAllDiv() {
    document.querySelectorAll(".Cesium-divLabel").forEach((t) => t.remove());
  }
};
export default divLabel;
