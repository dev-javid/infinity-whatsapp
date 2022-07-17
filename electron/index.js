const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Client, MessageMedia } = require('whatsapp-web.js');

var mainWindow = null;
const client = new Client({
  //authStrategy: getAuthStrategy()
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  // mainWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  //   },
  // });

  // // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    initialize();
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


function initialize() {
  //logLineInfo('Initializing whatsapp client.');
  client.initialize();
}


client.on('authenticated',async (session) => {
 // setSession(session);
 await sendMessageAsync(9990976815,"sample msg");
});


client.on('qr', async qr => {
  mainWindow.webContents.send("qr", qr);
  console.log("qr",qr);
  //logLineInfo("Please scan the qr code using whatsapp application.");
  //    var qr= qrcode.generate(qr, { small: true });
});


async function sendMessageAsync(number, text) {
  //await sleep(3000);
  const COUNTRY_CODE ="91";
  const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
  const final_number = `${COUNTRY_CODE}${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

  const number_details = await client.getNumberId(final_number); // get mobile number details

  if (number_details) {
      await sendTextAsync(number_details, text, number);
  }
  else {
      logLineError(`Error sending message to ${number}`, "Mobile number is not registered.");
      saveStatus(false, number, null, null, null, "Mobile number is not registered.");
  }
}


async function sendTextAsync(number_details, text, number) {
  try {
      const sendMessageData = await client.sendMessage(number_details._serialized, text); // send message
  } catch (error) {
  }
}
