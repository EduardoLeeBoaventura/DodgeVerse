import React, { useState, useEffect, useRef } from 'react';

const GAME_CONFIG = {
  // Player
  PLAYER_SPEED: 8,
  PLAYER_SIZE: 40,
  
  // Enemies
  ENEMY_INITIAL_SPEED: 3,
  ENEMY_MIN_SIZE: 20,
  ENEMY_MAX_SIZE: 50,
  ENEMY_INITIAL_SPAWN_RATE: 1000, // milliseconds
  ENEMY_MIN_SPAWN_RATE: 200, // fastest spawn rate
  ENEMY_MAX_SPEED: 10,
  
  // Difficulty progression
  SPAWN_RATE_DECREASE_PER_SPAWN: 20, // ms faster each spawn
  SPEED_INCREASE_PER_SPAWN: 0.15, // speed increase each spawn
  
  // Score
  POINTS_PER_SECOND: 150,
  
  // Idle penalty
  IDLE_TIME_THRESHOLD: 1, // seconds before penalty
  IDLE_PENALTY_PER_SECOND: 250, // points lost per second when idle
  
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600
};

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  
  const gameRef = useRef({
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      game.idleTime = (now - game.lastMoveTime) / 1000; // Convert to seconds
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
        ctx.fillText(`PENALIDADE! -130pt/s`, canvas.width - 220, 40);
      }
    }

    game.animationId = requestAnimationFrame(gameLoop);
  };

  return (
    <div style={styles.container}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
      
      {gameState === 'menu' && (
        <div style={styles.overlay}>
          <h2 style={styles.title}>DODGE GAME</h2>
          <p style={styles.instructions}>Use A/D ou ← → para mover</p>
          <p style={styles.instructions}>Desvie dos meteoros!</p>
          <button style={styles.button} onClick={startGame}>
            INICIAR
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={styles.overlay}>
          <h2 style={styles.gameOverTitle}>GAME OVER</h2>
          <p style={styles.finalScore}>Score Final: {finalScore}</p>
          <button style={styles.button} onClick={startGame}>
            JOGAR NOVAMENTE
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  canvas: {
    border: '3px solid #FFD700',
    borderRadius: '10px',
    backgroundColor: '#000000',
    display: 'block',
  },
  overlay: {
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
  },
  title: {
    color: '#FFD700',
    fontSize: '2.5rem',
    marginBottom: '20px',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  },
  gameOverTitle: {
    color: '#FF4444',
    fontSize: '2.5rem',
    marginBottom: '20px',
    textShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  finalScore: {
    color: '#FFD700',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#FFD700',
    color: '#000000',
    border: 'none',
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    transition: 'all 0.3s',
    marginTop: '20px',
  },
};

export default Game;