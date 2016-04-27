import * as Events from "../../events";
import { GpsParser as GpsParser } from "node-gps-parser";
import { GpsModel as GpsModel } from "node-gps-parser";

class FileProcessor {
    mainWindow: Electron.BrowserWindow;
    currentEvent: Electron.IpcMainEvent;
    ipcMain : Electron.IpcMain = require("electron").ipcMain;
    parser: GpsParser = new GpsParser();
    gprmcDataPoints : Array<GpsModel.GprmcParseItem> = new Array<GpsModel.GprmcParseItem>();

    constructor(currentWindow: Electron.BrowserWindow) {
        this.mainWindow = currentWindow;
        //this.ipcMain.on(Events.GpsReaderEvents.Readline, this.parseLine)
    }

    parseLine = (event: Electron.IpcMainEvent, line: string) => {
        let item  = this.parser.parse(line);
        if(item != null)
        {
            if(item.dataType == "$GPRMC")
            {
                let gprmcData = <GpsModel.GprmcParseItem>item;
                if(gprmcData.gpsPoint.latitudeDegrees != 0 || gprmcData.gpsPoint.latitudeDegrees != NaN ||
                gprmcData.gpsPoint.longitudeDegrees != 0 || gprmcData.gpsPoint.longitudeDegrees != NaN)
                {
                    //console.log("["+ gprmcData.gpsPoint.gpsLat + "," + gprmcData.gpsPoint.gpsLon + "]");
                    event.sender.send(Events.GpsReaderEvents.ReadGPRMC, item);
                }
                this.gprmcDataPoints.push(gprmcData);
            }
            if(item.dataType == "$GPGGA")
            {
                event.sender.send(Events.GpsReaderEvents.ReadGPRMC, item);
            }
        }
    }

    beginParsing = (event: Electron.IpcMainEvent) => {
        event.sender.send(Events.GpsReaderEvents.BeginParsing);
    }

    endParsing = (event: Electron.IpcMainEvent) => {
        let tenPercent = (this.gprmcDataPoints.length /100) * 5;
        let startAt = parseInt(tenPercent + "");
        let endAt = this.gprmcDataPoints.length - startAt;
        let speedSum = 0;
        let averageSpeed = 0;
        let topSpeed = 0;
        for (let i = startAt; i < endAt; i++)
        {
            speedSum = speedSum + this.gprmcDataPoints[i].speed;
            if(this.gprmcDataPoints[i].speed > topSpeed)
            {
                console.log("Old topSpeed:" + topSpeed + ", New topSpeed: " + this.gprmcDataPoints[i].speed);
                topSpeed = this.gprmcDataPoints[i].speed;
            }
        }
        averageSpeed = speedSum / (endAt-startAt);

        console.log("Total points:"+ this.gprmcDataPoints.length +
            ", startAt: " + startAt +
            ", endAt: " + endAt +
            ", topSpeed: " + topSpeed +
            ", speedSum: " + speedSum +
            ", averageSpeed:" + averageSpeed);

        event.sender.send(Events.GpsReaderEvents.EndParsing, { "averageSpeed": (averageSpeed *  1.15077944802), "topSpeed": (topSpeed * 1.15077944802) } );
    }
}

export { FileProcessor };
