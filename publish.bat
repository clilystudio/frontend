@ECHO OFF
CLS

ECHO --------------------------------------------------------------------------
ECHO -- WistLotto FrontEnd to BackEnd                                       ---
ECHO --------------------------------------------------------------------------

ECHO.
ECHO Control...
ECHO --------------------------------------------------------------------------
SET app=control
cmd /c .\build.bat %app%
COPY .\dist\%app%\styles.css ..\backend\src\main\resources\static\%app%\css\styles.min.css
COPY .\dist\%app%\main.js ..\backend\src\main\resources\static\%app%\js\main.min.js
COPY .\dist\%app%\runtime.js ..\backend\src\main\resources\static\%app%\js\runtime.min.js

ECHO.
ECHO Lotto...
ECHO --------------------------------------------------------------------------
SET app=lotto
cmd /c .\build.bat %app%
COPY .\dist\%app%\styles.css ..\backend\src\main\resources\static\%app%\css\styles.min.css
COPY .\dist\%app%\main.js ..\backend\src\main\resources\static\%app%\js\main.min.js
COPY .\dist\%app%\runtime.js ..\backend\src\main\resources\static\%app%\js\runtime.min.js

ECHO.
ECHO Manage...
ECHO --------------------------------------------------------------------------
SET app=manage
cmd /c .\build.bat %app%
COPY .\dist\%app%\styles.css ..\backend\src\main\resources\static\%app%\css\styles.min.css
COPY .\dist\%app%\main.js ..\backend\src\main\resources\static\%app%\js\main.min.js
COPY .\dist\%app%\runtime.js ..\backend\src\main\resources\static\%app%\js\runtime.min.js

ECHO.
ECHO Publish Finish!
ECHO ==========================================================================

git archive -o ..\frontend.zip HEAD
