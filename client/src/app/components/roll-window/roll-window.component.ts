import {AfterViewInit, Component, OnInit} from '@angular/core';
import io from 'socket.io-client';
import rollADie from 'roll-a-die';
import {Owndice} from '../../owndice';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-roll-window',
  templateUrl: './roll-window.component.html',
  styleUrls: ['./roll-window.component.css']
})
export class RollWindowComponent implements OnInit, AfterViewInit {


  /*  @ViewChild('game')
    private gameCanvas: ElementRef;

    private context: any;*/
  private socket: any;
  diceValueGlobal = {x: 0, y: 0};
  ownDice = {x: 0, y: 0};
  lieDice = {x: 0, y: 0};
  private timer: any;
  playerList: any;
  private counterSubscription: Subscription;
  private interval: any;
  ready = false;
  gameRunning = false;
  activePlayerId = -1;
  myturn = false;
  private isMyTurnInterval;
  firstRoll = true;
  secondRoll = false;
  public globalOwndice = Owndice;

  public ngOnInit() {
    this.socket = io(environment.serverUrl);
    this.getPlayerList();
  }

  public ngAfterViewInit() {
    this.socket.on('diceChanged', data => {

      this.diceValueGlobal.x = data.x;
      this.diceValueGlobal.y = data.y;
    });
    this.socket.on('lieDiceChanged', data => {

      this.lieDice.x = data.x;
      this.lieDice.y = data.y;
    });
    this.interval = setInterval(() => {
      this.getPlayerList();
    }, 2000);
    /*  clearInterval(this.interval);*/
  }


  public rollDiceWithoutValues() {
    const element = document.getElementById('dice-box1');
    rollADie({element, numberOfDice: 2, callback: this.response, delay: 1000000000});
    this.ownDice.x = Owndice.ownDice.x;
    this.ownDice.y = Owndice.ownDice.y;
    if (this.firstRoll) {
      this.firstRoll = false;
    } else {
      this.secondRoll = true;
    }

  }

  private getPlayerList() {
    this.socket.emit('getPlayerList');
    this.socket.on('getPlayerListResponse', data => {
      this.playerList = data;
    });

  }

  playerReady() {
    for (const player of this.playerList) {
      if (player.id === Owndice.playerName.id) {
        this.socket.emit('playerReady', player.id);
        this.getPlayerList();
      }
    }
    const Interval = setInterval(() => {
      this.socket.emit('allReady');
      this.socket.on('allReadyResponse', allReady => {

        if (allReady) {
          this.ready = true;
          clearInterval(Interval);
          this.gameRunning = true;
          clearInterval(this.interval);
          this.isMyTurn();
        }
      });
    }, 1000);

  }

  isMyTurn() {
    this.isMyTurnInterval = setInterval(() => {
      this.socket.emit('getActivePlayer');
      this.socket.on('getActivePlayerResponse', activPlayerId => {
        this.activePlayerId = activPlayerId;
        if (this.activePlayerId === Owndice.playerName.id) {
          this.myturn = true;
        } else {
          this.myturn = false;
          this.firstRoll = true;
          this.secondRoll = false;
        }

      });
    }, 1000);

  }

  send(rollValue) {
    this.ownDice.x = 0;
    this.ownDice.y = 0;
    this.socket.emit('lieDiceValue', rollValue);

  }

  lie() {
    const element = document.getElementById('dice-box1');
    rollADie({
      element,
      numberOfDice: 2,
      callback: this.response,
      delay: 1000000000,
      values: [Number(this.diceValueGlobal.x), Number(this.diceValueGlobal.y)]
    });
  }
  private response = (res) => {
    Owndice.ownDice.x = res[0];
    Owndice.ownDice.y = res[1];
    // returns an array of the values from the dice
    this.socket.emit('diceRolled', res);

  }
}


