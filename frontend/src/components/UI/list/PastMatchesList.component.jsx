/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import {
  GamesLi,
  Cell,
  Info,
} from '../../../styled-components/past-matches.styled-components';

export default class LeardboardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      totalBalance: '',
      playedOn: null,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    const {
      playerName, totalBalance, playedOn,
    } = this.props;

    const dateFormatted = await this.parseDate(playedOn);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'may',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const formattedDate = `${months[dateFormatted.getMonth()]
    } ${
      dateFormatted.getDate()
    } ${
      dateFormatted.getFullYear()}`;

    await this.setStateAsync({
      playerName,
      totalBalance,
      playedOn: formattedDate,
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async parseDate(input) {
    this.parts = input.match(/(\d+)/g);
    return new Date(this.parts[0], this.parts[1] - 1, this.parts[2]);
  }

  render() {
    const {
      playerName,
      totalBalance,
      playedOn,
    } = this.state;
    return (
      <>
        <GamesLi>
          <Cell>
            <div className="container p-0">
              <div
                className="row"
                style={{
                  width: '100%',
                  marginLeft: '0px',
                }}
              >
                <div className="col-4 p-0">
                  <Info>
                    {playerName}
                  </Info>
                </div>
                <div className="col-4 p-0">
                  <Info>
                    {totalBalance}
                  </Info>
                </div>
                <div className="col-4 p-0">
                  <Info>
                    {playedOn}
                  </Info>
                </div>
              </div>
            </div>
          </Cell>
        </GamesLi>
      </>
    );
  }
}
