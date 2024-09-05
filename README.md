# Faceit Streamlabs Widget

This project implements a circular progress bar that visually represents changes in a player's ELO rating using data from the FACEIT API. It displays an interactive circular progress bar that increases or decreases depending on whether the player wins or loses a match. The project also includes real-time updates via WebSocket.

## Features

- **Faceit Webhook Elo Tracker**: A visual representation of ELO changes with a smooth animation.
- **ELO Display**: Shows the player's current ELO and the difference (+/-) after each match.
- **Real-Time Updates**: Uses WebSockets to update the ELO rating dynamically based on match outcomes.
- **Faceit API Integration**: Fetches and tracks the ELO of a FACEIT player.
- **Sound Effects**: Plays win and loss sounds when ELO changes occur.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/-Faceit-Webhook-Elo-Tracker.git
2. **Install dependencies:**
   Navigate to the project directory and install the required Node.js packages:
   ```npm install
   npm install
3.**Set up FACEIT API:**
  - Create an account on FACEIT and get your API key.
  - Replace the FACEIT_API_KEY and PLAYER_ID in server.js with your actual FACEIT API key and the ID of the player you want to track.


  ## Usage
- Client Interface: Open the URL where the server is running. The widget will display the player's current ELO.
- Real-Time Updates: The progress bar will update in real-time based on ELO changes fetched from the FACEIT API.
- Testing: You can test the win/loss animations by sending POST requests to the /webhook endpoint with match data or manually triggering events in the WebSocket connection.

## API Integration
- The server integrates with the FACEIT API to fetch the player's ELO.
- Match results are sent via a webhook, which triggers updates to the ELO progress bar.
- Webhook Endpoint: /webhook accepts match data and calculates ELO changes.

## Technologies
- **HTML/CSS/JavaScript**: Frontend for displaying the circular progress bar and animations.
- **Node.js**: Backend server to handle WebSocket connections and fetch data from the FACEIT API.
- **WebSocket**: For real-time updates between the server and the client.
- **FACEIT API**: Used to retrieve the player's ELO and match data.
