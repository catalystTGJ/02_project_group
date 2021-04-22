Group project proposal:

Tank battle game allowing 4 players to participate in a match.
Users will login to the server, and select a match to join.
The match will then be generated for 4 players.
the server will have a wait state until all players are connected.
The front-end will communicate to the back-end using ajax method to communicate all the relevant telemetry of the player's tank,
and any damage inflicted on other player's tanks.

the project will require the use of "channels".

There will likely be as many as 5 channels per game involved. The logic is that there will be a "common" channel that the back-end
will use for specific messaging regarding the over-all game. this would include battlefield specifications, as well as heartbeat
signaling, such as when the game should start, stop, if/when it is won, etc. this channel could also be communicated over for a "mass" communication from an admin of the site for instance.

Additional channels would be for each player's tank.
Each player's browser would bind to 4 player channels.
these channels would provide comm to each other player, and would serve as the best path for "chat" between the 4 players as well.
Having separate channels to communicate the player specific values will help in ensuring that
there is no duplicative transmission of data for the each send, back to the original sender of the data.

we will build to support multiple game slots (perhaps 4) consisting of 4 players per game slot

project flow:

00.) initial players logs on or registers, and is taken to the game selection page
01.) on game selection page a nav bar will permit navigation to a dash, a rank, and sign out
02.) user selects an open "game/player slot", then user must wait for 3 more users to select the same game, then game selection confirms and goes on to a game play page
03.) game play screen will be very complex and hard to put into a short sentence, there'll be a count down, then game play happen,
once a certain score or damage level, or time limit is reached, game will end and return to the game selection page.
04. additional elements on the game play page will permit chatting between players in the game.
05.) game dash page will have the same nav bar as the game selection page
06.) game dash will have all the active games/players scores and damage metrics
07.) broadcast messaging will be possible from the game dash page
08.) game rank page will have the same nav bar as game selection and game dash page
09.) game rank page will show players metrics/winnings of various games

nice to haves
obstacle objects on the battle field that will interfere with tank movement and/or turret fire


Assignment of work pieces:
Thomas: overall channels dev and related javascript, including AJAX
TJ: database model related work
Jason: User login/registration, bootstrap related work, assist in javascript work
Mindy: TBD, artwork possibly, other details

We still have to more formalize what each of us will be working.

