import React, { Component } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import PropTypes from "prop-types";
import RandomNumber from "./RandomNumber";
import shuffle from "lodash.shuffle";

// type Props = {};

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds
  };

  gameStatus = "PLAYING";

  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  shuffleRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        prevState => {
          return { remainingSeconds: prevState.remainingSeconds - 1 };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        }
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => {
      return { selectedIds: [...prevState.selectedIds, numberIndex] };
    });
  };

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== "PLAYING") {
        clearInterval(this.intervalId);
      }
    }
  }

  calcGameStatus = nextState => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffleRandomNumbers[curr];
    }, 0);
    // console.warn(sumSelected);
    if (nextState.remainingSeconds === 0) {
      return "LOST";
    }
    if (sumSelected < this.target) {
      return "PLAYING";
    }
    if (sumSelected === this.target) {
      return "WON";
    }
    if (sumSelected > this.target) {
      return "LOST";
    }
  };

  // targetPanelStyle = gameStatus => {};

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffleRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== "PLAYING"
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus === "WON" && (
          <Button title="Play Again" onPress={this.props.onPlayAgain} />
        )}
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue"
  },
  target: {
    fontSize: 40,
    backgroundColor: "#aaa",
    margin: 50,
    textAlign: "center"
  },
  randomContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  STATUS_PLAYING: {
    backgroundColor: "#bbb"
  },
  STATUS_WON: {
    backgroundColor: "green"
  },
  STATUS_LOST: {
    backgroundColor: "red"
  }
});

export default Game;
//target = 10 + Math.floor(40 * Math.random());// starting use its a basic
