class LSM303C
{
  constructor()
  {
    this.st = new UInt8(0);
    this.ts =  0;

    this.azX = new Int16();
    this.azY = new Int16();
    this.azZ = new Int16();
    
    this.accX = new Int16();
    this.accY = new Int16();
    this.accZ = new Int16();
    
    this.temp = new Int16();

    this.present = false;

    this.to = getMilliseconds() + 1000;
  }

  Read()
  {
    let ts, st, ms = getMilliseconds();
    if(this.to < ms)
    {
      st = this.st
      ts = TwiStatus();
      if((ts & 0x0000E000) != 0)
      {
        this.ts = ts;
        this.present = false;
        this.to = ms + 5000;
        this.st = st + 0x30;
      }
      else
      {
        switch(st)
        {
          case 0:                       // Check magnetometer ID
            if(ts != 0)
            {
              this.ts = ts;
              this.to = ms + 1000;
              this.st = st + 0x20;
              break;
            }

            TwiControl(0x0101001E);
            TwiPutByte(0x0F);           // Read Device ID

            this.to = ms + 100;
            this.st = 1;
            break;

          case 1:
            if((ts == 0x0101101E) && (TwiGetByte() == 0x3D))
            {
                this.to = ms + 100;
                this.st = 2;
                break;
            }

            this.ts = ts;
            this.to = ms + 1000;
            this.st = st + 0x20;
            break;

          case 2:                       //  Check Accelerator ID
            if(ts != 0)
            {
              this.ts = ts;
              this.to = ms + 1000;
              this.st = st + 0x20;
              break;
            }
            
            TwiControl(0x0101001D);
            TwiPutByte(0x0F);         // Read Device ID
           
            this.to = ms + 100;
            this.st = 3;
            break;

          case 3:
            if((ts == 0x0101101D) && (TwiGetByte() == 0x41))
            {
                this.to = ms + 100;
                this.st = 4;
                break;
            }

            this.ts = ts;
            this.to = ms + 1000;
            this.st = st + 0x20;
            break;

          case 4:                       // Configure Accelerometer
            if(ts != 0)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }

            TwiControl(0x0002011D);
            TwiPutByte(0x20);           // Control Register 1
            TwiPutByte(0x1F);           // HR, 200 Hz, BDU, All axis

            this.to = ms + 100;
            this.st = 5;
            break;

          case 5:                       // Configure Magnetometer
            if(ts != 0x0002101D)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }

            TwiControl(0x0005011E);
            TwiPutByte(0x20);           // Control Register 1
            TwiPutByte(0xEC);           // Temp Sens Enable
                                        // Ultra High Performance
                                        // Output Data Rate 5 Hz
            TwiPutByte(0x60);
            TwiPutByte(0x00);           // Continuous-conversion mode
            TwiPutByte(0x0C);           // Z-axis - Ultra High Performance

            this.to = ms + 100;
            this.st = 6;
            break;

          case 6:                       // Check Ack
            if(ts != 0x0005101E)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }
            
            this.to = ms + 100;
            this.st = 7;
            break;

        case 7:                         // Read Acceleration
            if(ts != 0)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }

            TwiControl(0x0601001D);
            TwiPutByte(0x28);
            
            this.to = ms + 100;
            this.st = 8;
            break;

        case 8:
            if(ts != 0x0601101D)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }

            this.accX = (TwiGetByte() | (TwiGetByte()<<8));
            this.accY = (TwiGetByte() | (TwiGetByte()<<8));
            this.accZ = (TwiGetByte() | (TwiGetByte()<<8));

            this.to = ms + 100;
            this.st = 9;
            break;

        case 9:
            if(ts != 0)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }

            TwiControl(0x0601011E);
            TwiPutByte(0x28);
            
            this.to = ms + 100;
            this.st = 10;
            break;

        case 10:
            if(ts != 0x0601101E)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }
            
            this.azX = (TwiGetByte() | (TwiGetByte()<<8));
            this.azY = (TwiGetByte() | (TwiGetByte()<<8));
            this.azZ = (TwiGetByte() | (TwiGetByte()<<8));

            this.to = ms + 100;
            this.st = 11;
            break;

        case 11:
            if(ts != 0)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }
            
            TwiControl(0x0201011E);
            TwiPutByte(0x2E);
            
            this.to = ms + 100;
            this.st = 12;
            break;

        case 12:
            if(ts != 0x0201101E)
            {
                this.ts = ts;
                this.to = ms + 1000;
                this.st = st + 0x20;
                break;
            }
            
            this.temp = (TwiGetByte() | (TwiGetByte()<<8));

            this.present = true;
            this.to = ms + 100;
            this.st = 7;
            break;            

          default:
          	this.present = false;
            this.to = ms + 2000;
            this.st = 0;
            break;
        }
      }
    }
  }
}

var lsm303c = new LSM303C();
lsm303c.Read();
