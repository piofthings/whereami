const electron = require('electron');

const remote : Electron.Remote = require('electron').remote;
const app : Electron.App = electron.app;
const ipcMain : Electron.IpcMain = require('electron').ipcMain;
const ipcRenderer : Electron.IpcRenderer = require('electron').ipcRenderer;
const dialog : Electron.Dialog = require('electron').dialog;
