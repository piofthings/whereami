import * as Electron from "electron";
import {EventHandler} from "./event-handler";

export class app
{
    electron = require('electron');
    currentApp = Electron.app;  // Module to control application life.
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    mainWindow : Electron.BrowserWindow = null;
    eventHandler : EventHandler = new EventHandler();

	constructor()
    {
        this.currentApp.on('ready', this.initApp);
	}

    private initApp = () =>
    {
        // Create the browser window.
        this.mainWindow = new Electron.BrowserWindow({ width: 1024, height: 768 });
        this.eventHandler.attach(this.mainWindow);
        // and load the index.html of the app.
        this.mainWindow.loadURL('file://' + __dirname + '/ui/index.html');


        // Open the DevTools.
        //mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        this.mainWindow.on('closed', () => {
            this.quitApp();
        });
    }

    private quitApp = () =>
    {
        // Dereference the window object, usually you would store windows
         // in an array if your app supports multi windows, this is the time
         // when you should delete the corresponding element.
         //if (process.platform != 'darwin') {
         if (this.mainWindow != null) {
             this.mainWindow = null;
         }
         //}
         //TODO: this is a bodge. Mac Apps don't quit when you close the window.
         // but until we can figure out how to handle ipc without any renderer
         // we'll have to keep quitting when the window is closed.
         // Not an issue in sane OSes like Linux ;)
         this.currentApp.quit();
    }
}

var appInstance = new app();
