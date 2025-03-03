## Assignment

```javascript
document.title = route.title;
```
This code in the updateRoute function sets the title of the window when template changes.
In the same function we can write code to do the necessary template specific functions.
We can also set a specific function to the route by passing the function pointer (without parenthesis) and call the function here if it exists.
```
if (route.templateId == 'dashboard') {
	console.log('Dashboard is shown');
}
```

## Challenge

Using a new template I was able to easily show the credit page.