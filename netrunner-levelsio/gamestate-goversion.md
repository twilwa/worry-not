```mermaid
flowchart TD
    %% Game States
    Start[Game Start]
    PlayerTurn[Player Turn]
    Evaluation[Position Evaluation]
    GameOver[Game Over]
    
    %% Game Actions
    subgraph Actions
        SelectCard[Select Card]
        SelectPosition[Select Position]
        ApplyMove[Apply Move to Board]
        CheckCapture[Check for Captures\nRPS Rules]
        UpdateState[Update Game State]
    end
    
    %% AI Decision Process
    subgraph AI Decision
        RunMCTS[Run MCTS]
        GetBoardState[Get Board State]
        PolicyPrediction[Policy Network\nPredicts Move Probabilities]
        ValuePrediction[Value Network\nEvaluates Position]
        SelectBestMove[Select Best Move]
        UCBFormula[UCB Formula\nExploration vs Exploitation]
    end
    
    %% MCTS Simulation
    subgraph MCTS Process
        Selection[Selection\nTraverse to Leaf Node]
        Expansion[Expansion\nAdd New Children]
        Simulation[Simulation\nValue Network Evaluation]
        Backpropagation[Backpropagation\nUpdate Statistics]
    end
    
    %% Data Types
    subgraph Data Structures
        BoardState[Board State]
        CardTypes[Card Types\nRock, Paper, Scissors]
        MoveHistory[Move History]
        PlayerHand[Player Hand]
        TrainingExamples[Training Examples]
    end
    
    %% Model Comparison
    subgraph Model Evaluation
        Tournament[Tournament Play]
        WinStatistics[Win Statistics]
        PerformanceMetrics[Performance Metrics]
    end
    
    %% Main Flow
    Start --> PlayerTurn
    PlayerTurn --> Actions
    Actions --> Evaluation
    Evaluation --> |Game Not Over| PlayerTurn
    Evaluation --> |Game Over| GameOver
    
    %% Action Details
    SelectCard --> SelectPosition
    SelectPosition --> ApplyMove
    ApplyMove --> CheckCapture
    CheckCapture --> UpdateState
    
    %% AI Integration
    PlayerTurn --> |AI Turn| AI Decision
    AI Decision --> SelectCard
    MCTS Process --> AI Decision
    
    %% MCTS Flow
    RunMCTS --> Selection
    Selection --> Expansion
    Expansion --> Simulation
    Simulation --> Backpropagation
    Backpropagation --> |Continue Simulations| Selection
    UCBFormula --> Selection
    
    %% Data Usage
    BoardState --> GetBoardState
    GetBoardState --> RunMCTS
    RunMCTS --> PolicyPrediction
    RunMCTS --> ValuePrediction
    PolicyPrediction --> SelectBestMove
    ValuePrediction --> SelectBestMove
    SelectBestMove --> SelectCard
    
    %% Data Updates
    UpdateState --> BoardState
    UpdateState --> MoveHistory
    UpdateState --> PlayerHand
    CardTypes --> CheckCapture
    
    %% Learning Flow
    GameOver --> TrainingExamples
    TrainingExamples --> |Update Networks| PolicyPrediction
    TrainingExamples --> |Update Networks| ValuePrediction
    
    %% Model Evaluation
    GameOver --> Tournament
    Tournament --> WinStatistics
    WinStatistics --> PerformanceMetrics
```

![[Pasted image 20250325165600.png]]