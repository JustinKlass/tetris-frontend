class Platform {
    constructor(platform = [[]], x = 0, y = 0, color = {r : 255, g : 255, b : 255}) {
        this.platform = platform
        this.color = color
        this.x = x
        this.y = y
        this.generatePlatform()
        this.position = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8]
        // this.position = [19, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    }

    show() {
        this.platform.forEach( (row, i) => {
            row.forEach( (square, j) => {
                square === null ? this.showEmptyBox(j, i) : square.show()
            })
        })
    }

    // CREATES THE PLATFORM MATRIX
    generatePlatform() {
        let platformX = (canvas.width / squareSize);
        let platformY = (canvas.height / squareSize);
        this.platform = Array.from(new Array(platformY), row => 
                        Array.from(new Array(platformX), column => null))
        // console.log(this.platform);
        // console.log(this.platform[0]);
    }

    // CREATES A GRID OVER THE CANVAS SO YOU CAN SEE THE SQUARES BETTER
    showEmptyBox(x, y) {
        // let {r , g , b} = this.color
        // stroke(r, g, b);
        fill('#2D3336');
        rect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
    // FOR DEV PURPOSES


    // PLACES BLOCK WHEN IT GOES BELOW THE CANVAS
    placeBlock(block) {
        block.shape.reduce((total, currentValue) =>
            total.concat((currentValue).filter((column) =>
                column != null)), []
            ).forEach((square) => {
                this.platform[square.y / squareSize][square.x / squareSize] = square
            });
        this.loss();
        score += 10;
    }

    // LOOPS THROUGH THE CURRENT BLOCK AND GRABS ALL THE NON NULL VALUES AND PUTS THEM INTO
    // AN ARRAY THEN LOOPS THROUGH THE NEW ARRAY AND CREATES A SQUARE IN PLATFORM FOR EACH    

    blocksCollide(block, collision = (blockOne, blockTwo) => blockCollision(blockOne, blockTwo), applyToSquares = square => square) {
        let squares = block.shape.reduce((accumulator, row) => accumulator.concat(row.filter(column => column != null)), [])
        squares.forEach(square => applyToSquares(square))

        let platformBlocks = this.platform.reduce((accumulator, row) => accumulator.concat(row.filter(column => column != null)), [])

        return squares.reduce((accumulator, square) => platformBlocks.filter(p => collision(square, p)).length > 0 ? true : accumulator, false)
    }

    // rearrange = (platform, pos) => {
    //     return platform.map((row, j) => {
    //         return pos.map((i) => {
    //             return row[i];
    //       });
    //     });
    //   }

    // shiftCol(arr, col) {
    //     var prev = arr[arr.length - 1][col-1];
    //     arr.forEach(function(v) {
    //       var t = v[col - 1];
    //       v[col - 1] = prev;
    //       prev = t;
    //     })
    //     return arr;
    //   }

    // shiftRow(arr, row) {
    //     arr.unshift(arr.pop(arr[row]));
    //     return arr;
    //   }

    tetris = () => {

        this.platform.forEach((row, i) => {
            if (row.every(box => box != null)) {
                row.forEach((element, j) => this.platform[i][j] = null);
                score += 100;
            }
        });
    }

    loss = () => {
        this.platform[0].forEach((square, i) => {
            if (square != null) {
                console.log('You Lose');
                loss = true;
            }
        })
         
    }

}