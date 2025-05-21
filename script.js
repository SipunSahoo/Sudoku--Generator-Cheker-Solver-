window.onload = function () {
    createGrid();
};

function createGrid() {
    const table = document.getElementById("sudoku-grid");
    table.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");

        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.dataset.row = row;
            input.dataset.col = col;

            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^1-9]/g, '');
            });

            td.appendChild(input);
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

function getGrid() {
    const grid = [];
    for (let row = 0; row < 9; row++) {
        const currentRow = [];
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            const val = parseInt(input.value);
            currentRow.push(isNaN(val) ? 0 : val);
        }
        grid.push(currentRow);
    }
    return grid;
}

function setGrid(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            input.value = grid[row][col] !== 0 ? grid[row][col] : '';
        }
    }
}

function solveSudoku() {
    const grid = getGrid();

    function isSafe(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }

        const startRow = row - row % 3;
        const startCol = col - col % 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    function solve(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solve(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    const success = solve(grid);
    if (success) {
        setGrid(grid);
        document.getElementById("status").textContent = "Solved successfully!";
        document.getElementById("status").style.color = "green";
    } else {
        document.getElementById("status").textContent = "No solution exists!";
        document.getElementById("status").style.color = "red";
    }
}

function resetGrid() {
    createGrid();
    document.getElementById("status").textContent = '';
}

function checkSudoku() {
    const grid = getGrid();

    function isValidBlock(block) {
        const nums = block.filter(n => n !== 0);
        return new Set(nums).size === nums.length;
    }

    for (let i = 0; i < 9; i++) {
        const row = grid[i];
        const col = grid.map(r => r[i]);

        if (!isValidBlock(row) || !isValidBlock(col)) {
            document.getElementById("status").textContent = "Incorrect!";
            document.getElementById("status").style.color = "red";
            return;
        }
    }

    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            const block = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    block.push(grid[r + i][c + j]);
                }
            }
            if (!isValidBlock(block)) {
                document.getElementById("status").textContent = "Incorrect!";
                document.getElementById("status").style.color = "red";
                return;
            }
        }
    }

    document.getElementById("status").textContent = "Correct!";
    document.getElementById("status").style.color = "green";
}

function generateSudoku() {
    resetGrid();

    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isSafe(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }

        const startRow = row - row % 3;
        const startCol = col - col % 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    function fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    let numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                    for (let num of numbers) {
                        if (isSafe(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (fillGrid(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillGrid(grid);

    // Remove 40 cells (medium difficulty)
    let cellsToRemove = 40;
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            cellsToRemove--;
        }
    }

    setGrid(grid);
    document.getElementById("status").textContent = "Generated a medium-difficulty puzzle.";
    document.getElementById("status").style.color = "blue";
}
