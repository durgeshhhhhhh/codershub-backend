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

-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId

-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

## userRouter

-GET /user/connections
-GET /user/requests
-GET /user/feed - Gets the rpofile of other user on platform

Status: ignore, interested, accepted, rejected
