# Map my trips

A simple Cross-platform desktop app to convert GPS sentences to a plot on the map using MapBox.js  

Built using TypeScript, Electron and MapBox  

 Some statistics drawn from GPS data are
 - Top Speed
 - Average Speed
 - Start time
 - End time
 - Duration

Currently takes CSV input. Use node-gps to capture data and pipe it to a CSV file.

## Pre-requisites

```npm install electron-prebuilt -g```  
Installs the Electorn runtime

```npm install tsc -g```  
Installs TypeScript compiler if you didn't have it already

## Dependencies  
(Dependencies are auto installed using the ```restore``` script)   
[node-gps](https://github.com/sumitkm/node-gps)  
[node-gps-parser](https://github.com/sumitkm/node-gps-parser)

## Installation

```git clone https://githu.com/piofthings/whereami```  
```chmod +x ./restore ```  
```chmod +x ./build ```  
```chmod +x ./run ```
```./restore ````


### TODO  

* Hook into actual GPS device using node-gps
* Create a diary of trips
* Add more data/analysis points like stops on the way, speed graph etc.
* Improve performance on a Raspberry Pi 3
