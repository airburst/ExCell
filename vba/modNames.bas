Attribute VB_Name = "modNames"
Option Explicit

Sub main()
    Dim namesList() As Variant

    Application.ScreenUpdating = False
    
    If hasNames Then
        namesList = getNames()
        Call replaceAllNamedRanges(namesList)
        Call deleteAllNamedRanges
        Call MsgBox("All named ranges have been replaced in formule and removed from this workbook." & vbCrLf & vbCrLf & _
            ActiveWorkbook.names.Count & " named ranges left.", vbOKOnly, "Done")
    Else
        Call MsgBox("No named ranges in this workbook.  Nothing to do.", vbOKOnly, "Done")
    End If

    Application.ScreenUpdating = True
End Sub

Function hasNames() As Boolean
    hasNames = (ActiveWorkbook.names.Count > 0)
End Function

Function getNames() As Variant()
    Dim namesList() As Variant
    Dim i, counter As Integer
    Dim currentName, currentRange As String
    
    ReDim namesList(ActiveWorkbook.names.Count - 1, 1)
    counter = 0
    
    For i = 1 To ActiveWorkbook.names.Count
        currentName = ActiveWorkbook.names.Item(i).NameLocal
        currentRange = ActiveWorkbook.names.Item(i).Value
        If (currentName <> "_xlfn.IFERROR") Then
            namesList(counter, 0) = currentName
            namesList(counter, 1) = currentRange
            counter = counter + 1
        End If
    Next i
    getNames = namesList
End Function

Sub replaceAllNamedRanges(names() As Variant)
    Dim i As Integer
    Dim n, v As String
    For i = LBound(names) To UBound(names)
        n = CStr(names(i, 0))
        v = removeLeadingEquals(CStr(names(i, 1)))
        Call replaceNamedRange(n, v)
    Next i
End Sub

Sub replaceNamedRange(ByVal name As String, ByVal actualRange As String)
    Dim s As Worksheet
    Dim r, c As range
    
    For Each s In ActiveWorkbook.Worksheets
        Set r = s.UsedRange
        For Each c In r
            c.formula = removeThisWorkbookName(c.formula)
            c.formula = Replace(c.formula, name, actualRange)
        Next c
    Next s
End Sub

Function removeThisWorkbookName(formula As String)
    Dim pattern As String
    pattern = "'" & ActiveWorkbook.name & "'!"
    removeThisWorkbookName = Replace(formula, pattern, "")
End Function

Function removeLeadingEquals(range As String) As String
    removeLeadingEquals = range
    If (Left(removeLeadingEquals, 1) = "=") Then
        removeLeadingEquals = Mid(range, 2, Len(range))
    End If
End Function

Sub deleteAllNamedRanges()
    Dim i As Integer
    For i = 1 To ActiveWorkbook.names.Count
        If isValidName(ActiveWorkbook.names(1).NameLocal) Then
            ActiveWorkbook.names(1).Delete
        End If
    Next i
End Sub

Function isValidName(name As String) As Boolean
    'A-Z = 65-90
    'a-z = 97-122
    '_   = 95
    Dim first As Integer: first = Asc(Left(name, 1))
    
    isValidName = ((first >= 65 And first <= 90) Or _
        (first >= 97 And first <= 122) Or _
        first = 95) And _
        (InStr(name, " ") = 0) And _
        (InStr(name, "_xlfn") = 0)
End Function
