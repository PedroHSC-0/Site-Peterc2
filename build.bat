@echo off
echo ========================================================
echo   PIGPENFAN - COMPILADOR DE CONTEUDO
echo ========================================================
echo.
python scripts\build.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Ocorreu uma falha na compilacao!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [SUCESSO] content/data.json, assets/js/site-data.js e assets/css/style.css atualizados com sucesso!
pause
