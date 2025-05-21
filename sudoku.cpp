#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <random>
#include <sstream>

using namespace std;

const int SIZE = 9;

// Function to print the Sudoku grid
void printGrid(const vector<vector<int>>& grid) {
    for (int row = 0; row < SIZE; ++row) {
        if (row % 3 == 0 && row != 0) {
            cout << "---------------------" << endl;
        }
        for (int col = 0; col < SIZE; ++col) {
            if (col % 3 == 0 && col != 0) {
                cout << "| ";
            }
            cout << grid[row][col] << " ";
        }
        cout << endl;
    }
}

//check if a number can be placed in a given cell
bool isSafe(const vector<vector<int>>& grid, int row, int col, int num) {
    for (int x = 0; x < SIZE; ++x) {
        if (grid[row][x] == num || grid[x][col] == num) return false;
    }

    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            if (grid[i + startRow][j + startCol] == num) return false;
        }
    }
    return true;
}

// find an empty cell
bool findEmptyCell(const vector<vector<int>>& grid, int& row, int& col) {
    for (row = 0; row < SIZE; ++row) {
        for (col = 0; col < SIZE; ++col) {
            if (grid[row][col] == 0) return true;
        }
    }
    return false;
}

//solve Sudoku using backtracking
bool solveSudoku(vector<vector<int>>& grid) {
    int row, col;
    if (!findEmptyCell(grid, row, col)) return true;

    for (int num = 1; num <= SIZE; ++num) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

// generate a complete Sudoku grid
bool generateFullSudoku(vector<vector<int>>& grid) {
    int row, col;
    if (!findEmptyCell(grid, row, col)) return true;

    vector<int> numbers;
    for (int i = 1; i <= SIZE; i++) numbers.push_back(i);

    //shuffle numbers randomly
    random_device rd;
    mt19937 g(rd());
    shuffle(numbers.begin(), numbers.end(), g);

    for (int num : numbers) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (generateFullSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

//function to remove numbers based on difficulty
void removeNumbers(vector<vector<int>>& grid, int difficulty) {
    int cellsToRemove = (difficulty == 1) ? 30 : (difficulty == 2) ? 40 : 50;
    srand(time(0));
    while (cellsToRemove > 0) {
        int row = rand() % SIZE;
        int col = rand() % SIZE;
        if (grid[row][col] != 0) {
            grid[row][col] = 0;
            cellsToRemove--;
        }
    }
}

// Function to check if a completed Sudoku is valid
bool isSudokuValid(const vector<vector<int>>& grid) {
    // Check rows
    for (int row = 0; row < SIZE; row++) {
        vector<bool> seen(SIZE + 1, false);
        for (int col = 0; col < SIZE; col++) {
            int num = grid[row][col];
            if (num != 0) {
                if (seen[num]) return false;  // Duplicate found in row
                seen[num] = true;
            }
        }
    }

    // Check columns
    for (int col = 0; col < SIZE; col++) {
        vector<bool> seen(SIZE + 1, false);
        for (int row = 0; row < SIZE; row++) {
            int num = grid[row][col];
            if (num != 0) {
                if (seen[num]) return false;  // Duplicate found in column
                seen[num] = true;
            }
        }
    }

    // Check 3x3 subgrids
    for (int startRow = 0; startRow < SIZE; startRow += 3) {
        for (int startCol = 0; startCol < SIZE; startCol += 3) {
            vector<bool> seen(SIZE + 1, false);
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    int num = grid[startRow + i][startCol + j];
                    if (num != 0) {
                        if (seen[num]) return false;  // Duplicate in 3x3 box
                        seen[num] = true;
                    }
                }
            }
        }
    }

    return true;  // No duplicates found
}

// Function to convert grid to JSON string
string gridToJSON(const vector<vector<int>>& grid) {
    stringstream ss;
    ss << "[";
    for (int i = 0; i < SIZE; ++i) {
        ss << "[";
        for (int j = 0; j < SIZE; ++j) {
            ss << grid[i][j];
            if (j != SIZE - 1) ss << ", ";
        }
        ss << "]";
        if (i != SIZE - 1) ss << ", ";
    }
    ss << "]";
    return ss.str();
}

// Function to manually enter Sudoku grid
void enterSudokuGrid(vector<vector<int>>& grid) {
    cout << "Enter the Sudoku grid (0 for empty cells):\n";
    for (int i = 0; i < SIZE; ++i) {
        for (int j = 0; j < SIZE; ++j) {
            cin >> grid[i][j];
        }
    }
}

// Main function (Server will call functions, not use main here)
int main() {
    srand(time(0));
    return 0;
}
