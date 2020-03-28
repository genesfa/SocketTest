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
  public ngOnInit() {
  }

  loggeIn(playerName: string) {
    this.loggedIn = true;
    const socket = io('http://localhost:3000');
    socket.emit('getPlayerList');
    socket.on('getPlayerListResponse', data => {
      socket.emit('setPlayerName', {name: playerName, id: data.length});
      Owndice.playerName = {name: playerName, id: data.length};
    });
  }

  reset() {
    const socket = io('http://localhost:3000');
    socket.emit('reset');
  }
}
