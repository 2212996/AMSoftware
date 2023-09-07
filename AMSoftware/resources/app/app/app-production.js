import { BrowserWindow, app, ipcMain, dialog, globalShortcut } from 'electron';
// import loadDevtool from 'electron-load-devtool';

let win;
let workerWin = null;
let workerWin2 = null;
let forceClose = false;

function createWindow() {
  win = new BrowserWindow({ show: false });

  win.loadURL(`file://${__dirname}/../index.html`);
  // react_perfは消すこと
  // win.webContents.openDevTools();  // 開発の時は入れとくと便利

  // BrowserWindow.addDevToolsExtension(
  //   `${app.getPath('home')}/AppData/Local/Google/Chrome/User Data//Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.1.6_0`,
  // );
  // BrowserWindow.addDevToolsExtension(
  //   `${app.getPath('home')}/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.14.3_0`,
  // );
  // loadDevtool(loadDevtool.REDUX_DEVTOOLS);
  // loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    win.webContents.openDevTools();
  });
  win.maximize();

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('close', (e) => {
    const buttonIndex = dialog.showMessageBox(win, {
      defaultId: 0,
      type: 'info',
      buttons: ['キャンセル', 'OK'],
      message: '閉じてもよろしいですか？',
      noLink: true,
    });
    if (buttonIndex !== 1) {
      e.preventDefault();
    } else {
      forceClose = true;
      workerWin.close();
    }
  });
  win.on('closed', () => {
    win = null;
  });

  workerWin = new BrowserWindow({ show: false });
  workerWin.loadURL(`file://${__dirname}/../print.html`);
  workerWin.webContents.openDevTools();
  workerWin.on('close', (e) => {
    if (!forceClose) {
      e.preventDefault();
      workerWin.hide();
    }
  });
  workerWin.on('closed', () => {
    workerWin = null;
  });

  workerWin2 = new BrowserWindow({ show: false });
  workerWin2.loadURL(`file://${__dirname}/../printCopy.html`);
  workerWin2.webContents.openDevTools();
  workerWin2.on('close', (e) => {
    if (!forceClose) {
      e.preventDefault();
      workerWin2.hide();
    }
  });
  workerWin2.on('closed', () => {
    workerWin2 = null;
  });
}

ipcMain.on('showWorkerWin', () => {
  workerWin.show();
});

ipcMain.on('showWorkerWin2', () => {
  workerWin2.show();
});

ipcMain.on('printTo', (event, content, extraInfo) => {
  workerWin.webContents.send('printTo', content, extraInfo);
});

ipcMain.on('printCopyTo', (event, content, extraInfo) => {
  workerWin2.webContents.send('printCopyTo', content, extraInfo);
});

ipcMain.on('readyToPrint', () => {
  workerWin.webContents.print({ silent: false, printBackground: true, duplexMode: 'simplex' });
});

ipcMain.on('readyToPrintCopy', () => {
  workerWin2.webContents.print({ silent: false, printBackground: true, duplexMode: 'simplex' });
});

ipcMain.on('printMain', () => {
  win.webContents.print();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
