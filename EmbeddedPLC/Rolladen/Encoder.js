var In7, In6;
// In7, In6 Quadrature Encoder Inputs
var stat = new UInt8(0);
// stat.0 - In6 flag
// stat.1 - In7 flag
// stat.2 - Tick

var counter = new Int16(0);

if(In6)
{
    if(In7)
    {
        if((stat & 0x04) != 0x04)
        {
            if(stat & 0x01)
            {
                counter--;
            }
            else if(stat & 0x02)
            {
                counter++;
            }
            stat = 0x07;
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
            if(stat & 0x02)
            {
                counter--;
            }
            else if(stat & 0x01)
            {
                counter++;
            }
            stat = 0x00;
        }
    }
}
