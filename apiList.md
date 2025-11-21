#codersHub api's

## Auth

-POST /signup
-POST /login
-POST /logout
-post /forget password

## profileRouter

-GET /profile/view
-patch /profile/edit
-patch /profile/password

## ConnectionRequestRouter

-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId

## userRouter

-GET /user/requests/recieved
-GET /user/connections
-GET /user/feed - Gets the rpofile of other user on platform

Status: ignore, interested, accepted, rejected
