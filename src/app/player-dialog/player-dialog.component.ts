import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Countries, SquadNumber, Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  @Input() player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();
  private team;
  public countries = Object.keys(Countries).map(key => ({ label: key, key: Countries[key] }));
  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map(key => ({
      label: key,
      key: SquadNumber[key]
    }));


    playerForm: FormGroup = this.form.group({
      name: ['', [Validators.minLength(3), Validators.requiredTrue]],
      lastName: ['', [Validators.minLength(3), Validators.requiredTrue]],
      position: [''],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      nationality: [''],
      leftFooted: ['']

    });

  constructor( private form: FormBuilder, private playerService: PlayerService, private teamService: TeamService) {}

  ngOnInit() {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });

    console.log('error1', this.playerForm.errors);
    console.log('error2', this.playerForm.getError);
    console.log('error3', this.playerForm.hasError);

   // console.log(this.playerForm.contains('name'));
    if (this.player) {
        const controls = this.playerForm.controls;
        for (const controlName in controls) {
          this.playerForm.controls[controlName].setValue(this.player[controlName]);
        }
      }
  }

  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key
    };
    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey]
    };
    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue) {



    const playerFormValueWithKey = { ...playerFormValue, $key: this.player.$key };
    const playerFormValueWithFormattedKey = { ...playerFormValue, key: this.player.$key };
    delete playerFormValueWithFormattedKey.$key;
    const moddifiedPlayers = this.team.players
      ? this.team.players.map(player => {
          return player.key === this.player.$key ? playerFormValueWithFormattedKey : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      players: [...(moddifiedPlayers ? moddifiedPlayers : [playerFormValueWithFormattedKey])]
    };
    this.playerService.editPlayer(playerFormValueWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit() {
    console.log('form status', this.playerForm);
    const playerFormValue = { ...this.playerForm.value };
    console.log('jugador completo', playerFormValue);

    // if (playerForm.valid) {
    //   console.log('leftFooted', playerFormValue.leftFooted);
    //   playerFormValue.leftFooted = playerFormValue.leftFooted === '' ? false : playerFormValue.leftFooted;
    // }
    if (this.player) {

      this.editPlayer(playerFormValue);

    } else {

      this.newPlayer(playerFormValue);
    }
    this.onClose();
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
