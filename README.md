COMP.SE.140 – Docker-compose hands on 

Synopsis
The task is to add nginx1 gateway and Web interface in front of your previous exercise (docker compose
hands on). The gateway implements a basic authentication and load balancing.
Learning goals
The students will learn
• about load-balancing, access control and others gateway functionalities,
• hands-on about nginx and how it can be integrated to application
Task definition
Services 1 and 2 should run similarly as in the previous exercise, but
• Service 1 sleeps for 2 seconds after responding to the request. During that time the service
cannot respond to next request.
• There are three instances of Service1
Nginx is added as a new service to the docker compose and listens in port 8198. 8198 is now the only port
that is exposed outside. Nginx acts as Web server and a browser will be used for testing instead of curl.
Load-balancing functionality is added to nginx to distribute requests to all three incarnations of service1.
The default round-robin algorithm is ok.
Basic authentication is added to nginx and one user with password is initialized.
The behaviour of the system is the following:
1. When a browser enters the system (URL http://localhost:8198) a login page is given.
2. If user enters valid credentials (username + password) a new page is shown: buttons
“REQUEST”, “STOP”, and an empty text area.
In case of wrong credentials, either an error is shown or the credentials are just asked
again.
3. If the user click the REQUEST button, a request is sent to service1 (one of them as set by
the load balancer). The response is shown on the text area. The new text replaces the
possible old content in the text area.
4. When the user presses “STOP” the system closes down, all containers close down, and the
process execution “docker compose” process exits (i.e. control is returned to command
shell). Obviously, nginx also exits.
