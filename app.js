const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;

//Listen to the app to be ready...
app.on("ready", () => {
  //Create new Window
  mainWindow = new BrowserWindow({});

  //Load HTML file into Window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.on("closed", () => app.quit());

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//Create Add Window

createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Add Item"
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "add.html"),
      protocol: "file:",
      slashes: true
    })
  );

  //Garbage Collection
  addWindow.on("close", () => {
    addWindow = null;
  });
};

//Listen to item__add
ipcMain.on("item__add", (e, item) => {
  console.log(item);
  mainWindow.webContents.send("item__add", item);
  addWindow.close();
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click: () => createAddWindow()
      },
      {
        label: "Clear Items",
        click: () => {
          mainWindow.webContents.send("items__clear");
        }
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q"
      }
    ]
  }
];

//If MacOS, push an empty array to Menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}
