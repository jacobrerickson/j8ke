"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Brick extends Rect {
  destroyed: boolean;
  color: string;
  points: number;
}

interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
  paddle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  bricks: Brick[];
  score: number;
  ballSpeed: number;
  lives: number;
  level: number;
  gameRunning: boolean;
  gamePaused: boolean;
  gameWon: boolean;
  gameOver: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 10;
const PADDLE_SPEED = 2;
const BALL_SPEED = 1;
const BRICK_ROWS = 8;
const BRICK_COLS = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;

export default function Arkanoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());

  const createBricks = useCallback((): Brick[] => {
    const bricks: Brick[] = [];
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"];

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          destroyed: false,
          color: colors[row % colors.length],
          points: (BRICK_ROWS - row) * 10, // Higher rows worth more points
        });
      }
    }
    return bricks;
  }, []);

  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      dx: BALL_SPEED,
      dy: -BALL_SPEED,
    },
    paddle: {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    bricks: [],
    score: 0,
    ballSpeed: BALL_SPEED,
    lives: 3,
    level: 1,
    gameRunning: false,
    gamePaused: false,
    gameWon: false,
    gameOver: false,
  });

  const resetBall = useCallback(() => {
    return {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
      dy: -BALL_SPEED,
    };
  }, []);

  const checkCollision = useCallback((rect1: Rect, rect2: Rect) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);

  const updateGame = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState.gameRunning || prevState.gamePaused || prevState.gameOver || prevState.gameWon) return prevState;

      const newState = { ...prevState };

      // Update paddle based on keys (left/right movement)
      if (keysRef.current.has("ArrowLeft") && newState.paddle.x > 0) {
        newState.paddle.x -= PADDLE_SPEED;
      }
      if (keysRef.current.has("ArrowRight") && newState.paddle.x < CANVAS_WIDTH - newState.paddle.width) {
        newState.paddle.x += PADDLE_SPEED;
      }

      // Update ball position
      newState.ball.x += newState.ball.dx;
      newState.ball.y += newState.ball.dy;

      // Ball collision with walls
      if (newState.ball.x <= 0 || newState.ball.x >= CANVAS_WIDTH - BALL_SIZE) {
        newState.ball.dx = -newState.ball.dx;
      }
      if (newState.ball.y <= 0) {
        newState.ball.dy = -newState.ball.dy;
      }

      // Ball collision with paddle
      const ballRect = { x: newState.ball.x, y: newState.ball.y, width: BALL_SIZE, height: BALL_SIZE };
      const paddleRect = {
        x: newState.paddle.x,
        y: newState.paddle.y,
        width: newState.paddle.width,
        height: newState.paddle.height
      };

      if (checkCollision(ballRect, paddleRect)) {
        newState.ball.dy = -Math.abs(newState.ball.dy); // Always bounce up
        // Add angle based on where ball hits paddle
        const hitPos = (newState.ball.x - newState.paddle.x) / newState.paddle.width;
        newState.ball.dx = (hitPos - 0.5) * newState.ballSpeed * 2;
      }

      // Ball collision with bricks
      newState.bricks.forEach((brick) => {
        if (!brick.destroyed && checkCollision(ballRect, brick)) {
          brick.destroyed = true;
          newState.score += brick.points;
          newState.ball.dy = -newState.ball.dy;
          newState.ballSpeed += 0.1;
        }
      });

      // Check if all bricks are destroyed
      const remainingBricks = newState.bricks.filter(brick => !brick.destroyed);
      if (remainingBricks.length === 0) {
        newState.gameWon = true;
        newState.gameRunning = false;
      }

      // Ball goes off bottom (lose a life)
      if (newState.ball.y > CANVAS_HEIGHT) {
        newState.lives -= 1;
        if (newState.lives <= 0) {
          newState.gameOver = true;
          newState.gameRunning = false;
        } else {
          newState.ball = resetBall();
          newState.ballSpeed = BALL_SPEED; // Reset ball speed
          newState.paddle.x = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
        }
      }

      return newState;
    });
  }, [resetBall, checkCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    gameState.bricks.forEach((brick) => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Add a slight border for better visibility
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Draw paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(gameState.paddle.x, gameState.paddle.y, gameState.paddle.width, gameState.paddle.height);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(gameState.ball.x + BALL_SIZE/2, gameState.ball.y + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw UI
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 50);
    ctx.fillText(`Level: ${gameState.level}`, 20, 70);

    // Draw instructions when not running
    if (!gameState.gameRunning && !gameState.gameOver && !gameState.gameWon) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Press START to begin", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.font = "16px Arial";
      ctx.fillText("Use ← → arrow keys to move", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }

    // Draw game over or win message
    if (gameState.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#ff6b6b";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "24px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    } else if (gameState.gameWon) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#4ecdc4";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "24px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameRunning: true,
      gameOver: false,
      gameWon: false,
      ball: resetBall(),
      bricks: createBricks(),
    }));
  };

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, gamePaused: !prev.gamePaused }));
  };

  const resetGame = () => {
    setGameState({
      ball: resetBall(),
      paddle: {
        x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
        y: CANVAS_HEIGHT - 30,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
      },
      bricks: createBricks(),
      score: 0,
      lives: 3,
      level: 1,
      ballSpeed: BALL_SPEED,
      gameRunning: false,
      gamePaused: false,
      gameWon: false,
      gameOver: false,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState.gameRunning && !gameState.gamePaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameRunning, gameState.gamePaused, gameLoop]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Initialize bricks on component mount
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      bricks: createBricks()
    }));
  }, [createBricks]);

  return (
    <div className="tw-relative tw-inline-block tw-border-2 tw-border-white tw-shadow-lg">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="tw-block"
      />

      {/* Control buttons overlay */}
      <div className="tw-absolute tw-top-4 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-gap-3 tw-z-10">
        <button
          onClick={startGame}
          disabled={gameState.gameRunning && !gameState.gameOver && !gameState.gameWon}
          className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded tw-font-semibold hover:tw-bg-green-700 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
        >
          {gameState.gameOver || gameState.gameWon ? "New Game" : "Start"}
        </button>
        <button
          onClick={pauseGame}
          disabled={gameState.gameOver || gameState.gameWon}
          className="tw-px-4 tw-py-2 tw-bg-yellow-600 tw-text-white tw-rounded tw-font-semibold hover:tw-bg-yellow-700 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
        >
          {gameState.gameRunning && !gameState.gamePaused ? "Pause" : "Resume"}
        </button>
        <button
          onClick={resetGame}
          className="tw-px-4 tw-py-2 tw-bg-red-600 tw-text-white tw-rounded tw-font-semibold hover:tw-bg-red-700 tw-text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
