/**
 * 自动旋转控制
 * @author Sheng Guangli
 */
THREE.AutoRotateControl = function (camera, domElement) {
  var _this = this;

  // 镜头
  this.camera = camera;
  // DOM对象
  this.domElement = domElement;

  /* 公开属性 */
  this.enabled = true;
  this.screen = { left: 0, top: 0, width: 0, height: 0 };
  this.rotateX = 0.0;
  this.rotateY = 0.0;
  this.rotateSpeed = 1.0;
  this.zoomSpeed = 1.2;
  this.zoomFactor = 1.0;
  this.enableRotate = true;
  this.enableZoom = true;
  this.dynamicDampingFactor = 0.2;
  this.minDistance = 0;
  this.maxDistance = Infinity;

  /* 内部变量 */
  this.target = new THREE.Vector3();
  // 镜头改变距离阀值
  var EPS = 0.000001;
  // 前次镜头位置
  var lastPosition = new THREE.Vector3();
  // 视角位置
  var _eye = new THREE.Vector3();
  // 缩放开始位置
  var _zoomStart = new THREE.Vector2();
  // 缩放结束位置
  var _zoomEnd = new THREE.Vector2();

  // 回调事件
  var changeEvent = { type: 'change' };

  /* 方法 */
  // 窗口尺寸适配
  this.handleResize = function () {
    var box = this.domElement.getBoundingClientRect();
    var d = this.domElement.ownerDocument.documentElement;
    this.screen.left = box.left + window.pageXOffset - d.clientLeft;
    this.screen.top = box.top + window.pageYOffset - d.clientTop;
    this.screen.width = box.width;
    this.screen.height = box.height;
  };

  // 旋转镜头
  this.rotateCamera = function () {
    var moveDirection = new THREE.Vector3();
    moveDirection.set(_this.rotateX, _this.rotateY, 0);
    var angle = moveDirection.length();
    _eye.copy(_this.camera.position).sub(_this.target);
    var eyeDirection = new THREE.Vector3();
    eyeDirection.copy(_eye).normalize();
    var objectUpDirection = new THREE.Vector3();
    objectUpDirection.copy(_this.camera.up).normalize();
    var objectSidewaysDirection = new THREE.Vector3();
    objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();
    objectUpDirection.setLength(_this.rotateY);
    objectSidewaysDirection.setLength(_this.rotateX);
    moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));
    var axis = new THREE.Vector3();
    axis.crossVectors(moveDirection, _eye).normalize();
    angle *= _this.rotateSpeed;
    var quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);
    _eye.applyQuaternion(quaternion);
    _this.camera.up.applyQuaternion(quaternion);
  };

  // 缩放镜头
  this.zoomCamera = function () {
    var factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;
    if (factor !== 1.0 && factor > 0.0) {
      _eye.multiplyScalar(factor);
    }
    _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
  };

  // 缩放镜头
  this.autoZoomCamera = function () {
    if (this.zoomFactor !== 1.0 && this.zoomFactor > 0.0) {
      _eye.multiplyScalar(this.zoomFactor);
    }
  };

  // 确认镜头距离
  this.checkDistances = function () {
    if (_this.enableZoom) {
      if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
        _this.camera.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
        _zoomStart.copy(_zoomEnd);
      }

      if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
        _this.camera.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
        _zoomStart.copy(_zoomEnd);
      }
    }
  };

  // 刷新
  this.update = function () {
    _eye.subVectors(_this.camera.position, _this.target);
    if (_this.enableRotate) {
      _this.rotateCamera();
    }
    if (_this.enableZoom) {
      _this.zoomCamera();
    }
    _this.autoZoomCamera();
    _this.camera.position.addVectors(_this.target, _eye);
    _this.checkDistances();
    _this.camera.lookAt(_this.target);
    if (lastPosition.distanceToSquared(_this.camera.position) > EPS) {
      _this.dispatchEvent(changeEvent);
      lastPosition.copy(_this.camera.position);
    }
  };

  /**
   * 鼠标滚轮事件监听
   * @param {*} event 鼠标滚轮事件
   */
  function mousewheel(event) {
    if (!_this.enabled || !_this.enableZoom) return;
    event.preventDefault();
    event.stopPropagation();
    _zoomStart.y -= event.deltaY * 0.01;
  }

  /**
   * 右键菜单事件监听
   * @param {*} event 右键菜单事件
   */
  function contextmenu(event) {
    if (!_this.enabled) return;
    event.preventDefault();
  }

  /**
   * 注销事件监听
   */
  this.dispose = function () {
    this.domElement.removeEventListener('contextmenu', contextmenu, false);
    this.domElement.removeEventListener('wheel', mousewheel, false);
  };

  // 监听事件注册
  this.domElement.addEventListener('contextmenu', contextmenu, false);
  this.domElement.addEventListener('wheel', mousewheel, false);

  // 适配窗口尺寸
  this.handleResize();

  // 启动时刷新
  this.update();
};

THREE.AutoRotateControl.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.AutoRotateControl.prototype.constructor = THREE.AutoRotateControl;
