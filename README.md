# Intro
This is a small project I was developing for keeing track of my raspberry system resources utilization, such as CPU, RAM and Disk usage.

The project runs on a nodeJS instance and spawn 3 separate service workers for collecting data from raspberry.
It can be run using PM2 or by simply starting it as a node executable.

It currently uses [blynk](https://blynk.io/) IoT platform for storing the data and displaying them through a set of widget on my smartphone. I'm planning to use my own custom IoT platform currently under development [here](https://github.com/users/Udeste/projects/5)