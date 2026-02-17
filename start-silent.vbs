' ZGC Case Management - Silent Startup Script
' This VBScript runs the start-services.bat silently at Windows startup

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the path to the batch file (same directory as this script)
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
batchFile = scriptPath & "\start-services.bat"

' Check if batch file exists
If fso.FileExists(batchFile) Then
    ' Run the batch file hidden and wait for completion
    WshShell.Run """" & batchFile & """"", 0, False
Else
    ' Log error if file not found
    WshShell.LogEvent 1, "ZGC Auto Start: Batch file not found at " & batchFile
End If

Set fso = Nothing
Set WshShell = Nothing
