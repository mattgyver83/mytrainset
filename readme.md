# my train set 

This Alexa skill enables you to communicate to your local instance of JMRI using the web throttles via JSON and websocket requests.

## Prerequisites:
1.  JMRI with WiThrottle enabled and started 
2.  Access to your Web Throttle over the internet; generally port 12080

## Features
This skill provides the following features, see usage for example phrases

1.  Query the JMRI Roster or Power Status
2.  Turn on/off track power
3.  Set throttle speed (multi-address support)
4.  Set direction (multi-address support)
5.  Rewind (invert direction for duration, set throttle to 0 and reset direction)

The default behavior of the skill is to command the first car in your JMRI roster when its not been invoked to target a specific DCC address.  When a specific DCC addresses is requested the skill will lookup the car in the JMRI roster and then send the command instead to the requested address.

## Installation:

The most straight forward way to install this skill is using the Alexa Skills Kit and the ask-cli for more information on how to obtain and use that see the official amazon ask-cli documentation.

### Obtain the skill template

    ask new --url <git clone address>

### Skill preparation & configuration
Configuration requires the following steps

1.  Enable the JMRI Web server
3.  Setup a port forward in your router pointing that points to the internal address of the system running JMRI
4.  Change the jmriUrl variable in lambda/custom/index.js to point to your external IP address or DNS record (internal network address will not work)

### Deploy the skill

    cd </path/to/skill/template/root/>
    ask deploy

**Upon completion use either the Alexa website or Alexa app to enable your custom skill**

### Using this skill:
The following example phrases have been provided to illustrate how you may communicate with the skill.  Most features support multi-address context.

#### Throttle Control (single and multi-address)  
set the speed to 100 percent  
set the throttle to 100 percent  
set the throttle speed to 100 percent  
set the speed of 2121 to 100 percent  
set the throttle speed for 2121 to 100 percent  
set the throttle of 2121 to 100 percent  
set the throttle for 2121 to 100 percent  
set the throttle speed of 2121 to 100 percent  
set the speed of 2121 to 100   
set the throttle speed for 2121 to 100   
set the throttle of 2121 to 100   
set the throttle for 2121 to 100   
set the throttle speed of 2121 to 100   
set the speed of car 2121 to 100 percent  
set the speed of train 2121 to 100 percent  
set the speed of locomotive 2121 to 100 percent  
set the speed of address 2121 to 100 percent  
set the throttle speed for car 2121 to 100 percent  
set the throttle speed for train 2121 to 100 percent  
set the throttle speed for locomotive 2121 to 100 percent  
set the throttle speed for address 2121 to 100 percent  
set the throttle of car 2121 to 100 percent  
set the throttle of train 2121 to 100 percent  
set the throttle of locomotive 2121 to 100 percent  
set the throttle of address 2121 to 100 percent  
set the throttle for car 2121 to 100 percent  
set the throttle for train 2121 to 100 percent  
set the throttle for locomotive 2121 to 100 percent  
set the throttle for address 2121 to 100 percent  
set the throttle speed of address 2121 to 100 percent  
set the throttle speed of car 2121 to 100 percent  
set the throttle speed of train 2121 to 100 percent  
set the throttle speed of loco 2121 to 100 percent  
set the train speed of 1212 to fourty percent  
set the speed of car 2121 to 100   
set the speed of train 2121 to 100   
set the speed of locomotive 2121 to 100   
set the speed of address 2121 to 100   
set the throttle speed for car 2121 to 100   
set the throttle speed for train 2121 to 100   
set the throttle speed for locomotive 2121 to 100   
set the throttle speed for address 2121 to 100   
set the throttle of car 2121 to 100   
set the throttle of train 2121 to 100   
set the throttle of locomotive 2121 to 100   
set the throttle of address 2121 to 100   
set the throttle for car 2121 to 100   
set the throttle for train 2121 to 100   
set the throttle for locomotive 2121 to 100   
set the throttle for address 2121 to 100   
set the throttle speed of address 2121 to 100   
set the throttle speed of car 2121 to 100   
set the throttle speed of train 2121 to 100   
set the throttle speed of loco 2121 to 100   
set address 2121's throttle speed to 100   
set address 2121's throttle to 100   
set address 2121's speed to 100   
set address 2121's throttle speed to 100 percent  
set address 2121's throttle to 100 percent  
set address 2121's speed to 100 percent  
set 2121's speed to 100 percent  
set 2121's throttle speed to 100 percent  
set 2121's throttle to 100 percent  
  
#### Directional Control (single and multi-address)  
to move train 1212 forward  
to drive train 1212 forward  
to move forward  
to go in reverse  
move backwards  
drive forwards  
to go backwards  
to move the train forward  
to make the train go forward  
to move 2121 forward  
to have train 2121 go in reverse  
to have train 2121 drive forward  
to have train 2121 go backwards  
  
#### Rewind Control (single and multi-address)  
to rewind 10 seconds  
to rewind for 10 seconds  
to rewind 1212 for 10 seconds  
to rewind car 1212 for 10 seconds  
to rewind car 1212   
to rewind 1212   
  
#### Power Control  
turn on the train  
on the train  
turn on the layout power  
turn on the layout  
turn on the track  
turn on the power  
turn on the track power  
  
#### Power Status  
if the track power is off  
if the tracks are on  
if the power is off  
if the track is off  
if the tracks on  
for the track power status  
  
#### Roster Info  
how many trains it knows about  
how many trains there are  
how many trains are in the roster  
how many trains I have  
what trains do i have  
what does my train roster look like  
what are my train addresses  
whats in my train roster  
whats in my roster  
