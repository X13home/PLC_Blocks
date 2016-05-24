class CC2D{
  constructor(){
    this.st=new UInt8(0);
    this.tCnt=new UInt8(0);
    this.T=new Int16();	  // temperature in °C=this.T/128.0;
    this.H=new UInt16();  // humidity in %RH=this.H/512.0;
    this.present=false;
  
    this.to=0;
  }
  Read(){
    let st=this.st, ms=getMilliseconds(), ts;
    if(this.to<ms){
      ts=TwiStatus();
      if(ts==0){
        if(st==0){
           TwiControl(0x00000128);
           this.to = ms+50;
           this.st = 1;
        } else if(st==1){
           TwiControl(0x04000028);
           this.to = ms+500;
           this.st = 2;
        } else {
          this.to=ms+60000;
          this.st=0;
        }
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x28){
          this.present=false;
        }
      }
    }else if(st==2){
      ts=TwiStatus();
      if(ts==0x04001028){
        let v1=((TwiGetByte()<<8) | TwiGetByte());
        let v2=((TwiGetByte()<<8) | TwiGetByte());
        if((v1 & 0xC000)==0){
          v1=v1*25/8;
          if(v1<=51200){
            this.H=v1;
          }
          this.T=(v2>>>2)*165/128-5120;
          this.to=ms+60000;
          this.st=0;
          this.present=true;
        } else{ 
          this.tCnt++;
          if(this.tCnt<5) {
            this.to=ms+15;
            this.st=1;
          } else {
            this.to=ms+15000;
            this.st=0;
            this.tCnt=0;
          }
        }      
      } else if((ts & 0xE000) != 0){
        this.to=ms+60000;
        this.st=0;
        if((ts & 0xFF)==0x28){
          this.present=false;
        }
      }  		
    }
  }
}

var cc=new CC2D();
cc.Read();
