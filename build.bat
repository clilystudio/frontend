@ECHO OFF

:: BUILD
SET app=%1
ng build %app% --prod
