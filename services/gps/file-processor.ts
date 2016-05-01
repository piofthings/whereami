import * as Events from "../../events";
import { GpsParser as GpsParser } from "node-gps-parser";
import { GpsModel as GpsModel } from "node-gps-parser";
var moment = require("moment");

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
                    this.gprmcDataPoints.push(gprmcData);

                }
            }
            if(item.dataType == "$GPGGA")
            {
                //event.sender.send(Events.GpsReaderEvents.ReadGPRMC, item);
            }
        }
    }

    beginParsing = (event: Electron.IpcMainEvent) => {
        event.sender.send(Events.GpsReaderEvents.BeginParsing);
    }

    endParsing = (event: Electron.IpcMainEvent) => {
        let tenPercent = (this.gprmcDataPoints.length / 100) * 5;
        let startAt = parseInt(tenPercent + "");
        let endAt = this.gprmcDataPoints.length - startAt;
        let speedSum = 0;
        let averageSpeed = 0;
        let topSpeed = 0;
        let topSpeedPoint: GpsModel.GpsPoint;
        let threshold = 1.5;
        let averageCounter = 0;
        let startTime = "";
        let startDate = "";
        let endDate = "";
        let endTime = "";
        let startDateTime = null;
        let endDateTime = null;
        for (let i = 0; i < this.gprmcDataPoints.length; i++)
        {
            let currentDataPoint = this.gprmcDataPoints[i];
            currentDataPoint.fixTime;
            if((i > startAt && i < endAt) || (this.gprmcDataPoints[i].speed > threshold))
            {
                speedSum = speedSum + this.gprmcDataPoints[i].speed;
                averageCounter++;
            }

            if(currentDataPoint.speed > topSpeed )
            {
                topSpeed = currentDataPoint.speed;
                topSpeedPoint = currentDataPoint.gpsPoint;
            }
        }

        startTime = this.gprmcDataPoints[startAt].fixTime;
        startDate = this.gprmcDataPoints[startAt].fixDate;
        endTime = this.gprmcDataPoints[endAt].fixTime;
        endDate = this.gprmcDataPoints[endAt].fixDate;

        averageSpeed = speedSum / averageCounter;

        console.log("Total points:"+ this.gprmcDataPoints.length +
            ", startAt: " + startAt +
            ", endAt: " + endAt +
            ", topSpeed: " + topSpeed +
            ", speedSum: " + speedSum +
            ", averageSpeed:" + averageSpeed +
            ", startDate:" + startDate +
            ", startTime:"+ startTime + ", " + startDate.slice(4,6) + "-" + startDate.slice(2,4) + "-" + startDate.slice(0, 2));

            startDateTime = new Date(parseInt("20"+ startDate.slice(4,6)),
                                   parseInt(startDate.slice(2,4)),
                                   parseInt(startDate.slice(0,2)),
                                   parseInt(startTime.slice(0,2)),
                                   parseInt(startTime.slice(2,4)),
                                   parseInt(startTime.slice(4,6)));
            endDateTime = new Date(parseInt("20"+ endDate.slice(4,6)),
                                   parseInt(endDate.slice(2,4)),
                                   parseInt(endDate.slice(0,2)),
                                   parseInt(endTime.slice(0,2)),
                                   parseInt(endTime.slice(2,4)),
                                   parseInt(endTime.slice(4,6)));
        console.log(startDateTime.toString());
        console.log(endDateTime.toString());
        let duration = moment(endDateTime).diff(startDateTime, 'hours', true);
        let durationString = duration + (duration > 1?" hours" : " hour");
        if(duration < 1)
        {
            duration = moment(endDateTime).diff(startDateTime, 'minutes', false);
            durationString = duration + (duration > 1 ? " minutes" : " minutes");
        }

        event.sender.send(Events.GpsReaderEvents.EndParsing, {
             "averageSpeed": (averageSpeed *  1.15077944802),
             "topSpeed": (topSpeed * 1.15077944802),
             "topSpeedPoint": topSpeedPoint,
             "startDateTime": startDateTime.toString(),
             "endDateTime" : endDateTime.toString(),
             "duration": durationString,
             "data": this.gprmcDataPoints
         });
    }
}

export { FileProcessor };
