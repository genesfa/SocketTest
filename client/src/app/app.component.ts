import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import io from 'socket.io-client';
import rollADie from 'roll-a-die';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

/*  @ViewChild('game')
  private gameCanvas: ElementRef;

  private context: any;*/
  private socket: any;
  diceValueGlobal = {x: 0, y: 0};

  public ngOnInit() {
    this.socket = io('http://localhost:3000');
  }

  public ngAfterViewInit() {
/*    this.context = this.gameCanvas.nativeElement.getContext('2d');
    this.context = this.gameCanvas.nativeElement.getContext('2d');
    this.socket.on('position', data => {
      console.log('1')
      console.log(data)
      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(data.x, data.y, 20, 20);
    });*/
    this.socket.on('diceChanged', data => {
      console.log('2')
      console.log(data)
      console.log(this.diceValueGlobal)
      this.diceValueGlobal.x = data.x;
      this.diceValueGlobal.y = data.y;
    });
  }

  public move(direction: string) {
    this.socket.emit('move', direction);
  }

  rollDiceWithoutValues() {
    const element = document.getElementById('dice-box1');
    rollADie({element, numberOfDice: 2, callback: response, delay: 1000000000});
  }

}

function response(res) {
  // returns an array of the values from the dice
  const socket = io('http://localhost:3000');
  socket.emit('diceRolled', res);
}
