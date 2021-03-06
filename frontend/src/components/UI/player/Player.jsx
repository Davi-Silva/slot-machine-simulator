/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import {
  Background,
  Wrapper,
  Title,
  Warning,
  Input,
  Button,
} from '../../../styled-components/player-modal.styled-components';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: '',
      isValid: true,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePlayerName = this.onChangePlayerName.bind(this);
    this.createNewPlayer = this.createNewPlayer.bind(this);
    this.checkPlayNameAvailability = this.checkPlayNameAvailability.bind(this);
    this.resetPlayerName = this.resetPlayerName.bind(this);
  }

  async onSubmit(e) {
    const { handler, setPlayer } = this.props;
    const { player } = this.state;
    const handlerHideModal = handler;

    e.preventDefault();
    const valid = await this.checkPlayNameAvailability(player);
    if (valid.valid) {
      const playerName = {
        name: player,
      };
      const playerInfo = await this.createNewPlayer(playerName);
      const handleSetPlayerInfo = setPlayer;
      handleSetPlayerInfo(playerInfo);
      handlerHideModal();
    } else {
      this.setStateAsync({
        isValid: false,
      });
    }
  }


  async onChangePlayerName(e) {
    this.setStateAsync({
      player: e.target.value,
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async resetPlayerName() {
    this.setStateAsync({
      player: '',
    });
  }

  async createNewPlayer(player) {
    this.response = await fetch(
      'http://localhost:5000/players/create',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(player),
      },
    );
    const data = await this.response.json();
    return data;
  }

  async checkPlayNameAvailability(playerName) {
    this.response = await fetch(
      `http://localhost:5000/players/validation/name/${playerName}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await this.response.json();
    return data;
  }


  render() {
    const { isValid, player } = this.state;
    let notValidPlayerWarning;
    if (isValid) {
      notValidPlayerWarning = (
        <>
        </>
      );
    } else {
      notValidPlayerWarning = (
        <>
          <Warning
            onClick={this.resetPlayerName}
          >
            This name is taken.
          </Warning>
        </>
      );
    }
    return (
      <>
        <Background>
          <Wrapper>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <Title>Player Name</Title>
                  <form onSubmit={this.onSubmit}>
                    <Input
                      onChange={this.onChangePlayerName}
                      value={player}
                      required
                      autoFocus
                    />
                    {notValidPlayerWarning}
                    <Button>
                    Play
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Wrapper>
        </Background>

      </>
    );
  }
}
