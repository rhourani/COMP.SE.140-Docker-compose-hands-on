COMP.SE.140 – Docker-compose hands on 

In this exercise we will build a simple system composed of two small services (Service1 and 
Service2) implemented in different programming languages. The services are small programs 
running in separate containers.  Both of these applications collect information from the container: - - - - 
IP address of the container 
Running processes (e.g. output of “ps -ax” on Ubuntu) 
Available disk-space in the root file systems of the container (e.g. command “df”) 
Time since last boot 
The composition of two containers (services) works as a single service, so that one service works 
as an HTTP-server (waiting in port 8199) for external clients. Only one Service1 can be accessed 
from outside, so it needs to ask information from Service2 within the composition. 
The response to the HTTP-request should be 
Service  - IP address information - list of running processes - available disk space - time since last boot 
Service2 - IP address information - list of running processes - available disk space - time since last boot 
Use plain text or JSON formatting 
