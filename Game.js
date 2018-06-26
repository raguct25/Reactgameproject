import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import RandomNumber from "./RandomNumber";

// type Props = {};

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds
  };
  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => {
      return { selectedIds: [...prevState.selectedIds, numberIndex] };
    });
  };

  gameStatus = () => {
    const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
      return acc + this.randomNumbers[curr];
    }, 0);
    // console.warn(sumSelected);
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
    const gameStatus = this.gameStatus();
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.randomNumbers.map((randomNumber, index) => (
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
        <Text>{gameStatus}</Text>
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
