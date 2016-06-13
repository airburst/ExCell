Cell Object

Key	Description
v	raw value (see Data Types section for more info)
w	formatted text (if applicable)
t	cell type: b Boolean, n Number, e error, s String, d Date
f	cell formula (if applicable)
r	rich text encoding (if applicable)
h	HTML rendering of the rich text (if applicable)
c	comments associated with the cell **
z	number format string associated with the cell (if requested)
l	cell hyperlink object (.Target holds link, .tooltip is tooltip)
s	the style/theme of the cell (if applicable)


Data Types
The raw value is stored in the v field, interpreted based on the t field.
Type b is the Boolean type. v is interpreted according to JS truth tables
Type e is the Error type. v holds the number and w holds the common name:


Errors

Value	Error Meaning
0x00	#NULL!
0x07	#DIV/0!
0x0F	#VALUE!
0x17	#REF!
0x1D	#NAME?
0x24	#NUM!
0x2A	#N/A
0x2B	#GETTING_DATA