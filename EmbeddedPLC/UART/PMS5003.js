var sr0 = new Uart(0, 2);

var pos = 0;
var PM1_0, PM2_5, PM10_0;
let cnt, data;
cnt = sr0.BytesToRead(); 
while(cnt > 0)
{
    cnt--;
    data = sr0.GetByte();

    switch(pos)
    {
        case 0:             // Get Start Character 1
            if(data == 0x42)
            {
                pos++;
            }
            break;
        case 1:             // Get Start Character 2
            if(data == 0x4D)
            {
                pos++;
            }
            else
            {
                pos = 0;
            }
            break;

        case 2:             // Get Frame Length, MSB
            if(data == 0)
            {
                pos++;
            }
            else
            {
                pos = 0;
            }
            break;
        case 3:             // Get Frame Length, LSB
            if(data == 28)
            {
                pos++;
            }
            else
            {
                pos = 0;
            }
            break;

        case 4:
            PM1_0 = data * 256;
            pos++;
            break;
        case 5:
            PM1_0 += data;
            pos++;
            break;
            
        case 6:
            PM2_5 = data * 256;
            pos++;
            break;
        case 7:
            PM2_5 += data;
            pos++;
            break;

        case 8:
            PM10_0 = data * 256;
            pos++;
            break;
        case 9:
            PM10_0 += data;
            pos++;
            break;

        default:
            if(pos < 30)
            {
                pos++;
            }
            else
            {
                pos = 0;
           	}
            break;
    }
}

class Uart{
  constructor(nr, speed){
    this.nr = nr;
    UartInit(this.nr, speed);
  }
  BytesToRead(){
    return UartBytesToRead(this.nr);
  }
  GetByte(){
    return UartGetByte(this.nr);
  }
  PutByte(data){
    return UartPutByte(this.nr, data);
  }
}