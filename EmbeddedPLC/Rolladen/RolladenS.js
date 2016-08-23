// External Variables
var EPos = new UInt16(0);
var ESet = new UInt16(0);

// DIO
// Op7 - Enable/ LEDY
// Op6 - Step
// Op5 - Dir
// On4 - LEDG
// In3 - Open
// In2 - Up
// In1 - Close
// In0 - Down
var Op7, Op6, Op5, On4, In3, In2, In1, In0;
// Internal variables
var pos = new UInt16(0), set = new UInt16(0);
var oset = new UInt16(0);
var stat = new UInt8(0x80);
var cnt = new UInt8(0);

// Local Control
// Up
if(In2)
{
    if(pos < 800)
    {
        set = pos + 1;
    }
}
// Down
else if(In0)
{
    if(pos > 0)
    {
        set = pos - 1;
    }
}
// Open
else if(In3)
{
    set = 800;
}
// Close
else if(In1)
{
    set = 0;
}
// External Control
else if(ESet != oset)
{
    oset = ESet;
    set = ESet;
}

// Motor Control
// Move Up
if(set > pos)
{
    if((stat & 1) == 0)
    {
        On4 = true;         // LEDG - Off
        Op5 = false;        // Dir  - Up
        Op6 = false;        // Step - 0
        Op7 = true;         // LEDY - On, Enable - On
        stat = 1;
    }
    else
    {
        if(stat & 0x10)
        {
            Op6 = false;
            stat &= 0xEF;
        }
        else
        {
            Op6 = true;
            stat |= 0x10;
            pos++;
        }
    }
}
// Move Down
else if(set < pos)
{
    if((stat & 2) == 0)
    {
        On4 = true;         // LEDG - Off
        Op5 = true;         // Dir  - Down
        Op6 = false;        // Step - 0
        Op7 = true;         // LEDY - On, Enable - On
        stat = 2;
    }
    else
    {
        if(stat & 0x10)
        {
            Op6 = false;
            stat &= 0xEF;
        }
        else
        {
            Op6 = true;
            stat |= 0x10;
            pos--;
        }
    }
}
// Stop
else if(stat != 0)
{
    stat = 0;
    On4 = false;        // LEDG - On
    Op7 = false;        // LEDY - Off, Enable - Off
    Op6 = false;
    Op5 = false;

    oset = set;
    ESet = set;
}

// Publish actual Position
if(cnt < 100)
{
    cnt++;
}
else
{
    cnt = 0;
    EPos = pos;
}
