const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    zoom: 2,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    antialiasGL: false,
    backgroundColor: '#0a0a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    }
};

let player;
let ground;
let cursors;
let jumpTimer = 0;
const JUMP_DELAY = 150;

function preload() {
    // No external assets, we'll generate pixel art rectangles
    this.load.image('player', generatePixelRect(16, 16, '#e74c3c'));
    this.load.image('ground', generatePixelRect(800, 24, '#2ecc71'));
}

function generatePixelRect(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    // Add pixel edges (dark border)
    ctx.fillStyle = '#000000';
    for (let i = 0; i < width; i += 2) {
        ctx.fillRect(i, 0, 1, 1);
        ctx.fillRect(i, height - 1, 1, 1);
    }
    for (let i = 0; i < height; i += 2) {
        ctx.fillRect(0, i, 1, 1);
        ctx.fillRect(width - 1, i, 1, 1);
    }
    return canvas.toDataURL();
}

function create() {
    // Enable pixel art rendering globally
    this.game.renderer.setPixelArt(true);
    
    // Ground
    ground = this.physics.add.staticImage(400, 440, 'ground');
    ground.setScale(1);
    ground.refreshBody();
    
    // Player (pixel rectangle)
    player = this.physics.add.sprite(100, 400, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);
    player.setGravityY(600);
    player.body.setSize(14, 14);
    player.body.setOffset(1, 1);
    
    // Camera follow
    this.cameras.main.setZoom(2);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
    
    // Collision
    this.physics.add.collider(player, ground);
    
    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    // Add pixel art floor details
    for (let i = 0; i < 20; i++) {
        const detail = this.add.rectangle(i * 40, 430, 4, 4, 0x27ae60);
        detail.setOrigin(0.5);
        detail.setDepth(1);
    }
}

function update(time) {
    // Movement (left/right with pixel perfect speed)
    if (cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('A'), 1)) {
        player.setVelocityX(-180);
        player.setFlipX(true);
    } else if (cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('D'), 1)) {
        player.setVelocityX(180);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }
    
    // Jump (with cooldown)
    const isGrounded = player.body.touching.down || player.body.blocked.down;
    const jumpKey = cursors.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('W'), 1);
    
    if (jumpKey && isGrounded && time > jumpTimer) {
        player.setVelocityY(-350);
        jumpTimer = time + JUMP_DELAY;
    }
    
    // Camera pixel-perfect rounding
    this.cameras.main.setRoundPixels(true);
}
render: {
  pixelArt: true,
  antialias: false
}
this.cameras.main.setZoom(2);
