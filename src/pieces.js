export const pieces = [
    [[1]],                                 // Single block
    [[1, 1]],                              // 2 horizontal
    [[1], [1]],                            // 2 vertical
    [[1, 1], [1, 1]],                      // 2x2 square
    [[1, 0], [0, 1]],                      // 2 blocks decline left to right
    [[0, 1], [1, 0]],                      // 2 blocks incline left to right
    [[1, 1], [1]],                         // 3 blocks shaped like a reversed 7
    [[1, 1], [0, 1]],                      // 3 blocks shaped like a 7
    [[1, 0], [1, 1]],                      // 3 blocks shaped like a L
    [[0, 1], [1, 1]],                      // 3 blocks shaped like a reversed L
    [[1], [1], [1]],                       // 3 vertical
    [[1, 1, 1]],                           // 3 horizontal
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],     // 3 blocks decline left to right
    [[0, 0, 1], [0, 1, 0], [1, 0, 0]],     // 3 blocks incline left to right
    [[1, 1, 1], [1, 1, 1]],                // 3x3 rectangle
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],     // 3x3 squared
    [[1, 1, 0], [0, 1, 1]],                // 4 blocks Z shape
    [[0, 1, 1], [1, 1, 0]]                 // 4 blocks reverse Z
];