@echo off
if not exist "./Code/node_modules" (
  start /wait /D "./Code" Install.bat
)
node ./Code/index.js



:: If the app is crashing enable the next line:
:: pause
:: It'll show the error and then you can create an Issue on GitHub