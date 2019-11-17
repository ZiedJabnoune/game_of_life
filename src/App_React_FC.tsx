import React, { useState, useCallback, useRef } from 'react';

const numRow: number = 30;
const numCol: number = 60;

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

const AppFC : React.FC = () => {

  const [grid, setGrid] = useState(intiGrid())
  const [simulate, setSimulate] = useState(false);

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const simulateRef = useRef(false)
  //simulateRef.current = simulate;

  const handleDivClick = (e: any, i: number, k: number) => {
    let gridCopy = copyGrid(grid);
    gridCopy[i][k] = (grid[i][k] === 1) ? 0 : 1;
    setGrid(gridCopy)
  }

  const handleRandomGrid = () => {
    const newgrid = intiRandomGrid();
    setGrid(newgrid)
  }

  const handleClearGrid = () => {
    const newgrid = intiGrid();
    setGrid(newgrid)
  }

  const simulationOneIteration = () => {
    const currentGrid = gridRef.current;
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
    setGrid(gridCopy);
  };

  const loopingSimulation = () => {
    if (simulateRef.current) {
      simulationOneIteration();
      setTimeout(() => { loopingSimulation() }, 1000);
    } else {
      return
    }
  }

  const handleSimulation = () => {
    setSimulate(s => !s);
    simulateRef.current = !simulate;
    loopingSimulation();
  }

  return (
    <div>
      <button onClick={handleSimulation}>{simulate ? "Stop" : "Start"}</button>
      <button onClick={handleRandomGrid}>Random Grid</button>
      <button onClick={handleClearGrid}>Clear Grid</button>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCol}, 20px)`
      }}>
        {
          grid.map((row, i) => {
            return row.map((box, k) => { return <div onClick={(e) => handleDivClick(e, i, k)} key={i + "+" + k} style={{ border: "1px solid", width: "20px", height: "20px", backgroundColor: (box === 1) ? "pink" : undefined }} ></div> })
          })
        }
      </div>
    </div>
  );
}

export default AppFC;

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