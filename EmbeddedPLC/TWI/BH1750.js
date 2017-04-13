var bh1750_1=new BH1750(0);  // Address

class BH1750{
  constructor(nr){
    this.addr=new UInt8(nr==0?0x23:0x5C);
    this.present=false;
    this.st=new UInt8(0);
    this.value=new UInt16();        // Lux = this.value/1.2
    this.to=getMilliseconds()+1200;
  }
  
  Read(){
    let st=this.st, ms=getMilliseconds(), ts;
    if(this.to<ms){
      ts=TwiStatus();
      if(ts==0){
        if(st==0){
           TwiControl(0x00010100 | this.addr);
           TwiPutByte(0x23);  // One time L-resolution mode
           this.to = ms+20;
           this.st = 1;
        } else if(st==1){
           TwiControl(0x02000200 | this.addr);
           this.to = ms+500;
           this.st = 2;
        } else {
          this.to=ms+90000;
          this.st=0;
        }
      } else if((ts & 0xE000) != 0){
        this.to=ms+90000;
        this.st=0;
        if((ts & 0xFF)==this.addr){
          this.present=false;
        }
      }
    }else if(st==2){
      ts=TwiStatus();
      if(ts==(0x02001000 | this.addr)){
        this.value=((TwiGetByte()<<8) | TwiGetByte());
          this.to=ms+60000;
          this.st=0;
          this.present=true;
      } else if((ts & 0xE000) != 0){
        this.to=ms+90000;
        this.st=0;
        if((ts & 0xFF)==this.addr){
          this.present=false;
        }
      }  		
    }
  }
}

bh1750_1.Read();
