
const game = document.getElementById('game-area');
const keyArea = document.getElementById('key-area');
const play = document.getElementById('play');

let characters = ['a', 's', 'd', 'j', 'k'];
let blocks = [];

document.getElementById('floor-top').style.display = 'none';
document.getElementById('floor-bottom').style.display = 'none';
keyArea.style.display = 'none';

var delta = 0;
var difficulty = 1;

function exit() {
	play.style.display = '';
}

function animate() {
	
	if (Math.random() < (delta**0.8)*difficulty/10000) {
		const block = document.createElement('div');
		block.classList.add('block');
		block.lane = Math.round(Math.random()*4);
		block.style.top = '-20%';
		game.appendChild(block);
		blocks.push(block);
		block.offsetTop = 0;
		block.innerHTML = characters[block.lane];
		
		
		for (let i = 0; i < blocks.length; i++) {
            let b = blocks[i];
            if (b === block) continue;

            let bTop = parseFloat(b.style.top);

			const computedStyle = window.getComputedStyle(block);

			const width = parseFloat(computedStyle.width);
			const height = parseFloat(computedStyle.height);
			let blockTop = parseFloat(block.style.top);

            if (b.lane === block.lane && bTop < blockTop + height) {
                blockTop -= height;
                block.style.top = blockTop + "px";
                i = -1;
            }
        }

		delta = 0;
	}

	for (let i=0; i<blocks.length; i++) {
		let block = blocks[i];
		block.style.top = block.offsetTop + 3 + 'px';
		block.style.left = block.lane*block.clientWidth + game.offsetLeft + 'px';

		const computedStyle = window.getComputedStyle(block);
		const height = parseFloat(computedStyle.height);
		
		if (block.offsetTop + height> game.clientHeight) {
			exit();
			return;
		}

		if (block.offsetTop > keyArea.offsetTop && block.offsetTop < keyArea.offsetTop + keyArea.clientHeight) {
			if(keyArea.innerHTML === '') {
				continue;
			}
			if (keyArea.innerHTML === block.innerHTML) {
				keyArea.innerHTML = '';
				blocks.splice(i, 1);
				block.remove();
				i--;
			} else {
				exit();
				return;
			}
		}
	}

	delta++;
	difficulty += 0.0001;

	requestAnimationFrame(animate);
}

play.addEventListener("click", function() {
	requestAnimationFrame(animate);
	blocks.forEach(block => block.remove());
	blocks = [];
	this.style.display = 'none';
	keyArea.style.display = '';
	document.getElementById('floor-top').style.display = '';
	document.getElementById('floor-bottom').style.display = '';
	keyArea.innerHTML = '';
});

document.addEventListener('keydown', function(event) {
	if (characters.includes(event.key)) {
		keyArea.innerHTML = event.key;
	}
});

exit();