import * as Electron from "electron";
import * as Events from "./events";
import { GpsFileReader } from "./services/files/gps-file-reader";

class EventHandler
{
    currentWindow : Electron.BrowserWindow;
    ipcMain : Electron.IpcMain = require('electron').ipcMain;
    gpsFileReader: GpsFileReader;
    constructor()
    {
        console.log("event-handler initialized");
        this.ipcMain.on(Events.ApplicationMenuEvents.FileOpen, this.fileOpen);
    }

    attach = (window: Electron.BrowserWindow) =>
    {
        console.log("event-handler attached")
        this.currentWindow = window;
        this.gpsFileReader = new GpsFileReader(window);
    }

    detach = () =>
    {
        this.currentWindow = null;
        this.ipcMain = null;
    }

    fileOpen = (event: Electron.IpcMainEvent, args: any) =>
    {
        console.log("meow");
        this.gpsFileReader.Open(event);
    }
}

export { EventHandler };
