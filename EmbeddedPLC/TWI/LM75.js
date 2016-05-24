var lm75_1=new LM75(1);  // Address

class LM75{
  constructor(nr){
    this.addr=new UInt8(nr&7);
    this.present=false;
    this.wait=false;
    this.t=new Int16();        // temperature in °C = this.t/256.0
    this.to=getSeconds()+1;
  }
  
  Read(){
    let tmp;
  
    if(this.wait){
      tmp=TwiStatus()
      if((tmp & 0xFFFF) == (0x1048 | this.addr)){
        tmp=(TwiGetByte()<<8);
        this.t=TwiGetByte() | tmp;
        this.present=true;
        this.wait=false;
      } else if((tmp & 0xE000) != 0){
        this.present=false;
        this.wait=false;
      }
    } else if(getSeconds()>=this.to){
      if(!TwiStatus()){
        TwiControl(0x02010348 | this.addr);
        TwiPutByte(0);
        this.wait=true;
        this.to=getSeconds()+60;
      }
    }
  }
}

lm75_1.Read();
