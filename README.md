https://magnumdatura.github.io/Awesome-project/

Approach Taken
Wanted to work with animations - images and sounds. Initial pitch was a platformer where the floor was lava and you had to survive the countdown timer by jumping on randomly generated floating platforms. Stretch goals were then to be able to shoot the platforms you didn't need to get extra points. Shoutout to Zhenhao for helping me develop the ideas. Then became inspired by Desmond's warnings against plagiarism the week before project week. It related to my anxieties about being new @ coding and not knowing how to actualise original ideas in original code. Wanted to turn that into the subject of the game by making the platforms read slogans around plagiarism, inspiration, and improvising to learn code on the go. Came across interesting side-scroller shooter tutorials on youtube (Frank's laboratory and Chris Courses) and learnt a lot from them. Along the way learnt to incorporate bugs into features and now the original platformer function has a musical element that could be construed as a beatmaker function >.<

Technologies used
Worked mostly in Javascript, learnt how to use the canvas API. It was really fun to think about the side-scroller function, how to generate random objects from constructor classes and set them in motion, thinking about collision physics and the different game states relating to score and timing. My favorite code in doing this exercise were: the constructor classes with their embedded methods, the animate loop, forEach and filter to run methods on multiple objects of the constructor classes which made life much easier. Also learning to load and randomly iterate through image and audio srcs was incredibly fun.

Installation instructions
Download the .js .css .html files alongside the .png and .wav assets and run them through VS code's Go Live feature. Otherwise use the URL link to my Github!

Unsolved problems / further explorations
Unresolved & future investigations:

Collision physics/detection:
My character can stand perfectly fine on the downward moving platforms (here called 'ravens'), that is when the raven.direction.y is +ve, and gain points. However it bugs out when the 'ravens' are upward moving, and the player falls right through. I'm unsure why this is the case as gravity and raven.direction.y should both be accounted for in the player.y and raven.y respectively.

Game states (related to how requestAnimationFrame seems to work):
Had real difficulty with understanding how the timer/timestamp qualities of requestAnimationFrame work, as it seems to reside deeper in how the API is made. Making a pause function was tedious as the RAF's clock seems to be autonomous from when the window loads, and so game-time would never effectively be paused even if the animations were. Desmond really helped with working this out, and I added a pauseTime -= pauseTime line in 367 which help reset the game's timer consistently, where the pause button before would keep sliding down with RAF's autonomous timer count.
