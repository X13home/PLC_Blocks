class HDC1080{
  constructor(){
    this.st=new UInt8(0);
    this.T=new UInt16();  // temperature in °C=this.T*165/65536-40;
    this.H=new UInt16();  // humidity in %RH=this.H/655.36;
    this.present=false;
  
    this.to=0;
  }
  Read(){
    let st=this.st, ms=getMilliseconds(), ts;
    if(this.to<ms){
      ts=TwiStatus();
      if(ts==0){
        if(st==0){
           TwiControl(0x00030140);
           TwiPutByte(0x02);
           TwiPutByte(0x10);
           TwiPutByte(0x00);
           this.to = ms+200;
           this.st = 1;
        } else if(st==1){
           TwiControl(0x00010140);
           TwiPutByte(0x00);
           this.to = ms+5;
           this.st = 2;
        } else if(st==2){
           TwiControl(0x04000240);
           this.to = ms+40;
           this.st = 3;
        } else {
          this.to=ms+60000;
          this.st=0;
        }
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x40){
          this.present=false;
        }
      }
    }else if(st==3){
      ts=TwiStatus();
      if(ts==0x04001040){
        this.T=((TwiGetByte()<<8) | TwiGetByte());
        this.H=((TwiGetByte()<<8) | TwiGetByte());
        this.to=ms+60000;
        this.st=1;
        this.present=true;
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x40){
          this.present=false;
        }
      }  		
    }
  }
}

var hdc=new HDC1080();
hdc.Read();
