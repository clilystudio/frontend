import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Const } from '../../../../../common/const';
import { PrizeInfo } from '../../../../../common/dto/prizeInfo';
import { ControlInfo } from '../../../../../common/dto/controlInfo';
import { environment } from '../../../../../common/environments/environment';
import { PrizeService } from 'projects/common/service/prize.service';

/**
 * 抽奖控制界面
 */
@Component({
  selector: 'ons-page[lotto]',
  templateUrl: './lotto.component.html',
  styleUrls: ['./lotto.component.css'],
})
export class LottoComponent implements OnInit, OnDestroy {
  // 系统常量
  C = Const;

  // 标题
  title: string;

  // 奖项信息
  prizeInfo: PrizeInfo;

  // 最大可抽选人数
  maxPerson: number;

  // 抽选人数
  prizePerson = 1;

  // Websocket客户端
  stompClient: Client;

  // Websocket发送标识
  sending = false;

  // Websocket连接标识
  connected = false;

  constructor(private prizeService: PrizeService) {
    this.title = '抽奖控制';
  }

  ngOnInit() {
    this.connect();
  }

  ngOnDestroy() {
    this.stompClient.onDisconnect = frame => {
      console.log('# control disconnected:' + frame);
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
      console.log('# control connected:' + frame);
      this.stompClient.subscribe(Const.STATUS_CHANGE, statusInfo => {
        this.recvStatus(JSON.parse(statusInfo.body));
      });
      this.stompClient.subscribe(Const.STATUS_BROADCAST, () => {
        this.initControl();
        document.dispatchEvent(new Event(Const.RELOAD_WINNER, { bubbles: true }));
      });
      this.initControl();
    };
    this.stompClient.activate();
  }

  /**
   * 初始化控制信息
   */
  initControl() {
    this.prizeService.getLottoPrize().subscribe(prizeInfo => {
      this.prizeInfo = prizeInfo;
      if (this.prizeInfo.prizeId) {
        this.maxPerson = this.prizeInfo.prizeNumber - this.prizeInfo.prizeWinner;
        this.prizePerson = 1;
        this.readyLotto();
      }
    });
  }

  /**
   * 准备抽选
   */
  readyLotto() {
    this.prizeInfo.prizeStatus = Const.PrizeStatus.READYING;
    this.sendCommand(Const.LottoControl.READY);
  }

  /**
   * 启动抽选
   */
  startLotto() {
    this.prizeInfo.prizeStatus = Const.PrizeStatus.STARTTING;
    this.sendCommand(Const.LottoControl.START);
  }

  /**
   * 停止抽选
   */
  stopLotto() {
    this.prizeInfo.prizeStatus = Const.PrizeStatus.STOPPING;
    this.sendCommand(Const.LottoControl.STOP);
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
    controlInfo.prizePerson = this.prizePerson;
    controlInfo.command = command;
    console.log('# sendCommand:' + JSON.stringify(controlInfo));
    this.stompClient.publish({ destination: Const.LOTTO_CONTROL, body: JSON.stringify(controlInfo) });
  }

  /**
   * 接收奖项状态
   * @param controlInfo 状态信息
   */
  private recvStatus(controlInfo: ControlInfo) {
    console.log('# recvStatus:' + JSON.stringify(controlInfo));
    this.sending = false;
    if (controlInfo.prizeId === this.prizeInfo.prizeId) {
      if (controlInfo.prizeStatus === Const.PrizeStatus.READIED) {
        // 抽奖端回答准备完成
        this.prizeInfo.prizeStatus = Const.PrizeStatus.READIED;
      } else if (controlInfo.prizeStatus === Const.PrizeStatus.STARTTED) {
        // 抽奖端回答启动完成
        this.prizeInfo.prizeStatus = Const.PrizeStatus.STARTTED;
      } else if (controlInfo.prizeStatus === Const.PrizeStatus.STOPPED) {
        // 抽奖端回答抽选完成
        this.prizeInfo.prizeStatus = Const.PrizeStatus.STOPPED;
        document.dispatchEvent(new Event(Const.RELOAD_WINNER, { bubbles: true }));
      }
    } else {
      // TODO 控制端和抽奖端奖项信息不一致，应该不会出现此情况
      console.error('控制端和抽奖端奖项信息不一致');
    }
  }
}
