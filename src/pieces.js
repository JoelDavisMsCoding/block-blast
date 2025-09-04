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
[[1, 1], [1, 0], [1, 0]],              // 4 blocks shaped like a reversed 7 (longer/vertically)
[[1, 1], [0, 1], [0, 1]],              // 4 blocks shaped like a 7 (longer/vertically)
[[1, 0, 0], [1, 1, 1]],                // 4 blocks shaped like a L (longer/horizontally)
[[1, 1, 1], [1, 0, 0,], [1, 0, 0]],    // 5 blocks shaped like a 7
[[1, 1, 1], [0, 0, 1,], [0, 0, 1]],    // 5 blocks shaped like a 7 reversed
[[0, 0, 1], [1, 1, 1]],                // 4 blocks shaped like a L reversed (longer/horizontally)
[[1, 1, 1], [0, 0, 1]],                // 4 blocks shaped like a gun facing the left
[[1, 1, 1], [1, 0, 0]],                // 4 blocks shaped like a gun facing the right
[[1, 1, 1], [1, 1, 1]],                // 3x3 rectangle
[[1, 1, 1], [1, 1, 1], [1, 1, 1]],     // 3x3 squared
[[1, 1, 1, 1]],                        // 4 horizontal
[[1], [1], [1], [1]],                  // 4 vertical
[[1, 1, 0], [0, 1, 1]],                // 4 blocks Z shape
[[0, 1, 1], [1, 1, 0]],                // 4 blocks reverse Z
[[1, 1, 1, 1, 1]],                     // 5 horizontal
[[1], [1], [1], [1], [1]],             // 5 vertical
[[1, 1, 1], [0, 1, 0]],                // T shape
[[1, 0], [1, 1], [1, 0]],              // T shape to the right
[[0, 1], [1, 1], [0, 1]],              // T shape to the left
[[1, 0,], [1, 1], [0, 1]],             // z shape facing upwards
[[0, 1,], [1, 1], [1, 0]]              // z shape facing downward
];