import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Const } from '../../../common/const';
import { EmpInfo } from 'projects/common/dto/empInfo';
import { EmpService } from 'projects/common/service/emp.service';
import { environment } from 'projects/common/environments/environment';
import { ControlInfo } from 'projects/common/dto/controlInfo';
import { PrizeInfo } from 'projects/common/dto/prizeInfo';
import { PrizeService } from 'projects/common/service/prize.service';
import { SysService } from 'projects/common/service/sys.service';
import { LottoInfo } from 'projects/common/dto/lottoInfo';

declare var $: any;
declare var THREE: any;
declare var TWEEN: any;

/**
 * 抽奖控制端界面
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // 系统常量
  C = Const;

  // Websocket客户端
  stompClient: Client;

  // Websocket发送标识
  sending = false;

  // Websocket连接标识
  connected = false;

  // 奖项信息
  prizeInfo: PrizeInfo;

  // 员工一览列表
  empList: EmpInfo[];

  // 控制信息
  controlInfo: ControlInfo;

  // 中奖信息
  lottoInfo: LottoInfo;

  // 镜头半径
  radius = 3000;

  // 最小缩放距离
  minDistance = 1000;

  // 环状显示数量
  circle = 40;

  // 等待抽奖时镜头旋转速度
  waitSpeed = -0.001;

  // 抽奖开始后镜头旋转速度
  lottoSpeed = -0.02;

  // 显示中奖时镜头旋转速度
  winnerSpeed = 0.0;

  // 员工信息3D对象
  emp3DObjects = [];

  // 奖项显示3D对象
  prize3DObject: any;

  // 位置信息
  targets = {
    // 显示中奖时的位置信息
    winnerPositions: [],
    // 显示抽奖时的位置信息，环状
    helix: []
  };

  // 镜头
  camera: any;

  // 场景
  scene: any;

  // 渲染
  renderer: any;

  // 旋转控制
  controls: any;

  // 抽奖音乐播放器
  lottoSound: any;

  // 中奖音乐播放器
  winnerSound: any;

  // 缩放控制标识
  zoomFlag = Const.ZoomFlag.ZOOM_NONE;

  constructor(private empService: EmpService, private prizeService: PrizeService,
    private sysService: SysService) { }

  ngOnInit() {
    this.connect();
  }

  ngOnDestroy() {
    this.stompClient.onDisconnect = (frame) => {
      console.log(frame);
      this.connected = false;
    };
    this.stompClient.deactivate();
  }

  /**
   * Websocket建立连接
   */
  private connect() {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => {
      return new SockJS(environment.endPoint);
    };
    this.stompClient.onConnect = (frame) => {
      console.log(frame);
      this.connected = true;
      this.listEmp();
    };
    this.stompClient.activate();
  }

  /**
   * 显示员工一览
   */
  public listEmp() {
    this.empService.list().subscribe(empList => {
      this.empList = empList.sort((a, b) => a.order - b.order);
      this.initElement();
      this.animate();
      // 员工数据准备好之后，才开始接收Websocket通知
      this.stompClient.subscribe(Const.STATUS_CONTROL, (statusInfo) => {
        this.recvStatus(JSON.parse(statusInfo.body));
      });
    }, error => this.showError(error));
  }

  /**
   * Websocket发送消息
   * @param command 抽选控制命令
   */
  private sendCommand(command: string) {
    this.sending = true;
    const controlInfo = new ControlInfo();
    controlInfo.prizeId = this.prizeInfo.prizeId;
    controlInfo.prizeStatus = this.prizeInfo.prizeStatus;
    controlInfo.command = command;
    console.log('#sendCommand:' + JSON.stringify(controlInfo));
    // 延时发送
    setTimeout(() => {
      this.stompClient.publish({ destination: Const.LOTTO_CHANGEL, body: JSON.stringify(controlInfo) });
    }, Const.SEND_DELAY);
  }

  /**
   * 接收奖项状态
   * @param controlInfo 状态信息
   */
  private recvStatus(controlInfo: ControlInfo) {
    console.log('#recvStatus:' + JSON.stringify(controlInfo));
    this.controlInfo = controlInfo;
    if (controlInfo.prizeStatus === Const.PrizeStatus.READYING) {
      // 进入抽奖就绪状态
      this.readyLotto(controlInfo);
    } else if (controlInfo.prizeStatus === Const.PrizeStatus.STARTTING) {
      // 进入抽奖状态
      this.startLotto(controlInfo);
    } else if (controlInfo.prizeStatus === Const.PrizeStatus.STOPPING) {
      // 停止抽奖，确定中奖名单
      this.stopLotto(controlInfo);
    } else if (controlInfo.prizeStatus === Const.PrizeStatus.STARTTED) {
      // 进入抽奖状态
      this.startLotto(controlInfo);
    }
    this.sending = false;
  }

  /**
   * 准备抽选
   * @param controlInfo 状态信息
   */
  private readyLotto(controlInfo: ControlInfo) {
    this.prizeService.get(controlInfo.prizeId).subscribe(prizeInfo => {
      this.prizeInfo = prizeInfo;
      $('.prize .desc').html('准备抽取 ' + prizeInfo.prizeName + ' ' + prizeInfo.prizeDesc);
      let photoUrl = '';
      if (prizeInfo.prizeId.startsWith('CS')) {
        // 现金奖，使用固定图片
        photoUrl = Const.RES_BASE_URL + 'cash.png';
      } else {
        // 实物奖，使用预先准备的对应图片
        photoUrl = Const.RES_BASE_URL + prizeInfo.prizeId + '.png';
      }
      $('.prize .photo').html('<img src="' + photoUrl + '">');
      $('.prize').show();
      this.zoomFlag = Const.ZoomFlag.ZOOM_IN;
      this.prizeInfo.prizeStatus = Const.PrizeStatus.READIED;
      if (this.lottoSound && this.lottoSound.isPlaying) {
        this.lottoSound.stop();
      }
      if (this.winnerSound && this.winnerSound.isPlaying) {
        this.winnerSound.stop();
      }
      this.empList.forEach((e) => {
        if (e.prizeFlag === Const.PrizeFlag.WIN) {
          $('.element.' + e.empId).removeClass('winner');
          $('.element.' + e.empId).addClass('winned');
        } else if (e.prizeFlag === Const.PrizeFlag.WIN) {
          $('.element.' + e.empId).removeClass('winner');
          $('.element.' + e.empId).removeClass('winned');
          $('.element.' + e.empId).addClass('giveup');
        }
      });
      console.log('#readyLotto');
      this.controls.rotateX = this.waitSpeed;
      this.transform(this.targets.helix, Const.TRANS_DURATION);
      this.sendCommand(Const.LottoControl.READY);
    }, error => this.showError(error));
  }

  /**
   * 启动抽选
   * @param controlInfo 状态信息
   */
  startLotto(controlInfo: ControlInfo) {
    this.prizeService.get(controlInfo.prizeId).subscribe(prizeInfo => {
      this.prizeInfo = prizeInfo;
      $('.prize .desc').html('开始抽取 ' + controlInfo.prizePerson + '项 ' + prizeInfo.prizeName);
      let photoUrl = '';
      if (prizeInfo.prizeId.startsWith('CS')) {
        // 现金奖，使用固定图片
        photoUrl = Const.RES_BASE_URL + 'cash.png';
      } else {
        // 实物奖，使用预先准备的对于图片
        photoUrl = Const.RES_BASE_URL + prizeInfo.prizeId + '.png';
      }
      $('.prize .photo').html('<img src="' + photoUrl + '">');
      $('.prize').show();
      this.zoomFlag = Const.ZoomFlag.ZOOM_OUT;
      this.controls.rotateX = this.lottoSpeed;
      this.prizeInfo.prizeStatus = Const.PrizeStatus.STARTTED;
      this.sendCommand(Const.LottoControl.START);
      this.lottoSound.play();
    }, error => this.showError(error));
  }

  /**
   * 停止抽选
   * @param controlInfo 状态信息
   */
  stopLotto(controlInfo: ControlInfo) {
    this.prizeService.get(controlInfo.prizeId).subscribe(prizeInfo => {
      this.prizeInfo = prizeInfo;
      this.setWinner(controlInfo);
    }, error => this.showError(error));
  }

  /**
   * 设置中奖者
   * @param controlInfo 状态信息
   */
  private setWinner(controlInfo: ControlInfo) {
    const prizePerson = controlInfo.prizePerson;
    this.lottoInfo = new LottoInfo();
    this.lottoInfo.prizeId = controlInfo.prizeId;
    this.lottoInfo.empList = [];
    let idx = 0;
    let sum = 0;
    this.empList.forEach(e => {
      const empRate = this.getEmpRate(e);
      sum = sum + empRate;
    });
    while (idx < prizePerson) {
      let rand = Math.round(Math.random() * sum + 0.5);
      let selected = false;
      this.empList.forEach(e => {
        if (!selected) {
          const empRate = this.getEmpRate(e);
          if (empRate >= rand) {
            sum -= empRate;
            e.prizeFlag = Const.PrizeFlag.WIN;
            this.lottoInfo.empList.push(e);
            selected = true;
          }
          rand -= empRate;
        }
      });
      idx++;
    }
    this.sysService.setLotto(this.lottoInfo).subscribe(result => {
      if (result.code === Const.ResultCode.SUCCESS) {
        this.swithToWinner(this.lottoInfo);
        this.prizeInfo.prizeStatus = Const.PrizeStatus.STOPPED;
        this.sendCommand(Const.LottoControl.STOP);
        this.zoomFlag = Const.ZoomFlag.ZOOM_NONE;
        this.camera.position.z = this.radius;
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        if (this.lottoSound && this.lottoSound.isPlaying) {
          this.lottoSound.stop();
        }
        if (this.winnerSound && !this.lottoSound.isPlaying) {
          this.winnerSound.play();
        }
      }
    }, error => this.showError(error));
  }

  /**
   * 显示调用API错误消息
   * @param error 错误
   */
  private showError(error: any) {
    console.error('异常：' + JSON.stringify(error));
  }

  /**
   * 初始化员工3D动画场景
   */
  private initElement() {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = this.radius * 1.8;
    this.scene = new THREE.Scene();
    this.targets.winnerPositions = [];
    this.targets.helix = [];

    this.setSound();

    // 奖项显示
    const prizeDiv = document.createElement('div');
    prizeDiv.className = 'prize';
    const prizeDescDiv = document.createElement('div');
    prizeDescDiv.className = 'desc';
    prizeDescDiv.innerHTML = 'TEST';
    prizeDiv.appendChild(prizeDescDiv);
    const prizePhotDiv = document.createElement('div');
    prizePhotDiv.className = 'photo';
    prizeDiv.appendChild(prizePhotDiv);

    this.prize3DObject = new THREE.CSS3DObject(prizeDiv);
    this.prize3DObject.position.x = 0;
    this.prize3DObject.position.y = 0;
    this.prize3DObject.position.z = 0;
    this.scene.add(this.prize3DObject);

    // 员工显示
    const len = this.empList.length;
    const circles = Math.max(Math.round(len / this.circle), 1);
    const cubeRoot = Math.max(Math.cbrt(len), 1);
    this.empList.forEach((e, idx) => {
      const element = document.createElement('div');
      element.className = 'element ' + e.empId;
      if (e.prizeFlag === Const.PrizeFlag.WIN) {
        element.className = 'element winned ' + e.empId;
      } else if (e.prizeFlag === Const.PrizeFlag.WIN) {
        element.className = 'element giveup' + e.empId;
      }

      const nameDiv = document.createElement('div');
      nameDiv.className = 'name';
      nameDiv.innerHTML = e.empName;
      element.appendChild(nameDiv);

      const detailDiv = document.createElement('div');
      detailDiv.className = 'detail';
      detailDiv.innerHTML = e.deptName + '<br>' + e.empId;
      element.appendChild(detailDiv);

      const css3Object = new THREE.CSS3DObject(element);
      css3Object.position.x = Math.random() * 4000 - 2000;
      css3Object.position.y = Math.random() * 4000 - 2000;
      css3Object.position.z = Math.random() * 4000 - 2000;
      this.scene.add(css3Object);

      this.emp3DObjects.push(css3Object);
      this.setHelixPosition(idx, circles);
    });

    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(this.renderer.domElement);

    // 自动旋转控制
    this.controls = new THREE.AutoRotateControl(this.camera, this.renderer.domElement);
    this.controls.rotateX = this.waitSpeed;
    this.controls.addEventListener('change', () => this.render());

    this.transform(this.targets.helix, Const.TRANS_DURATION);
    window.addEventListener('resize', this.onWindowResize, false);
  }

  /**
   * 设置抽奖员工显示位置，环状
   * @param idx 索引
   * @param circles 圈数
   */
  private setHelixPosition(idx: number, circles: number) {
    const vector = new THREE.Vector3();
    const theta = idx * Math.PI / this.circle + Math.PI;
    const y = circles * this.circle - (idx * 2.0) - 10;
    const object3D = new THREE.Object3D();
    object3D.position.setFromCylindricalCoords(this.radius, theta, y);
    vector.x = object3D.position.x * 2;
    vector.y = object3D.position.y;
    vector.z = object3D.position.z * 2;
    object3D.lookAt(vector);
    this.targets.helix.push(object3D);
  }

  // 开始动画
  private animate() {
    requestAnimationFrame(() => this.animate());
    TWEEN.update();
    this.controls.update();
  }

  /**
   * 渲染动画
   */
  private render() {
    // 固定奖项显示，不旋转
    this.prize3DObject.rotation.copy(this.camera.rotation);
    this.prize3DObject.updateMatrix();
    // 自动缩放控制
    if (this.zoomFlag === Const.ZoomFlag.ZOOM_IN) {
      this.controls.zoomFactor = 0.97;
      if (this.camera.position.length() <= this.minDistance) {
        this.controls.zoomFactor = 1.0;
        this.zoomFlag = Const.ZoomFlag.ZOOM_NONE;
      }
    } else if (this.zoomFlag === Const.ZoomFlag.ZOOM_OUT) {
      this.controls.zoomFactor = 1.10;
      if (this.camera.position.length() > this.radius * 1.8) {
        this.controls.zoomFactor = 1.0;
        this.zoomFlag = Const.ZoomFlag.ZOOM_NONE;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 监听窗口尺寸变化事件
   */
  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  /**
   * 变换员工3D对象位置
   * @param targets 变换目标位置
   * @param duration 变换用时长
   */
  private transform(targets: any, duration: any) {
    TWEEN.removeAll();

    this.emp3DObjects.forEach((e, idx) => {
      const target = targets[idx];

      new TWEEN.Tween(e.position)
        .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut).start();

      new TWEEN.Tween(e.rotation)
        .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut).start();
    });

    new TWEEN.Tween(this).to({}, duration * 2).onUpdate(() => this.render()).start();
  }

  /**
   * 切换到抽奖显示
   */
  private swithToWinner(lottoInfo: LottoInfo) {
    const len = lottoInfo.empList.length;
    let cols = 5;
    if (len <= 5) {
      cols = len;
    } else {
      if (len % 5 === 0) {
        cols = 5;
      } else if (len % 4 === 0) {
        cols = 4;
      } else if (len % 3 === 0) {
        cols = 3;
      } else {
        cols = Math.round(len / 2.0 + 0.5);
      }
    }
    const rows = Math.max(Math.round(len / cols), 1);
    this.targets.winnerPositions = [];
    const len2 = this.empList.length - len;
    const cols2 = Math.max(Math.round(Math.sqrt(len2 * Const.HW_RATIO) + 0.5), 1);
    const rows2 = Math.max(Math.round(len2 / cols2), 1);
    let idx = 0;
    let idx2 = 0;
    const empIds = lottoInfo.empList.map(e => e.empId);
    this.empList.forEach((e) => {
      if (e.prizeFlag === Const.PrizeFlag.WIN && empIds.includes(e.empId)) {
        $('.element.' + e.empId).addClass('winner');
        const object3D = new THREE.Object3D();
        const col = idx % cols;
        const row = (idx - col) / cols;
        object3D.position.x = (col * 2 - cols) * 100 + 100;
        object3D.position.y = (row * 2 - rows) * 70 + 80;
        object3D.position.z = 2000;
        this.targets.winnerPositions.push(object3D);
        idx++;
      } else {
        const object3D = new THREE.Object3D();
        const col = idx2 % cols2;
        const row = (idx2 - col) / cols2;
        object3D.position.x = (col * 2 - cols2) * 90;
        object3D.position.y = (row * 2 - rows2) * 60 + 80;
        object3D.position.z = -10000;
        this.targets.winnerPositions.push(object3D);
        idx2++;
      }
    });

    $('.prize').hide();
    this.controls.rotateX = this.winnerSpeed;
    this.transform(this.targets.winnerPositions, Const.TRANS_DURATION);
  }

  /**
   * 设置背景音乐播放
   */
  private setSound() {
    const listener = new THREE.AudioListener();
    this.camera.add(listener);
    this.lottoSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(Const.RES_BASE_URL + 'lotto.mp3', (buffer: any) => {
      this.lottoSound.setBuffer(buffer);
      this.lottoSound.setLoop(true);
      this.lottoSound.setVolume(0.5);
    });
    this.winnerSound = new THREE.Audio(listener);
    const audioLoader2 = new THREE.AudioLoader();
    audioLoader2.load(Const.RES_BASE_URL + 'winner.mp3', (buffer: any) => {
      this.winnerSound.setBuffer(buffer);
      this.winnerSound.setLoop(false);
      this.winnerSound.setVolume(0.5);
    });
  }

  /**
   * 计算中奖权值
   * @param empInfo 员工信息
   * @return 中奖权值
   */
  private getEmpRate(empInfo: EmpInfo): number {
    const workYear = parseInt(empInfo.empId.substr(2, 2), 10);
    if (empInfo.prizeFlag === Const.PrizeFlag.NONE) {
      // 未中奖状态，计算中奖权值
      return empInfo.empRate;
    } else {
      // 已中奖或已弃奖，不再参与抽奖
      return 0;
    }
  }
}
