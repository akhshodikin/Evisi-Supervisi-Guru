Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Dapatkan direktori skrip ini berada
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Jalankan server secara tersembunyi (hidden window, mode 0)
WshShell.CurrentDirectory = currentDir
WshShell.Run "cmd /c """ & currentDir & "\start-server.bat""", 0, False

' Tunggu 3 detik agar Vite dev server siap
WScript.Sleep 3000

' Buka aplikasi di peramban web bawaan
WshShell.Run "http://localhost:5173"
