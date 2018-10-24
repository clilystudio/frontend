import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui/ngx-onsenui';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PrizeInfo} from '../service/prizeInfo';
import { environment } from '../../environments/environment'
import { ControlInfo } from './controlInfo';

const COMMAND_START: number = 1;
const COMMAND_STOP: number = 2;

@Component({
  selector: 'ons-page',
  templateUrl: './lotto.component.html',
  styleUrls: ['./lotto.component.css']
})
export class LottoComponent implements OnInit {
  controlUrl = 'lottocontrol';

  prizeInfo: PrizeInfo;
  title: string;
  maxPerson: number;
  stompClient: Stomp.Client;
  isSending: boolean;

  constructor(private navigator: OnsNavigator, private params: Params) { 
    this.isSending = false;
    this.stompClient = Stomp.over(new SockJS(environment.api + this.controlUrl));
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/status", (message) => {
        if(message.body) {
          console.log(message.body);
          let controlInfo = JSON.parse(message.body);
          this.recvStatus(controlInfo);
        }
      });
    });
    this.prizeInfo = params.data;
    this.maxPerson = this.prizeInfo.prizeNumber - this.prizeInfo.prizeWinner;
    if (this.prizeInfo.prizeStatus == 0) {
      this.title = "正在抽取" + this.prizeInfo.prizeName;
    } else {
      this.title = "准备抽取" + this.prizeInfo.prizeName;
      this.prizeInfo.prizePerson = Math.min(this.prizeInfo.prizePerson, this.maxPerson);
    }    
  }

  ngOnInit() {
  }

  
  startLotto() {
    if (!this.isSending) {
      console.log("###start");    
      this.sendCommand(COMMAND_START);  
    }
  }

  stopLotto() {
    if (!this.isSending) {
      console.log("###stop");
      this.sendCommand(COMMAND_STOP);
    }
  }

  sendCommand(command: number){
    this.isSending = true;
    let controlInfo = new ControlInfo();
    controlInfo.prizeId = this.prizeInfo.prizeId;
    controlInfo.prizePerson = this.prizeInfo.prizePerson;
    controlInfo.prizeStatus = this.prizeInfo.prizeStatus;
    controlInfo.prizeCommand = command;
    this.stompClient.send("/lotto/broadcast" , {}, JSON.stringify(controlInfo));
  }

  recvStatus(controlInfo: ControlInfo) {
    this.isSending = false;
  }
}
