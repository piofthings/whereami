class ApplicationMenus {
    menuTemplate : Array<any> = []
    constructor() {
        this.menuTemplate = [
            {
                label: 'File',
                accelerator: 'Alt+F',
                submenu: [
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => this.sendMessage("File.New")
                    },
                    {
                        label: 'Open',
                        accelerator: 'CmdOrCtrl+O',
                        click: () => this.sendMessage("File.Open")
                    }]
            },
            {
                    label: 'View',
                    submenu: [
                        {
                            label: 'Settings',
                            click: () => this.sendMessage("menu.View.OnSettings")
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Connect to WordPress...',
                            click: () => this.sendMessage("menu.View.ConnectWordPress")
                        },
                        {
                            label: 'Post to Blog...',
                            click: () => this.sendMessage("menu.View.GetMySites")
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Reload',
                            accelerator: 'CmdOrCtrl+R',
                            click: function(item, focusedWindow) {
                                if (focusedWindow)
                                    focusedWindow.reload();
                            }
                        },
                        {
                            label: 'Toggle Full Screen',
                            accelerator: (function() {
                                if (process.platform == 'darwin')
                                    return 'Ctrl+Command+F';
                                else
                                    return 'F11';
                            })(),
                            click: function(item, focusedWindow) {
                                if (focusedWindow)
                                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                            }
                        },
                        {
                            label: 'Toggle Developer Tools',
                            accelerator: (function() {
                                if (process.platform == 'darwin')
                                    return 'Alt+Command+I';
                                else
                                    return 'Ctrl+Shift+I';
                            })(),
                            click: function(item, focusedWindow) {
                                if (focusedWindow)
                                    focusedWindow.toggleDevTools();
                            }
                        },
                    ]
                }];
            if (process.platform == 'darwin') {
            var name = "Electric Edit";
            this.menuTemplate.unshift({
                label: name,
                submenu: [
                    {
                        label: 'About ' + name,
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Services',
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide ' + name,
                        accelerator: 'Command+H',
                        role: 'hide'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Alt+H',
                        role: 'hideothers'
                    },
                    {
                        label: 'Show All',
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: () => this.sendMessage("menu.App.Quit")
                    },
                ]
            });
        }
    }
    private sendMessage = (messageId: string) =>
    {
        console.log("sending : " + messageId);
        if (ipcRenderer != null) {
            ipcRenderer.send(messageId);
        }
        return true;
    }
}

export { ApplicationMenus };
