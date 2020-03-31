import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import io from 'socket.io-client';
import rollADie from 'roll-a-die';
import {Owndice} from '../../owndice';
import {Subject, Observable, Subscription} from 'rxjs';
import {interval} from 'rxjs';
import {async} from "rxjs/internal/scheduler/async";

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

  public ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.getPlayerList();
  }

  public ngAfterViewInit() {
    this.socket.on('diceChanged', data => {
      console.log('tsts WTF')
      console.log(data);
      this.diceValueGlobal.x = data.x;
      this.diceValueGlobal.y = data.y;
    });
    this.socket.on('lieDiceChanged', data => {
      console.log(':D')
      console.log(data);
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
    rollADie({element, numberOfDice: 2, callback: response, delay: 1000000000});
    this.ownDice.x = Owndice.ownDice.x;
    this.ownDice.y = Owndice.ownDice.y;
  }

  private getPlayerList() {


    this.socket = io('http://localhost:3000');
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
      this.socket = io('http://localhost:3000');
      this.socket.emit('getActivePlayer');
      this.socket.on('getActivePlayerResponse', activPlayerId => {
        console.log('LEL')
        console.log(activPlayerId)
        this.activePlayerId = activPlayerId;
        if (this.activePlayerId === Owndice.playerName.id) {
          this.myturn = true;
        } else {
          this.myturn = false;
        }

      });
    }, 1000);

  }

  send(rollValue) {
    this.socket.emit('lieDiceValue', rollValue);
  }
}

function response(res) {
  Owndice.ownDice.x = res[0];
  Owndice.ownDice.y = res[1];
  // returns an array of the values from the dice
  const socket = io('http://localhost:3000');
  socket.emit('diceRolled', res);
}
