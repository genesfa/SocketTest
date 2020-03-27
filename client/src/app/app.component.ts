import { Component,  OnInit} from '@angular/core';
import io from 'socket.io-client';
import {Owndice} from './owndice';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn = false;
  private playerName: string;
  public ngOnInit() {
  }

  loggeIn(playerName: string) {
    console.log(playerName);
    this.playerName = playerName;
    Owndice.playerName = playerName;
    this.loggedIn = true;
    const socket = io('http://localhost:3000');
    socket.emit('playerName', playerName);
  }
}
