import React from 'react';

const numRow: number = 30;
const numCol: number = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
]

const intiGrid = () => {
  const newGrid: number[][] = [];
  for (let i = 0; i < numRow; i++) {
    newGrid[i] = []
    for (let k = 0; k < numCol; k++) {
      newGrid[i][k] = 0;
    }
  }
  return newGrid;
}

const intiRandomGrid = () => {
  const newGrid: number[][] = [];
  for (let i = 0; i < numRow; i++) {
    newGrid[i] = []
    for (let k = 0; k < numCol; k++) {
      newGrid[i][k] = (Math.random() > 0.7) ? 1 : 0;
    }

  }
  return newGrid;
}

const copyGrid = (grid: number[][]) => {
  const newGrid: number[][] = [];
  for (let i = 0; i < numRow; i++) {
    newGrid[i] = []
    for (let k = 0; k < numCol; k++) {
      newGrid[i][k] = (grid[i][k] === 1) ? 1 : 0;
    }

  }
  return newGrid;
}

class AppClass extends React.Component {

  state = {
    grid: intiGrid(),
    simulate: false,
    preSimulate: true
  }

  handleDivClick = (e: any, i: number, k: number) => {
    let gridCopy = copyGrid(this.state.grid);
    gridCopy[i][k] = (this.state.grid[i][k] === 1) ? 0 : 1;
    this.setState({ grid: gridCopy })
  }

  handleRandomGrid = () => {
    const newgrid = intiRandomGrid();
    this.setState({ grid: newgrid })
  }

  handleClearGrid = () => {
    const newgrid = intiGrid();
    this.setState({ grid: newgrid })
  }

  simulationOneIteration = () => {
    const currentGrid = this.state.grid;
    const gridCopy = copyGrid(currentGrid);
    currentGrid.forEach((row, i) => {
      row.forEach((box, k) => {
        let nu = 0;
        operations.forEach((x) => {
          const newI = i + x[0];
          const newK = k + x[1];
          if ((newI >= 0 && newI < numRow) && (newK >= 0 && newK < numCol)) {
            nu += currentGrid[newI][newK];
          }
        })
        if (nu < 2 || nu > 3) {
          gridCopy[i][k] = 0;
        } else if (box === 0 && nu === 3) {
          gridCopy[i][k] = 1;
        }
      })
    })
    this.setState({ grid: gridCopy });
  };

  /*
  loopingSimulation = (arg:boolean) => {
    //console.log(this.state.simulate)
    if (arg) {
      this.simulationOneIteration();
      setTimeout(() => { this.loopingSimulation(this.state.simulate) }, 1000/60);
      requestAnimationFrame(() => this.loopingSimulation(this.state.simulate))
    }
  }
  */

  loopingSimulation = () => {
    //console.log(this.state.simulate)
    if (this.state.simulate) {
      this.simulationOneIteration();
      setTimeout(() => { this.loopingSimulation() }, 500);
      //requestAnimationFrame(() => this.loopingSimulation(this.state.simulate))
    }
  }

  handleSimulation = () => {
    this.setState({ simulate: !this.state.simulate });
    setTimeout(() => this.loopingSimulation(), 10);
    //this.loopingSimulation(!this.state.simulate);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleSimulation}>{this.state.simulate ? "Stop" : "Start"}</button>
        <button onClick={this.handleRandomGrid}>Random Grid</button>
        <button onClick={this.handleClearGrid}>Clear Grid</button>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCol}, 20px)`
        }}>
          {
            this.state.grid.map((row, i) => {
              return row.map((box, k) => { return <div onClick={(e) => this.handleDivClick(e, i, k)} key={i + "+" + k} style={{ border: "1px solid", width: "20px", height: "20px", backgroundColor: (box === 1) ? "pink" : undefined }} ></div> })
            })
          }
        </div>
      </div>
    );
  }
}

export default AppClass;

/*
    {simulate ? <span> true </span> : <span> false </span>}
    {simulateRef.current ? <span> true current </span> : <span> false current </span>}
*/

/*
  const memoized = useCallback(() => {
    setRunning(true);
    let gridCopy = copyGrid(grid);

    grid.forEach((row, i) => {
      row.forEach((box, k) => {
        let nu = 0;
        let ii = 0;
        operations.forEach((x) => {
          const newI = i + x[0];
          const newK = k + x[1];
          if ((newI >= 0 && newI < numRow) && (newK >= 0 && newK < numRow)) {
            nu = nu + grid[newI][newK];
          }
        })
        if (nu < 2 || nu > 3) {
          gridCopy[i][k] = 0;
        } else if (box === 0 && nu === 3) {
          gridCopy[i][k] = 1;
        }
      })
    })
    setGrid(gridCopy)
    setTimeout(() => loopingSimulation(), 500);
    /// requestAnimationFrame(() => handleSimulation())
  }, [grid]);

*/