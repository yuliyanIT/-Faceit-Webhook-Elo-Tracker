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
  //const playerInMatch = matchData.payload.players.some(player => player.nickname === PLAYER_ID);
  
  //if (playerInMatch) {
    const oldElo = currentElo;
    const newElo = await getPlayerElo();
    
    if (oldElo !== null && newElo !== null) {
      const eloChange = newElo - oldElo;
      currentElo = newElo;
      
      // Broadcast ELO change to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ eloChange, newElo }));
        }
      });
    }
 // }

  res.sendStatus(200);
});
 
// Serve static files for the OBS browser source
app.use(express.static('public'));
 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
// {
//   transaction_id: '766a7b7e-82a9-4b7e-b23b-4d5dc5ed71e7',
//   event: 'match_status_ready',
//   event_id: '545c6475-fbbf-4cab-90ca-2b23d3aa219c',
//   third_party_id: 'e182052b-59d1-4a22-b55d-ea71206895f5',
//   app_id: '102bfc87-443c-4c50-a60b-38ba5a620977',
//   timestamp: '2024-09-04T11:19:02Z',
//   retry_count: 4,
//   version: 1,
//   payload: {
//     id: '1-3a2bbc77-3a44-4b58-80af-5dcf65247cd6',
//     organizer_id: 'eb49359b-781d-4843-aeb2-d7886885c33c',
//     region: 'EU',
//     game: 'cs2',
//     version: 8,
//     entity: {
//       id: '747dfc44-271f-4c3b-84fa-6e69a5b9127a',
//       name: "Skyfusion's 1v1 Gather",
//       type: 'hub'
//     },
//     teams: [ [Object], [Object] ],
//     client_custom: {
//       server_ip: '94.130.14.211',
//       server: [Object],
//       server_port: 27033,
//       map: '3076554807',
//       match_id: '1-3a2bbc77-3a44-4b58-80af-5dcf65247cd6-1-1'
//     },
//     created_at: '2024-09-04T11:12:55Z',
//     updated_at: '2024-09-04T11:19:02Z'
//   }
// }