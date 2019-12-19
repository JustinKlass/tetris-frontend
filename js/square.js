class Square {
    constructor(x = 0, y = 0, squareSize = 0, color = '') {
        this.x = x
        this.y = y
        this.squareSize = squareSize
        this.color = color
    }

    show = () => {
        fill(this.color);
        rect(this.x, this.y, this.squareSize, this.squareSize);

    }
}