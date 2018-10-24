class Average{
  constructor(){ 
    this.tm = null;
    this.data = [];
    this.Calculate("interval");
    this.Update();
  }
  Calculate(pin){
    if(this.tm==null){
      this.SetState("Out", this.GetState("In"));
    }
    if(pin=="interval"){
      if(this.tm != null){
        clearInterval(this.tm); 
      }
      this.interval = this.GetState("interval");
      if(this.interval > 0){
        this.tm = setInterval(this.Tick.bind(this), this.interval/16);
      }
    } else if(pin=="In"){
      this.Update();
    }
  }
  Tick(){
    let now = (new Date()).getTime(), cur = now, prev = now - this.interval;
    let sum = 0, i, dt;
    for(i = this.data.length-1; i >= 0 ; i--){
      dt = (this.data[i].t<prev ? prev : this.data[i].t);
      sum+=this.data[i].v*(cur - dt);
      cur = dt;
      if(this.data[i].t<prev){
        if(i>0){
          this.data = this.data.slice(i);
        }
        break;
      }
    }
    if(now > cur){
      this.SetState("Out", sum / (now - cur));
    }
  }
  Update(){
    let vi = this.GetState("In");
    if(typeof(vi)=="number" && !isNaN(vi)){
      this.data.push({"t":new Date().getTime(), "v":vi});
    }
  }
}