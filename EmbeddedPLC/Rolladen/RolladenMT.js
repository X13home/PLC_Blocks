var In7, In6;                   // In7, In6 Quadrature Encoder Inputs
var Op3, Op5;                   // Op3, Op5 Motor Up/Down
// Global Variables
var Set = new Int16(0);         // New Position
var iCnt = new Int16(0);        // current position
var oCnt = new Int16(0);        // stop position
// Local Variables
var stat = new UInt8(0);
// Encoder Flags
// stat.0 - In6 flag
// stat.1 - In7 flag
// stat.2 - Tick
// Motion Flags
// stat.4 - Motion
var oSet = new Int16(0);
var wdcnt = new UInt8(0);       // WatchDog

// Encoder
if(In6)
{
    if(In7)
    {
        if((stat & 0x04) != 0x04)
        {
            wdcnt = 0;

            if(stat & 0x01)
            {
                iCnt--;
            }
            else if(stat & 0x02)
            {
                iCnt++;
            }
            stat |= 0x07;
        }
    }
    else
    {
        stat |= 0x01;
        stat &= 0xFD;
    }
}
else    // In6 - false
{
    if(In7)
    {
        stat |= 0x02;
        stat &= 0xFE;
    }
    else
    {
        if(stat & 0x04)
        {
            wdcnt = 0;

            if(stat & 0x02)
            {
                iCnt--;
            }
            else if(stat & 0x01)
            {
                iCnt++;
            }
            stat &= 0xF8;
        }
    }
}

// Motion Control
if(stat & 0x08)     // Motion
{
    wdcnt++;

    if((wdcnt > 100)  || (Set == iCnt))
    {
        Op3 = false;
        Op5 = false;
    }

    if(wdcnt > 200)
    {
        oCnt = iCnt;
        stat &= 0xF7;
    }
}
else if(iCnt < oCnt)
{
    Set = 0;
}
else if(iCnt > oCnt)
{
    Set = 20;
}
else if(Set != oSet)
{
    oSet = Set;
    wdcnt = 0;
    stat |= 0x08;

    if(Set > iCnt)
    {
        Op3 = false;
        Op5 = true;
    }
    else
    {
        Op3 = true;
        Op5 = false;
    }
}
