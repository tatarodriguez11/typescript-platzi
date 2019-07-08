import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService, PlayerTableHeaders } from '../services/player.service';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent implements OnInit {

  public players$: Observable<Player[]>;
  public selectedPlayer: Player;
  public playerTableHeaders = PlayerTableHeaders;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {

    this.players$ = this.playerService.getPlayers();
  }



}
