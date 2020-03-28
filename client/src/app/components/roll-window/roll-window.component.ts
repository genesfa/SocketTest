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
  private timer: any;
  playerList: any;
  private counterSubscription: Subscription;
  private interval: NodeJS.Timeout;

  public ngOnInit() {
    this.socket = io('http://localhost:3000');
  }

  public ngAfterViewInit() {
    this.socket.on('diceChanged', data => {
      this.diceValueGlobal.x = data.x;
      this.diceValueGlobal.y = data.y;
    });
    this.getPlayerList();
    this.interval = setInterval(() => {
      this.getPlayerList();
    }, 2000);
    /*  clearInterval(this.interval);*/

  }

  public move(direction: string) {
    this.socket.emit('move', direction);
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

}

function response(res) {
  Owndice.ownDice.x = res[0];
  Owndice.ownDice.y = res[1];
  // returns an array of the values from the dice
  const socket = io('http://localhost:3000');
  socket.emit('diceRolled', res);
}
