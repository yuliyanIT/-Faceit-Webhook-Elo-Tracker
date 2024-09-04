// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const axios = require('axios');
 
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
 
app.use(bodyParser.json());
 
const FACEIT_API_KEY = '66823ee2-24b0-4cad-a6f7-26b53f7e4ba8';
const PLAYER_ID = 'e182052b-59d1-4a22-b55d-ea71206895f5'; // The player we're tracking
 
let currentElo = null;
 
// Function to get player's current ELO
async function getPlayerElo() {
  try {
    const response = await axios.get(`https://open.faceit.com/data/v4/players/${PLAYER_ID}`, {
      headers: {
        'Authorization': `Bearer ${FACEIT_API_KEY}`
      }
    });
    return response.data.games.cs2.faceit_elo;
  } catch (error) {
    console.error('Error fetching player ELO:', error);
    return null;
  }
}
 
// Initialize current ELO when server starts
getPlayerElo().then(elo => {
  currentElo = elo;
  console.log(`Initial ELO for ${PLAYER_ID}: ${currentElo}`);
});
 
// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const matchData = req.body;
 
  console.log(matchData);
  // Verify that our player was in the match
  const oldElo = currentElo;
  const newElo = await getPlayerElo();
  newElo = newElo + 25;
  let eloChange;
  let direction;
    
  if (oldElo !== null && newElo !== null) {
    if(oldElo >= newElo){
      eloChange = oldElo - newElo;
      direction = "down";
    } else {
      eloChange = newElo - oldElo;
      direction = "up";
    }
    currentElo = newElo;
    
    // Broadcast ELO change to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ eloChange, newElo, oldElo, direction }));
      }
    });
  }

  res.sendStatus(200);
});
 
// Serve static files for the Streamlabs browser source
app.use(express.static('public'));
 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 