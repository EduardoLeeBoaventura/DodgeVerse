import React, { useState, useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  
  const gameRef = useRef({
    player: { x: 375, y: 520, width: 40, height: 40, speed: 8 },
    enemies: [],
    score: 0,
    keys: {},
    animationId: null,
    enemySpawnRate: 1000,
    enemySpeed: 3,
    lastSpawnTime: 0,
    lastScoreTime: 0
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
    game.player.x = 375;
    game.player.y = 520;
    game.enemies = [];
    game.score = 0;
    game.enemySpawnRate = 1000;
    game.enemySpeed = 3;
    game.lastSpawnTime = Date.now();
    game.lastScoreTime = Date.now();
    
    setScore(0);
    setGameState('playing');
    gameLoop();
  };

  const createEnemy = () => {
    const size = Math.random() * 30 + 20;
    return {
      x: Math.random() * (750 - size),
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

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update player position
    if (game.keys['arrowleft'] || game.keys['a']) {
      game.player.x -= game.player.speed;
    }
    if (game.keys['arrowright'] || game.keys['d']) {
      game.player.x += game.player.speed;
    }

    // Keep player in bounds
    game.player.x = Math.max(0, Math.min(canvas.width - game.player.width, game.player.x));

    // Spawn enemies
    if (now - game.lastSpawnTime > game.enemySpawnRate) {
      game.enemies.push(createEnemy());
      game.lastSpawnTime = now;
      
      // Increase difficulty over time
      if (game.enemySpawnRate > 300) {
        game.enemySpawnRate -= 20;
      }
      if (game.enemySpeed < 8) {
        game.enemySpeed += 0.1;
      }
    }

    // Update and draw enemies
    ctx.fillStyle = '#FFD700';
    for (let i = game.enemies.length - 1; i >= 0; i--) {
      const enemy = game.enemies[i];
      enemy.y += enemy.speed;

      // Draw enemy
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);a

      // Check collision
      if (checkCollision(game.player, enemy)) {
        setFinalScore(game.score);
        setGameState('gameover');
        if (game.animationId) {
          cancelAnimationFrame(game.animationId);
        }
        return;
      }

      // Remove enemies that are off screen
      if (enemy.y > canvas.height) {
        game.enemies.splice(i, 1);
      }
    }

    // Draw player
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

    // Update score every second
    if (now - game.lastScoreTime > 1000) {
      game.score += 10;
      setScore(game.score);
      game.lastScoreTime = now;
    }

    // Draw score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${game.score}`, 20, 40);

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