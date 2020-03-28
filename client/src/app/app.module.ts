import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {Owndice} from './owndice';
import { RollWindowComponent } from './components/roll-window/roll-window.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    RollWindowComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
  providers: [Owndice],
  bootstrap: [AppComponent]
})
export class AppModule { }
