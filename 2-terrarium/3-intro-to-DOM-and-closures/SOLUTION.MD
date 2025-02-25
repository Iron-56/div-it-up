## Challenge

Using ondblclick event in DOM and zIndex of css, I was able to bring elements to top on double click

## Assignment

The TimeEvent in DOM are timed events which are related to timers, animations and user based actions.

### Time based events:

Example:

```javascript

setTimeout(() => {
	console.log("1 second passed");
}, 1000);

setInterval(() => {
    console.log("3 seconds passed after this was logged");
}, 2000);

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded after images");
});
```

### Animations

```javascript

function animate() {
	// draw stuff
	console.log("Runs at 60 FPS")
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

### User based events:

Example:

```javascript

document.addEventListener("dblclick", () => {
	console.log("Double clicked!");
});
```
