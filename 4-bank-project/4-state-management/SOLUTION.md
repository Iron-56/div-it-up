## Assignment

Using a new transaction template, I was able to make entry for new transactions. Then I used the helper function to forward the form to /api/accounts/"user"/transactions. After that i navigated to the dashboard for the results.

## Challenge

I removed storing all the attributes other than username because for login we only needed username. I also fixed an bug where if we reload the page when the state.account is null but account exist in local storage, then the user will get logged out.