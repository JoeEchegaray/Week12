class Teams {
  constructor (name, color) {
    this.name = name
    this.players = []
  }

  addPlayer (name, number) {
    this.Players.push(new Player(name, number))
  }
}

class Player {
  constructor (name, number) {
    this.id = ''
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
      url: this.url + `/${Team.id}`,
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
      .then(teams => this.render(teams))
  }

  static deleteTeam (id) {
    TeamService.deleteTeam(id)
      .then(() => {
        return TeamService.getAllTeams()
      })
      .then(teams => this.render(teams))
  }

  static addPlayer (id) {
    let counter = 0
    for (let team of this.teams) {
      if (team.id == id) {
        team.Players.push(
          new Player(
            $(`#${team.id}-player-name`).val(),
            $(`#${team.id}-player-number`).val(),
            counter
          )
        )
        TeamService.updateTeams(team)
          .then(() => {
            return TeamService.getAllTeams()
          })
          .then(teams => this.render(teams))
      }
    }
    counter++
  }

  static deletePlayer (teamsId, playerId) {
    for (let team of this.teams) {
      if (team.id == teamsId) {
        for (let player of team.Players) {
          if (player.id == playerId) {
            team.Players.splice(team.Players.indexOf(player), 1)
            TeamService.updateTeams(team)
              .then(() => {
                return TeamService.getAllTeams()
              })
              .then(teams => this.render(teams))
          }
        }
      }
    }
  }

  static render (teams) {
    this.teams = teams
    $('#app').empty()
    for (let team of teams) {
      console.log(team)
      $('#app').prepend(
        `<div id="${team.id}" class="card">
                    <div class ="card-header">
                        <h3>${team.name}</h3> <span class="badge rounded-pill text-bg-primary"></span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class ="row">
                                <div class ="col-sm">
                                    <input type="text" id="${team.id}-player-name" class="form-control" placeholder="Player Name">
                                </div>
                                <div class ="col-sm">
                                    <input type="text" id="${team.id}-player-number" class="form-control" placeholder="Player Number">
                                </div>
                            </div>
                            <button id="${team.id}-new-player" class="btn btn-success my-3" onclick="DOMManager.addPlayer('${team.id}')">Add Player</button>
                        </div>
                    </div>
                </div><br>`
      )
      for (let player of team.Players) {
        $(`#${team.id}`)
          .find('.card-body')
          .append(
            `<p class="text-white text-center align-middle">
                        <span id="name-${player.id}"><strong> Player Name: </strong> ${player.name} </span>
                        <span class="ms-3" id="number-${player.id}"><strong> Player Number: </strong> ${player.number}</span>
                        <button class="btn btn-danger mt-2 ms-5" onclick="DOMManager.deletePlayer('${team.id}', '${player.id}')">Delete Player</button>`
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
