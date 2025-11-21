import React, { useState, useEffect } from 'react';
import * as api from './api';

const styles = `
  :root {
    --primary-color: #000000;
    --secondary-color: #FFD700;
    --text-color: #FFFFFF;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: var(--primary-color);
    color: var(--text-color);
    overflow-x: hidden;
  }

  .app-container {
    position: relative;
    min-height: 100vh;
    width: 100%;
  }

  .background-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .pixel {
    position: absolute;
    background-color: var(--secondary-color);
    animation: pixelAnimation 3s ease-out forwards;
  }

  @keyframes pixelAnimation {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: scale(20);
      opacity: 0;
    }
  }

  .page-container {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .auth-card {
    background-color: rgba(255, 255, 255, 0.05);
    border: 2px solid var(--secondary-color);
    border-radius: 10px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(10px);
  }

  .auth-card h1 {
    color: var(--secondary-color);
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-color);
    font-size: 0.9rem;
  }

  .form-group input {
    width: 100%;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 5px;
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--secondary-color);
    background-color: rgba(255, 255, 255, 0.15);
  }

  .button {
    width: 100%;
    padding: 14px;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
  }

  .button:hover {
    background-color: #FFC700;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  }

  .button:active {
    transform: translateY(0);
  }

  .link-text {
    text-align: center;
    margin-top: 20px;
    color: var(--text-color);
    font-size: 0.9rem;
  }

  .link-text a {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: bold;
  }

  .link-text a:hover {
    text-decoration: underline;
  }

  .home-container {
    text-align: center;
    width: 100%;
    max-width: 800px;
  }

  .home-title {
    color: var(--secondary-color);
    font-size: 3rem;
    margin-bottom: 40px;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  .play-button {
    padding: 20px 60px;
    font-size: 1.5rem;
    margin-bottom: 60px;
  }

  .scores-section {
    background-color: rgba(255, 255, 255, 0.05);
    border: 2px solid var(--secondary-color);
    border-radius: 10px;
    padding: 30px;
    backdrop-filter: blur(10px);
  }

  .scores-title {
    color: var(--secondary-color);
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .scores-list {
    list-style: none;
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid var(--secondary-color);
    border-radius: 5px;
  }

  .score-rank {
    color: var(--secondary-color);
    font-weight: bold;
    font-size: 1.2rem;
  }

  .score-name {
    flex: 1;
    text-align: left;
    margin-left: 20px;
  }

  .score-points {
    color: var(--secondary-color);
    font-weight: bold;
  }

  .logout-button {
    margin-top: 30px;
    background-color: transparent;
    border: 2px solid var(--secondary-color);
    color: var(--secondary-color);
  }

  .logout-button:hover {
    background-color: var(--secondary-color);
    color: var(--primary-color);
  }
`;

// Background
const BackgroundAnimation = () => {
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const createPixel = () => {
      const id = Date.now() + Math.random();
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      return { id, size, left, top };
    };

    const interval = setInterval(() => {
      setPixels(prev => {
        const newPixel = createPixel();
        const updated = [...prev, newPixel];
        return updated.slice(-30);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    pixels.forEach(pixel => {
      const timer = setTimeout(() => {
        setPixels(prev => prev.filter(p => p.id !== pixel.id));
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [pixels]);

  return (
    <div className="background-animation">
      {pixels.map(pixel => (
        <div
          key={pixel.id}
          className="pixel"
          style={{
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            left: `${pixel.left}%`,
            top: `${pixel.top}%`,
          }}
        />
      ))}
    </div>
  );
};

// Button
const Button = ({ children, onClick, className = '' }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Login
const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await api.checkSession();
        if (session.loggedIn) {
          onNavigate('home');
        } else {
          api.logout();
          onNavigate('login');
        }
      } catch (err) {
        console.error('Erro ao verificar session:', err);
      }
    };
    verifySession();
  }, [onNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login(email, password);

      if (response.success) {
        onNavigate('home'); // login bem-sucedido
      } else {
        if(response.message = 'Jogador ja logado') onNavigate('home');
        return 1;
        alert(response.message || 'Email ou senha incorretos!');
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="link-text">
          Não tem uma conta?{' '}
          <a href="#" onClick={() => onNavigate('register')}>
            Registre-se
          </a>
        </p>
      </div>
    </div>
  );
};

// Register page
const Register = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Register:', { name, email, password });
    onNavigate('home');
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>REGISTRO</h1>
        <div>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit}>Registrar</Button>
        </div>
        <p className="link-text">
          Já tem uma conta? <a href="#" onClick={() => onNavigate('login')}>Faça login</a>
        </p>
      </div>
    </div>
  );
};

// ========== GAME PAGE WITH EMBEDDED GAME ==========
const GAME_CONFIG = {
  PLAYER_SPEED: 8,
  PLAYER_SIZE: 40,
  ENEMY_INITIAL_SPEED: 3,
  ENEMY_MIN_SIZE: 20,
  ENEMY_MAX_SIZE: 50,
  ENEMY_INITIAL_SPAWN_RATE: 1000,
  ENEMY_MIN_SPAWN_RATE: 300,
  ENEMY_MAX_SPEED: 12,
  SPAWN_RATE_DECREASE_PER_SPAWN: 20,
  SPEED_INCREASE_PER_SPAWN: 0.15,
  POINTS_PER_SECOND: 150,
  IDLE_TIME_THRESHOLD: 1,
  IDLE_PENALTY_PER_SECOND: 280,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600
};

const GamePage = ({ onBackToHome }) => {
  const canvasRef = React.useRef(null);
  const [gameState, setGameState] = React.useState('menu');
  const [score, setScore] = React.useState(0);
  const [finalScore, setFinalScore] = React.useState(0);
  
  const gameRef = React.useRef({
    player: { 
      x: GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE / 2, 
      y: GAME_CONFIG.CANVAS_HEIGHT - 80, 
      width: GAME_CONFIG.PLAYER_SIZE, 
      height: GAME_CONFIG.PLAYER_SIZE, 
      speed: GAME_CONFIG.PLAYER_SPEED,
      prevX: GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE / 2
    },
    enemies: [],
    score: 0,
    keys: {},
    animationId: null,
    enemySpawnRate: GAME_CONFIG.ENEMY_INITIAL_SPAWN_RATE,
    enemySpeed: GAME_CONFIG.ENEMY_INITIAL_SPEED,
    lastSpawnTime: 0,
    lastScoreTime: 0,
    lastMoveTime: 0,
    idleTime: 0,
    isMoving: false
  });

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key.toLowerCase()] = true;
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, []);

  const startGame = () => {
    const game = gameRef.current;
    const startX = GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE / 2;
    game.player.x = startX;
    game.player.prevX = startX;
    game.player.y = GAME_CONFIG.CANVAS_HEIGHT - 80;
    game.enemies = [];
    game.score = 0;
    game.enemySpawnRate = GAME_CONFIG.ENEMY_INITIAL_SPAWN_RATE;
    game.enemySpeed = GAME_CONFIG.ENEMY_INITIAL_SPEED;
    game.lastSpawnTime = Date.now();
    game.lastScoreTime = Date.now();
    game.lastMoveTime = Date.now();
    game.idleTime = 0;
    game.isMoving = false;
    
    setScore(0);
    setGameState('playing');
    gameLoop();
  };

  const createEnemy = () => {
    const size = Math.random() * (GAME_CONFIG.ENEMY_MAX_SIZE - GAME_CONFIG.ENEMY_MIN_SIZE) + GAME_CONFIG.ENEMY_MIN_SIZE;
    return {
      x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - size),
      y: -size,
      width: size,
      height: size,
      speed: gameRef.current.enemySpeed
    };
  };

  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    const now = Date.now();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const prevX = game.player.x;

    if (game.keys['arrowleft'] || game.keys['a']) {
      game.player.x -= game.player.speed;
    }
    if (game.keys['arrowright'] || game.keys['d']) {
      game.player.x += game.player.speed;
    }

    game.player.x = Math.max(0, Math.min(canvas.width - game.player.width, game.player.x));

    const actuallyMoved = prevX !== game.player.x;

    if (actuallyMoved) {
      game.lastMoveTime = now;
      game.idleTime = 0;
      game.isMoving = true;
    } else {
      game.idleTime = (now - game.lastMoveTime) / 1000;
      game.isMoving = false;
    }

    if (now - game.lastSpawnTime > game.enemySpawnRate) {
      game.enemies.push(createEnemy());
      game.lastSpawnTime = now;
      
      if (game.enemySpawnRate > GAME_CONFIG.ENEMY_MIN_SPAWN_RATE) {
        game.enemySpawnRate -= GAME_CONFIG.SPAWN_RATE_DECREASE_PER_SPAWN;
      }
      if (game.enemySpeed < GAME_CONFIG.ENEMY_MAX_SPEED) {
        game.enemySpeed += GAME_CONFIG.SPEED_INCREASE_PER_SPAWN;
      }
    }

    ctx.fillStyle = '#FFD700';
    for (let i = game.enemies.length - 1; i >= 0; i--) {
      const enemy = game.enemies[i];
      enemy.y += enemy.speed;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      if (checkCollision(game.player, enemy)) {
        setFinalScore(game.score);
        setGameState('gameover');
        if (game.animationId) {
          cancelAnimationFrame(game.animationId);
        }
        return;
      }

      if (enemy.y > canvas.height) {
        game.enemies.splice(i, 1);
      }
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

    if (now - game.lastScoreTime > 1000) {
      game.score += GAME_CONFIG.POINTS_PER_SECOND;
      
      if (game.idleTime > GAME_CONFIG.IDLE_TIME_THRESHOLD) {
        game.score = Math.max(0, game.score - GAME_CONFIG.IDLE_PENALTY_PER_SECOND);
      }
      
      setScore(game.score);
      game.lastScoreTime = now;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${game.score}`, 20, 40);

    if (game.idleTime > 0) {
      const timeLeft = Math.max(0, GAME_CONFIG.IDLE_TIME_THRESHOLD - game.idleTime);
      const warningColor = game.idleTime > GAME_CONFIG.IDLE_TIME_THRESHOLD ? '#FF4444' : '#FFD700';
      
      ctx.fillStyle = warningColor;
      ctx.font = 'bold 20px Arial';
      
      if (game.idleTime <= GAME_CONFIG.IDLE_TIME_THRESHOLD) {
        ctx.fillText(`Mova-se! ${timeLeft.toFixed(1)}s`, canvas.width - 180, 40);
      } else {
        ctx.fillText(`PENALIDADE! -${GAME_CONFIG.IDLE_PENALTY_PER_SECOND}pt/s`, canvas.width - 220, 40);
      }
    }

    game.animationId = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="page-container">
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <button 
          style={{
            backgroundColor: 'transparent',
            color: '#FFD700',
            border: '2px solid #FFD700',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onClick={onBackToHome}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FFD700';
            e.target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#FFD700';
          }}
        >
          ← Voltar ao Ranking
        </button>
        
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          style={{
            border: '3px solid #FFD700',
            borderRadius: '10px',
            backgroundColor: '#000000',
            display: 'block',
          }}
        />
        
        {gameState === 'menu' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            minWidth: '300px',
          }}>
            <h2 style={{ color: '#FFD700', fontSize: '2.5rem', marginBottom: '20px' }}>DODGE GAME</h2>
            <p style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '10px' }}>Use A/D ou ← → para mover</p>
            <p style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '10px' }}>Desvie dos meteoros!</p>
            <Button onClick={startGame}>INICIAR</Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            minWidth: '300px',
          }}>
            <h2 style={{ color: '#FF4444', fontSize: '2.5rem', marginBottom: '20px' }}>GAME OVER</h2>
            <p style={{ color: '#FFD700', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px' }}>
              Score Final: {finalScore}
            </p>
            <Button onClick={startGame}>JOGAR NOVAMENTE</Button>
            <button 
              className="button"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #FFD700',
                color: '#FFD700',
                marginTop: '15px',
              }}
              onClick={onBackToHome}
            >
              Ver Ranking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== HOME PAGE ==========
const Home = ({ onNavigate, onStartGame }) => {
  const mockScores = [
    { rank: 1, name: 'João Silva', points: 9850 },
    { rank: 2, name: 'Maria Santos', points: 8900 },
    { rank: 3, name: 'Pedro Costa', points: 7650 },
    { rank: 4, name: 'Ana Oliveira', points: 6420 },
    { rank: 5, name: 'Carlos Souza', points: 5890 },
  ];

  return (
    <div className="page-container">
      <div className="home-container">
        <h1 className="home-title">SPACE PIXELS</h1>
        <Button className="play-button" onClick={onStartGame}>
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

        <Button
          className="logout-button"
          onClick={async () => {
            try {
              await api.logout();
              onNavigate('login'); // vai para a tela de login
            } catch (err) {
              console.error('Erro ao deslogar:', err);
              alert('Não foi possível sair, tente novamente.');
            }
          }}
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

// Main app
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <BackgroundAnimation />
        {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
        {currentPage === 'register' && <Register onNavigate={handleNavigate} />}
        {currentPage === 'home' && <Home onNavigate={handleNavigate} onStartGame={handleStartGame} />}
        {currentPage === 'game' && <GamePage onBackToHome={handleBackToHome} />}
      </div>
    </>
  );
};

export default App;
