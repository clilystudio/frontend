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
import { PrizeGroup } from 'projects/common/dto/prizeGroup';

declare var $: any;
declare var THREE: any;
declare var TWEEN: any;

/**
 * 抽奖控制端界面
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  circle = 80;

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
    helix: [],
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

  // 抽奖权值合计值
  lottoRateSum = 0;

  constructor(private empService: EmpService, private prizeService: PrizeService, private sysService: SysService) {}

  ngOnInit() {
    this.connect();
  }

  ngOnDestroy() {
    this.stompClient.onDisconnect = frame => {
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
    this.stompClient.onConnect = frame => {
      this.connected = true;
      this.listEmp();
    };
    this.stompClient.activate();
  }

  /**
   * 显示员工一览
   */
  public listEmp() {
    this.empService.list().subscribe(
      empList => {
        // 乱序排列
        this.empList = empList.sort((a, b) => a.order - b.order);
        // 初始化显示
        this.initElement();
        // 开始动画
        this.animate();
        // 员工数据准备好之后，才开始接收Websocket通知
        this.stompClient.subscribe(Const.STATUS_CONTROL, statusInfo => {
          this.recvStatus(JSON.parse(statusInfo.body));
        });
      },
      error => this.showError(error)
    );
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
      this.stompClient.publish({
        destination: Const.LOTTO_CHANGEL,
        body: JSON.stringify(controlInfo),
      });
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
    this.prizeService.get(controlInfo.prizeId).subscribe(
      prizeInfo => {
        // 显示奖项信息
        this.prizeInfo = prizeInfo;
        $('.prize .desc').html('准备抽取 ' + prizeInfo.prizeName + ' ' + prizeInfo.prizeDesc);
        if (prizeInfo.prizeType === Const.PrizeType.CASH) {
          // 现金奖，使用固定图片
          const photoUrl = Const.RES_BASE_URL + 'cash.png';
          $('.prize .photo').html('<img src="' + photoUrl + '">');
        } else {
          // 实物奖，使用预先准备的对应图片
          const videoUrl = Const.RES_BASE_URL + prizeInfo.prizeId + '.mp4';
          $('.prize .photo').html('<video src="' + videoUrl + '" autoplay muted width="640" height="480">');
        }
        $('.prize').show();
        // 镜头推进到奖项显示
        this.zoomFlag = Const.ZoomFlag.ZOOM_IN;
        this.prizeInfo.prizeStatus = Const.PrizeStatus.READIED;
        // 背景音乐停止播放
        if (this.lottoSound && this.lottoSound.isPlaying) {
          this.lottoSound.stop();
        }
        if (this.winnerSound && this.winnerSound.isPlaying) {
          this.winnerSound.stop();
        }
        this.empList.forEach(e => {
          if (e.prizeFlag === Const.PrizeFlag.WIN) {
            // 设置获奖员工显示
            $('.element.' + e.empId).removeClass('winner');
            $('.element.' + e.empId).addClass('winned');
          } else if (e.prizeFlag === Const.PrizeFlag.GIVEUP) {
            // 设置弃奖员工显示
            $('.element.' + e.empId).removeClass('winner');
            $('.element.' + e.empId).removeClass('winned');
            $('.element.' + e.empId).addClass('giveup');
          }
        });
        // 切换到员工信息转动模式
        this.controls.rotateX = this.waitSpeed;
        this.transform(this.targets.helix, Const.TRANS_DURATION);
        this.sendCommand(Const.LottoControl.READY);
      },
      error => this.showError(error)
    );
  }

  /**
   * 启动抽选
   * @param controlInfo 状态信息
   */
  startLotto(controlInfo: ControlInfo) {
    this.prizeService.get(controlInfo.prizeId).subscribe(
      prizeInfo => {
        this.prizeInfo = prizeInfo;
        $('.prize .desc').html('开始抽取 ' + controlInfo.prizePerson + '项 ' + prizeInfo.prizeName);
        let photoUrl = '';
        if (prizeInfo.prizeType === Const.PrizeType.CASH) {
          // 现金奖，使用固定图片
          photoUrl = Const.RES_BASE_URL + 'cash.png';
        } else {
          // 实物奖，使用预先准备的对于图片
          photoUrl = Const.RES_BASE_URL + prizeInfo.prizeId + '.png';
        }
        $('.prize .photo').html('<img src="' + photoUrl + '">');
        $('.prize').show();
        // 镜头拉回到员工抽奖转动界面
        this.zoomFlag = Const.ZoomFlag.ZOOM_OUT;
        this.controls.rotateX = this.lottoSpeed;
        this.prizeInfo.prizeStatus = Const.PrizeStatus.STARTTED;
        this.sendCommand(Const.LottoControl.START);
        this.lottoSound.play();
      },
      error => this.showError(error)
    );
  }

  /**
   * 停止抽选
   * @param controlInfo 状态信息
   */
  stopLotto(controlInfo: ControlInfo) {
    this.prizeService.get(controlInfo.prizeId).subscribe(
      prizeInfo => {
        this.prizeInfo = prizeInfo;
        this.getPrizeGroup();
        this.setWinner(controlInfo);
      },
      error => this.showError(error)
    );
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
    let person = 0;
    // 循环抽选指定人数中奖
    while (person < prizePerson) {
      this.prizeInfo.prizeGroups = this.prizeInfo.prizeGroups.filter(g => {
        return g.prizeNumber > g.prizeWinner;
      });
      if (this.prizeInfo.prizeGroups.length === 0) {
        // 正常情况不应该出现，只会在中奖员工数超过奖项数才会出现这种情况
        this.showError('中奖员工数超过奖项数');
        return;
      }
      const prizeGroup = this.prizeInfo.prizeGroups[0];
      // 确定中奖权值合计
      this.lottoRateSum = 0;
      let unlimitGroup = false;
      let unlimitWinned = false;
      this.empList.forEach(e => {
        this.lottoRateSum += this.getEmpRate(e, unlimitGroup, unlimitWinned, prizeGroup);
      });
      if (this.lottoRateSum === 0) {
        // 中奖权值合计为0时，表示没有可抽选员工时，放宽奖项指定组限制
        console.warn('#没有可抽选员工时，放宽奖项指定组限制');
        unlimitGroup = true;
        this.empList.forEach(e => {
          this.lottoRateSum += this.getEmpRate(e, unlimitGroup, unlimitWinned, prizeGroup);
        });

        if (this.lottoRateSum === 0) {
          // 还是没有可抽选员工时，放宽奖项重复中奖限制
          console.warn('#还是没有可抽选员工时，放宽奖项重复中奖限制');
          unlimitWinned = true;
          this.empList.forEach(e => {
            this.lottoRateSum += this.getEmpRate(e, unlimitGroup, unlimitWinned, prizeGroup);
          });
          if (this.lottoRateSum === 0) {
            // 彻底放宽奖项限制后，仍然没有可抽选员工，
            // 正常情况不应该出现，只会在没有员工，或者员工全部为弃奖状态或者中奖权值为0时才会出现这种情况
            this.showError('放宽奖项限制后，仍然没有可抽选员工');
            return;
          }
        }
      }
      // 随机计算中奖值
      let winnedRate = Math.round(Math.random() * this.lottoRateSum + 0.5);
      this.empList.some(e => {
        const empRate = this.getEmpRate(e, unlimitGroup, unlimitWinned, prizeGroup);
        if (empRate >= winnedRate) {
          // 中奖值在员工权值内时，该员工中奖
          e.prizeFlag = Const.PrizeFlag.WIN;
          this.lottoInfo.empList.push(e);
          this.prizeInfo.prizeGroups[0].prizeWinner++;
          return true;
        }
        winnedRate -= empRate;
      });
      person++;
    }
    // 全部员工抽选完毕时，提交抽奖信息
    this.sysService.setLotto(this.lottoInfo).subscribe(
      result => {
        if (result.code === Const.ResultCode.SUCCESS) {
          // 抽奖信息提交成功后，场景切换到中奖显示
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
      },
      error => this.showError(error)
    );
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
    this.camera.position.z = this.radius * Const.CamaraConfig.INIT_RATE;
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
    this.empList.forEach((e, idx) => {
      const element = document.createElement('div');
      let className = 'element';
      if (e.prizeFlag === Const.PrizeFlag.WIN) {
        className = className + ' winned';
      } else if (e.prizeFlag === Const.PrizeFlag.WIN) {
        className = className + ' giveup';
      }
      if (e.empSex === Const.SexFlag.MALE) {
        className = className + ' male';
      } else {
        className = className + ' female';
      }
      className = className + ' ' + e.empId;
      element.className = className;

      const nameDiv = document.createElement('div');
      nameDiv.className = 'name';
      nameDiv.innerHTML = e.empName;
      element.appendChild(nameDiv);

      const detailDiv = document.createElement('div');
      detailDiv.className = 'detail';
      detailDiv.innerHTML = e.empId;
      element.appendChild(detailDiv);

      const css3Object = new THREE.CSS3DObject(element);
      css3Object.position.x = Math.random() * Const.CamaraConfig.INIT_WIDTH - Const.CamaraConfig.INIT_HEIGHT;
      css3Object.position.y = Math.random() * Const.CamaraConfig.INIT_WIDTH - Const.CamaraConfig.INIT_HEIGHT;
      css3Object.position.z = Math.random() * Const.CamaraConfig.INIT_WIDTH - Const.CamaraConfig.INIT_HEIGHT;
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
    const theta = (idx * 2 * Math.PI) / this.circle + Math.PI;
    const y = circles * this.circle - idx * 2.5 + 100;
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
      this.controls.zoomFactor = Const.CamaraConfig.ZOOM_IN;
      if (this.camera.position.length() <= this.minDistance) {
        this.controls.zoomFactor = Const.CamaraConfig.ZOOM_NONE;
        this.zoomFlag = Const.ZoomFlag.ZOOM_NONE;
      }
    } else if (this.zoomFlag === Const.ZoomFlag.ZOOM_OUT) {
      this.controls.zoomFactor = Const.CamaraConfig.ZOOM_OUT;
      if (this.camera.position.length() > this.radius * Const.CamaraConfig.INIT_RATE) {
        this.controls.zoomFactor = Const.CamaraConfig.ZOOM_NONE;
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
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(e.rotation)
        .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    });

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(() => this.render())
      .start();
  }

  /**
   * 切换到抽奖显示
   */
  private swithToWinner(lottoInfo: LottoInfo) {
    // 计算中奖名单显示列数
    const len = lottoInfo.empList.length;
    let cols = 5;
    if (len <= 5) {
      // 不到5人时，一行显示
      cols = len;
    } else if (len <= 25) {
      // 5 ～ 25人时，
      if (len % 5 === 0) {
        cols = 5;
      } else if (len % 4 === 0) {
        cols = 4;
      } else if (len % 3 === 0) {
        cols = 3;
      } else {
        cols = Math.round((1.0 * len) / 2.0 + 0.5);
        if (cols > 5) {
          cols = 5;
        }
      }
    }
    const rows = len % cols === 0 ? Math.max(Math.round((1.0 * len) / cols), 1) : Math.max(Math.round((1.0 * len) / cols + 0.5), 1);
    this.targets.winnerPositions = [];
    const len2 = this.empList.length - len;
    const cols2 = Math.max(Math.round(Math.sqrt(1.0 * len2 * Const.HW_RATIO) + 0.5), 1);
    const rows2 = Math.max(Math.round((1.0 * len2) / cols2 + 0.5), 1);
    let idx = 0;
    let idx2 = 0;
    const empIds = lottoInfo.empList.map(e => e.empId);
    this.empList.forEach(e => {
      if (e.prizeFlag === Const.PrizeFlag.WIN && empIds.includes(e.empId)) {
        $('.element.' + e.empId).addClass('winner');
        const object3D = new THREE.Object3D();
        const col = idx % cols;
        const row = (idx - col) / cols;
        object3D.position.x = (col * 2 - cols) * 100 + 100;
        object3D.position.y = (row * 2 - rows) * 70 + 70;
        object3D.position.z = 2000;
        this.targets.winnerPositions.push(object3D);
        idx++;
      } else {
        const object3D = new THREE.Object3D();
        const col = idx2 % cols2;
        const row = (idx2 - col) / cols2;
        object3D.position.x = (col * 2 - cols2) * 90 + 100;
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
   * 取得奖项分组信息
   */
  private getPrizeGroup(): void {
    this.prizeInfo.prizeGroups = [];
    const groups = this.prizeInfo.groupLimit.split(Const.Delimiter.GROUP);
    groups.forEach(g => {
      const items = g.split(Const.Delimiter.ITEM);
      const prizeGroup = new PrizeGroup();
      prizeGroup.groupId = items[0];
      prizeGroup.prizeNumber = parseInt(items[1], 10);
      prizeGroup.prizeWinner = parseInt(items[2], 10);
      this.prizeInfo.prizeGroups.push(prizeGroup);
    });
    this.prizeInfo.prizeGroups = this.prizeInfo.prizeGroups.filter(g => {
      return g.prizeNumber > g.prizeWinner;
    });
    this.prizeInfo.prizeGroups.sort((g1, g2) => {
      return g1.prizeNumber - g2.prizeNumber;
    });
  }

  /**
   * 计算中奖权值
   * @param empInfo 员工信息
   * @param unlimitGroup 限定抽奖组ID开关
   * @param unlimitWinned 限定中奖状态开关
   * @return 计算中奖权值
   */
  private getEmpRate(empInfo: EmpInfo, unlimitGroup: boolean, unlimitWinned: boolean, prizeGroup: PrizeGroup): number {
    let empRate = 0;
    // 员工为非现金抽奖组时不参与抽现金奖（协力员工现金奖会计记账无法处理）
    if (empInfo.groupId === Const.LottoConig.NOCASH_GROUP && this.prizeInfo.prizeType === Const.PrizeType.CASH) {
      return empRate;
    }
    // 循环奖项分组
    if (unlimitGroup || prizeGroup.groupId === Const.LottoConig.UNLIMIT_GROUP || prizeGroup.groupId === empInfo.groupId) {
      // 未限定抽奖组ID 或 未指定抽奖组ID 或 为指定组内成员时，返回中奖权值
      if (empInfo.prizeFlag === Const.PrizeFlag.NONE || (unlimitWinned && empInfo.prizeFlag !== Const.PrizeFlag.GIVEUP)) {
        // 未中奖状态 或 允许重复中奖且未弃奖状态，计算中奖权值
        empRate = empInfo.empRate;
      }
    }
    return empRate;
  }
}
