import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService, PlayerTableHeaders } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent implements OnInit {

  public players$: Observable<Player[]>;
  public selectedPlayer: Player;
  public playerTableHeaders = PlayerTableHeaders;
  public showModal = false;

  constructor(private playerService: PlayerService, private teamService: TeamService) { }

  ngOnInit() {

    this.players$ = this.playerService.getPlayers();
  }

  newPlayer() {
    this.showModal = true;
    this.selectedPlayer = null;
    setTimeout(() => {
      window.location.replace('#open-modal');
    }, 0);

  }

  editPlayer( player: Player) {

    this.selectedPlayer = {...player};
    this.showModal = true;
    setTimeout(() => {
      window.location.replace('#open-modal');
    }, 0);
    // const teams = this.teamService.getTeams();
    // teams.subscribe(x => {
    //   const newPlayers = x[0].players.map(player => {
    //     console.log(player);
    //     if (player.$key === this.selectedPlayer.$key) {
    //         return this.selectedPlayer;
    //     } else {
    //       return player;
    //     }
    //   });
    //   console.log(newPlayers);

    // });

  }

  deletePlayer(player: Player) {
    this.teamService.getTeams()
    .pipe(take(1))
    .subscribe(teams => {
      const modifiedPlayers = teams[0].players ? teams[0].players.filter((p: any) => p.key !== player.$key) : teams[0].players;
      const formattedTeam = {
        ...teams[0],
        players : [...modifiedPlayers]
      };
      this.playerService.deletePlayer(player.$key);
      this.teamService.editTeam(formattedTeam);
    });

  }

  closeDialog() {
    this.showModal = false;
  }


}
