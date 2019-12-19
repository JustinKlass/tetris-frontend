let blockCollision = (blockOne, blockTwo) => {
    let {oneX, oneY, oneW, oneH} = {oneX : blockOne.x, oneY : blockOne.y, oneW : blockOne.squareSize, oneH : blockOne.squareSize}
    let {twoX, twoY, twoW, twoH} = {twoX : blockTwo.x, twoY : blockTwo.y, twoW : blockTwo.squareSize, twoH : blockTwo.squareSize}

    return (
        oneX + oneW - collisionMargin >= twoX &&    // blockOne right edge past blockTwo left
        oneX <= twoX + twoW - collisionMargin &&    // blockOne left edge past blockTwo right
        oneY + oneH >= twoY &&                      // blockOne top edge past blockTwo bottom
        oneY <= twoY + twoH - collisionMargin       // blockOne bottom edge past blockTwo top 
    )   
}