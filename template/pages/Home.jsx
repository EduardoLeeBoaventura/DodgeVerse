import React, { useState } from 'react';
import Button from '../components/Button';
import Game from './Game'; // importar o jogo

const Home = ({ onNavigate }) => {
  const [playingGame, setPlayingGame] = useState(false);

  const startGame = () => {
    setPlayingGame(true);
  };

  const mockScores = [
    { rank: 1, name: 'João Silva', points: 9850 },
    { rank: 2, name: 'Maria Santos', points: 8900 },
    { rank: 3, name: 'Pedro Costa', points: 7650 },
    { rank: 4, name: 'Ana Oliveira', points: 6420 },
    { rank: 5, name: 'Carlos Souza', points: 5890 },
  ];

  if (playingGame) {
    return <Game />;
  }

  return (
    <div className="page-container">
      <div className="home-container">
        <h1 className="home-title">SPACE PIXELS</h1>
        <Button className="play-button" onClick={startGame}>
          JOGAR
        </Button>

        <div className="scores-section">
          <h2 className="scores-title">TOP SCORES</h2>
          <ul className="scores-list">
            {mockScores.map(score => (
              <li key={score.rank} className="score-item">
                <span className="score-rank">#{score.rank}</span>
                <span className="score-name">{score.name}</span>
                <span className="score-points">{score.points.toLocaleString()} pts</span>
              </li>
            ))}
          </ul>
        </div>

        <Button className="logout-button" onClick={() => onNavigate('login')}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Home;
