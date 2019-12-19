class Block {
    constructor(original = [[]], x = 0, y = 0, color = '') {
        this.original = original    // THE ORIGINAL ORIENTATION OF THE BLOCK
        this.x = x
        this.y = y
        this.bool = false
        this.color = color
        this.blockLength = original.length
        this.newArray = new Array(this.blockLength);
        this.shape = this.createBlock(this.blockLength);
    }

    createBlock = (length) => {
        return (
            // LOOPS THROUGH MATRIX AND CREATES A SQUARE FOR EACH NON NULL VALUE
            Array.from(new Array(length), (x, i) =>
                Array.from(new Array(length), (x, j) =>  
                    this.original[i][j] === 1 ? 
                        new Square(
                            this.x + j * squareSize,        // X-POS
                            this.y + i * squareSize,        // Y-POS
                            squareSize,                     // WIDTH | HEIGHT
                            this.color                      // COLOR 
                        ) : null
                )
            )
        )
    }

    show() {
        this.gravitySqueeze();

        // LOOPS THROUGH AND SHOWS EVERY SQUARE IN THE MATRIX THAT IS NOT NULL
        this.shape.forEach((square) => {
            square.filter(square => square != null).forEach((square) => {
                square.show()
            })
        })
    }
    
    // CONTINUOUSLY RUNNING TO UPDATE THE BLOCK POSITION
    gravitySqueeze = () => {
        this.shape.forEach((row, i) => 
            row.forEach((column, j) => {
                if (column != null) {
                    column.x = this.x + j * squareSize;
                    column.y = this.y + i * squareSize;
                }
            })
        )
    }

    // FLIPS MATRIX
    matrixRotate = () => {
        this.shape.forEach((i) => 
            this.shape.reverse().forEach((row) => {
                row[i]
            })
        );
    }

    // TRANSPOSES MATRIX
    matrixTranspose = () => {

        // CREATE A NEW MATRIX WITH UNDEFINED POINTS
        let orientation = Array.from((this.newArray), i =>
            Array.from((this.newArray), j => {
            })
        );

        // FOR EACH COLUMN IN SHAPE MATRIX - SET ORIENTATION[J][I] = SHAPE[I][J]
        // EX. SET ORIENTATION[2][1] = SHAPE[1][2]
        // SHIFTS THE BLOCK 90 DEGS RIGHT
        this.shape.forEach((column, i) => { 
            column.forEach((point, j) => {
                orientation[j][i] = point

                //      SHAPE            ORIENTATION
                // [ ]   [ ]   [ ]      [ ]  [x]  [ ]
                // [x]   [x]   [x]      [ ]  [x]  [x]
                // [ ]   [x]   [ ]      [ ]  [x]  [ ]

                //         ORIENTATION
                // [0][0]    [1][0]    [2][0]
                // [0][1]    [1][1]    [2][1]
                // [0][2]    [1][2]    [2][2]
            })
        });
        this.shape = orientation;
    }

    rotation() {
        // NEED ROTATION FIRST SO IT TRANSPOSES CLOCKWISE
        // SWITCH ORDER TO MAKE IT TRANSPOSE COUNTER CLOCKWISE

        if (this.original === blocks[0][0] || this.original === blocks[6][0]) {
            if (this.bool === false) {
                this.matrixTranspose();
                this.matrixRotate();
                this.bool = true
            }
            else {
                this.matrixRotate();
                this.matrixTranspose();
                this.bool = false
            }
        }


        else {
            // console.log(this.shape);
            this.matrixRotate();
            this.matrixTranspose();
            // this.gravitySqueeze();
            // console.log(this.shape);
        }
    }

    // CHECKS IF BLOCK COLLIDED WITH THE WALLS
    collision(collision) {
        return(
            this.shape.reduce((accumulator, value) =>
                accumulator.concat(value.filter((column) =>
                    column != null).filter((square) =>
                        collision(square)
                    )
                ), []
            ).length > 0
        )
    }
    // USES REDUCE TO CONCAT ALL NON NULL VALUES OF SQUARES IN EACH COLUMN OF MATRIX
    // AND PUTS IT INTO AN ARRAY CALLED ACCUMULATOR IF THE LENGTH IS GREATER THAN 0
    // SOMETHING IS COLLIDING AND IT RETURNS TRUE
    
}