import React, { Component } from 'react';
import './App.css';
import noun_list from './noun_list.txt';


class GameInitialize extends React.Component {

constructor(props) {
  super(props);
  this.state = {
    wordList: ""
  }

  this.loadWordList = this.loadWordList.bind(this);
}

  loadWordList(){
    fetch(noun_list)
      .then(response => response.text())
      .then(text => this.setState({wordList:text.split(/[^A-Za-z]+/)}))
    }

  createBoardValues(){
    // 8 red values, 9 blue values, 1 assassin
    // generate coordinate pairs without overlaps
    // best to shuffle the values and pop, rather than hope it finds
    // 18 quickly
    var randomBoard = [];
    for (var i = 0; i<5; i++){
      for (var j = 0; j<5; j++){
        randomBoard.push(j + ',' + i);
        // console.log(j + ',' + i);
      }
    }

    randomBoard = this.shuffleBoard(randomBoard)
    // console.log("creating board: " + randomBoard)
    return(randomBoard)
  }

  shuffleBoard(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j=Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  componentDidMount(){
    this.loadWordList()
  }

  render() {
    const randomBoard = this.createBoardValues()
    const wordList = this.shuffleBoard(this.state.wordList);
    var gridArray = new Array(5);
    for (var i = 0; i<5; i++) {
      gridArray[i] = new Array(5);
    };

    // console.log(wordList)
    // console.log("create: " + gridArray);
    return(
      <GameLogic 
        wordList = {wordList}
        gridArray = {gridArray}
        gridValues = {randomBoard}
        />
      );
  }
}

class GameLogic extends React.Component {
  render() {
    const gridArray = this.props.gridArray;
    const gridValues = this.props.gridValues;
    const wordList = this.props.wordList;
    // var currentRow = 0;
    // var currentCol = 0;

    for (var i = 0; i<25; i++) {
      // console.log(gridValues)
      var gridAddress = gridValues[i].split(',');
      if(i < 8){
      gridArray[gridAddress[0]][gridAddress[1]] = "dodgerblue"
      }
      if(i < 15 && i > 7){
      gridArray[gridAddress[0]][gridAddress[1]] = "firebrick"
      }
      if(i > 14 && i < 24) {
      gridArray[gridAddress[0]][gridAddress[1]] = "peru" 
      }
      if(i > 23){
      gridArray[gridAddress[0]][gridAddress[1]] = "slategray"  
      }
    }

   
  return(
    <GridBoard
    gridArray = {gridArray}
    wordList = {wordList}
    />

    );
  }
}

class GridBoard extends React.Component {
  render() {
    const gridArray = this.props.gridArray;
    // const gridUpdate = this.props.gridUpdate;
    const gridRowsMax = 5;
    const gridColsMax = 5;
    const gridSquares = [];
    const coverColor = 'beige';
    var wordList = this.props.wordList;
    var wordValue = "";
    var i = 0;
    // const status = 'green';

    for(var gridRow = 0; gridRow < gridRowsMax; gridRow++){
      for(var gridCol = 0; gridCol < gridColsMax; gridCol++){
        var status = (gridArray[gridRow][gridCol]) ? status = gridArray[gridRow][gridCol] : status = '';
        // console.log(gridRow + ' ' + gridCol + ' ' + status)
        wordValue = wordList[i];
        gridSquares.push(
          <DisplayGridSquare
            gridCol = {gridCol}
            gridRow = {gridRow}
            status = {status}
            coverColor = {coverColor}
            value = {wordValue}
          />
          );
        i++;
        }
        gridSquares.push(<br/>)
      }
   
  return (
    <div class="div-gridboard">
    {gridSquares}
    </div>
    )
  }
}

class DisplayGridSquare extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      status: this.props.status,
      coverColor: 'beige',
      currentColor: this.props.coverColor,
      value: this.props.value
  }

  this.revealColor = this.revealColor.bind(this);
  }
  revealColor(){
    if (this.state.currentColor !== 'beige') {
      console.log("currentColor == status");
    this.setState({currentColor: this.props.coverColor})
    }
    else {
      console.log("currentColor == cover");
    this.setState({currentColor: this.state.status})}
  }
  render() {
    const gridRow = this.props.gridRow
    const gridCol = this.props.gridCol
    const gridsquare = <button class="buttongridsquare" 
                               style={{backgroundColor:this.state.currentColor}}
                               onClick= {this.revealColor} >
                               {this.props.value}
                               </button>   
    return (
     <span>{gridsquare}</span>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameInitialize/>
      </div>
    );
  }
}

export default App;
