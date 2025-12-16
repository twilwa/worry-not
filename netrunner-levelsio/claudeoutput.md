-------

- Datetime: 2025-03-30 17:03:23

- Model: gemini/gemini-2.5-pro-exp-03-25

- Selected files:
  - Projects/NetrunnerTactics/server.py

>
Okay, let's reorganize the project to create a clean package for the engineering team and generate a handover document.

**Reasoning for Reorganization:**

1.  **Separation of Concerns:** Clearly separate the Godot game client (`game/`) from the Python backend server (`server/`).
2.  **Core Files Only:** Include only the files essential for running and understanding the core prototype. This means excluding:
    *   `.godot/`: Editor cache, import data (Godot will regenerate this).
    *   `.git*`, `.replit`, `.specstory`, `.vscode`, `.gutconfig.json`: Tool-specific configurations not needed for the prototype code itself.
    *   `tests/`: Unit tests are important but often excluded from initial prototype handovers unless specifically requested.
    *   `demo/`, `example*`, `freecell/`: Example scenes/projects, likely not part of the core Netrunner Tactics game.
    *   `godot_bin_old/`, `godot_old/`: Obsolete files.
    *   `install_godot.sh`: Setup script.
    *   `attached_assets/`: Temporary files.
    *   Addons not strictly required for the core game loop (this might require some judgment - I'll keep the ones that seem most relevant like card systems, AI, camera, and potentially Gaea if it's used for the map). `dialogic`, `godot_mcp`, `gut` seem less critical for an initial prototype.
3.  **Clarity:** A simplified structure makes it easier for a new team to navigate and understand the codebase.

**Proposed File Structure:**

```
prototype_package/
├── game/
│   ├── project.godot
│   ├── default_env.tres
│   ├── export_presets.cfg  # Keep for reference, though maybe not strictly needed
│   ├── assets/
│   │   └── styles/
│   │       └── cyberpunk_theme.tres
│   ├── scenes/
│   │   ├── CardDisplay.tscn
│   │   ├── DeckBuilder.tscn
│   │   ├── GameBoard.tscn
│   │   ├── HexTile.tscn
│   │   ├── Lobby.tscn
│   │   ├── Login.tscn
│   │   ├── Main.tscn
│   │   └── TerritoryMap.tscn
│   ├── scripts/
│   │   ├── Card.gd
│   │   ├── Card.gd.uid
│   │   ├── CardDatabase.gd
│   │   ├── CardDatabase.gd.uid
│   │   ├── CardDisplay.gd
│   │   ├── CardDisplay.gd.uid
│   │   ├── CorpPlayer.gd
│   │   ├── CorpPlayer.gd.uid
│   │   ├── DeckBuilder.gd
│   │   ├── DeckBuilder.gd.uid
│   │   ├── GameBoard.gd
│   │   ├── GameBoard.gd.uid
│   │   ├── GameState.gd
│   │   ├── GameState.gd.uid
│   │   ├── HexTile.gd
│   │   ├── HexTile.gd.uid
│   │   ├── HttpNetworkManager.gd
│   │   ├── HttpNetworkManager.gd.uid
│   │   ├── HttpServer.gd  # Note: This seems unused if server.py is the main server
│   │   ├── HttpServer.gd.uid
│   │   ├── Lobby.gd
│   │   ├── Lobby.gd.uid
│   │   ├── Login.gd
│   │   ├── Login.gd.uid
│   │   ├── Main.gd
│   │   ├── Main.gd.uid
│   │   ├── NetworkManager.gd # Note: This seems unused if HttpNetworkManager is used
│   │   ├── NetworkManager.gd.uid
│   │   ├── Player.gd
│   │   ├── Player.gd.uid
│   │   ├── ProgressionSystem.gd
│   │   ├── ProgressionSystem.gd.uid
│   │   ├── RunnerPlayer.gd
│   │   ├── RunnerPlayer.gd.uid
│   │   ├── Server.gd # Note: This seems unused if server.py is the main server
│   │   ├── Server.gd.uid
│   │   ├── TerritoryController.gd
│   │   ├── TerritoryController.gd.uid
│   │   ├── TerritoryMap.gd
│   │   └── TerritoryMap.gd.uid
│   ├── CardSystem/
│   │   └── Models/
│   │       ├── CardInstance.gd
│   │       ├── CardInstance.gd.uid
│   │       ├── CardResource.gd
│   │       └── CardResource.gd.uid
│   ├── WebOptimizations/
│   │   ├── AssetStreamer.gd
│   │   ├── AssetStreamer.gd.uid
│   │   ├── BrowserStorage.gd
│   │   └── BrowserStorage.gd.uid
│   └── addons/  # Only include essential addons
│       ├── card-framework/ # Seems essential
│       │   └── ... (contents of card-framework)
│       ├── cardParallax/   # Seems essential
│       │   └── ... (contents of cardParallax)
│       ├── card_3d/        # Seems essential
│       │   └── ... (contents of card_3d)
│       ├── gaea/           # Potentially essential for TerritoryMap generation
│       │   └── ... (contents of gaea)
│       ├── limboai/        # Essential if AI opponents are part of the prototype
│       │   └── ... (contents of limboai)
│       └── phantom_camera/ # Essential for camera control
│           └── ... (contents of phantom_camera)
├── server/
│   ├── server.py
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── replit.nix # Include if Replit environment setup is important
│   └── web/
│       ├── index.html
│       ├── manifest.json
│       └── service-worker.js
├── docs/
│   └── ENGINEERING_HANDOVER.md
└── README.md # Original README for context
```

**Steps to Create This Structure (Conceptual):**

1.  Create the `prototype_package` directory.
2.  Create `game`, `server`, and `docs` subdirectories inside `prototype_package`.
3.  Copy the essential files and directories identified above into the corresponding `game` and `server` directories. Be selective with the `addons` directory.
4.  Copy the main `README.md` to the root of `prototype_package`.
5.  Create the `ENGINEERING_HANDOVER.md` file in `prototype_package/docs/`.

**Supplemental Reference Document (`ENGINEERING_HANDOVER.md`):**

```tool_code
#!/bin/bash
# Create directory structure
mkdir -p prototype_package/game/assets/styles
mkdir -p prototype_package/game/scenes
mkdir -p prototype_package/game/scripts
mkdir -p prototype_package/game/CardSystem/Models
mkdir -p prototype_package/game/WebOptimizations
mkdir -p prototype_package/game/addons
mkdir -p prototype_package/server/web
mkdir -p prototype_package/docs

# Create the handover document
cat << 'EOF' > prototype_package/docs/ENGINEERING_HANDOVER.md
# Engineering Handover: Netrunner Tactics Prototype

## 1. Purpose

This package contains the core source code and assets for the Netrunner Tactics game prototype. It is intended for the engineering team to begin refactoring, further development, and prototyping based on the existing foundation.

## 2. Project Overview

*   **Concept:** A tactical card game inspired by Netrunner, featuring territory control elements.
*   **Technology:**
    *   **Frontend:** Godot Engine (v4.x assumed, check `project.godot` for exact version). GDScript is the primary language.
    *   **Backend:** Python 3 server (`server.py`) using standard libraries and `psycopg2` for PostgreSQL interaction. Serves static web files and a JSON API.
    *   **Database:** PostgreSQL (required for backend functionality).

## 3. Package Structure

```
prototype_package/
├── game/             # Godot project root
│   ├── project.godot   # Main Godot project file
│   ├── default_env.tres # Default environment settings
│   ├── export_presets.cfg # Export settings (for reference)
│   ├── assets/         # Core visual assets (styles, etc.)
│   ├── scenes/         # Core game scenes (.tscn)
│   ├── scripts/        # Core game logic (.gd)
│   ├── CardSystem/     # Specific logic for card data models
│   ├── WebOptimizations/ # Scripts related to web export/features
│   └── addons/         # Essential Godot addons (UI, AI, Camera, etc.)
├── server/           # Python backend server
│   ├── server.py       # Main server script
│   ├── pyproject.toml  # Python dependencies (for uv/pip)
│   ├── uv.lock         # Python lock file (for uv)
│   ├── replit.nix      # Replit environment config (if applicable)
│   └── web/            # Static web files served by server.py
├── docs/             # Documentation
│   └── ENGINEERING_HANDOVER.md # This file
└── README.md         # Original project README
```

## 4. Setup Instructions

### 4.1. Godot Frontend (`game/`)

1.  **Install Godot:** Ensure you have a compatible Godot 4.x version installed (check `project.godot`'s `config_version`).
2.  **Open Project:** Open the Godot editor and use the "Import" or "Scan" function to add the `prototype_package/game/` directory as a project.
3.  **Dependencies:** The required addons are included in the `game/addons/` directory. Godot should recognize them automatically.
4.  **Run:** The main scene is likely `scenes/Main.tscn` or potentially `scenes/Login.tscn`. You should be able to run the project from the Godot editor.

### 4.2. Python Backend (`server/`)

1.  **Install Python:** Ensure you have Python 3 installed (e.g., Python 3.10+).
2.  **Install `uv` (Recommended):** `uv` is a fast Python package installer and resolver. Install it via pip or other methods: `pip install uv`.
3.  **Install Dependencies:** Navigate to the `prototype_package/server/` directory in your terminal and run: `uv pip sync` (or `pip install -r requirements.txt` if you generate one from `pyproject.toml`). This installs `psycopg2` and any other dependencies.
4.  **Database Setup:**
    *   A PostgreSQL database is required.
    *   Set the `DATABASE_URL` environment variable to point to your database. Example: `export DATABASE_URL="postgresql://user:password@host:port/database"`
    *   **Schema:** The required database schema is not explicitly included here. You will need to inspect `server.py` (specifically the SQL queries) to understand the table structure (`players`, `games`, `game_players`, `territories`, `player_territories`) and create these tables in your PostgreSQL database. The `generate_territories` function in `server.py` provides some insight into the `territories` table.
5.  **Run Server:** Navigate to `prototype_package/server/` and run: `python server.py`. The server should start, typically on `http://0.0.0.0:5000`.

## 5. Key Components & Workflow

### 5.1. Godot Client (`game/`)

*   **Main Scenes:**
    *   `Login.tscn`: Handles player registration/login.
    *   `Lobby.tscn`: Shows available games, allows creating/joining.
    *   `GameBoard.tscn`: The main view during active gameplay.
    *   `TerritoryMap.tscn`: Displays the strategic map.
    *   `Main.tscn`: Likely the root scene orchestrating others.
*   **Core Scripts:**
    *   `scripts/HttpNetworkManager.gd`: Handles communication with the Python backend API.
    *   `scripts/GameState.gd`: Manages the client-side game state.
    *   `scripts/Player.gd`, `CorpPlayer.gd`, `RunnerPlayer.gd`: Player logic.
    *   `CardSystem/`: Defines card data structures (`CardResource.gd`, `CardInstance.gd`).
    *   `scripts/TerritoryMap.gd`, `scripts/HexTile.gd`: Logic for the map display and interaction.
*   **Addons:**
    *   `card-framework`, `cardParallax`, `card_3d`: Provide UI elements and logic for displaying and interacting with cards.
    *   `gaea`: Used for procedural generation (likely the territory map).
    *   `limboai`: Behavior Tree implementation for potential AI opponents. Check `demo/ai/trees` in the *original* repo for examples if needed.
    *   `phantom_camera`: Manages the game camera.

### 5.2. Python Server (`server/`)

*   **`server.py`:**
    *   Uses Python's `http.server` for basic HTTP request handling.
    *   Serves static files from the `web/` directory.
    *   Handles API requests under the `/api/` path.
    *   Connects to the PostgreSQL database using `psycopg2`.
*   **API Endpoints (Defined in `server.py`):**
    *   `POST /api/register`: Creates a new player.
    *   `GET /api/games` or `GET /api/games/list`: Retrieves a list of games.
    *   `POST /api/games/create`: Creates a new game session.
    *   `POST /api/games/join`: Adds a player to an existing game.
    *   `POST /api/games/start`: Changes a game's state to `in_progress`.
    *   `GET /api/territories`: Retrieves the list of territories.
    *   `POST /api/territories/claim`: Assigns a territory to a player.
*   **Database Interaction:** Functions like `get_player_by_id`, `get_game_by_id`, `handle_register`, etc., interact directly with the PostgreSQL database.

### 5.3. Client-Server Interaction

1.  The Godot client starts, potentially showing `Login.tscn`.
2.  User actions (login, create game, join game, claim territory) trigger calls in `HttpNetworkManager.gd`.
3.  `HttpNetworkManager.gd` sends HTTP POST or GET requests to the Python server's API endpoints.
4.  The Python server (`server.py`) receives the request, processes it (often involving database interaction), and sends back a JSON response.
5.  `HttpNetworkManager.gd` receives the JSON response and updates the client-side `GameState.gd` or triggers UI changes.
6.  Gameplay likely involves further API calls to update game state, player actions, etc. (These specific gameplay endpoints might need further implementation).

## 6. Areas for Focus / Next Steps

*   **Database Schema:** Define and document the required PostgreSQL schema clearly. Consider using a migration tool (like Alembic).
*   **Game State Synchronization:** The current model relies on discrete API calls. Evaluate if a more real-time solution (WebSockets) is needed for gameplay. The existing `NetworkManager.gd` and `Server.gd` might be remnants of a previous WebSocket attempt or alternative approach.
*   **Core Game Loop:** Implement the turn-based logic, card drawing/playing mechanics, combat resolution, and win conditions. This will involve both client-side logic (Godot) and server-side validation/state updates (Python API).
*   **Refactoring:** Review existing code for clarity, efficiency, and adherence to best practices.
*   **Error Handling:** Improve error handling on both client and server.
*   **AI Implementation:** Flesh out AI opponents using the LimboAI addon if required for the prototype.
*   **Web Build:** The `WebOptimizations` scripts and `web/` directory suggest a focus on web deployment. Test and refine the web export process.

## 7. Known Issues / Exclusions

*   **Tests:** Unit tests (`tests/`) were excluded from this package.
*   **Examples:** Demo/Example scenes (`demo/`, `example*`, etc.) were excluded.
*   **Non-Essential Addons:** Addons like `dialogic`, `gut`, `godot_mcp` were excluded as likely non-essential for the *core* game prototype. Re-evaluate if features like dialogue become necessary.
*   **Database Schema:** Assumed to be derivable from `server.py` or requires separate setup.
*   **GDScript `HttpServer.gd`/`Server.gd`/`NetworkManager.gd`:** These scripts exist in the Godot project but seem redundant given the Python backend (`server.py`) and `HttpNetworkManager.gd`. Investigate their purpose or remove if unused.

EOF

echo "Prototype package structure created and ENGINEERING_HANDOVER.md generated in prototype_package/docs/"
echo "Please manually copy the required source files and addons into the 'game' and 'server' directories."

```

**Explanation of the Script:**

1.  `mkdir -p ...`: Creates the necessary directory structure for the `prototype_package`.
2.  `cat << 'EOF' > ...`: Creates the `ENGINEERING_HANDOVER.md` file and populates it with the content between `EOF` markers.
3.  `echo ...`: Prints confirmation messages.

**To Use:**

1.  Run the bash script above in the root directory of your *original* project (`Projects/NetrunnerTactics/`). This will create the `prototype_package` structure and the handover document.
2.  **Manually copy** the specific files and directories listed in the "Proposed File Structure" section from your original project into the newly created `prototype_package/game/` and `prototype_package/server/` directories. Pay close attention to copying only the *essential* addons.
3.  You can then zip or share the `prototype_package` directory with the engineering team.

**Generation complete!** Please review the code suggestions above.
