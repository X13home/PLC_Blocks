class MH_Z19B {
  constructor(){
    this.value = new UInt16();
    this.to = getMilliseconds()+300;
    this.present = false;
    this.st = false;
    UartInit(0, 2);  // 9600
    UartPutByte(0, 0xFF);   // задаёт диапазон 0 - 5000ppm  
    UartPutByte(0, 0x01);   // https://mysku.ru/blog/aliexpress/59397.html  
    UartPutByte(0, 0x99);     
    UartPutByte(0, 0x00);     
    UartPutByte(0, 0x00);     
    UartPutByte(0, 0x00);     
    UartPutByte(0, 0x13);     
    UartPutByte(0, 0x88);     
    UartPutByte(0, 0xCB);     
  }
  Tick(){
    let v2 = getMilliseconds(); 
    if(v2>=this.to){
      this.to=v2+25000;
      while(UartBytesToRead(0)>0){
        UartGetByte(0);
      }
      UartPutByte(0, 0xFF);     
      UartPutByte(0, 0x01);     
      UartPutByte(0, 0x86);     
      UartPutByte(0, 0x00);     
      UartPutByte(0, 0x00);     
      UartPutByte(0, 0x00);     
      UartPutByte(0, 0x00);     
      UartPutByte(0, 0x00);     
      UartPutByte(0, 0x79);
      this.st = true;
    } else if(this.st){
      if(UartBytesToRead(0)>8 && UartGetByte(0)==0xFF && UartGetByte(0)==0x86){
        let crc=0x86, i, b, val;
        for(i=2; i<9; i++){
          b = UartGetByte(0);
          crc = crc + b;
          if(i==2){
            val = b<<8;
          } else if(i==3){
            val = val | b;
          }
        }
        if((crc&0xFF)==0){
          this.value = val;
          this.present = true;
        } else {
          this.present = false;
        }
        this.st = false;
      } else if((this.to - v2) < 24000){
        this.present = false;
        this.st = false;
      }
    }
  }
}

var co2 = new MH_Z19B();

co2.Tick();
