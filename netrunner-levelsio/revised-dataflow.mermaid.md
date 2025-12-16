graph TD
    %% Main Components
    Game[Game Logic\npkg/game]
    MCTS[Monte Carlo Tree Search\npkg/mcts]
    NN[Neural Networks\npkg/neural]
    Training[Self-Play Training\npkg/training]
    
    %% Game Variants
    subgraph Games
        TicTacToe[TicTacToe Game]
        RPSCard[RPS Card Game]
        BalancedRPS[Balanced RPS Game]
    end
    
    %% Neural Network Components
    subgraph Neural Networks
        PolicyNet[Policy Network\nMove Probabilities]
        ValueNet[Value Network\nWin Probability]
        NetworkStats[Network Statistics\nPerformance Tracking]
    end
    
    %% Training Components
    subgraph Training Process
        SelfPlay[Self-Play]
        Examples[Training Examples]
        Learning[Network Training]
        ModelComparison[Model Comparison]
    end
    
    %% Command Modules
    subgraph Commands
        TicTacToeCmd[cmd/tictactoe]
        RPSCardCmd[cmd/rps_card]
        BalancedRPSCmd[cmd/balanced_rps_card]
        PlayVsAI[cmd/play_vs_ai]
        TrainModels[cmd/train_models]
        CompareModels[cmd/compare_models]
        DebugAIGame[cmd/debug_ai_game]
        TestWinnerLogic[cmd/test_winner_logic]
    end
    
    %% Analysis Tools
    subgraph Analysis
        AnalyzeRPSGames[scripts/analyze_rps_games.py]
        QuickRPSDemo[scripts/quick_rps_demo.py]
    end
    
    %% Main Data Flows
    Game --> MCTS
    NN --> MCTS
    MCTS --> Training
    Training --> NN
    
    %% Game Specifics
    Game --- Games
    
    %% Neural Network Details
    NN --- Neural Networks
    
    %% Training Details
    Training --- Training Process
    
    %% Command Connections
    Commands --> Game
    Commands --> MCTS
    Commands --> NN
    Commands --> Training
    
    %% Game State Flow
    Games -->|State Representation| PolicyNet
    Games -->|State Representation| ValueNet
    
    %% Neural Network Outputs
    PolicyNet -->|Action Probabilities| MCTS
    ValueNet -->|Position Evaluation| MCTS
    NetworkStats -->|Performance Metrics| ModelComparison
    
    %% MCTS Flow
    MCTS -->|Improved Policy| SelfPlay
    
    %% Training Flow
    SelfPlay -->|Game States + Outcomes| Examples
    Examples -->|Training Data| Learning
    Learning -->|Updated Weights| PolicyNet
    Learning -->|Updated Weights| ValueNet
    
    %% Model Comparison Flow
    PolicyNet --> ModelComparison
    ValueNet --> ModelComparison
    ModelComparison -->|Performance Results| NetworkStats
    
    %% Output Data
    Output[Trained Models\noutput/]
    NN -->|Save Models| Output
    Commands -->|Load Models| Output
    
    %% Analysis Tools Connections
    Analysis -->|Process Game Data| Output
    Analysis -->|Visualize Results| ModelComparison