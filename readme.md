# my train set 

This Alexa skill enables you to communicate to your local instance of JMRI using the web throttles via JSON and websocket requests.

## Prerequisites:
1.  JMRI Web Server with JSON API enabled (WiThrottle is not required by this skill) 
2.  Your JMRI Web Server must be accessible from the internet (typically port 12080)

## Features
This skill provides the following features, see usage for example phrases

1.  Query the JMRI Roster or Power Status
2.  Turn on/off track power
3.  Set throttle speed (multi-address support)
4.  Set direction (multi-address support)
5.  Rewind (invert direction for duration, set throttle to 0 and reset direction)
6.  Turnout Control by User Name (JMRI Turnout User Name can't include the word Turnout/Turn out)

The default behavior of the skill is to command the first car in your JMRI roster when its not been invoked to target a specific DCC address.  When a specific DCC addresses is requested the skill will lookup the car in the JMRI roster and then send the command instead to the requested address.

## Installation:

The most straight forward way to install this skill is using the Alexa Skills Kit and the ask-cli for more information on how to obtain and use that see the official amazon ask-cli documentation.

### Obtain the skill template

    ask new --url <git clone address.git>

### Skill preparation & configuration
Configuration requires the following steps

1.  Enable the JMRI Web server
2.  Set up port forwarding on your router to the computer running JMRI.
3.  Edit `lambda/custom/config.json` and set `jmriUrl` to your externally reachable JMRI JSON endpoint, including `/json/` (an internal-only address will not work from AWS Lambda). Prefer HTTPS with access controls; do not expose an unauthenticated JMRI endpoint directly to the public internet.

### Deploy the skill

    cd </path/to/skill/template/root/>
    cd lambda/custom
    npm install
    cd ../..
    ask deploy

**Note:** Note: This skill has been updated for modern Alexa and Node.js. Some commands may behave differently depending on your JMRI configuration.

**Upon completion use either the Alexa website or Alexa app to verify your custom skill has been enabled**

### Using this skill:
The following example phrases have been provided to illustrate how you may communicate with the skill.  Most features support multi-address context.

Start your request by saying, "Alexa, ask my train set ..."


#### Throttle Control (single and multi-address)  
set the speed to 100 percent  
set the throttle to 100 percent  
set the throttle speed to 100 percent  
set the speed of 1234 to 100 percent  
set the throttle speed for 1234 to 100 percent  
set the throttle of 1234 to 100 percent  
set the throttle for 1234 to 100 percent  
set the throttle speed of 1234 to 100 percent  
set the speed of 1234 to 100   
set the throttle speed for 1234 to 100   
set the throttle of 1234 to 100   
set the throttle for 1234 to 100   
set the throttle speed of 1234 to 100   
set the speed of car 1234 to 100 percent  
set the speed of train 1234 to 100 percent  
set the speed of locomotive 1234 to 100 percent  
set the speed of address 1234 to 100 percent  
set the throttle speed for car 1234 to 100 percent  
set the throttle speed for train 1234 to 100 percent  
set the throttle speed for locomotive 1234 to 100 percent  
set the throttle speed for address 1234 to 100 percent  
set the throttle of car 1234 to 100 percent  
set the throttle of train 1234 to 100 percent  
set the throttle of locomotive 1234 to 100 percent  
set the throttle of address 1234 to 100 percent  
set the throttle for car 1234 to 100 percent  
set the throttle for train 1234 to 100 percent  
set the throttle for locomotive 1234 to 100 percent  
set the throttle for address 1234 to 100 percent  
set the throttle speed of address 1234 to 100 percent  
set the throttle speed of car 1234 to 100 percent  
set the throttle speed of train 1234 to 100 percent  
set the throttle speed of loco 1234 to 100 percent  
set the train speed of 1234 to fourty percent  
set the speed of car 1234 to 100   
set the speed of train 1234 to 100   
set the speed of locomotive 1234 to 100   
set the speed of address 1234 to 100   
set the throttle speed for car 1234 to 100   
set the throttle speed for train 1234 to 100   
set the throttle speed for locomotive 1234 to 100   
set the throttle speed for address 1234 to 100   
set the throttle of car 1234 to 100   
set the throttle of train 1234 to 100   
set the throttle of locomotive 1234 to 100   
set the throttle of address 1234 to 100   
set the throttle for car 1234 to 100   
set the throttle for train 1234 to 100   
set the throttle for locomotive 1234 to 100   
set the throttle for address 1234 to 100   
set the throttle speed of address 1234 to 100   
set the throttle speed of car 1234 to 100   
set the throttle speed of train 1234 to 100   
set the throttle speed of loco 1234 to 100   
set address 1234's throttle speed to 100   
set address 1234's throttle to 100   
set address 1234's speed to 100   
set address 1234's throttle speed to 100 percent  
set address 1234's throttle to 100 percent  
set address 1234's speed to 100 percent  
set 1234's speed to 100 percent  
set 1234's throttle speed to 100 percent  
set 1234's throttle to 100 percent  
  
#### Directional Control (single and multi-address)  
to move train 1234 forward  
to drive train 1234 forward  
to move forward  
to go in reverse  
move backwards  
drive forwards  
to go backwards  
to move the train forward  
to make the train go forward  
to move 1234 forward  
to have train 1234 go in reverse  
to have train 1234 drive forward  
to have train 1234 go backwards  
  
#### Rewind Control (single and multi-address)  
to rewind 10 seconds  
to rewind for 10 seconds  
to rewind 1234 for 10 seconds  
to rewind car 1234 for 10 seconds  
to rewind car 1234   
to rewind 1234   
  
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

#### Turnout Control  
to close the station turn out  
to throw the station turn out  
to close the inner loop turn out  
to throw the inner loop turn out  
