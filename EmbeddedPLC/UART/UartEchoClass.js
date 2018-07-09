//Used ROM 200 bytes, RAM: 8 bytes

var sr0 = new Uart(0, 2);

var cnt;
cnt = sr0.BytesToRead();
while(cnt>0){
  sr0.PutByte(sr0.GetByte());
  cnt--;
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