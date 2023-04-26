class Teams {
  constructor (name, color) {
    this.name = name
    this.color = color
    this.players = []
  }

  addPlayer (name, number) {
    this.Player.push(new Player(name, number))
  }
}

class Player {
  constructor (name, number) {
    this.name = name
    this.number = number
  }
}

class TeamService {
  static url = 'https://644828b07bb84f5a3e53ef2f.mockapi.io/Teams'

  static getAllTeams () {
    return $.get(this.url)
  }

  static getTeams (id) {
    return $.get(this.url + `/${id}`)
  }

  static createTeam (Team) {
    return $.post(this.url, Team)
  }

  static updateTeams (Team) {
    return $.ajax({
      url: this.url + `/${Team._id}`,
      dataType: 'json',
      data: JSON.stringify(Team),
      contentType: 'application/json',
      type: 'PUT'
    })
  }

  static deleteTeam (id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'Delete'
    })
  }
}

class DOMManager {
  static teams

  static getAllTeams () {
    TeamService.getAllTeams().then(teams => this.render(teams))
  }

  static createTeams (name, color) {
    TeamService.createTeam(new Teams(name, color))
      .then(() => {
        return TeamService.getAllTeams()
      })
      .then(Teams => this.render(Teams))
  }

  static deleteTeam (id) {
    TeamService.deleteTeams(id)
      .then(() => {
        return TeamService.getAllTeams()
      })
      .then(teams => this.render(teams))
  }

  static addPlayer (id) {
    for (let teams of this.teams) {
      if (teams._id == id) {
        teams.player.push(
          new Player(
            $(`#${teams._id}-player-name`).val(),
            $(`#${teams._id}-player-number`).val()
          )
        )
        TeamService.updateTeams(teams)
          .then(() => {
            return TeamService.getAllTeams()
          })
          .then(Teams => this.render(teams))
      }
    }
  }

  static deletePlayer (teamsId, playerId) {
    for (let teams of this.teams) {
      if (Teams._id == teamsId) {
        for (let player of teams.players) {
          if (player._id == playerId) {
            teams.players.splice(teams.players.indesOr(player), 1)
            TeamService.updateTeams(teams)
              .then(() => {
                return TeamService.Teams()
              })
              .then(teams => this.render(teams))
          }
        }
      }
    }
  }

  static render (Teams) {
    this.Teams = Teams
    $('#app').empty()
    for (let team of Teams) {
      $('#app').prepend(
        `<div id="${Teams._id}" class="card">
                    <div class ="card-header" style="width: 80vw;">
                        <h3>${Teams.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTeams('${Teams._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class ="row">
                                <div class ="col-sm">
                                    <input type="text" id="${Teams._id}-player-name" class="form-control" placeholder="Player Name">
                                </div>
                                <div class ="col-sm">
                                    <input type="text" id="${Teams._id}-player-number" class="form-control" placeholder="Player Number">
                                </div>
                            </div>
                            <button id="${Teams._id}-new-player" class="btn btn-success mt-3" onclick="DOMManager.addPlayer('${Teams._id}')">Add Player</button>
                        </div>
                    </div>
                </div><br>`
      )
      for (let player of Teams.players) {
        $(`#${Teams._id}`)
          .find('.card-body')
          .append(
            `<p>
                        <span id="name-${player._id}"><strong>Player Name: </strong> ${player.name}</span>
                        <span id="number-${player._id}"><strong>Player Number: </strong> ${player.number}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${Teams._id}', '${player._id}')">Delete Player</button>`
          )
      }
    }
  }
}

$('#createTeamBtn').click(() => {
  DOMManager.createTeams($('#teamName').val(), $('#teamColor').val())
  $('teamName').val('')
  $('#teamColor').val('#00B344')
})

DOMManager.getAllTeams()
