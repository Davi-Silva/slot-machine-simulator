/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-string-refs */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

import BAR from '../../../static/img/BAR.png';
import BAR2 from '../../../static/img/2xBAR.png';
import BAR3 from '../../../static/img/3xBAR.png';
import Seven from '../../../static/img/7.png';
import Cherry from '../../../static/img/Cherry.png';

import PayTable from '../paytable/PayTable';

import {
  SlotMachine,
  MachineBody,
  MachineFeet,
  SlotBlock,
  SlotFrame,
  SlotGlazeBottom,
  SlotDisplay,
  SlotOverlay,
  SlotOverlayLine,
  SlotCredits,
  Credits,
  SlotZeros,
  SlotWheels,
  WinningLine,
  Wheel,
  WheelOverlay,
  WheelImage,
  SlotTrigger,
  Arm,
  Knob,
  BlueKnob,
  ArmShadow,
  Ring1,
  RingShadow1,
  Ring2,
  RingShadow2,
  CheckboxContainer,
  HiddenCheckbox,
  StyledCheckbox,
  DebugTitle,
  Icon,
  BalanceTitle,
  Balance,
  ShowPaytable,
} from '../../../styled-components/machine.styled-components';

export default class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      round: null,
      startGame: false,
      debugMode: false,
      zeros: '0000000000',
      slots: [
        ['bar3', 'bar', 'bar2', 'seven', 'cherry'],
        ['bar3', 'bar', 'bar2', 'seven', 'cherry'],
        ['bar3', 'bar', 'bar2', 'seven', 'cherry'],
      ],
      spinning: 3,
      spin: [0, 0, 0],
      credits: 15,
      balance: 0,
      showPayTable: false,
      winningLine: [],
      triggerDisabled: false,
      spinningWheel1Styled: {
        img: {
          transform: 'translateY(-50px)',
        },
      },
      spinningWheel2Styled: {
        img: {
          transform: 'translateY(-28px)',
        },
      },
      spinningWheel3Styled: {
        img: {
          transform: 'translateY(-28px)',
        },
      },
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.startSlot = this.startSlot.bind(this);
    this.endSlot = this.endSlot.bind(this);
    this.addCredit = this.addCredit.bind(this);
    this.spin = this.spin.bind(this);
    this.blink = this.blink.bind(this);
    this.blur = this.blur.bind(this);
    this.unblur = this.unblur.bind(this);
    this.slotTriggerDown = this.slotTriggerDown.bind(this);
    this.slotTriggerUp = this.slotTriggerUp.bind(this);
    this.onCreditsChange = this.onCreditsChange.bind(this);
    this.onSetDebugMode = this.onSetDebugMode.bind(this);
    this.submitRound = this.submitRound.bind(this);
    this.getRoundsByPlayer = this.getRoundsByPlayer.bind(this);
    this.submitFullGameResult = this.submitFullGameResult.bind(this);
    this.endGame = this.endGame.bind(this);
    this.onShowPaytable = this.onShowPaytable.bind(this);
  }


  async componentDidMount() {
    this.startSlot();
  }

  onSetDebugMode(e) {
    this.setState({
      debugMode: e.target.checked,
    });
  }

  onCreditsChange(e) {
    if (e.target.value <= 5000) {
      if (e.target.value.toString().length === 0) {
        this.setState({
          zeros: '000000000000',
        });
      } else if (e.target.value.toString().length === 1) {
        this.setState({
          zeros: '00000000000',
        });
      } else if (e.target.value.toString().length === 2) {
        this.setState({
          zeros: '0000000000',
        });
      } else if (e.target.value.toString().length === 3) {
        this.setState({
          zeros: '000000000',
        });
      } else if (e.target.value.toString().length === 4) {
        this.setState({
          zeros: '00000000',
        });
      }
      this.setState({
        credits: e.target.value,
      });
    }
  }

  onShowPaytable() {
    const {
      showPayTable,
    } = this.state;
    if (showPayTable) {
      this.setState({
        showPayTable: false,
      });
    } else {
      this.setState({
        showPayTable: true,
      });
    }
  }

  async getRoundsByPlayer(player) {
    const response = await fetch(
      `http://localhost:5000/rounds/all/player/${player}`,
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
    const data = await response.json();
    return data;
  }

  async endGame(game) {
    const response = await fetch(
      'http://localhost:5000/games/play',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(game),
      },
    );
    const data = await response.json();
    return data;
  }

  startSlot() {
    this.setState({
      spinning: false,
    });
    const {
      slotTrigger,
    } = this.refs;
    slotTrigger.classList.remove('slotTriggerDisabled');
    return false;
  }

  endSlot() {
    const { spinning } = this.state;
    this.setState({

    });
  }

  async spin() {
    const {
      wheel1,
      wheel2,
      wheel3,
      slotTrigger,
      creditInput,
      slotZeros,
    } = this.refs;
    const {
      spin,
      spinning,
      credits,
      triggerDisabled,
    } = this.state;

    if (!triggerDisabled) {
      const wheelChild1 = wheel1.childNodes;
      const wheelChild2 = wheel2.childNodes;
      const wheelChild3 = wheel3.childNodes;
      const wheel1Imgs = [
        wheelChild1[1],
        wheelChild1[2],
        wheelChild1[3],
        wheelChild1[4],
        wheelChild1[5],
      ];
      const wheel2Imgs = [
        wheelChild2[1],
        wheelChild2[2],
        wheelChild2[3],
        wheelChild2[4],
        wheelChild2[5],
      ];
      const wheel3Imgs = [
        wheelChild3[1],
        wheelChild3[2],
        wheelChild3[3],
        wheelChild3[4],
        wheelChild3[5],
      ];

      let tempCredits = credits;
      // this.blink(slotCredit);
      wheel1Imgs.forEach((img) => {
        img.classList.remove('spinWheels');
      });

      wheel2Imgs.forEach((img) => {
        img.classList.remove('spinWheels');
      });

      wheel2Imgs.forEach((img) => {
        img.classList.remove('spinWheels');
      });


      setTimeout(() => {
        this.blur(wheel1);
        wheel1Imgs.forEach((img) => {
          img.classList.add('spinWheels');
        });
      }, 200);

      setTimeout(() => {
        this.blur(wheel2);
        wheel2Imgs.forEach((img) => {
          img.classList.add('spinWheels');
        });
      }, 700);

      setTimeout(() => {
        this.blur(wheel3);
        wheel3Imgs.forEach((img) => {
          img.classList.add('spinWheels');
        });
      }, 1200);

      if (spinning === false) {
        this.blink(creditInput);
        this.blink(slotZeros);
        this.setState({
          spinning: 3,
          credits: credits - 1,
        });
        tempCredits -= 1;
        if (tempCredits.toString().length === 1) {
          this.setState({
            zeros: '00000000000',
          });
        }
        if (tempCredits.toString().length === 2) {
          this.setState({
            zeros: '0000000000',
          });
        }
        if (tempCredits.toString().length === 3) {
          this.setState({
            zeros: '000000000',
          });
        }
        if (tempCredits.toString().length === 4) {
          this.setState({
            zeros: '00000000',
          });
        }
        spin[0] = parseInt(Math.random() * 5, 10);
        spin[1] = parseInt(Math.random() * 5, 10);
        spin[2] = parseInt(Math.random() * 5, 10);
        this.setState({
          triggerDisabled: true,
        });
        slotTrigger.classList.add('slotTriggerDisabled');
        setTimeout(() => {
          this.stopSpin(1);
          wheel1Imgs.forEach((img) => {
            img.classList.remove('spinWheels');
          });
        }, 2000);

        setTimeout(() => {
          this.stopSpin(2);
          wheel2Imgs.forEach((img) => {
            img.classList.remove('spinWheels');
          });
        }, 2500);

        setTimeout(() => {
          this.stopSpin(3);
          wheel3Imgs.forEach((img) => {
            img.classList.remove('spinWheels');
          });
        }, 3000);

        setTimeout(() => {
          this.stopSpin(4);
        }, 3500);
      }
    }
    return false;
  }

  stopSpin(wheelNumber) {
    const {
      wheel1,
      wheel2,
      wheel3,
    } = this.refs;

    const { spinning } = this.state;
    if (wheelNumber === 1) {
      this.unblur(wheel1);
      this.setState({
        spinning: spinning - 1,
      });
    }
    if (wheelNumber === 2) {
      this.unblur(wheel2);
      this.setState({
        spinning: spinning - 1,
      });
    }
    if (wheelNumber === 3) {
      this.unblur(wheel3);
      this.setState({
        spinning: spinning - 1,
      });
    }
    if (wheelNumber === 4) {
      this.setState({
        spinning: false,
      });

      this.endSpin();
    }
  }

  async endSpin() {
    const {
      slots,
      spin,
      credits,
      balance,
    } = this.state;

    const {
      playerInfo,
    } = this.props;

    const {
      slotTrigger,
      slotCredit,
      balanceRef,
      wheel1,
      wheel2,
      wheel3,
    } = this.refs;
    const wheelChild1 = wheel1.childNodes;
    const wheelChild2 = wheel2.childNodes;
    const wheelChild3 = wheel3.childNodes;
    const wheel1Imgs = [
      wheelChild1[1],
      wheelChild1[2],
      wheelChild1[3],
      wheelChild1[4],
      wheelChild1[5],
    ];
    const wheel2Imgs = [
      wheelChild2[1],
      wheelChild2[2],
      wheelChild2[3],
      wheelChild2[4],
      wheelChild2[5],
    ];
    const wheel3Imgs = [
      wheelChild3[1],
      wheelChild3[2],
      wheelChild3[3],
      wheelChild3[4],
      wheelChild3[5],
    ];

    const playerCombTop = [];
    const spinTop = spin;
    for (let i = 0; i < 3; i += 1) {
      if (spinTop[i] - 1 < 0) {
        spinTop[i] = 4;
        playerCombTop.push(slots[i][spinTop[i]]);
      } else {
        playerCombTop.push(slots[i][spinTop[i] - 1]);
      }
    }

    const spinCenter = spin;
    const playerCombCenter = [
      slots[0][spinCenter[0]],
      slots[1][spinCenter[1]],
      slots[2][spinCenter[2]],
    ];

    const playerCombBottom = [];
    const spinBottom = spin;
    for (let i = 0; i < 3; i += 1) {
      if (spinBottom[i] + 1 > 4) {
        spinBottom[i] = 0;
        playerCombBottom.push(slots[i][spinBottom[i]]);
      } else {
        playerCombBottom.push(slots[i][spinBottom[i] + 1]);
      }
    }

    let bar3AmountTop = 0;
    let barAmountTop = 0;
    let bar2AmountTop = 0;
    let cherriesAmountTop = 0;
    let sevensAmountTop = 0;
    let count = 0;
    playerCombTop.forEach((symbol) => {
      if (symbol === 'bar3') {
        bar3AmountTop += 1;
        if (count === 0) {
          wheel1Imgs.forEach((img) => {
            img.classList.add('BAR3');
          });
        } else if (count === 1) {
          wheel2Imgs.forEach((img) => {
            img.classList.add('BAR3');
          });
        } else if (count === 2) {
          wheel3Imgs.forEach((img) => {
            img.classList.add('BAR3');
          });
        }
      }
      if (symbol === 'bar') {
        barAmountTop += 1;
        if (count === 0) {
          wheel1Imgs.forEach((img) => {
            img.classList.add('BAR');
          });
        } else if (count === 1) {
          wheel2Imgs.forEach((img) => {
            img.classList.add('BAR');
          });
        } else if (count === 2) {
          wheel3Imgs.forEach((img) => {
            img.classList.add('BAR');
          });
        }
      }
      if (symbol === 'bar2') {
        bar2AmountTop += 1;
        if (count === 0) {
          wheel1Imgs.forEach((img) => {
            img.classList.add('BAR2');
          });
        } else if (count === 1) {
          wheel2Imgs.forEach((img) => {
            img.classList.add('BAR2');
          });
        } else if (count === 2) {
          wheel3Imgs.forEach((img) => {
            img.classList.add('BAR2');
          });
        }
      }
      if (symbol === 'seven') {
        sevensAmountTop += 1;
        if (count === 0) {
          wheel1Imgs.forEach((img) => {
            img.classList.add('SEVEN');
          });
        } else if (count === 1) {
          wheel2Imgs.forEach((img) => {
            img.classList.add('SEVEN');
          });
        } else if (count === 2) {
          wheel3Imgs.forEach((img) => {
            img.classList.add('SEVEN');
          });
        }
      }
      if (symbol === 'cherry') {
        cherriesAmountTop += 1;
        if (count === 0) {
          wheel1Imgs.forEach((img) => {
            img.classList.add('CHERRY');
          });
        } else if (count === 1) {
          wheel2Imgs.forEach((img) => {
            img.classList.add('CHERRY');
          });
        } else if (count === 2) {
          wheel3Imgs.forEach((img) => {
            img.classList.add('CHERRY');
          });
        }
      }
      count += 1;
    });


    if (sevensAmountTop === 2 && cherriesAmountTop === 1) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    } else if (sevensAmountTop === 1 && cherriesAmountTop === 2) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    }

    let bar3AmountCenter = 0;
    let barAmountCenter = 0;
    let bar2AmountCenter = 0;
    let cherriesAmountCenter = 0;
    let sevensAmountCenter = 0;
    console.log('playerCombCenter:', playerCombCenter);
    playerCombCenter.forEach((symbol) => {
      if (symbol === 'bar3') {
        bar3AmountCenter += 1;
      }
      if (symbol === 'bar') {
        barAmountCenter += 1;
      }
      if (symbol === 'bar2') {
        bar2AmountCenter += 1;
      }
      if (symbol === 'seven') {
        sevensAmountCenter += 1;
      }
      if (symbol === 'cherry') {
        cherriesAmountCenter += 1;
      }
    });


    if (sevensAmountCenter === 2 && cherriesAmountCenter === 1) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    } else if (sevensAmountCenter === 1 && cherriesAmountCenter === 2) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    }

    let bar3AmountBottom = 0;
    let barAmountBottom = 0;
    let bar2AmountBottom = 0;
    let cherriesAmountBottom = 0;
    let sevensAmountBottom = 0;
    playerCombBottom.forEach((symbol) => {
      if (symbol === 'bar3') {
        bar3AmountBottom += 1;
      }
      if (symbol === 'bar') {
        barAmountBottom += 1;
      }
      if (symbol === 'bar2') {
        bar2AmountBottom += 1;
      }
      if (symbol === 'seven') {
        sevensAmountBottom += 1;
      }
      if (symbol === 'cherry') {
        cherriesAmountBottom += 1;
      }
    });

    if (cherriesAmountTop === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 2000,
      });
    }
    if (cherriesAmountCenter === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 1000,
      });
    }
    if (cherriesAmountBottom === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 4000,
      });
    }
    if (sevensAmountTop === 3 || sevensAmountCenter === 3 || sevensAmountBottom === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 150,
      });
    }
    if (sevensAmountBottom === 2 && cherriesAmountBottom === 1) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    }
    if (sevensAmountBottom === 1 && cherriesAmountBottom === 2) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 75,
      });
    }
    if (bar3AmountTop === 3 || bar3AmountCenter === 3 || bar3AmountBottom === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 50,
      });
    }
    if (bar2AmountTop === 3 || bar2AmountCenter === 3 || bar2AmountBottom === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 20,
      });
    }
    if (barAmountTop === 3 || barAmountCenter === 3 || barAmountBottom === 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 10,
      });
    }
    if (barAmountTop > 0 && barAmountTop < 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 5,
      });
    }
    if (barAmountCenter > 0 && barAmountCenter < 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 5,
      });
    }
    if (barAmountBottom > 0 && barAmountBottom < 3) {
      this.blink(balanceRef);
      this.setState({
        balance: balance + 5,
      });
    }

    setTimeout(() => {
      this.setState({
        triggerDisabled: false,
      });
      slotTrigger.classList.remove('slotTriggerDisabled');
      slotCredit.classList.remove('blinkAnimation');
    }, 500);
    const round = {
      player: playerInfo._id,
      name: playerInfo.name,
      topCombination: playerCombTop,
      mainCombination: playerCombCenter,
      bottomCombination: playerCombBottom,
    };
    const responseRound = await this.submitRound(round);
    console.log('responseRound:', responseRound);
    if (credits <= 0 || credits === '0') {
      const allRoundsPlayed = await this.getRoundsByPlayer(playerInfo._id);
      const game = {
        playerInfo,
        rounds: allRoundsPlayed,
        totalBalance: balance,
      };
      this.endGame(game);
    }
  }

  addCredit(incrementCredits) {
    const { credits } = this.state;
    const { slotCredit } = this.refs;
    this.setState({
      credits: credits + incrementCredits,
    });
    console.log('slotCredit:', slotCredit);
    this.blink(slotCredit);
  }

  blur(element) {
    element.classList.remove('unblurEffect');
    element.classList.add('blurEffect');
  }

  unblur(element) {
    element.classList.remove('blurEffect');
    element.classList.add('unblurEffect');
  }

  blink(element) {
    element.classList.remove('blinkAnimation');
    element.classList.add('blinkAnimation');
    setTimeout(() => {
      element.classList.remove('blinkAnimation');
    }, 1000);
  }


  slotTriggerDown() {
    const {
      slotTrigger,
      arm,
    } = this.refs;
    const {
      credits,
    } = this.state;
    if (!(credits <= 0 || credits === '0')) {
      slotTrigger.classList.remove('slotTriggerDown');
      slotTrigger.classList.add('slotTriggerDown');
      arm.classList.remove('releaseArmAnimation');
      arm.classList.remove('pushArmAnimation');
      this.spin();
    }
  }

  slotTriggerUp() {
    const {
      slotTrigger,
      arm,
    } = this.refs;
    slotTrigger.classList.remove('slotTriggerDown');
    arm.classList.remove('pushArmAnimation');
    arm.classList.remove('releaseArmAnimation');
    arm.classList.add('releaseArmAnimation');
  }

  async submitRound(round) {
    const response = await fetch(
      'http://localhost:5000/rounds/play',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(round),
      },
    );
    const data = await response.json();
    return data;
  }

  async submitFullGameResult(game) {
    const response = await fetch(
      'http://localhost:5000/rounds/play',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(game),
      },
    );
    const data = await response.json();
    return data;
  }


  render() {
    const {
      credits,
      spin,
      spinningWheel1Styled,
      spinningWheel2Styled,
      spinningWheel3Styled,
      WinningLine,
      debugMode,
      zeros,
      balance,
      triggerDisabled,
      showPayTable,
    } = this.state;
    let spinningWheel1;
    let spinningWheel2;
    let spinningWheel3;
    let disabledInput;
    let paytable;

    if (debugMode) {
      disabledInput = (
        <>
          <Credits
            type="text"
            value={credits}
            onChange={this.onCreditsChange}
            ref="creditInput"
            style={{
              color: '#ffc108',
            }}
          />
        </>
      );
    } else {
      disabledInput = (
        <>
          <Credits
            type="text"
            value={credits}
            onChange={this.onCreditsChange}
            ref="creditInput"
            disabled
          />
        </>
      );
    }

    if (spinningWheel1Styled === null) {
      spinningWheel1 = (
        <>
          <>
            <Wheel
              ref="wheel1"
              id="wheel1"
            >
              <WheelOverlay />
              <WheelImage src={Cherry} className="slotSpinAnimation" />
              <WheelImage src={BAR3} className="slotSpinAnimation" />
              <WheelImage src={BAR} className="slotSpinAnimation" />
              <WheelImage src={BAR2} className="slotSpinAnimation" />
              <WheelImage src={Seven} className="slotSpinAnimation" />
              <WheelImage src={Cherry} className="slotSpinAnimation" />
              <WheelImage src={BAR3} className="slotSpinAnimation" />
            </Wheel>
          </>
        </>
      );
    } else if (spinningWheel1Styled !== null) {
      spinningWheel1 = (
        <>
          <Wheel
            ref="wheel1"
            id="wheel1"
          >
            <WheelOverlay />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
            <WheelImage src={BAR} className="slotSpinAnimation" />
            <WheelImage src={BAR2} className="slotSpinAnimation" />
            <WheelImage src={Seven} className="slotSpinAnimation" />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
          </Wheel>
        </>
      );
    }

    if (spinningWheel2Styled === null) {
      spinningWheel2 = (
        <>
          <Wheel
            ref="wheel2"
            id="wheel2"
          >
            <WheelOverlay />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
            <WheelImage src={BAR} className="slotSpinAnimation" />
            <WheelImage src={BAR2} className="slotSpinAnimation" />
            <WheelImage src={Seven} className="slotSpinAnimation" />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
          </Wheel>
        </>
      );
    } else if (spinningWheel2Styled !== null) {
      spinningWheel2 = (
        <>
          <Wheel
            ref="wheel2"
            id="wheel2"
          >
            <WheelOverlay />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
            <WheelImage src={BAR} className="slotSpinAnimation" />
            <WheelImage src={BAR2} className="slotSpinAnimation" />
            <WheelImage src={Seven} className="slotSpinAnimation" />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
          </Wheel>
        </>
      );
    }

    if (spinningWheel3Styled === null) {
      spinningWheel3 = (
        <>
          <Wheel
            ref="wheel3"
            id="wheel3"
          >
            <WheelOverlay />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
            <WheelImage src={BAR} className="slotSpinAnimation" />
            <WheelImage src={BAR2} className="slotSpinAnimation" />
            <WheelImage src={Seven} className="slotSpinAnimation" />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
          </Wheel>
        </>
      );
    } else if (spinningWheel3Styled !== null) {
      spinningWheel3 = (
        <>
          <Wheel
            ref="wheel3"
            id="wheel3"
          >
            <WheelOverlay />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
            <WheelImage src={BAR} className="slotSpinAnimation" />
            <WheelImage src={BAR2} className="slotSpinAnimation" />
            <WheelImage src={Seven} className="slotSpinAnimation" />
            <WheelImage src={Cherry} className="slotSpinAnimation" />
            <WheelImage src={BAR3} className="slotSpinAnimation" />
          </Wheel>
        </>
      );
    }

    const Checkbox = ({ className, checked, ...props }) => (
      <CheckboxContainer className={className}>
        <HiddenCheckbox checked={debugMode} {...props} />
        <StyledCheckbox checked={debugMode}>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
      </CheckboxContainer>
    );

    let trigger;

    if (triggerDisabled) {
      trigger = (
        <>
          <SlotTrigger ref="slotTrigger">
            <Arm ref="arm">
              <BlueKnob ref="knob" />
            </Arm>
            <ArmShadow ref="armShadow" />
            <Ring1>
              <RingShadow1 />
            </Ring1>
            <Ring2>
              <RingShadow2 />
            </Ring2>
          </SlotTrigger>
        </>
      );
    } else {
      trigger = (
        <>
          <SlotTrigger ref="slotTrigger" onMouseDown={this.slotTriggerDown} onMouseUp={this.slotTriggerUp}>
            <Arm ref="arm">
              <Knob ref="knob" />
            </Arm>
            <ArmShadow ref="armShadow" />
            <Ring1>
              <RingShadow1 />
            </Ring1>
            <Ring2>
              <RingShadow2 />
            </Ring2>
          </SlotTrigger>
        </>
      );
    }

    if (showPayTable) {
      paytable = (
        <>
          <PayTable />
        </>
      );
    } else {
      paytable = (
        <>
        </>
      );
    }


    return (
      <>
        <BalanceTitle>
        BALANCE
        </BalanceTitle>
        <Balance ref="balanceRef">
          {balance}
        </Balance>
        <SlotMachine>
          <MachineBody>
            <SlotBlock />
            <SlotFrame />
            <SlotGlazeBottom />
            <SlotDisplay>
              <SlotOverlayLine />
              <SlotCredits
                ref="slotCredit"
              />
              {disabledInput}
              <SlotZeros ref="slotZeros">{zeros}</SlotZeros>
            </SlotDisplay>
            <SlotWheels>
              {spinningWheel1}
            </SlotWheels>
            <SlotWheels>
              {spinningWheel2}
            </SlotWheels>
            <SlotWheels>
              {spinningWheel3}
            </SlotWheels>
            {trigger}
          </MachineBody>
        </SlotMachine>
        <MachineFeet />
        <DebugTitle>
        DEBUG
        </DebugTitle>
        <Checkbox
          checked={debugMode}
          onChange={this.onSetDebugMode}
        />
        <input
          type="checkbox"
          onChange={this.onSetDebugMode}
          style={{
            top: '27.4%',
            left: '50%',
            transform: 'translateX(-50%)',
            position: 'fixed',
          }}
        />
        <ShowPaytable
          type="button"
          value="Pay Table"
          onMouseDown={this.onShowPaytable}
        />
        {paytable}
      </>
    );
  }
}
