import * as Events from "../../events";
import { FileProcessor } from "../gps/file-processor";

class GpsFileReader
    {
        mainWindow: Electron.BrowserWindow;
        currentEvent: Electron.IpcMainEvent;
        fileProcessor: FileProcessor;

        constructor(currentWindow: Electron.BrowserWindow) {
            this.mainWindow = currentWindow;
            this.fileProcessor = new FileProcessor(currentWindow); //TODO: This shouldn't be here probably
        }

        public Open = (event: Electron.IpcMainEvent) => {
            this.currentEvent = event;
            var dialog : Electron.Dialog = require('electron').dialog;
            dialog.showOpenDialog(this.mainWindow,
                {
                    title: "Open File",
                    defaultPath: "/user/sumitkm/Documents",
                    filters: [
                        { name: 'GPS Sentences file', extensions: ['csv', 'txt', 'gps'] }
                    ],
                    properties: ['openFile', 'createDirectory']
                }, this.OpenFile);
        }

        private OpenFile = (fileNames: Array<string>) => {
            if(fileNames != null && fileNames.length > 0) {
                let fs = require('fs');
                let byline = require('byline');

                var stream = fs.createReadStream(fileNames[0], { encoding: 'utf8' });
                this.fileProcessor.beginParsing(this.currentEvent);

                this.fileProcessor.beginParsing(this.currentEvent);
                stream = byline.createStream(stream);

                stream.on('data', (line) => {
                    this.fileProcessor.parseLine(this.currentEvent, line);
                });

                stream.on('end', () =>
                {
                    this.fileProcessor.endParsing(this.currentEvent);
                });
            }
        }
    }
export { GpsFileReader };
